import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import * as SharedGroupPreferences from 'expo-shared-preferences';
import i18next from 'i18next';
import { CARD_NAME_TO_ID } from './cardNameMapping';
import { LEGACY_NAME_TO_ID } from './legacyCardMapping';

const MIGRATION_KEY = 'MIGRATION_V1_COMPLETE_V4'; // Versioned key

// Helper to generate dates for the last N years
const getPastDates = (years: number = 5): string[] => {
    const dates: string[] = [];
    const today = new Date();

    // Go 5 years back
    const start = new Date();
    start.setFullYear(today.getFullYear() - years);

    for (let d = start; d <= today; d.setDate(d.getDate() + 1)) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dates.push(`${yyyy}-${mm}-${dd}`);
    }
    return dates;
};

export const MigrationService = {
    runMigration: async (tarotDb: SQLite.SQLiteDatabase, notesDb: SQLite.SQLiteDatabase) => {
        try {
            const isDone = await AsyncStorage.getItem(MIGRATION_KEY);
            if (isDone === 'true') {
                console.log('[Migration] Already completed.');
                return;
            }

            console.log('[Migration] Starting legacy history migration...');

            // 1. Build the Master Map (English + Localized)
            // We prioritize LEGACY_NAME_TO_ID (User provided) over standard English if conflicts exist (unlikely)
            const rosettaStone: Record<string, string> = {
                ...CARD_NAME_TO_ID,
                ...LEGACY_NAME_TO_ID
            };

            // Add case-insensitive variants just in case
            Object.keys(rosettaStone).forEach(key => {
                rosettaStone[key.toLowerCase()] = rosettaStone[key];
                rosettaStone[key.toUpperCase()] = rosettaStone[key];
            });

            console.log(`[Migration] Loaded mapping with ${Object.keys(rosettaStone).length} entries.`);

            // 1.5 Migrate Language Preference
            try {
                const legacyLang = await SharedGroupPreferences.getItemAsync('LANGUAGE', { name: 'APP_PREFS' });
                if (legacyLang && typeof legacyLang === 'string') {
                    console.log('[Migration] Found legacy language:', legacyLang);
                    await AsyncStorage.setItem('user-language', legacyLang);
                    await i18next.changeLanguage(legacyLang);
                }
            } catch (e) {
                // Ignore if not key found or error
                console.log('[Migration] No legacy language found or error:', e);
            }

            // 2. Scan Dates
            const datesToCheck = getPastDates(4); // Last 4-5 years
            let migratedCount = 0;

            for (const dateStr of datesToCheck) {
                // Check if we already have this date in SQLite (don't overwrite new data)
                const existing = await notesDb.getFirstAsync(
                    'SELECT id FROM daily_draws WHERE date = ?',
                    [dateStr]
                );

                if (!existing) {
                    // Try to read from SharedPrefs (specifically APP_PREFS file)
                    const legacyName = await SharedGroupPreferences.getItemAsync(dateStr, { name: 'APP_PREFS' });

                    if (legacyName && typeof legacyName === 'string') {

                        // Resolve ID
                        const id = rosettaStone[legacyName] || rosettaStone[legacyName.trim()];

                        if (id) {
                            // Insert!
                            // Fix Date Bug: Create timestamp at LOCAL NOON to matches app logic
                            // standard new Date(dateStr) creates UTC Midnight, which causes "previous day" display in Western hemispheres
                            const [y, m, d] = dateStr.split('-').map(Number);
                            const timestamp = new Date(y, m - 1, d, 12, 0, 0).getTime();

                            await notesDb.runAsync(
                                'INSERT INTO daily_draws (card_id, card_name, date, timestamp) VALUES (?, ?, ?, ?)',
                                [id, legacyName, dateStr, timestamp]
                            );
                            migratedCount++;
                            console.log(`[Migration] Migrated ${dateStr}: ${legacyName} -> ID ${id} (TS: ${timestamp})`);
                        } else {
                            console.log(`[Migration] Found record for ${dateStr} but could not resolve ID for name: "${legacyName}"`);
                        }
                    }
                }
            }

            console.log(`[Migration] Finished. Migrated ${migratedCount} records.`);
            await AsyncStorage.setItem(MIGRATION_KEY, 'true');

        } catch (error) {
            console.error('[Migration] Failed:', error);
        }
    }
};

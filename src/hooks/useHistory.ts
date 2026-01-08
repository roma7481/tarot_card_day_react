import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotesDatabase } from './useNotesDatabase';
import cardsData from '../data/cards.json';

export interface DailyDraw {
    id: number;
    card_id: string; // Historically ID, but we want to move to Name reliance
    card_name?: string; // New field
    date: string;
    timestamp: number;
}

export const useHistory = () => {
    const { db, isReady } = useNotesDatabase();

    // Migration & Cleanup
    useEffect(() => {
        const migrateHistory = async () => {
            if (!db || !isReady) return;

            // 1. AsyncStorage -> SQLite (V1)
            try {
                const hasMigrated = await AsyncStorage.getItem('history_migrated_v1');
                if (hasMigrated !== 'true') {
                    console.log('Starting history migration v1...');
                    const storedDrawsStr = await AsyncStorage.getItem('daily_draws_map');

                    if (storedDrawsStr) {
                        const draws: Record<string, string> = JSON.parse(storedDrawsStr); // Date -> Name
                        const allCards = (cardsData as any).cards || cardsData;

                        for (const [date, cardName] of Object.entries(draws)) {
                            const card = allCards.find((c: any) => c.name === cardName);
                            // We construct ID or use Name. 
                            // IMPORTANT: User wants NAME. We should store name in card_name column.
                            // The old column `card_id` exists, we can still populate it for legacy safety, 
                            // OR populate it with ID if found.
                            if (card) {
                                const existing = await db.getFirstAsync('SELECT * FROM daily_draws WHERE date = ?', [date]);
                                if (!existing) {
                                    await db.runAsync(
                                        'INSERT INTO daily_draws (card_id, card_name, date, timestamp) VALUES (?, ?, ?, ?)',
                                        [card.id, cardName, date, new Date(date).getTime()]
                                    );
                                    console.log(`Migrated: ${date} - ${cardName}`);
                                }
                            }
                        }
                    }
                    await AsyncStorage.setItem('history_migrated_v1', 'true');
                }
            } catch (error) {
                console.error('Migration v1 failed:', error);
            }

            // 2. Backfill Names for rows that only have IDs (V3 Migration)
            // User complained about IDs being used. We must ensure `card_name` is populated.
            try {
                const hasBackfilled = await AsyncStorage.getItem('history_names_backfilled_v1');
                if (hasBackfilled !== 'true') {
                    console.log('Running name backfill...');
                    const allCards = (cardsData as any).cards || cardsData;
                    // Get all rows
                    const rows = await db.getAllAsync<DailyDraw>('SELECT * FROM daily_draws WHERE card_name IS NULL OR card_name = ""');

                    for (const row of rows) {
                        // Try to find by ID
                        const card = allCards.find((c: any) => c.id == row.card_id); // loose equality for string/int match
                        if (card) {
                            await db.runAsync('UPDATE daily_draws SET card_name = ? WHERE id = ?', [card.name, row.id]);
                            console.log(`Backfilled name for ID ${row.card_id} -> ${card.name}`);
                        }
                    }
                    await AsyncStorage.setItem('history_names_backfilled_v1', 'true');
                }
            } catch (e) {
                console.error('Name backfill failed:', e);
            }

            // 3. Cleanup Duplicates (V2)
            try {
                const hasCleaned = await AsyncStorage.getItem('history_cleaned_v2');
                if (hasCleaned !== 'true') {
                    console.log('Running history duplicates cleanup...');
                    await db.runAsync(`
                        DELETE FROM daily_draws 
                        WHERE id NOT IN (
                            SELECT MIN(id) 
                            FROM daily_draws 
                            GROUP BY date
                        )
                    `);
                    await AsyncStorage.setItem('history_cleaned_v2', 'true');
                }
            } catch (e) {
                console.error('History cleanup failed:', e);
            }
        };

        migrateHistory();
    }, [db, isReady]);

    const addDailyDraw = useCallback(async (cardId: string, cardName: string) => {
        if (!db || !isReady) return;

        try {
            const today = new Date().toLocaleDateString('en-CA');
            const timestamp = Date.now();

            const existing = await db.getFirstAsync('SELECT * FROM daily_draws WHERE date = ?', [today]);

            if (!existing) {
                await db.runAsync(
                    'INSERT INTO daily_draws (card_id, card_name, date, timestamp) VALUES (?, ?, ?, ?)',
                    [cardId, cardName, today, timestamp]
                );
                console.log(`Saved daily draw: ${cardName} (${cardId}) for ${today}`);
            } else {
                console.log(`Daily draw already exists for ${today}`);
            }

        } catch (error) {
            console.error('Error adding daily draw:', error);
        }
    }, [db, isReady]);

    const getHistory = useCallback(async (): Promise<DailyDraw[]> => {
        if (!db || !isReady) return [];
        try {
            return await db.getAllAsync<DailyDraw>('SELECT * FROM daily_draws ORDER BY timestamp DESC', []);
        } catch (error) {
            console.error('Error fetching history:', error);
            return [];
        }
    }, [db, isReady]);

    const getTodaysDraw = useCallback(async (): Promise<DailyDraw | null> => {
        if (!db || !isReady) return null;
        try {
            const today = new Date().toLocaleDateString('en-CA');
            return await db.getFirstAsync<DailyDraw>('SELECT * FROM daily_draws WHERE date = ?', [today]);
        } catch (error) {
            console.error('Error checking today draw:', error);
            return null;
        }
    }, [db, isReady]);

    return {
        addDailyDraw,
        getHistory,
        getTodaysDraw,
        isReady
    };
};

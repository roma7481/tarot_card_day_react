import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { SQLiteDatabase } from 'expo-sqlite';
import { Alert } from 'react-native';

interface BackupData {
    version: number;
    timestamp: number;
    notes: any[];
    history: any[];
}

export const DataBackupService = {
    /**
     * Exports all user data (Notes and History) to a JSON file and opens the share sheet.
     */
    createBackup: async (db: SQLiteDatabase, t: (key: string) => string) => {
        try {
            // 1. Fetch Data
            const notes = await db.getAllAsync('SELECT * FROM notes');
            const history = await db.getAllAsync('SELECT * FROM daily_draws');

            // 2. Prepare JSON
            const backupData: BackupData = {
                version: 1,
                timestamp: Date.now(),
                notes: notes,
                history: history
            };

            const jsonString = JSON.stringify(backupData, null, 2);

            // 3. Write to File
            const fileName = `tarot_backup_${new Date().toISOString().split('T')[0]}.json`;
            const filePath = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(filePath, jsonString);

            // 4. Share File
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filePath, {
                    mimeType: 'application/json',
                    dialogTitle: t('settings.backupShareTitle'),
                    UTI: 'public.json' // for iOS
                });
            } else {
                Alert.alert(t('common.error'), t('settings.sharingNotAvailable'));
            }
        } catch (error) {
            console.error('Backup failed:', error);
            Alert.alert(t('common.error'), t('settings.backupError'));
        }
    },

    /**
     * Opens document picker to select a backup file, then restores it.
     * Starts by verifying the file structure, then inserts missing data.
     */
    restoreBackup: async (db: SQLiteDatabase, t: (key: string) => string): Promise<boolean> => {
        try {
            // 1. Pick File
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/json', 'public.json'],
                copyToCacheDirectory: true
            });

            if (result.canceled) return false;

            const asset = result.assets[0];
            if (!asset.uri) return false;

            // 2. Read File
            const content = await FileSystem.readAsStringAsync(asset.uri);
            let data: BackupData;
            try {
                data = JSON.parse(content);
            } catch (e) {
                Alert.alert(t('common.error'), t('settings.invalidBackupFile'));
                return false;
            }

            // 3. Validate Structure
            if (!data.notes || !data.history) {
                Alert.alert(t('common.error'), t('settings.invalidBackupFile'));
                return false;
            }

            // 4. Restore Logic (Merge/Safe Insert)
            // We use 'INSERT OR IGNORE' or check existence to avoid duplicates.
            // For simple implementation, we can check by date/card combinations.

            let restoredNotes = 0;
            let restoredHistory = 0;

            // Notes
            // notes table: note_id (PK), card_id, date, note, timeSaved, cardName
            for (const note of data.notes) {
                // SQLite doesn't strictly support "ON CONFLICT" for all constraints unless defined.
                // Safest to check existence or just INSERT OR IGNORE if PK matches? 
                // PK might differ between devices. We should identify by (date, card_id).

                const exists = await db.getFirstAsync(
                    'SELECT note_id FROM notes WHERE date = ? AND card_id = ?',
                    [note.date, note.card_id]
                );

                if (!exists) {
                    await db.runAsync(
                        'INSERT INTO notes (card_id, date, note, timeSaved, cardName) VALUES (?, ?, ?, ?, ?)',
                        [note.card_id, note.date, note.note, note.timeSaved, note.cardName]
                    );
                    restoredNotes++;
                }
            }

            // History
            // daily_draws table: id (PK), card_id, date, timestamp, card_name
            for (const item of data.history) {
                const exists = await db.getFirstAsync(
                    'SELECT id FROM daily_draws WHERE date = ?',
                    [item.date]
                );

                if (!exists) {
                    await db.runAsync(
                        'INSERT INTO daily_draws (card_id, date, timestamp, card_name) VALUES (?, ?, ?, ?)',
                        [item.card_id, item.date, item.timestamp, item.card_name]
                    );
                    restoredHistory++;
                }
            }

            Alert.alert(
                t('common.success'),
                t('settings.restoreSuccess', { notes: restoredNotes, history: restoredHistory })
            );
            return true;

        } catch (error) {
            console.error('Restore failed:', error);
            Alert.alert(t('common.error'), t('settings.restoreError'));
            return false;
        }
    }
};

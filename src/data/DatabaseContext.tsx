import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

interface DatabaseContextType {
    tarotDb: SQLite.SQLiteDatabase | null;
    notesDb: SQLite.SQLiteDatabase | null;
    isTarotReady: boolean;
    isNotesReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tarotDb, setTarotDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [notesDb, setNotesDb] = useState<SQLite.SQLiteDatabase | null>(null);
    const [isTarotReady, setIsTarotReady] = useState(false);
    const [isNotesReady, setIsNotesReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        const initTarotDB = async () => {
            try {
                const dbName = 'tarot.db';
                const dbPath = FileSystem.documentDirectory + 'SQLite/' + dbName;
                const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite');
                if (!dirInfo.exists) await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');

                const fileInfo = await FileSystem.getInfoAsync(dbPath);

                // FORCE UPDATE on launch
                if (fileInfo.exists) {
                    await FileSystem.deleteAsync(dbPath);
                }

                const asset = Asset.fromModule(require('../assets/database/tarot.db'));
                await asset.downloadAsync();
                await FileSystem.copyAsync({ from: asset.localUri || asset.uri, to: dbPath });

                const database = await SQLite.openDatabaseAsync(dbName);
                if (mounted) {
                    setTarotDb(database);
                    setIsTarotReady(true);
                }
            } catch (error) {
                console.error("Tarot DB Setup Error:", error);
            }
        };

        const initNotesDB = async () => {
            try {
                const database = await SQLite.openDatabaseAsync('DB_NOTES');

                // --- Migration Logic ---
                // Get current version
                const versionRes = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
                let currentVersion = versionRes ? versionRes.user_version : 0;
                console.log('Current DB Version:', currentVersion);

                if (currentVersion < 1) {
                    // Initial Schema or Migration from v0
                    // Since "CREATE TABLE IF NOT EXISTS" doesn't change existing tables, we might need ALTER.
                    // But for v1, let's just ensure basic tables exist.
                    await database.execAsync(`
                        CREATE TABLE IF NOT EXISTS notes (
                            note_id INTEGER PRIMARY KEY AUTOINCREMENT,
                            cardName TEXT NOT NULL,
                            date TEXT NOT NULL,
                            note TEXT,
                            timeSaved INTEGER
                        );
                    `);

                    // Check if 'timeSaved' exists in notes (Safe migration for existing v0 users)
                    try {
                        await database.execAsync('ALTER TABLE notes ADD COLUMN timeSaved INTEGER');
                        console.log('Added timeSaved column');
                    } catch (e) {
                        // Column likely exists
                    }

                    try {
                        // If we changed id -> note_id, that's complex. 
                        // For now, assuming standard 'ALTER ADD' is mostly what's needed for compatible updates.
                        // But for entirely new schema columns:
                        await database.execAsync('ALTER TABLE notes ADD COLUMN cardName TEXT');
                    } catch (e) { }

                    // Add new tables
                    await database.execAsync(`
                        CREATE TABLE IF NOT EXISTS daily_draws (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            card_id TEXT NOT NULL,
                            date TEXT NOT NULL,
                            timestamp INTEGER
                        );
                        CREATE TABLE IF NOT EXISTS preferences (
                            key TEXT PRIMARY KEY,
                            value TEXT
                        );
                    `);

                    await database.execAsync('PRAGMA user_version = 1');
                    currentVersion = 1;
                }

                if (currentVersion < 2) {
                    try {
                        await database.execAsync('ALTER TABLE daily_draws ADD COLUMN card_name TEXT');
                        console.log('Added card_name column to daily_draws');
                    } catch (e) {
                        // Column might already exist if re-running
                    }
                    await database.execAsync('PRAGMA user_version = 2');
                    currentVersion = 2;
                }

                if (mounted) {
                    setNotesDb(database);
                    setIsNotesReady(true);
                }
            } catch (error) {
                console.error("Notes DB Setup Error:", error);
            }
        };

        const initDatabases = async () => {
            // 1. Initialize Tarot DB AND wait for it
            await initTarotDB();

            // 2. Initialize Notes DB (only after Tarot is potentially stable, or at least sequential attempt)
            // A small delay might actually help if there's a native contention on file handles on Android
            await new Promise(resolve => setTimeout(resolve, 200));
            await initNotesDB();
        };

        initDatabases();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <DatabaseContext.Provider value={{ tarotDb, notesDb, isTarotReady, isNotesReady }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context;
};

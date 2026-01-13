import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import { LEGACY_NAME_TO_ID } from './legacyCardMapping';

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
                // --- Legacy DB Migration (Android Std -> Expo SQLite) ---
                const LEGACY_MIGRATION_KEY = 'LEGACY_DB_FILE_MIGRATED_V1';
                const hasMigrated = await import('@react-native-async-storage/async-storage').then(m => m.default.getItem(LEGACY_MIGRATION_KEY));

                if (hasMigrated !== 'true') {
                    console.log('[DB Migration] Checking for legacy DB files...');
                    const docDir = FileSystem.documentDirectory; // ends with /files/
                    if (docDir) {
                        // "files/" -> "../databases/"
                        // Construct absolute paths carefully
                        // Typically: /data/user/0/com.package/files/
                        // Target: /data/user/0/com.package/databases/

                        // We can try to access the parent directory.
                        // However, FileSystem might sandboxed.
                        // On Android, "databases" is a sibling of "files".

                        const parentDir = docDir.replace(/\/files\/$/, '/');
                        const legacyDbDir = parentDir + 'databases/';
                        const targetDir = docDir + 'SQLite/';

                        const legacyPath = legacyDbDir + 'DB_NOTES';
                        const targetPath = targetDir + 'DB_NOTES';

                        const legacyInfo = await FileSystem.getInfoAsync(legacyPath);

                        if (legacyInfo.exists) {
                            console.log('[DB Migration] Found legacy DB at:', legacyPath);

                            // Ensure target dir exists
                            const targetDirInfo = await FileSystem.getInfoAsync(targetDir);
                            if (!targetDirInfo.exists) {
                                await FileSystem.makeDirectoryAsync(targetDir);
                            }

                            // Copy Main DB
                            // Delete existing empty/new DB if it exists to overwrite with legacy
                            const targetFileInfo = await FileSystem.getInfoAsync(targetPath);
                            if (targetFileInfo.exists) {
                                console.log('[DB Migration] Overwriting existing new DB with legacy DB');
                                await FileSystem.deleteAsync(targetPath);
                            }
                            await FileSystem.copyAsync({ from: legacyPath, to: targetPath });
                            console.log('[DB Migration] DB_NOTES Copied.');

                            // Copy WAL
                            const walPath = legacyPath + '-wal';
                            const targetWal = targetPath + '-wal';
                            const walInfo = await FileSystem.getInfoAsync(walPath);
                            if (walInfo.exists) {
                                const targetWalInfo = await FileSystem.getInfoAsync(targetWal);
                                if (targetWalInfo.exists) await FileSystem.deleteAsync(targetWal);
                                await FileSystem.copyAsync({ from: walPath, to: targetWal });
                                console.log('[DB Migration] WAL Copied.');
                            }

                            // Copy SHM
                            const shmPath = legacyPath + '-shm';
                            const targetShm = targetPath + '-shm';
                            const shmInfo = await FileSystem.getInfoAsync(shmPath);
                            if (shmInfo.exists) {
                                const targetShmInfo = await FileSystem.getInfoAsync(targetShm);
                                if (targetShmInfo.exists) await FileSystem.deleteAsync(targetShm);
                                await FileSystem.copyAsync({ from: shmPath, to: targetShm });
                                console.log('[DB Migration] SHM Copied.');
                            }

                            console.log('[DB Migration] File migration successful.');
                        } else {
                            console.log('[DB Migration] No legacy DB found at:', legacyPath);
                        }
                    }

                    // If we found a legacy DB, we grant legacy access (Unlimited Notes)
                    const finalTargetInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/DB_NOTES');
                    if (finalTargetInfo.exists) {
                        console.log('[DB Migration] Legacy Notes DB confirmed. Granting Legacy Access.');
                        await import('@react-native-async-storage/async-storage').then(m => m.default.setItem('LEGACY_ACCESS_NOTES', 'true'));
                    }

                    await import('@react-native-async-storage/async-storage').then(m => m.default.setItem(LEGACY_MIGRATION_KEY, 'true'));
                }

                const database = await SQLite.openDatabaseAsync('DB_NOTES');

                // --- Schema Initialization (Run ALWAYS to ensure tables exist) ---
                // "CREATE TABLE IF NOT EXISTS" is cheap and safe.
                // This handles:
                // 1. Brand new installs
                // 2. Legacy Migration (where DB exists but lacks new tables)

                await database.execAsync(`
                    CREATE TABLE IF NOT EXISTS notes (
                        note_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        cardName TEXT NOT NULL,
                        date TEXT NOT NULL,
                        note TEXT,
                        timeSaved INTEGER
                    );
                    CREATE TABLE IF NOT EXISTS daily_draws (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        card_id TEXT NOT NULL,
                        date TEXT NOT NULL,
                        timestamp INTEGER,
                        card_name TEXT
                    );
                    CREATE TABLE IF NOT EXISTS preferences (
                        key TEXT PRIMARY KEY,
                        value TEXT
                    );
                `);

                // --- Versioned Migrations (ALTERs) ---
                // Get current version
                const versionRes = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
                let currentVersion = versionRes ? versionRes.user_version : 0;
                console.log('Current DB Version:', currentVersion);

                if (currentVersion < 1) {
                    // Start Version Control
                    await database.execAsync('PRAGMA user_version = 1');
                    currentVersion = 1;
                }

                if (currentVersion < 2) {
                    // Safe column additions
                    try {
                        await database.execAsync('ALTER TABLE notes ADD COLUMN timeSaved INTEGER');
                    } catch (e) { } // Exists
                    try {
                        await database.execAsync('ALTER TABLE notes ADD COLUMN cardName TEXT');
                    } catch (e) { } // Exists
                    try {
                        // Double check just in case, though CREATE TABLE handles it for new DBs
                        await database.execAsync('ALTER TABLE daily_draws ADD COLUMN card_name TEXT');
                    } catch (e) { } // Exists

                    await database.execAsync('PRAGMA user_version = 2');
                    currentVersion = 2;
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

                if (currentVersion < 3) {
                    // Backfil card_id for notes
                    try {
                        await database.execAsync('ALTER TABLE notes ADD COLUMN card_id TEXT');
                    } catch (e) { }

                    // Fetch all notes that might need updates
                    // We only need to update ones where card_id is null/empty
                    const allNotes = await database.getAllAsync<{ note_id: number; cardName: string }>('SELECT note_id, cardName FROM notes');

                    for (const n of allNotes) {
                        // Resolve ID
                        let resolvedId = LEGACY_NAME_TO_ID[n.cardName];
                        if (!resolvedId) {
                            // If not in legacy map, maybe it's already an ID or we don't know it. 
                            // Assume it is the ID if it matches roughly digit format, or just use it as fallback.
                            resolvedId = n.cardName;
                        }

                        if (resolvedId) {
                            await database.runAsync('UPDATE notes SET card_id = ? WHERE note_id = ?', [resolvedId, n.note_id]);
                        }
                    }
                    console.log('[DB Migration] Backfilled card_id for notes table.');

                    await database.execAsync('PRAGMA user_version = 3');
                    currentVersion = 3;
                }

                // --- LEGACY TABLE MIGRATION (TABLE_NAME_NOTE -> notes) ---
                try {
                    const legacyTableExists = await database.getFirstAsync<{ name: string }>(
                        "SELECT name FROM sqlite_master WHERE type='table' AND name='TABLE_NAME_NOTE'"
                    );

                    if (legacyTableExists) {
                        console.log('[DB Migration] Found legacy table TABLE_NAME_NOTE. Migrating data to notes...');

                        // Copy data
                        // The schemas are identical based on debug output.
                        // NOTE: If we are running this AFTER version 3, we must respect new schema.
                        // But legacy table migration runs on newly copied DB which might be version 0/1/2?
                        // Actually, if we just copied it, it has version X.
                        // If we already added card_id above, we should populate it during INSERT too? 
                        // Or just let the loop above handle it on next run?
                        // Better: Just do the standard copy, and assume the migration above (or a reload) fixes IDs.
                        // Wait, if legacy table exists, we drop it.
                        // If we migrated above, we used data from 'notes'.
                        // Sequence matters.
                        // If I copy data NOW, i might miss the backfill if version > 2.
                        // But user has already run the copy (previous step).
                        // So 'notes' table is populated with Russian names.
                        // The code ABOVE runs on every startup (version check).
                        // So the backfill WILL run.

                        await database.execAsync(`
                            INSERT INTO notes (cardName, date, note, timeSaved)
                            SELECT cardName, date, note, timeSaved FROM TABLE_NAME_NOTE;
                        `);
                        console.log('[DB Migration] Data migrated to notes table.');

                        // Drop legacy table
                        await database.execAsync('DROP TABLE TABLE_NAME_NOTE');
                        console.log('[DB Migration] Dropped legacy table TABLE_NAME_NOTE.');

                        // Force backfill again just in case (since we just inserted new rows)
                        // Fetch all newly inserted notes
                        const newNotes = await database.getAllAsync<{ note_id: number; cardName: string }>('SELECT note_id, cardName FROM notes WHERE card_id IS NULL');
                        for (const n of newNotes) {
                            let resolvedId = LEGACY_NAME_TO_ID[n.cardName] || n.cardName;
                            if (resolvedId) {
                                await database.runAsync('UPDATE notes SET card_id = ? WHERE note_id = ?', [resolvedId, n.note_id]);
                            }
                        }
                    }
                } catch (e) {
                    console.error('[DB Migration] Error migrating from TABLE_NAME_NOTE:', e);
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

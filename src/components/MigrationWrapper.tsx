import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useDatabase } from '../data/DatabaseContext';
import { MigrationService } from '../data/MigrationService';
import styled from 'styled-components/native';

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.colors.background};
`;

const LoadingText = styled.Text`
    color: ${props => props.theme.colors.text};
    margin-top: 20px;
    font-size: 16px;
    font-family: 'Manrope_500Medium';
`;

export const MigrationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { tarotDb, notesDb, isTarotReady, isNotesReady } = useDatabase();
    const [isMigrating, setIsMigrating] = useState(true);

    useEffect(() => {
        const run = async () => {
            if (isTarotReady && isNotesReady && tarotDb && notesDb) {
                try {
                    await MigrationService.runMigration(tarotDb, notesDb);
                } catch (e) {
                    console.error("Migration failed:", e);
                } finally {
                    setIsMigrating(false);
                }
            }
        };
        run();
    }, [isTarotReady, isNotesReady, tarotDb, notesDb]);

    if (isMigrating) {
        // Technically this might flash briefly, but it ensures we don't load the app 
        // until we've at least checked if migration is needed.
        // If we want it invsible, we can just render null or children (and migrate in background).
        // BUT, for history consistency, blocking briefly is safer so the user sees their data immediately.
        return null;
        // Returning null allows the splash screen (if native) to persist or shows nothing.
        // Or we can show a loader if it takes time. 
        // Given it scans 5 years, it might take 1-2 seconds on old phones.
    }

    return <>{children}</>;
};

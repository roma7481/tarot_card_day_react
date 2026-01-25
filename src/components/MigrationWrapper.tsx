import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useDatabase } from '../data/DatabaseContext';
import { MigrationService } from '../data/MigrationService';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${(props: any) => props.theme.colors.background};
`;

const LoadingText = styled.Text`
    color: ${(props: any) => props.theme.colors.text};
    margin-top: 20px;
    font-size: 16px;
    font-family: 'Manrope_500Medium';
`;

export const MigrationWrapper: React.FC<{ children: React.ReactNode, onMigrationComplete?: () => void }> = ({ children, onMigrationComplete }) => {
    const { tarotDb, notesDb, isTarotReady, isNotesReady } = useDatabase();
    const [isMigrating, setIsMigrating] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const run = async () => {
            if (isTarotReady && isNotesReady && tarotDb && notesDb) {
                const needsMigration = await MigrationService.needsMigration();
                if (needsMigration) {
                    setIsMigrating(true);
                    try {
                        await MigrationService.runMigration(tarotDb, notesDb);
                    } catch (e) {
                        console.error("Migration failed:", e);
                    } finally {
                        setIsMigrating(false);
                        onMigrationComplete?.();
                    }
                } else {
                    onMigrationComplete?.();
                }
            }
        };
        run();
    }, [isTarotReady, isNotesReady, tarotDb, notesDb]);

    if (isMigrating) {
        return (
            <LoadingContainer>
                <ActivityIndicator size="large" color="#A78BFA" />
                <LoadingText>{t('common.optimizing')}</LoadingText>
            </LoadingContainer>
        );
    }

    return <>{children}</>;
};

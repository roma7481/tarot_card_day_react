import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { themes, defaultThemeId, ThemeMeta } from './colors';
import { defaultCardBackId } from './cardBacks';

interface ThemeContextType {
    themeId: string;
    setThemeId: (id: string) => void;
    currentTheme: ThemeMeta;
    availableThemes: ThemeMeta[];
    textSize: 'medium' | 'large';
    setTextSize: (size: 'medium' | 'large') => void;
    cardBack: string;
    setCardBack: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

import { useNotesDatabase } from '../hooks/useNotesDatabase';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { db, isReady } = useNotesDatabase();
    const [themeId, setThemeIdState] = useState<string>(defaultThemeId);
    const [textSize, setTextSizeState] = useState<'medium' | 'large'>('medium');
    const [cardBack, setCardBackState] = useState<string>(defaultCardBackId);

    const currentTheme = themes[themeId] || themes[defaultThemeId];
    const availableThemes = Object.values(themes);

    // Load saved settings
    useEffect(() => {
        if (isReady && db) {
            const loadSettings = async () => {
                try {
                    const themeRes = await db.getFirstAsync<{ value: string }>('SELECT value FROM preferences WHERE key = ?', ['themeId']);
                    if (themeRes) setThemeIdState(themeRes.value);

                    const textRes = await db.getFirstAsync<{ value: string }>('SELECT value FROM preferences WHERE key = ?', ['textSize']);
                    if (textRes) setTextSizeState(textRes.value as 'medium' | 'large');

                    const cardBackRes = await db.getFirstAsync<{ value: string }>('SELECT value FROM preferences WHERE key = ?', ['cardBack']);
                    if (cardBackRes) setCardBackState(cardBackRes.value);
                } catch (e) {
                    console.log('Error loading settings', e);
                }
            };
            loadSettings();
        }
    }, [isReady, db]);

    const setThemeId = async (id: string) => {
        setThemeIdState(id);
        if (isReady && db) {
            await db.runAsync('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', ['themeId', id]);
        }
    };

    const setTextSize = async (size: 'medium' | 'large') => {
        setTextSizeState(size);
        if (isReady && db) {
            await db.runAsync('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', ['textSize', size]);
        }
    };

    const setCardBack = async (id: string) => {
        setCardBackState(id);
        if (isReady && db) {
            await db.runAsync('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', ['cardBack', id]);
        }
    };

    return (
        <ThemeContext.Provider value={{ themeId, setThemeId, currentTheme, availableThemes, textSize, setTextSize, cardBack, setCardBack }}>
            <StyledThemeProvider theme={currentTheme.theme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};


import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cardsData from '../data/cards.json';

export interface TarotCard {
    id: string;
    name: string;
    image_url: string;
    description?: string;
}

interface DailyCardManagerState {
    dailyCard: TarotCard | null;
    drawnCardHistory: string[];
    isLoading: boolean;
    isNewCard: boolean;
    currentDate: string; // The date currently being VIEWED
    navigateDay: (direction: number) => void;
    isToday: boolean;
}

export function useDailyCardManager() {
    const [dailyDraws, setDailyDraws] = useState<Record<string, string>>({}); // Date -> CardName
    const [drawnCardHistory, setDrawnCardHistory] = useState<string[]>([]);
    const [viewDate, setViewDate] = useState<string>(new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD local
    const [isLoading, setIsLoading] = useState(true);
    const [isNewCard, setIsNewCard] = useState(false);

    // Storage Keys
    const STORAGE_KEY_DRAWS = 'daily_draws_map'; // { "2023-10-01": "The Fool" }
    const STORAGE_KEY_HISTORY = 'drawn_card_history_list'; // ["The Fool", "The Magician"]

    // Legacy / Migration Keys (Native App or Previous Version)
    const LEGACY_KEY_CARD = 'dailyCardName';
    const LEGACY_KEY_DATE = 'lastDrawDate';

    const getAllCards = (): TarotCard[] => {
        return (cardsData as any).cards || cardsData;
    };

    const getTodayStr = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

    // Load Data
    useEffect(() => {
        const initManager = async () => {
            try {
                setIsLoading(true);
                const todayStr = getTodayStr();
                setViewDate(todayStr);

                const [storedDrawsStr, storedHistoryStr, legacyCard, legacyDate] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEY_DRAWS),
                    AsyncStorage.getItem(STORAGE_KEY_HISTORY),
                    AsyncStorage.getItem(LEGACY_KEY_CARD),
                    AsyncStorage.getItem(LEGACY_KEY_DATE)
                ]);

                let draws: Record<string, string> = storedDrawsStr ? JSON.parse(storedDrawsStr) : {};
                let history: string[] = storedHistoryStr ? JSON.parse(storedHistoryStr) : [];

                // --- MIGRATION LOGIC ---
                // If we have legacy keys but no new map, migrate them
                if (Object.keys(draws).length === 0 && legacyCard && legacyDate) {
                    console.log("Migrating legacy daily card to new map system...");
                    draws[legacyDate] = legacyCard;
                    if (!history.includes(legacyCard)) {
                        history.push(legacyCard);
                    }
                    // Save immediately
                    await AsyncStorage.multiSet([
                        [STORAGE_KEY_DRAWS, JSON.stringify(draws)],
                        [STORAGE_KEY_HISTORY, JSON.stringify(history)]
                    ]);
                }

                setDailyDraws(draws);
                setDrawnCardHistory(history);

            } catch (error) {
                console.error("Failed to init Daily Manager:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initManager();
    }, []);

    const drawDailyCard = async () => {
        const todayStr = getTodayStr();

        // Safety check: Don't draw if already drawn
        if (dailyDraws[todayStr]) return;

        console.log(" Drawing new card for date:", todayStr);
        const allCards = getAllCards();

        // Simple random draw
        const randomIndex = Math.floor(Math.random() * allCards.length);
        const newCard = allCards[randomIndex];

        const newDraws = { ...dailyDraws, [todayStr]: newCard.name };
        const newHistory = [...drawnCardHistory];

        if (!newHistory.includes(newCard.name)) {
            newHistory.push(newCard.name);
            newHistory.sort();
        }

        // Save State
        setDailyDraws(newDraws);
        setDrawnCardHistory(newHistory);

        // Save to Storage
        await AsyncStorage.multiSet([
            [STORAGE_KEY_DRAWS, JSON.stringify(newDraws)],
            [STORAGE_KEY_HISTORY, JSON.stringify(newHistory)]
        ]);

        setIsNewCard(true);
        setTimeout(() => setIsNewCard(false), 3000);

        return newCard;
    };

    // Navigation
    const navigateDay = (direction: number) => {
        const current = new Date(viewDate);
        current.setDate(current.getDate() + direction);
        const newDateStr = current.toLocaleDateString('en-CA');

        // Prevent going to future
        if (newDateStr > getTodayStr()) return;

        setViewDate(newDateStr);
    };

    // Derive active card from ViewDate + Draws Map
    const activeCardName = dailyDraws[viewDate];
    const allCards = getAllCards();
    const dailyCard = activeCardName ? allCards.find(c => c.name === activeCardName) || null : null;

    return {
        dailyCard,
        drawnCardHistory,
        isLoading,
        isNewCard: isNewCard && viewDate === getTodayStr(), // Only show animation if viewing today
        currentDate: viewDate,
        navigateDay,
        isToday: viewDate === getTodayStr(),
        drawDailyCard
    };
}

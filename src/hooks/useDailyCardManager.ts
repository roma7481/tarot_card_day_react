import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import cardsData from '../data/cards.json';
import { useNotesDatabase } from './useNotesDatabase';
import { useHistory } from './useHistory';
import { useTarotDatabase } from './useTarotDatabase';

export interface TarotCard {
    id: string;
    name: string;
    image_url: string;
    description?: string;
}

export function useDailyCardManager() {
    const { db, isReady } = useNotesDatabase();
    const { addDailyDraw } = useHistory();
    const { getCardInterpretation, isReady: isTarotReady } = useTarotDatabase(); // Use localized DB

    // View State
    // Default to "today" YYYY-MM-DD local
    const getTodayStr = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [viewDate, setViewDate] = useState<string>(getTodayStr());
    const [dailyCard, setDailyCard] = useState<TarotCard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewCard, setIsNewCard] = useState(false);

    // Load Card for ViewDate
    useEffect(() => {
        const fetchCardForDate = async () => {
            if (!db || !isReady || !isTarotReady) return;

            setIsLoading(true);
            try {
                // Query SQLite for this specific date
                const record = await db.getFirstAsync<{ card_name: string, card_id: string }>(
                    'SELECT card_name, card_id FROM daily_draws WHERE date = ?',
                    [viewDate]
                );

                console.log(`[DailyCard] Fetching for ${viewDate}`, record);

                if (record && record.card_id) {
                    // Fetch LOCALIZED content by ID
                    const localizedData = await getCardInterpretation(record.card_id);

                    if (localizedData) {
                        setDailyCard({
                            id: record.card_id,
                            name: localizedData.name,
                            image_url: '', // Handled by UI
                            description: localizedData.general
                        });
                        console.log(`[DailyCard] Loaded localized: ${localizedData.name}`);
                    } else {
                        // Fallback (Rare): If localized DB fails, show stored name (migrated/english)
                        setDailyCard({
                            id: record.card_id,
                            name: record.card_name || 'Unknown',
                            image_url: '',
                            description: ''
                        });
                    }
                } else {
                    setDailyCard(null);
                }
            } catch (e) {
                console.error("Error fetching daily card for date:", viewDate, e);
                setDailyCard(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCardForDate();
    }, [viewDate, db, isReady, isTarotReady, getCardInterpretation]);

    // Auto-refresh date on App Resume
    const lastTodayRef = useRef(getTodayStr());

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                const nowToday = getTodayStr();
                const oldToday = lastTodayRef.current;

                if (nowToday !== oldToday) {
                    console.log(`[DailyCard] Date changed in background! ${oldToday} -> ${nowToday}`);
                    lastTodayRef.current = nowToday;

                    // If user was viewing "Yesterday" (which was today), auto-forward them
                    if (viewDate === oldToday) {
                        console.log(`[DailyCard] Auto-updating view to new today.`);
                        setViewDate(nowToday);
                    }
                }
            }
        });

        return () => {
            subscription.remove();
        };
    }, [viewDate]);

    const drawDailyCard = async () => {
        const todayStr = getTodayStr();

        // Safety
        if (viewDate !== todayStr || dailyCard) return null;

        // Draw Random ID (1-78)
        const randomId = String(Math.floor(Math.random() * 78) + 1);

        // Fetch Content
        const localizedData = await getCardInterpretation(randomId);

        if (!localizedData) return null;

        const newCard: TarotCard = {
            id: randomId,
            name: localizedData.name,
            image_url: '',
            description: localizedData.general
        };

        // Save to SQLite
        try {
            await addDailyDraw(newCard.id, newCard.name);
            setDailyCard(newCard); // Update UI immediately

            setIsNewCard(true);
            setTimeout(() => setIsNewCard(false), 3000);

            return newCard;
        } catch (e) {
            console.error("Failed to save draw:", e);
            return null;
        }
    };

    // Navigation (Skip Empty Days)
    const navigateDay = async (direction: number) => {
        if (!db) return;

        try {
            // "Previous" finds latest date BEFORE current
            // "Next" finds earliest date AFTER current
            const operator = direction < 0 ? '<' : '>';
            const order = direction < 0 ? 'DESC' : 'ASC';

            const result = await db.getFirstAsync<{ date: string }>(
                `SELECT date FROM daily_draws WHERE date ${operator} ? ORDER BY date ${order} LIMIT 1`,
                [viewDate]
            );

            if (result) {
                setViewDate(result.date);
            } else {
                // Edge Case: If going forward and no future cards found
                // If we are NOT at "Today", create a path back to "Today" so user can draw new card.
                if (direction > 0 && viewDate < getTodayStr()) {
                    setViewDate(getTodayStr());
                }
                // If going back and no history, stay put (or maybe show toast "No earlier history")
            }
        } catch (e) {
            console.error("Navigation error:", e);
        }
    };

    return {
        dailyCard,
        isLoading,
        isNewCard,
        currentDate: viewDate,
        navigateDay,
        isToday: viewDate === getTodayStr(),
        drawDailyCard
    };
}

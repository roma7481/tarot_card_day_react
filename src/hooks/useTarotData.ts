import { useState, useEffect } from 'react';
import { useTarotDatabase, LocalizedCardData } from './useTarotDatabase';
import { useHistory } from './useHistory';

export interface TarotCard {
  id: string;
  name: string;
  image_url: string; // Kept for types, but we use local mapping
  description: string;
}

export function useTarotData() {
  const [dailyCard, setDailyCard] = useState<TarotCard | null>(null);
  const [loading, setLoading] = useState(true);
  const { getCardInterpretation, isReady: isTarotReady } = useTarotDatabase();
  const { addDailyDraw, getTodaysDraw, isReady: isHistoryReady } = useHistory();

  useEffect(() => {
    const fetchCard = async () => {
      // Both DBs must be ready
      if (!isTarotReady || !isHistoryReady) return;

      setLoading(true);

      let idStr = '';

      // 1. Check if we already have a card for today
      const existingDraw = await getTodaysDraw();

      if (existingDraw) {
        // Use existing
        idStr = existingDraw.card_id;
        console.log(`Loaded existing daily card: ${idStr}`);
      } else {
        // 2. Generate new random card
        const randomId = Math.floor(Math.random() * 78) + 1;
        idStr = String(randomId);
      }

      // 3. Get Card Content
      const data = await getCardInterpretation(idStr);

      if (data) {
        // 4. Persist it if it was a new draw
        if (!existingDraw) {
          await addDailyDraw(idStr, data.name);
          console.log(`Generated and saved new daily card: ${data.name} (${idStr})`);
        }

        setDailyCard({
          id: idStr,
          name: data.name,
          image_url: '', // Handled by RevealedCard
          description: data.general || ''
        });
      }

      setLoading(false);
    };

    fetchCard();
  }, [isTarotReady, isHistoryReady]);

  return { dailyCard, loading };
}

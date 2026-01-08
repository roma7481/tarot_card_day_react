import { DailyDraw } from '../hooks/useHistory';

export interface CardStats {
    total: number;
    majors: number;
    minors: number;
    suits: {
        wands: number;
        cups: number;
        swords: number;
        pentacles: number;
    };
    mostDrawn?: string; // ID
    mostDrawnName?: string; // English Name from DB
    mostDrawnCount?: number; // Frequency
}

export const calculateStats = (history: DailyDraw[]): CardStats => {
    const stats: CardStats = {
        total: history.length,
        majors: 0,
        minors: 0,
        suits: {
            wands: 0,
            cups: 0,
            swords: 0,
            pentacles: 0
        },
        mostDrawnCount: 0
    };

    const counts: Record<string, number> = {};
    const nameMap: Record<string, string> = {}; // ID -> Name

    history.forEach(draw => {
        const id = parseInt(draw.card_id, 10);

        // Capture name mapping if available
        if (draw.card_name && !nameMap[draw.card_id]) {
            nameMap[draw.card_id] = draw.card_name;
        }

        // Count frequency
        counts[draw.card_id] = (counts[draw.card_id] || 0) + 1;

        // Major vs Minor
        if (id >= 1 && id <= 22) {
            stats.majors++;
        } else {
            stats.minors++;

            // Suits
            if (id >= 23 && id <= 36) stats.suits.wands++;
            else if (id >= 37 && id <= 50) stats.suits.cups++;
            else if (id >= 51 && id <= 64) stats.suits.swords++;
            else if (id >= 65 && id <= 78) stats.suits.pentacles++;
        }
    });

    // Find most drawn
    let max = 0;
    let mostDrawnId = undefined;
    Object.entries(counts).forEach(([id, count]) => {
        if (count > max) {
            max = count;
            mostDrawnId = id;
        }
    });
    stats.mostDrawn = mostDrawnId;
    stats.mostDrawnCount = max;
    if (mostDrawnId) {
        stats.mostDrawnName = nameMap[mostDrawnId];
    }

    return stats;
};

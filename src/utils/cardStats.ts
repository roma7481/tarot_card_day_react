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

    // New Stats
    streak: number;
    last7Days: number[]; // Array of counts for last 7 days (today is index 6 or 0 depending on pref, let's say index 6 is today)
    numerology: {
        aces: number;
        numbers: number; // 2-10
        court: number; // Page, Knight, Queen, King
    };
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
        mostDrawnCount: 0,
        streak: 0,
        last7Days: [0, 0, 0, 0, 0, 0, 0],
        numerology: {
            aces: 0,
            numbers: 0,
            court: 0
        }
    };

    const counts: Record<string, number> = {};
    const nameMap: Record<string, string> = {}; // ID -> Name
    const uniqueDates = new Set<string>();

    // Helper to normalize date string YYYY-MM-DD
    const normalizeDate = (d: string) => d.split('T')[0];

    // Weekly Activity Setup
    const today = new Date();
    const last7DaysMap: Record<string, number> = {}; // date string -> index
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i)); // 0 = 6 days ago, 6 = today
        const dateStr = d.toISOString().split('T')[0];
        last7DaysMap[dateStr] = i;
    }

    // Sort history by date desc for streak
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    history.forEach(draw => {
        const id = parseInt(draw.card_id, 10);
        const dateStr = normalizeDate(draw.date);
        uniqueDates.add(dateStr);

        // Capture name
        if (draw.card_name && !nameMap[draw.card_id]) {
            nameMap[draw.card_id] = draw.card_name;
        }

        // Count frequency
        counts[draw.card_id] = (counts[draw.card_id] || 0) + 1;

        // Weekly Activity
        if (last7DaysMap[dateStr] !== undefined) {
            stats.last7Days[last7DaysMap[dateStr]]++;
        }

        // Major vs Minor & Numerology
        if (id >= 1 && id <= 22) {
            stats.majors++;
            // Majors don't fit strict Ace/Number/Court numerology in standard RWS decks usually treated separately
            // Or typically they are separate. Let's count them as neither or specific?
            // User request: "Numerology Insights". 
            // Often Majors are "Spirit" or "Archetypes".
            // Let's purely count Minors for numerology breakdown to avoid confusion, 
            // OR we could map Magician=1(Ace)? No, that's conflating.
            // Let's stick to Minor Arcana for the Aces/Numbers/Court split.
        } else {
            stats.minors++;

            // Normalized Rank (0-13)
            // Wands: 23-36. 23-23=0 (Ace). 36-23=13 (King).
            // Cups: 37-50. 37-37=0 (Ace).
            // Swords: 51-64.
            // Pentacles: 65-78.

            let rank = -1;
            if (id >= 23 && id <= 36) { stats.suits.wands++; rank = id - 23; }
            else if (id >= 37 && id <= 50) { stats.suits.cups++; rank = id - 37; }
            else if (id >= 51 && id <= 64) { stats.suits.swords++; rank = id - 51; }
            else if (id >= 65 && id <= 78) { stats.suits.pentacles++; rank = id - 65; }

            if (rank === 0) stats.numerology.aces++;
            else if (rank >= 1 && rank <= 9) stats.numerology.numbers++; // 2 through 10
            else if (rank >= 10 && rank <= 13) stats.numerology.court++;
        }
    });

    // Calculate Streak
    // Logic: Count consecutive days going back from today (or yesterday if today not done yet).
    // Actually, simple is best: Check if today exists, if so streak starts today. If not, check yesterday.
    // But `sortedHistory` might have gaps.
    // Let's re-sort only unique dates
    const sortedUniqueDates = Array.from(uniqueDates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    if (sortedUniqueDates.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Check if head of list is today or yesterday
        let dateToCheck = new Date(); // Start with today
        let hasStarted = false;

        // If the most recent draw is today, streak includes today.
        // If most recent is yesterday, streak is valid (continuing).
        // If most recent is older, streak is broken (0).

        const latestInfo = sortedUniqueDates[0];
        if (latestInfo === todayStr || latestInfo === yesterdayStr) {
            // Iterate backwards
            // This is tricky with string dates.
            // Better: Iterate sortedUniqueDates.
            // 1. Is sortedUniqueDates[0] == today? Yes -> Streak = 1. Next is yesterday?
            // 2. Is sortedUniqueDates[0] == yesterday? Yes -> Streak = 1. (Today missed but streak held).
            // Let's simply count consecutive days from the LATEST DRAW downwards.
            // IF the latest draw is older than yesterday, streak is 0.

            const latestDate = new Date(latestInfo);
            const diffTime = Math.abs(new Date(todayStr).getTime() - latestDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // If diffDays > 1 (meaning gap between today and latest > 1 day, i.e. 2 days ago), streak broken.
            // Wait: today=13th. latest=12th. diff=1 day. streak valid.
            // today=13th. latest=11th. diff=2 days. streak broken (0).
            // However, calculateStreak usually counts "Active Streak". 
            // If I missed today, but did yesterday, is my streak 1? Yes.

            if (diffDays <= 1) { // 0 (today) or 1 (yesterday)
                currentStreak = 1;
                let prevDate = latestDate;

                for (let i = 1; i < sortedUniqueDates.length; i++) {
                    const thisDate = new Date(sortedUniqueDates[i]);
                    // Check if thisDate is exactly 1 day before prevDate
                    const gap = (prevDate.getTime() - thisDate.getTime()) / (1000 * 3600 * 24);
                    if (Math.round(gap) === 1) {
                        currentStreak++;
                        prevDate = thisDate;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    stats.streak = currentStreak;

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

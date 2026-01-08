import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CARD_NAME_MAPPING, CARD_NAME_TO_ID } from '../data/cardNameMapping';
import { useDatabase } from '../data/DatabaseContext';

export interface LocalizedCardData {
    name: string;
    [key: string]: string;
}

const TABLE_MAPPINGS: Record<string, string> = {
    en: 'DAILY_CARD_INFO_TAROT_ENG',
    ru: 'DAILY_CARD_INFO_TAROT_RUS',
    es: 'DAILY_CARD_INFO_TAROT_ES',
    pt: 'DAILY_CARD_INFO_TAROT_PORT',
    it: 'DAILY_CARD_INFO_TAROT_IT',
    fr: 'DAILY_CARD_INFO_TAROT_FR',
    de: 'DAILY_CARD_INFO_TAROT_DE',
    ja: 'DAILY_CARD_INFO_TAROT_JAP',
    pl: 'DAILY_CARD_INFO_TAROT_POL',
};

// Map: Language -> { StandardKey: DBColumnName }
const COLUMN_MAPPINGS: Record<string, Record<string, string>> = {
    en: { name: 'card_name', general: 'meaning_eng', love: 'romance', career: 'work_education', finance: 'money', spirituality: 'spirit', health: 'health_eng', yes_no: 'yes_no_eng', advice: 'key_sentence' },
    ru: { name: 'card_name', general: 'meaning', love: 'relationship', career: 'professional', finance: 'finance', health: 'health', personal: 'personal_condition', deep: 'deeper', advice: 'advice' },
    es: { name: 'card_name', general: 'general_esp', love: 'love_esp', career: 'work_esp', finance: 'money_esp', health: 'health_esp', yes_no: 'yesno_esp' },
    pt: { name: 'card_name', general: 'detailed_description_port', love: 'love_port', finance: 'work_money_port', health: 'health_port', yes_no: 'yes_no_port', reversed: 'negative_meaning_port' },
    it: { name: 'card_name', general: 'general_it', love: 'romance_it', career: 'work_it', finance: 'money_it', advice: 'advice_it', reversed: 'reversed_it' },
    fr: { name: 'card_name', general: 'general_fr', love: 'love_fr', career: 'work_fr', reversed: 'reversed_general_fr' },
    de: { name: 'card_name', general: 'meaning_de', love: 'romance_de', career: 'work_de', advice: 'advice_de', astrology: 'astrology_de', claim: 'claim_de', daily_card: 'card_of_the_day_de' },
    ja: { name: 'card_name', general: 'meaning_jp', love: 'love_jp', career: 'work_jp', finance: 'money_jp', deep: 'deep_jp', person: 'person_jp', how_to_read: 'how_to_read_jp' },
    pl: { name: 'card_name', general: 'general_pl', love: 'love_pl', finance: 'money_pl', keywords: 'keywords_pl' },
};

// Map: Language -> Name of the column containing the English Card Name
const NAME_LOOKUP_COLUMNS: Record<string, string> = {
    en: 'card_name', // English table uses card_name
    ru: 'card_name_eng',
    es: 'card_name_eng',
    pt: 'card_name_eng',
    it: 'card_name_eng',
    fr: 'card_name_eng',
    de: 'card_name_eng',
    ja: 'card_name_eng',
    pl: 'card_name_eng'
};

export const useTarotDatabase = () => {
    const { i18n } = useTranslation();
    const { tarotDb: db, isTarotReady: isReady } = useDatabase();

    const getCardInterpretation = useCallback(async (standardCardId: string): Promise<LocalizedCardData | null> => {
        if (!db || !isReady) return null;

        try {
            const lang = i18n.language;
            const tableName = TABLE_MAPPINGS[lang] || TABLE_MAPPINGS['en'];
            const columnMap = COLUMN_MAPPINGS[lang] || COLUMN_MAPPINGS['en'];

            // Should always exist now
            const nameLookupCol = NAME_LOOKUP_COLUMNS[lang] || NAME_LOOKUP_COLUMNS['en'];

            // 1. Get English Name from ID
            const englishName = CARD_NAME_MAPPING[standardCardId];
            if (!englishName) {
                console.warn(`No English Name found for ID ${standardCardId}`);
                return null;
            }

            // 2. Query by English Name
            const query = `SELECT * FROM ${tableName} WHERE ${nameLookupCol} = ?`;
            const params = [englishName];

            const result = await db.getFirstAsync<any>(query, params);

            if (!result) return null;

            const localizedData: LocalizedCardData = { name: '' };
            Object.keys(columnMap).forEach(key => {
                const dbCol = columnMap[key];
                if (result[dbCol]) localizedData[key] = result[dbCol];
            });

            return localizedData;

        } catch (error) {
            console.error("Database query error:", error);
            return null;
        }
    }, [db, isReady, i18n.language]);

    const getAllCards = useCallback(async (): Promise<{ id: string; name: string }[]> => {
        if (!db || !isReady) return [];
        try {
            const lang = i18n.language;
            const tableName = TABLE_MAPPINGS[lang] || TABLE_MAPPINGS['en'];
            const columnMap = COLUMN_MAPPINGS[lang] || COLUMN_MAPPINGS['en'];

            const localizedNameCol = columnMap.name;
            const engNameCol = NAME_LOOKUP_COLUMNS[lang] || NAME_LOOKUP_COLUMNS['en'];

            // Fetch English Name (for ID lookup) AND Localized Name (for Display)
            const query = `SELECT ${engNameCol} as eng_name, ${localizedNameCol} as name FROM ${tableName}`;
            console.log('Fetching Cards Query:', query);

            // Try without empty array if params are empty
            const results = await db.getAllAsync<{ eng_name: string; name: string }>(query);

            const cards = results.map(row => {
                const id = CARD_NAME_TO_ID[row.eng_name];

                if (!id) {
                    // Fallback or warning?
                    // console.warn('No ID found for card:', row.eng_name); 
                    // This might happen if DB has "The Wheel of Fortune" but map has "Wheel of Fortune"
                    return null;
                }

                return {
                    id: id,
                    name: row.name
                };
            }).filter((c): c is { id: string; name: string } => c !== null); // Type guard filter

            // Sort by Standard ID (1-78)
            return cards.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        } catch (error) {
            console.error("Error fetching all cards:", error);
            return [];
        }
    }, [db, isReady, i18n.language]);

    return { getCardInterpretation, getAllCards, isReady };
};

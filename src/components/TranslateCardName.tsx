import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTarotDatabase } from '../hooks/useTarotDatabase';
import { CARD_NAME_MAPPING } from '../data/cardNameMapping';
import { Text, TextProps } from 'react-native';

interface TranslateCardNameProps extends TextProps {
    id: string;
    fallback?: string;
}

export const TranslateCardName = ({ id, fallback, ...props }: TranslateCardNameProps) => {
    const { getCardInterpretation, isReady } = useTarotDatabase();
    const { i18n } = useTranslation();
    const [name, setName] = useState(fallback || CARD_NAME_MAPPING[id] || "");

    useEffect(() => {
        let mounted = true;

        if (!isReady || !id) return;

        const fetchName = async () => {
            try {
                const data = await getCardInterpretation(id);
                if (mounted && data && data.name) {
                    setName(data.name);
                }
            } catch (e) {
                // Keep fallback
            }
        };

        fetchName();
        return () => { mounted = false; };
    }, [id, i18n.language, isReady, getCardInterpretation]);

    return <Text {...props}>{name}</Text>;
};

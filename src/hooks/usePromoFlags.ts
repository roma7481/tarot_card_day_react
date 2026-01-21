import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROMO_MAGIC_KEY = 'promo_magic_clicked';
const PROMO_HEALING_KEY = 'promo_healing_clicked';
const PROMO_ASTROLOGY_KEY = 'promo_astrology_clicked';

export type PromoType = 'magic' | 'healing' | 'astrology';

export function usePromoFlags() {
    const [flags, setFlags] = useState<Record<PromoType, boolean>>({
        magic: true, // Default to true (hidden) while loading to avoid flash or if we want opt-in
        healing: true,
        astrology: true,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFlags = async () => {
            try {
                const [magic, healing, astrology] = await Promise.all([
                    AsyncStorage.getItem(PROMO_MAGIC_KEY),
                    AsyncStorage.getItem(PROMO_HEALING_KEY),
                    AsyncStorage.getItem(PROMO_ASTROLOGY_KEY),
                ]);

                setFlags({
                    magic: magic === 'true',
                    healing: healing === 'true',
                    astrology: astrology === 'true',
                });
            } catch (e) {
                console.error('Failed to load promo flags', e);
            } finally {
                setLoading(false);
            }
        };

        loadFlags();
    }, []);

    const setPromoClicked = useCallback(async (type: PromoType) => {
        try {
            let key = '';
            switch (type) {
                case 'magic': key = PROMO_MAGIC_KEY; break;
                case 'healing': key = PROMO_HEALING_KEY; break;
                case 'astrology': key = PROMO_ASTROLOGY_KEY; break;
            }

            if (key) {
                await AsyncStorage.setItem(key, 'true');
                setFlags(prev => ({ ...prev, [type]: true }));
            }
        } catch (e) {
            console.error(`Failed to save promo flag for ${type}`, e);
        }
    }, []);

    return { flags, setPromoClicked, loading };
}

import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initConnection, getAvailablePurchases, endConnection } from 'react-native-iap';
import { adService } from '../services/AdService';

const ITEM_SKUS = Platform.select({
    android: [
        'card_day_no_ads',
        'card_day_premium'
    ],
    ios: [
        'card_day_no_ads',
        'card_day_premium'
    ]
});

export const usePremium = () => {
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkPremium();
        return () => {
            endConnection();
        }
    }, []);

    const checkPremium = async () => {
        try {
            // 0. Check Dev Override (For Testing)
            if (__DEV__) {
                const devOverride = await AsyncStorage.getItem('DEV_PREMIUM_OVERRIDE');
                if (devOverride === 'true') {
                    console.log('DEV: Premium Override Active');
                    setIsPremium(true);
                    adService.setPremium(true);
                    setLoading(false);
                    return;
                }
            }

            // 1. Check local cache first for speed
            // TEST MODE: Disable cache to force fresh check
            // const cached = await AsyncStorage.getItem('IS_PREMIUM_USER');
            // if (cached === 'true') {
            //     setIsPremium(true);
            // }

            // 2. Initialize connection
            await initConnection();

            // 3. Get available purchases (restores transactions essentially)
            const purchases = await getAvailablePurchases();

            let hasPremium = false;

            purchases.forEach(purchase => {
                if (purchase.productId === 'card_day_premium' || purchase.productId === 'card_day_no_ads') {
                    hasPremium = true;
                }
            });

            // 4. Update state and cache
            if (hasPremium) {
                setIsPremium(true);
                await AsyncStorage.setItem('IS_PREMIUM_USER', 'true');
                adService.setPremium(true); // Disable ads immediately
            } else {
                // Only set to false if we are sure (e.g. no purchases found)
                setIsPremium(false);
                await AsyncStorage.setItem('IS_PREMIUM_USER', 'false');
                adService.setPremium(false); // Enable ads
            }

        } catch (e) {
            console.error('Error checking premium status', e);
            // If error, rely on cache (already set above if it existed)
        } finally {
            setLoading(false);
        }
    };

    return { isPremium, loading, checkPremium };
};

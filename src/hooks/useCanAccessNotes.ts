import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePremium } from './usePremium';

export const useCanAccessNotes = () => {
    const { isPremium, loading: premiumLoading } = usePremium();
    const [canAccess, setCanAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            if (premiumLoading) return;

            // 1. If Premium, always yes
            if (isPremium) {
                setCanAccess(true);
                setLoading(false);
                return;
            }

            // 2. If Android, check for legacy flag
            if (Platform.OS === 'android') {
                try {
                    const legacyFlag = await AsyncStorage.getItem('LEGACY_ACCESS_NOTES');
                    if (legacyFlag === 'true') {
                        setCanAccess(true);
                        setLoading(false);
                        return;
                    }
                } catch (e) {
                    console.error('Error checking legacy notes flag', e);
                }
            }

            // 3. Default to false (Locked)
            setCanAccess(false);
            setLoading(false);
        };

        checkAccess();
    }, [isPremium, premiumLoading]);

    return { canAccess, loading };
};

import { useState, useEffect } from 'react';
import { iapService } from '../services/IAPService';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export const usePremium = () => {
    const [isPremium, setIsPremium] = useState(iapService.getPremiumStatus());
    const [loading, setLoading] = useState(true);

    // Initial check
    useEffect(() => {
        checkPremium();
    }, []);

    // Re-check when screen comes into focus (optional but good for sync)
    useFocusEffect(
        useCallback(() => {
            checkPremium();
        }, [])
    );

    const checkPremium = async () => {
        setLoading(true);
        const status = await iapService.checkPremium();
        setIsPremium(status);
        setLoading(false);
    };

    return { isPremium, loading, checkPremium };
};

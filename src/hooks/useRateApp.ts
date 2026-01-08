import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

const LAUNCH_COUNT_KEY = 'rate_app_launch_count';
const RATE_STATUS_KEY = 'rate_app_status'; // 'IDLE' | 'RATED' | 'NEVER'
const LAST_PROMPT_KEY = 'rate_app_last_prompt_count';

const PROMPT_INTERVAL = 10;
const STORE_URL = 'https://play.google.com/store/apps/details?id=tarocard.crazybee.com.tarotcardoftheday';

export function useRateApp() {
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkRateStatus();
    }, []);

    const checkRateStatus = async () => {
        try {
            const status = await AsyncStorage.getItem(RATE_STATUS_KEY);
            if (status === 'RATED' || status === 'NEVER') {
                setLoading(false);
                return;
            }

            const countStr = await AsyncStorage.getItem(LAUNCH_COUNT_KEY);
            let count = countStr ? parseInt(countStr, 10) : 0;

            // Increment logic should be called once per "session". 
            // Since this hook mounts on MainScreen, we can increment here, 
            // BUT we need to ensure we don't double count on hot reload or quick nav.
            // A simple session key in memory or just incrementing is fine for this requirement.
            // Let's increment.
            count++;
            await AsyncStorage.setItem(LAUNCH_COUNT_KEY, count.toString());

            const lastPromptStr = await AsyncStorage.getItem(LAST_PROMPT_KEY);
            const lastPrompt = lastPromptStr ? parseInt(lastPromptStr, 10) : 0;

            // Check trigger: Every 10 entries (10, 20, 30...) relative to last prompt?
            // "pop up every 10 entries"
            // If we prompted at 10 and they said later, prompt at 20.
            if (count >= lastPrompt + PROMPT_INTERVAL) {
                setIsVisible(true);
            }

        } catch (e) {
            console.error("Rate App Check Failed", e);
        } finally {
            setLoading(false);
        }
    };

    const handleYes = async () => {
        setIsVisible(false);
        await AsyncStorage.setItem(RATE_STATUS_KEY, 'RATED');
        Linking.openURL(STORE_URL);
    };

    const handleLater = async () => {
        setIsVisible(false);
        // Reset the "last prompt" baseline to current count
        const countStr = await AsyncStorage.getItem(LAUNCH_COUNT_KEY);
        const count = countStr ? parseInt(countStr, 10) : 0;
        await AsyncStorage.setItem(LAST_PROMPT_KEY, count.toString());
    };

    const handleNo = async () => {
        setIsVisible(false);
        await AsyncStorage.setItem(RATE_STATUS_KEY, 'NEVER');
    };

    return {
        isVisible,
        handleYes,
        handleLater,
        handleNo,
        loading
    };
}

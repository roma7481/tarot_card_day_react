import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { useDatabase } from '../data/DatabaseContext';
import { useTranslation } from 'react-i18next';

export const useNotifications = () => {
    const { t } = useTranslation();
    const { notesDb, isNotesReady } = useDatabase();
    const [enabled, setEnabled] = useState(false);
    // time stored as "HH:mm" string (24h format)
    const [time, setTime] = useState<string>("09:00");

    // Load settings from DB
    useEffect(() => {
        if (!isNotesReady || !notesDb) return;

        const loadSettings = async () => {
            try {
                const enabledRes = await notesDb.getFirstAsync<{ value: string }>('SELECT value FROM preferences WHERE key = ?', ['notificationsEnabled']);
                if (enabledRes) setEnabled(enabledRes.value === 'true');

                const timeRes = await notesDb.getFirstAsync<{ value: string }>('SELECT value FROM preferences WHERE key = ?', ['notificationTime']);
                if (timeRes) setTime(timeRes.value);
            } catch (e) {
                console.log("Error loading notification settings", e);
            }
        };
        loadSettings();
    }, [isNotesReady, notesDb]);

    const requestPermissions = async () => {
        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('daily-tarot', {
                    name: 'Daily Tarot',
                    importance: Notifications.AndroidImportance.HIGH,
                    sound: 'default',
                });
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            return finalStatus === 'granted';
        } catch (e: any) {
            Alert.alert("Permission Error", e.message);
            return false;
        }
    };

    const scheduleNotification = async (targetTime: string) => {
        // Cancel all existing first
        await Notifications.cancelAllScheduledNotificationsAsync();

        const [hour, minute] = targetTime.split(':').map(Number);

        // Schedule
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: t('notifications.dailyTitle'),
                    body: t('notifications.dailyBody'),
                    sound: true,
                    data: { date: new Date().toISOString() },
                    // Channel ID must be in content for Android
                    color: '#60A5FA', // Optional accent color
                    ...(Platform.OS === 'android' ? { channelId: 'daily-tarot' } : {}),
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    hour: hour,
                    minute: minute,
                },
            });
            console.log(`Notification scheduled for ${hour}:${minute}`);
        } catch (e: any) {
            console.error("Error scheduling notification:", e);
        }
    };

    const toggleNotifications = async (value: boolean) => {
        setEnabled(value);
        if (isNotesReady && notesDb) {
            await notesDb.runAsync('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', ['notificationsEnabled', String(value)]);
        }

        if (value) {
            const granted = await requestPermissions();
            if (granted) {
                await scheduleNotification(time);
            } else {
                setEnabled(false); // Revert if permission denied
                Alert.alert('Permission denied', 'Please enable notifications in system settings.');
            }
        } else {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
    };

    const updateTime = async (newTime: string) => {
        setTime(newTime);
        if (isNotesReady && notesDb) {
            await notesDb.runAsync('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', ['notificationTime', newTime]);
        }

        if (enabled) {
            await scheduleNotification(newTime);
        }
    };

    return {
        enabled,
        time, // "HH:mm"
        toggleNotifications,
        updateTime
    };
};

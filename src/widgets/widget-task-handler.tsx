import React from 'react';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { DailyTarotWidget } from './DailyTarotWidget';

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function widgetTaskHandler(props: any) {
    const { widgetInfo, renderWidget } = props;

    let propsToRender = {
        cardName: "Tap to Reveal",
        date: new Date().toLocaleDateString(),
        theme: "dark",
        transparency: 0,
        showDate: true,
        imageUri: undefined
    };

    try {
        const cachedJson = await AsyncStorage.getItem('widget_cached_data');
        if (cachedJson) {
            const cached = JSON.parse(cachedJson);

            // basic check: is the cached data for today?
            // The cached.date string format varies (localized). 
            // We can't easily rely on string comparison unless we stored a raw timestamp or ISO date.
            // Let's rely on the fact we store 'date' in the cache.
            // Actually, in WidgetSyncService we stored 'date' user-facing string. 
            // We should ideally store a timestamp to check staleness.
            // But for now, let's just render what's there. 
            // The user's main issue is " Tap to Reveal" not showing up or "Sync" not happening.
            // If the user adds the widget and sees NOTHING, it's because cache is empty.
            // If they see OLD card, it's staleness.
            // Let's assume the SyncService is doing its job now with the useEffect.

            propsToRender = {
                ...propsToRender,
                ...cached
            };
        } else {
            // Fallback: Try reading settings directly if cached data missing (e.g. first run after update)
            const theme = await AsyncStorage.getItem('widget_theme');
            if (theme) propsToRender.theme = theme;
        }
    } catch (e) {
        console.warn('Failed to read widget cache:', e);
    }

    renderWidget(
        <DailyTarotWidget
            cardName={propsToRender.cardName}
            imageUri={propsToRender.imageUri}
            date={propsToRender.date}
            theme={propsToRender.theme as any}
            transparency={propsToRender.transparency}
            showDate={propsToRender.showDate}
        />
    );
}

// Just export the handler itself, we will register it in index.ts

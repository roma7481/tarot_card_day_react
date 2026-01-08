import { requestWidgetUpdate } from 'react-native-android-widget';
import { DailyTarotWidget } from '../widgets/DailyTarotWidget';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const syncWidgetData = async (cardName: string, imageUri: string, date?: string) => {
    try {
        const displayDate = date || new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

        // Read Settings
        const theme = (await AsyncStorage.getItem('widget_theme')) as 'light' | 'dark' || 'dark';
        const transparencyStr = await AsyncStorage.getItem('widget_transparency');
        const showDateStr = await AsyncStorage.getItem('widget_show_date');

        const transparency = transparencyStr ? parseInt(transparencyStr, 10) : 0;
        const showDate = showDateStr !== 'false'; // Default true

        let finalImageUri = imageUri;

        // Convert to Base64 if possible to ensure Widget can render it
        if (imageUri) {
            try {
                // If it's a remote URL (dev server) or local file
                const cacheFile = FileSystem.cacheDirectory + 'widget_image.png';

                if (imageUri.startsWith('http')) {
                    const download = await FileSystem.downloadAsync(imageUri, cacheFile);
                    if (download.status === 200) {
                        const base64 = await FileSystem.readAsStringAsync(cacheFile, { encoding: FileSystem.EncodingType.Base64 });
                        finalImageUri = `data:image/png;base64,${base64}`;
                    }
                } else if (imageUri.startsWith('file://')) {
                    const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
                    finalImageUri = `data:image/png;base64,${base64}`;
                }
                // If it's a resource identifier (android node id), we can't easily read it. 
                // But Image.resolveAssetSource usually gives http (dev) or file/asset (prod)
            } catch (imgError) {
                console.warn('Failed to convert widget image to base64, using original URI:', imgError);
                // Fallback to original
            }
        }

        await requestWidgetUpdate({
            widgetName: 'DailyTarot',
            renderWidget: () => (
                <DailyTarotWidget
                    cardName={cardName}
                    imageUri={finalImageUri}
                    date={displayDate}
                    theme={theme}
                    transparency={transparency}
                    showDate={showDate}
                />
            ),
            widgetNotFound: () => {
                console.log('No widget found to update.');
            }
        });
        console.log('Widget update requested with settings:', { theme, transparency, showDate });
    } catch (e) {
        console.error('Failed to update widget:', e);
    }
};

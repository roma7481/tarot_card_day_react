import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

class AnalyticsService {
    async logEvent(name: string, params?: Record<string, any>) {
        try {
            await analytics().logEvent(name, params);
            console.log(`[Analytics] Event logged: ${name}`, params);
        } catch (error) {
            console.error(`[Analytics] Failed to log event ${name}:`, error);
        }
    }

    async logScreenView(screenName: string, screenClass: string) {
        try {
            await analytics().logEvent('screen_view', {
                screen_name: screenName,
                screen_class: screenClass,
            });
            console.log(`[Analytics] Screen view logged: ${screenName}`);
        } catch (error) {
            console.error(`[Analytics] Failed to log screen view ${screenName}:`, error);
        }
    }

    async setUserProperty(name: string, value: string) {
        try {
            await analytics().setUserProperty(name, value);
        } catch (error) {
            console.error(`[Analytics] Failed to set user property ${name}:`, error);
        }
    }

    async setUserId(id: string) {
        try {
            await analytics().setUserId(id);
            await crashlytics().setUserId(id);
        } catch (error) {
            console.error(`[Analytics] Failed to set user ID:`, error);
        }
    }

    recordError(error: Error, jsErrorName?: string) {
        try {
            crashlytics().recordError(error, jsErrorName);
            console.log(`[Crashlytics] Error recorded:`, error);
        } catch (e) {
            console.error(`[Crashlytics] Failed to record error:`, e);
        }
    }

    log(message: string) {
        try {
            crashlytics().log(message);
        } catch (error) {
            console.error(`[Crashlytics] Failed to log message:`, error);
        }
    }

    async setCrashlyticsCollectionEnabled(enabled: boolean) {
        await crashlytics().setCrashlyticsCollectionEnabled(enabled);
    }
}

export const analyticsService = new AnalyticsService();

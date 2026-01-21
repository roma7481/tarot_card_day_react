import {
    getAnalytics,
    logEvent,
    setUserProperty,
    setUserId,
    logScreenView,
    Analytics
} from '@react-native-firebase/analytics';
import {
    getCrashlytics,
    recordError,
    log as crashlyticsLog,
    setUserId as setCrashlyticsUserId,
    setCrashlyticsCollectionEnabled,
    Crashlytics
} from '@react-native-firebase/crashlytics';

class AnalyticsService {
    private analytics: Analytics;
    private crashlytics: Crashlytics;

    constructor() {
        this.analytics = getAnalytics();
        this.crashlytics = getCrashlytics();
    }

    async logEvent(name: string, params?: Record<string, any>) {
        try {
            await logEvent(this.analytics, name, params);
            console.log(`[Analytics] Event logged: ${name}`, params);
        } catch (error) {
            console.error(`[Analytics] Failed to log event ${name}:`, error);
        }
    }

    async logScreenView(screenName: string, screenClass: string) {
        try {
            await logScreenView(this.analytics, {
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
            await setUserProperty(this.analytics, name, value);
        } catch (error) {
            console.error(`[Analytics] Failed to set user property ${name}:`, error);
        }
    }

    async setUserId(id: string) {
        try {
            await setUserId(this.analytics, id);
            await setCrashlyticsUserId(this.crashlytics, id);
        } catch (error) {
            console.error(`[Analytics] Failed to set user ID:`, error);
        }
    }

    recordError(error: Error, jsErrorName?: string) {
        try {
            recordError(this.crashlytics, error, jsErrorName);
            console.log(`[Crashlytics] Error recorded:`, error);
        } catch (e) {
            console.error(`[Crashlytics] Failed to record error:`, e);
        }
    }

    log(message: string) {
        try {
            crashlyticsLog(this.crashlytics, message);
        } catch (error) {
            console.error(`[Crashlytics] Failed to log message:`, error);
        }
    }

    async setCrashlyticsCollectionEnabled(enabled: boolean) {
        await setCrashlyticsCollectionEnabled(this.crashlytics, enabled);
    }
}

export const analyticsService = new AnalyticsService();

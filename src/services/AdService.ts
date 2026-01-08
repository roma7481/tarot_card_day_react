import { Platform } from 'react-native';
import AppLovinMAX from 'react-native-applovin-max';
import mobileAds from 'react-native-google-mobile-ads';
import * as Localization from 'expo-localization';
import * as Cellular from 'expo-cellular';

type AdProvider = 'admob' | 'applovin';

class AdService {
    private provider: AdProvider = 'admob';
    private initialized = false;

    constructor() {
        this.determineProvider();
    }

    private determineProvider() {
        // 1. Check SIM Country Code
        const simCountry = Cellular.isoCountryCode;
        if (simCountry && simCountry.toLowerCase() === 'ru') {
            this.provider = 'applovin';
            return;
        }

        // 2. Check Device Region
        // expo-localization 15+ uses getLocales()
        const locales = Localization.getLocales();
        if (locales && locales.length > 0) {
            const region = locales[0].regionCode;
            if (region === 'RU') {
                this.provider = 'applovin';
                return;
            }
        }

        this.provider = 'admob';
    }

    public async initialize() {
        if (this.initialized) return;

        console.log(`[AdService] Selected Provider: ${this.provider}`);

        if (this.provider === 'applovin') {
            // Initialize AppLovin
            // SDK Key is configured in the plugin/manifest, so we just init
            AppLovinMAX.initialize("qnL2sJHf5VT2RFA26vgN2heXM-Lpfdo4FPKD_09zl9TnHlPVSmGcSRPIQKwcsZwKIWCJZ62BtOONX_7JNmPDX_", (configuration) => {
                console.log("[AdService] AppLovin Initialized", configuration);
            });
        } else {
            // Initialize AdMob
            await mobileAds().initialize();
            console.log("[AdService] AdMob Initialized");
        }

        this.initialized = true;
    }

    public getProvider(): AdProvider {
        return this.provider;
    }

    public isRussianUser(): boolean {
        return this.provider === 'applovin';
    }

    // Helper to get unit IDs based on provider
    public getInterstitialId(): string {
        if (this.provider === 'applovin') {
            return Platform.OS === 'android' ? 'YOUR_ANDROID_INTERSTITIAL_ID' : 'YOUR_IOS_INTERSTITIAL_ID';
        }
        return 'ca-app-pub-3940256099942544/1033173712'; // Test AdMob ID
    }

    // --- Interstitial Logic ---
    private interstitialLoaded = false;
    private adCounter = 0;
    private readonly AD_FREQUENCY = 3;

    public loadInterstitial() {
        if (this.provider === 'applovin') {
            AppLovinMAX.loadInterstitial(this.getInterstitialId());
            // AppLovin handles retry automatically usually, but we can listen to events
        } else {
            // AdMob Interstitial
            // With mobile-ads, we create an instance. 
            // Simplified: We use InterstitialAd.createForAdRequest... 
            // For now, let's just log as this requires more complex state management with hooks or a singleton listener.
            // Using a simple load approach for this MVP step.
            const { InterstitialAd, TestIds, AdEventType } = require('react-native-google-mobile-ads');
            const interstitial = InterstitialAd.createForAdRequest(this.getInterstitialId());

            interstitial.addAdEventListener(AdEventType.LOADED, () => {
                this.interstitialLoaded = true;
                (this as any)._adMobInterstitial = interstitial;
            });
            interstitial.load();
        }
    }

    public showInterstitial() {
        if (this.provider === 'applovin') {
            if (AppLovinMAX.isInterstitialReady(this.getInterstitialId())) {
                AppLovinMAX.showInterstitial(this.getInterstitialId());
            }
        } else {
            const ad = (this as any)._adMobInterstitial;
            if (ad && this.interstitialLoaded) {
                ad.show();
                this.interstitialLoaded = false;
                (this as any)._adMobInterstitial = null;
                this.loadInterstitial(); // Preload next
            }
        }
    }

    public checkInterstitial(onClose: () => void) {
        // TODO: specific logic for frequency
        this.adCounter++;
        if (this.adCounter % this.AD_FREQUENCY === 0) {
            this.showInterstitial();
            // We can't easily wait for close callback here without listeners.
            // For now, just call onClose immediately or set up global listeners provided by the SDKs to resume app flow.
            // AdMob and AppLovin show over the app, so onClose (navigation) can happen immediately usually, 
            // unless we want to BLOCK navigation until ad closes.
            onClose();
        } else {
            onClose();
        }
    }
}

export const adService = new AdService();

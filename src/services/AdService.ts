import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import AppLovinMAX from 'react-native-applovin-max';
import mobileAds from 'react-native-google-mobile-ads';
import * as Localization from 'expo-localization';
import * as Cellular from 'expo-cellular';

type AdProvider = 'admob' | 'applovin';

class AdService {
    private provider: AdProvider = 'admob';
    public isPremium: boolean = false;
    private initialized: boolean = false;

    constructor() {
        this.determineProvider();
        this.checkPremiumCache();
    }

    private async checkPremiumCache() {
        const cached = await AsyncStorage.getItem('IS_PREMIUM_USER');
        if (cached === 'true') {
            this.setPremium(true);
        }
    }

    private determineProvider() {
        // 1. Check SIM Country Code
        const simCountry = Cellular.isoCountryCode;
        if (simCountry && ['ru'].includes(simCountry.toLowerCase())) {
            this.provider = 'applovin';
            return;
        }

        // 2. Check Device Region
        // expo-localization 15+ uses getLocales()
        const locales = Localization.getLocales();
        if (locales && locales.length > 0) {
            const region = locales[0].regionCode;
            if (region && ['RU'].includes(region)) {
                this.provider = 'applovin';
                return;
            }
        }

        this.provider = 'admob';
    }

    public async initialize() {
        console.log(`[AdService] initialize() called. Initialized=${this.initialized}, Premium=${this.isPremium}`);
        if (this.initialized) {
            console.log('[AdService] Already initialized, skipping.');
            return;
        }

        // Ensure we check premium before initializing ads
        await this.checkPremiumCache();
        if (this.isPremium) {
            console.log('[AdService] User is Premium. Skipping Ad Init.');
            this.initialized = true;
            return;
        }

        console.log(`[AdService] Selected Provider: ${this.provider}`);

        if (this.provider === 'applovin') {
            // Initialize AppLovin
            // SDK Key is configured in the plugin/manifest, so we just init
            console.log("[AdService] Calling AppLovinMAX.initialize...");
            try {
                // @ts-ignore
                const configuration = await AppLovinMAX.initialize("qnL2sJHf5VT2RFA26vgN2heXM-Lpfdo4FPKD_09zl9TnHlPVSmGcSRPIQKwcsZwKIWCJZ62BtOONX_7JNmPDX_");
                console.log("[AdService] AppLovin Initialized", configuration);
                this.loadInterstitial();
            } catch (error) {
                console.error("[AdService] AppLovin Failed to Initialize", error);
            }
        } else {
            // Initialize AdMob
            await mobileAds().initialize();
            console.log("[AdService] AdMob Initialized");
        }

        this.initialized = true;

        if (this.provider === 'applovin') {
            // @ts-ignore
            AppLovinMAX.addEventListener('OnInterstitialLoadedEvent', (adInfo) => {
                console.log('[AdService] AppLovin Interstitial LOADED', adInfo);
                this.interstitialLoaded = true;
            });
            // @ts-ignore
            AppLovinMAX.addEventListener('OnInterstitialLoadFailedEvent', (errorInfo) => {
                console.log('[AdService] AppLovin Interstitial LOAD FAILED', errorInfo);
                this.interstitialLoaded = false;
            });
            // @ts-ignore
            AppLovinMAX.addEventListener('OnInterstitialHiddenEvent', (adInfo) => {
                console.log('[AdService] AppLovin Interstitial CLOSED');
                if (this.onAdClosedCallback) {
                    this.onAdClosedCallback();
                    this.onAdClosedCallback = null;
                }
                this.loadInterstitial();
            });
            // @ts-ignore
            AppLovinMAX.addEventListener('OnInterstitialAdDisplayedEvent', (adInfo) => {
                console.log('[AdService] AppLovin Interstitial DISPLAYED', adInfo);
            });
            // @ts-ignore
            AppLovinMAX.addEventListener('OnInterstitialAdDisplayFailedEvent', (errorInfo) => {
                console.log('[AdService] AppLovin Interstitial DISPLAY FAILED', errorInfo);
                // If display fails, we should proceed with the app flow
                if (this.onAdClosedCallback) {
                    this.onAdClosedCallback();
                    this.onAdClosedCallback = null;
                }
                this.loadInterstitial();
            });
        }
    }

    public getProvider(): AdProvider {
        return this.provider;
    }

    public isRussianUser(): boolean {
        return this.provider === 'applovin';
    }

    // Helper to get unit IDs based on provider
    // Helper to get unit IDs based on provider
    public getInterstitialId(): string {
        if (this.provider === 'applovin') {
            return Platform.OS === 'android' ? '9c35bd587c040466' : 'YOUR_IOS_INTERSTITIAL_ID';
        }
        // Real AdMob Interstitial ID
        return 'ca-app-pub-1763151471947181/3370681560';
    }

    public getBannerId(): string {
        if (this.provider === 'applovin') {
            return Platform.OS === 'android' ? '3e505e8deb22b265' : 'YOUR_IOS_BANNER_ID';
        }
        // Real AdMob Banner ID handled in wrapper, or return here if unified
        return 'ca-app-pub-1763151471947181/5938093019';
    }

    public getMrecId(): string {
        if (this.provider === 'applovin') {
            return Platform.OS === 'android' ? 'ad521ffea9ed77fb' : 'YOUR_IOS_MREC_ID';
        }
        return '';
    }

    // --- Interstitial Logic ---
    private interstitialLoaded = false;
    private adCounter = 0;
    private readonly AD_FREQUENCY = 4;

    public loadInterstitial() {
        if (this.isPremium) return;

        console.log('[AdService] Loading Interstitial...');
        if (this.provider === 'applovin') {
            // @ts-ignore
            AppLovinMAX.loadInterstitial(this.getInterstitialId());
        } else {
            const { InterstitialAd, AdEventType } = require('react-native-google-mobile-ads');
            const interstitial = InterstitialAd.createForAdRequest(this.getInterstitialId());

            interstitial.addAdEventListener(AdEventType.LOADED, () => {
                console.log('[AdService] AdMob Interstitial Loaded!');
                this.interstitialLoaded = true;
                (this as any)._adMobInterstitial = interstitial;
            });
            interstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
                console.warn('[AdService] AdMob Load Error:', error);
            });
            interstitial.load();
        }
    }

    // Callback to hold the pending action (opening card detail)
    private onAdClosedCallback: (() => void) | null = null;

    public async showInterstitial(onAdClosed?: () => void) {
        console.log('[AdService] showInterstitial called');
        this.onAdClosedCallback = onAdClosed || null;

        if (this.provider === 'applovin') {
            // @ts-ignore
            const isReady = await AppLovinMAX.isInterstitialReady(this.getInterstitialId());
            console.log(`[AdService] AppLovin isInterstitialReady: ${isReady}`);

            if (isReady) {
                // For AppLovin, we rely on the event listener set in constructor 
                // (which needs to be there, but simpler to just set callback here if global listener expects it)
                // Since we don't have a reliable per-show callback in this simple wrapper, 
                // we might need to assume immediate close for now OR add a global listener interception.
                // However, for purposes of fixing the AdMob issue which is active:
                // @ts-ignore
                console.log('[AdService] Calling AppLovinMAX.showInterstitial...');
                try {
                    // @ts-ignore
                    AppLovinMAX.showInterstitial(this.getInterstitialId(), undefined, undefined);
                    console.log('[AdService] Called AppLovinMAX.showInterstitial');
                } catch (error) {
                    console.error('[AdService] Error calling showInterstitial:', error);
                    // Fallback to close if error prevents showing
                    if (onAdClosed) onAdClosed();
                }
            } else {
                console.log('[AdService] AppLovin Interstitial NOT READY. Triggering onAdClosed immediately.');
                if (onAdClosed) onAdClosed();
                // Try reloading
                this.loadInterstitial();
            }
        } else {
            const ad = (this as any)._adMobInterstitial;
            if (ad && this.interstitialLoaded) {
                console.log('[AdService] Showing AdMob Interstitial');

                const { AdEventType } = require('react-native-google-mobile-ads');
                // Listen for CLOSE event to trigger content
                const unsubscribe = ad.addAdEventListener(AdEventType.CLOSED, () => {
                    console.log('[AdService] AdMob Interstitial CLOSED');
                    if (onAdClosed) onAdClosed();
                    unsubscribe(); // Clean up this specific listener
                });

                ad.show();
                this.interstitialLoaded = false;
                (this as any)._adMobInterstitial = null;
                this.loadInterstitial(); // Preload next
            } else {
                console.log('[AdService] AdMob Interstitial NOT ready. Loaded:', this.interstitialLoaded);
                // Ad not ready, proceed immediately
                if (onAdClosed) onAdClosed();

                // Try loading if not ready
                if (!this.interstitialLoaded) this.loadInterstitial();
            }
        }
    }

    public setPremium(isPremium: boolean) {
        this.isPremium = isPremium;
        // If premium, we can stop loading/showing ads
        if (isPremium) {
            this.interstitialLoaded = false;
            (this as any)._adMobInterstitial = null;
        }
    }

    public async checkInterstitial(onClose: () => void) {
        if (this.isPremium) {
            onClose();
            return;
        }

        // Double check cache just in case state is stale
        const cached = await AsyncStorage.getItem('IS_PREMIUM_USER');
        if (cached === 'true') {
            this.setPremium(true);
            onClose();
            return;
        }

        this.adCounter++;
        if (this.adCounter % this.AD_FREQUENCY === 0) {
            // Pass the callback to be executed AFTER the ad closes
            this.showInterstitial(onClose);
        } else {
            onClose();
        }
    }
}

export const adService = new AdService();

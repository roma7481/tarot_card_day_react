import mobileAds, { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

class AdMobService {
    /**
     * Initialize the Mobile Ads SDK.
     * This should be called *after* consent is gathered or determined not required.
     */
    async initialize() {
        try {
            await mobileAds().initialize();
            console.log('[AdMob] SDK Initialized');
        } catch (error) {
            console.error('[AdMob] Failed to initialize SDK:', error);
        }
    }

    /**
     * Request consent information and show form if necessary.
     * Returns true if ads can be shown (consent obtained or not required).
     */
    async checkConsent(debug = false): Promise<boolean> {
        try {
            const consentOptions: any = {};

            // 1. Configure Debug options if needed (for testing in non-EEA regions)
            if (debug) {
                await AdsConsent.reset(); // Force reset to clear cached status
                consentOptions.debugGeography = 1; // 1 = EEA
                consentOptions.testDeviceIdentifiers = ['B7E67F4C90E213DBAF02D930FCFF41E0'];
                console.log('[AdMob] Debug Geography set to EEA (Reset + requestInfoUpdate)');
            }

            // 2. Request Consent Info Update with options
            const consentInfo = await AdsConsent.requestInfoUpdate(consentOptions);
            console.log('[AdMob] Consent Info:', consentInfo);

            // 3. Check if we need to show the form
            if (
                consentInfo.isConsentFormAvailable &&
                consentInfo.status === AdsConsentStatus.REQUIRED
            ) {
                const result = await AdsConsent.showForm();
                console.log('[AdMob] Form Result:', result);
            }

            // 4. Verify Final Status (Refreshed)
            // Note: getStatus() doesn't exist on all versions. We re-request info to get updated status.
            const updatedConsentInfo = await AdsConsent.requestInfoUpdate();
            const finalStatus = updatedConsentInfo.status;
            console.log('[AdMob] Final Consent Status:', finalStatus);

            // 5. Initialize SDK if consent is handled
            // We can initialize if status is OBTAINED or NOT_REQUIRED
            if (
                finalStatus === AdsConsentStatus.OBTAINED ||
                finalStatus === AdsConsentStatus.NOT_REQUIRED
            ) {
                await this.initialize();
                return true;
            }

            // If UNKNOWN or REQUIRED (and form failed?), we probably shouldn't show ads 
            // OR we might restricted processing. 
            // For simplicity, we initialize if it's not explicitly denied/unknown blocks?
            // Actually UMP handles the "Tag for under age" and other things internally. 
            // Usually you initialize anyway, but AdMob won't serve personalized ads if consent denied.

            // Let's rely on UMP's "canLoadAds" logic implicitly by just initializing.
            // But usually implementing "canShowAds" boolean return is good for the app.

            await this.initialize(); // Always initialize, UMP handles the "npa" flags internally now.
            return true;

        } catch (error) {
            console.error('[AdMob] Consent Error:', error);
            // Fallback: Initialize anyway so at least non-personalized might work or previous state holds
            await this.initialize();
            return false;
        }
    }
}

export const adMobService = new AdMobService();

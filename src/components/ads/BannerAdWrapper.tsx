import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import AppLovinMAX, { AdFormat, AdView } from 'react-native-applovin-max';
import { adService } from '../../services/AdService';
import { usePremium } from '../../hooks/usePremium';

interface Props {
    adMobUnitId: string;
    appLovinUnitId?: string; // Optional, fallback to placeholder if not provided
    style?: StyleProp<ViewStyle>;
}

export const BannerAdWrapper: React.FC<Props> = ({ adMobUnitId, appLovinUnitId, style }) => {
    const { isPremium } = usePremium();
    const provider = adService.getProvider();

    if (isPremium) return null;

    if (provider === 'applovin') {
        // AppLovin MAX Banner
        // Note: AppLovinMAX.AdView requires a specific height usually (50 or 90)
        // and adaptive banners are different.
        return (
            <View style={[style, { alignItems: 'center', justifyContent: 'center' }]}>
                <AdView
                    adUnitId={appLovinUnitId || adService.getBannerId()}
                    adFormat={AdFormat.BANNER}
                    style={{ width: 320, height: 50 }} // Explicit width/height matching load event
                    onAdLoaded={(adInfo: any) => console.log('[BannerAdWrapper] AppLovin Banner Loaded', adInfo)}
                    onAdLoadFailed={(error: any) => console.log('[BannerAdWrapper] AppLovin Banner Load Failed', error)}
                />
            </View>
        );
    }

    // AdMob Banner
    // If we passed TestIds.BANNER from parent, we override it here with the real ID for DeckScreen.
    // Ideally parent passes it, but for now enforcing here as requested.
    const realAdMobId = (adMobUnitId === 'ca-app-pub-3940256099942544/6300978111') // Default Test ID
        ? 'ca-app-pub-1763151471947181/5938093019'
        : adMobUnitId;

    return (
        <View style={style}>
            <BannerAd
                unitId={realAdMobId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            />
        </View>
    );
};

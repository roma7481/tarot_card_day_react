import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import AppLovinMAX from 'react-native-applovin-max';
import { adService } from '../../services/AdService';

interface Props {
    adMobUnitId: string;
    appLovinUnitId?: string; // Optional, fallback to placeholder if not provided
    style?: StyleProp<ViewStyle>;
}

export const BannerAdWrapper: React.FC<Props> = ({ adMobUnitId, appLovinUnitId, style }) => {
    const provider = adService.getProvider();

    if (provider === 'applovin') {
        // AppLovin MAX Banner
        // Note: AppLovinMAX.AdView requires a specific height usually (50 or 90)
        // and adaptive banners are different.
        return (
            <View style={style}>
                <AppLovinMAX.AdView
                    adUnitId={appLovinUnitId || "YOUR_APPLOVIN_BANNER_ID"}
                    adFormat={AppLovinMAX.AdFormat.BANNER}
                    style={{ width: '100%', height: 50 }} // Standard banner height
                />
            </View>
        );
    }

    // AdMob Banner
    return (
        <View style={style}>
            <BannerAd
                unitId={adMobUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            />
        </View>
    );
};

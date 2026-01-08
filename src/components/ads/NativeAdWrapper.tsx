import React from 'react';
import { View, StyleProp, ViewStyle, Platform } from 'react-native';
import AppLovinMAX from 'react-native-applovin-max';
import { adService } from '../../services/AdService';
import { NativeAdCard } from './NativeAdCard';

interface Props {
    variant?: 'default' | 'compact' | 'small';
    containerStyle?: StyleProp<ViewStyle>;
    appLovinUnitId?: string; // Optional placeholder
}

export const NativeAdWrapper: React.FC<Props> = ({ variant, containerStyle, appLovinUnitId }) => {
    const provider = adService.getProvider();

    if (provider === 'applovin') {
        // AppLovin MAX Native Ad
        // For simplicity in this iteration, we use the NativeAdView which usually renders a template
        // or we might need to use MREC if Native is complex to style identically without custom native views.
        // However, AppLovinMAX.NativeAdView exists.
        // We will try to render it. It might require `adUnitId` to be a Native one.

        // Placeholder ID logic
        const unitId = appLovinUnitId || (Platform.OS === 'android' ? 'YOUR_ANDROID_NATIVE_ID' : 'YOUR_IOS_NATIVE_ID');

        return (
            <View style={containerStyle}>
                <AppLovinMAX.NativeAdView
                    adUnitId={unitId}
                    style={{ width: '100%', height: variant === 'compact' ? 250 : 300 }}
                // Note: Styling AppLovin Native Ads in RN is often limited to predefined templates unless using manual Layout definitions in native code.
                // This might be a limitation.
                />
            </View>
        );
    }

    // AdMob
    return <NativeAdCard variant={variant} containerStyle={containerStyle} />;
};

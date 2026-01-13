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
    // Logic is now handled inside NativeAdCard to support MREC fallback for AppLovin
    return <NativeAdCard variant={variant} containerStyle={containerStyle} />;
};

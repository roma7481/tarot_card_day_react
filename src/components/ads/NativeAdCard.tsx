import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeAd, NativeAdView, TestIds, NativeAsset, NativeAssetType } from 'react-native-google-mobile-ads';
import AppLovinMAX, { AdFormat, AdView } from 'react-native-applovin-max';
import styled, { useTheme as useStyledTheme } from 'styled-components/native';
import { ThemeType as Theme } from '../../theme/colors';

type AdVariant = 'default' | 'compact' | 'small';

interface NativeAdCardProps {
  variant?: AdVariant;
  containerStyle?: any; // Allow overriding styles
}

// --- Styled Components for Layout (Not Ad Components) ---
const Container = styled.View`
  background-color: ${(props) => props.theme.colors.surface};
  border-radius: 16px;
  padding: 16px;
  /* margin handled via props to allow overrides */
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 5;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const AdLabel = styled.View`
  background-color: ${(props) => props.theme.colors.primary};
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
`;

const AdLabelText = styled.Text`
  color: #fff;
  font-size: 10px;
  font-weight: bold;
`;

const StyledHeadlineText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  flex: 1;
`;

const StyledBodyText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSub};
  margin-bottom: 12px;
`;

const StyledCallToActionView = styled.View`
  height: 45px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  border-radius: 22px;
  margin-top: 12px;
`;

const CTAText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

export const NativeAdCard = ({ variant = 'default', containerStyle }: NativeAdCardProps) => {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const theme = useStyledTheme() as Theme;

  // Get provider immediately
  const adProvider = require('../../services/AdService').adService.getProvider();

  useEffect(() => {
    // Skip Google Ad load if using AppLovin
    if (adProvider === 'applovin') return;

    let ad: NativeAd | null = null;

    const load = async () => {
      try {
        // Use TestIds.NATIVE_VIDEO or TestIds.NATIVE used for testing
        // Real Native ID: ca-app-pub-1763151471947181/2186545296
        const id = 'ca-app-pub-1763151471947181/2186545296';
        ad = await NativeAd.createForAdRequest(id);
        setNativeAd(ad);
      } catch (e) {
        console.error("Failed to load native ad", e);
      }
    };

    load();

    return () => {
      ad?.destroy();
    };
  }, [variant, adProvider]);

  // --- AppLovin MREC Implementation ---
  if (adProvider === 'applovin') {
    return (
      <View style={[
        containerStyle,
        {
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: isAdLoaded ? 10 : 0,
          height: isAdLoaded ? 'auto' : 0,
          opacity: isAdLoaded ? 1 : 0
        }
      ]}>
        {/* @ts-ignore */}
        <AdView
          adUnitId={require('../../services/AdService').adService.getMrecId()}
          // @ts-ignore
          adFormat={AdFormat.MREC}
          style={{ width: 300, height: 250 }}
          onAdLoaded={(adInfo: any) => {
            console.log('[NativeAdCard] AppLovin MREC Loaded', adInfo);
            setIsAdLoaded(true);
          }}
          onAdLoadFailed={(error: any) => {
            console.log('[NativeAdCard] AppLovin MREC Load Failed', error);
            setIsAdLoaded(false);
          }}
        />
      </View>
    );
  }

  // --- Google Ad Implementation ---
  if (!nativeAd) {
    // Optional: Return null or a placeholder while loading
    return null;
  }

  if (variant === 'compact') {
    // Grid Card Style
    return (
      <NativeAdView nativeAd={nativeAd} style={{ flex: 1, width: '100%', aspectRatio: 0.6 }}>
        <Container style={[{ margin: 6, padding: 8, flex: 1, borderRadius: 8 }, containerStyle]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AdLabel><AdLabelText>Ad</AdLabelText></AdLabel>
            {/* Compact: Maybe hide headline or keep it very small */}
          </View>

          {/* Image takes most space */}
          {nativeAd.images && nativeAd.images.length > 0 && (
            <NativeAsset assetType={NativeAssetType.IMAGE}>
              <Image
                source={{ uri: (nativeAd.images[0] as any).url || (nativeAd.images[0] as any).uri || '' }}
                style={{ width: '100%', flex: 1, borderRadius: 4, resizeMode: 'cover', marginTop: 4, marginBottom: 4 }}
              />
            </NativeAsset>
          )}

          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text numberOfLines={2} style={{ color: theme.colors.text, fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>
              {nativeAd.headline}
            </Text>
          </NativeAsset>

          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <TouchableOpacity style={{ backgroundColor: theme.colors.primary, borderRadius: 12, paddingVertical: 4, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                {nativeAd.callToAction || 'View'}
              </Text>
            </TouchableOpacity>
          </NativeAsset>
        </Container>
      </NativeAdView>
    );
  }

  // Default Layout
  const defaultStyle = { marginVertical: 10, marginHorizontal: 16 };

  return (
    <NativeAdView
      nativeAd={nativeAd}
      style={{ width: '100%' }}
    >
      <Container style={[defaultStyle, containerStyle]}>
        <HeaderRow>
          <AdLabel><AdLabelText>Ad</AdLabelText></AdLabel>
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <StyledHeadlineText numberOfLines={1}>{nativeAd.headline}</StyledHeadlineText>
          </NativeAsset>
        </HeaderRow>

        <NativeAsset assetType={NativeAssetType.BODY}>
          <StyledBodyText numberOfLines={2}>{nativeAd.body}</StyledBodyText>
        </NativeAsset>

        {nativeAd.images && nativeAd.images.length > 0 && (
          <NativeAsset assetType={NativeAssetType.IMAGE}>
            <Image
              source={{ uri: (nativeAd.images[0] as any).url || (nativeAd.images[0] as any).uri || '' }}
              style={{ width: '100%', height: 150, borderRadius: 8, resizeMode: 'cover' }}
            />
          </NativeAsset>
        )}

        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
          <StyledCallToActionView>
            <CTAText>{nativeAd.callToAction}</CTAText>
          </StyledCallToActionView>
        </NativeAsset>

      </Container>
    </NativeAdView>
  );
};

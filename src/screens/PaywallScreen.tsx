import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, StatusBar, Alert, Platform, ActivityIndicator, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Sparkles, Moon, Diamond, ArrowRight, Check, MessageCircle, BarChart2, History, FileText } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { darkTheme } from '../theme/colors';
import { useTranslation } from 'react-i18next';
import { initConnection, fetchProducts, requestPurchase, purchaseUpdatedListener, purchaseErrorListener, finishTransaction, endConnection, getAvailablePurchases, Product, Purchase, PurchaseError } from 'react-native-iap';
import { usePremium } from '../hooks/usePremium';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PRODUCT_ID_PREMIUM = 'card_day_premium';
const ITEM_SKUS = Platform.select({
    android: [PRODUCT_ID_PREMIUM],
    ios: [PRODUCT_ID_PREMIUM],
}) as string[];

// ... Styled Components (Keep existing) ...
const Container = styled(LinearGradient)`
    flex: 1;
`;

const ContentContainer = styled.View`
    flex: 1;
`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-horizontal: 20px;
    padding-vertical: 10px;
    z-index: 50;
`;

const CloseButton = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
    background-color: rgba(255,255,255,0.1);
`;

const HeaderTitle = styled.Text`
    font-family: 'Manrope_800ExtraBold';
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: ${darkTheme.colors.textSub};
`;

const RestoreButton = styled.TouchableOpacity`
    padding: 8px;
`;

const RestoreText = styled.Text`
    font-family: 'Manrope_700Bold';
    font-size: 14px;
    color: ${darkTheme.colors.primary};
`;

const ScrollContent = styled.ScrollView.attrs({
    contentContainerStyle: { paddingBottom: 350 }
})``;

const CardContainer = styled.View`
    width: 160px;
    height: 220px;
    border-radius: 16px;
    overflow: hidden;
    border-width: 1px;
    border-color: ${darkTheme.colors.border};
    background-color: ${darkTheme.colors.surface};
    shadow-color: ${darkTheme.colors.primary};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.2;
    shadow-radius: 8px;
    elevation: 5;
    align-self: center;
    margin-vertical: 20px;
    transform: rotate(-1deg);
`;

const CardImage = styled.Image`
    width: 100%;
    height: 100%;
`;

const HeroTextContainer = styled.View`
    align-items: center;
    padding-horizontal: 24px;
    margin-bottom: 24px;
`;

const Title = styled.Text`
    font-family: 'Manrope_800ExtraBold';
    font-size: 28px;
    text-align: center;
    color: ${darkTheme.colors.text};
    line-height: 36px;
`;

const Subtitle = styled.Text`
    font-family: 'Manrope_500Medium';
    font-size: 15px;
    text-align: center;
    color: ${darkTheme.colors.textSub};
    margin-top: 8px;
    line-height: 22px;
    max-width: 280px;
`;

const FeaturesList = styled.View`
    padding-horizontal: 20px;
    gap: 12px;
`;

const FeatureItem = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: rgba(255,255,255,0.03);
    border-width: 1px;
    border-color: ${darkTheme.colors.border};
    border-radius: 16px;
    padding: 16px;
`;

const FeatureIconCircle = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: rgba(167, 139, 250, 0.1);
    align-items: center;
    justify-content: center;
    margin-right: 16px;
`;

const FeatureTextCol = styled.View`
    flex: 1;
`;

const FeatureTitle = styled.Text`
    font-family: 'Manrope_700Bold';
    font-size: 16px;
    color: ${darkTheme.colors.text};
    margin-bottom: 2px;
`;

const FeatureDesc = styled.Text`
    font-family: 'Manrope_500Medium';
    font-size: 13px;
    color: ${darkTheme.colors.textSub};
`;

// Footer
const Footer = styled(LinearGradient)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding-top: 32px;
    padding-bottom: 40px;
    padding-horizontal: 24px;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
`;

const PricingInfo = styled.View`
    align-items: center;
    margin-bottom: 16px;
`;

const Badge = styled.View`
    background-color: rgba(167, 139, 250, 0.15);
    border-width: 1px;
    border-color: rgba(167, 139, 250, 0.3);
    padding-horizontal: 10px;
    padding-vertical: 4px;
    border-radius: 100px;
    margin-bottom: 8px;
`;

const BadgeText = styled.Text`
    font-family: 'Manrope_700Bold';
    font-size: 10px;
    color: ${darkTheme.colors.primary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const PriceRow = styled.View`
    flex-direction: row;
    align-items: baseline;
`;

const PriceText = styled.Text`
    font-family: 'Manrope_800ExtraBold';
    font-size: 32px;
    color: ${darkTheme.colors.text};
`;

const PriceSub = styled.Text`
    font-family: 'Manrope_500Medium';
    font-size: 16px;
    color: ${darkTheme.colors.textSub};
    margin-left: 6px;
`;

const CTAButton = styled.TouchableOpacity`
    background-color: ${darkTheme.colors.primary};
    border-radius: 16px;
    padding-vertical: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    shadow-color: ${darkTheme.colors.primary};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.3;
    shadow-radius: 12px;
    elevation: 8;
`;

const CTAButtonText = styled.Text`
    color: #fff;
    font-family: 'Manrope_700Bold';
    font-size: 18px;
    margin-right: 8px;
`;

const FooterLinks = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: 16px;
    gap: 8px;
`;

const LinkText = styled.Text`
    font-family: 'Manrope_500Medium';
    font-size: 12px;
    color: ${darkTheme.colors.textSub};
    opacity: 0.6;
`;

export default function PaywallScreen() {
    const { top, bottom } = useSafeAreaInsets();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { checkPremium } = usePremium();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        const initIAP = async () => {
            try {
                console.log('Initializing IAP connection...');
                await initConnection();
                console.log('IAP connected. Fetching products...', ITEM_SKUS);
                const prods = await fetchProducts({ skus: ITEM_SKUS });
                console.log('Fetched products:', JSON.stringify(prods, null, 2));
                if (prods && prods.length > 0) {
                    setProducts(prods);
                } else {
                    console.warn('No products fetched. Check Google Play Console configuration.');
                }
            } catch (err) {
                console.warn('initIAP or fetchProducts error', err);
            } finally {
                setLoading(false);
            }
        };

        initIAP();

        const purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase: Purchase) => {
                // Receipt location varies by platform
                const receipt = purchase.transactionReceipt;

                if (receipt) {
                    try {
                        await finishTransaction({ purchase, isConsumable: false });
                        await checkPremium();
                        Alert.alert("Success", "Purchase successful!");
                        navigation.goBack();
                    } catch (ackErr) {
                        console.warn('ackErr', ackErr);
                    }
                } else {
                    // Android might not have transactionReceipt in the top level object in some versions?
                    // Verify purchase.purchaseToken for android?
                    // For now, if purchase exists, we try to finish it.
                    try {
                        await finishTransaction({ purchase, isConsumable: false });
                        await checkPremium();
                        Alert.alert("Success", "Purchase successful!");
                        navigation.goBack();
                    } catch (e) { console.warn(e) }
                }
            },
        );

        const purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
                console.warn('purchaseErrorSubscription', error);
                setPurchasing(false);

                // user-cancelled is common on iOS/Android newer versions
                // E_USER_CANCELLED is RNIap standard
                // 1 is Android responseCode for User Canceled
                const code = error.code || error.responseCode;

                if (
                    code === 'user-cancelled' ||
                    code === 'E_USER_CANCELLED' ||
                    code === 1 ||
                    error.message === 'User cancelled the operation'
                ) {
                    // User cancelled, do nothing
                    return;
                }

                Alert.alert("Purchase Failed", error.message);
            },
        );

        return () => {
            if (purchaseUpdateSubscription) {
                purchaseUpdateSubscription.remove();
            }
            if (purchaseErrorSubscription) {
                purchaseErrorSubscription.remove();
            }
            endConnection();
        };
    }, []);

    const handlePurchase = async () => {
        if (products.length === 0) {
            Alert.alert("Error", "Products not loaded yet. Please check your internet connection.");
            return;
        }

        // Use id (v14) or productId (legacy/types)
        const product = products.find(p => (p.id === PRODUCT_ID_PREMIUM || p.productId === PRODUCT_ID_PREMIUM));
        if (!product) {
            Alert.alert("Error", "Product not found.");
            return;
        }

        setPurchasing(true);
        try {
            // v14 request structure
            const sku = product.id || product.productId;
            await requestPurchase({
                request: {
                    apple: { sku },
                    google: { skus: [sku] }
                }
            });
        } catch (err) {
            console.warn(err);
            setPurchasing(false);
        }
    };

    const handleRestore = async () => {
        setPurchasing(true);
        try {
            await initConnection(); // Ensure connected
            const purchases = await getAvailablePurchases();
            if (purchases.length > 0) {
                await checkPremium();
                Alert.alert("Restore Successful", "Your purchases have been restored.");
                navigation.goBack();
            } else {
                Alert.alert("Restore", "No previous purchases found.");
            }
        } catch (err) {
            console.warn(err);
            Alert.alert("Error", "Failed to restore purchases.");
        } finally {
            setPurchasing(false);
        }
    };

    // Use fetched product info if available, otherwise fallback (or loading)
    // Cast to any because the type definition might lag behind the actual object structure in v14
    const displayProduct = products.find(p => (p.id === PRODUCT_ID_PREMIUM || p.productId === PRODUCT_ID_PREMIUM)) as any;

    let displayPrice = '$19.99';
    if (displayProduct) {
        if (displayProduct.oneTimePurchaseOfferDetailsAndroid && displayProduct.oneTimePurchaseOfferDetailsAndroid.length > 0) {
            displayPrice = displayProduct.oneTimePurchaseOfferDetailsAndroid[0].formattedPrice;
        } else if (displayProduct.displayPrice) {
            displayPrice = displayProduct.displayPrice;
        } else if (displayProduct.localizedPrice) {
            displayPrice = displayProduct.localizedPrice;
        }
    }

    const displayTitle = displayProduct ? displayProduct.title : t('paywall.pricing.badge');

    return (
        <Container
            colors={darkTheme.colors.background}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <StatusBar barStyle="light-content" />

            <ContentContainer style={{ paddingTop: top }}>
                <Header>
                    <CloseButton onPress={() => navigation.goBack()}>
                        <X color={darkTheme.colors.text} size={20} />
                    </CloseButton>
                    <HeaderTitle>{t('paywall.title')}</HeaderTitle>
                    <RestoreButton onPress={handleRestore} disabled={purchasing}>
                        <RestoreText>{t('paywall.restore')}</RestoreText>
                    </RestoreButton>
                </Header>

                <ScrollContent showsVerticalScrollIndicator={false}>

                    {/* Hero Card */}
                    <CardContainer>
                        <CardImage
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnhPnhQ5lHicLWQLc6PubBN8r3rTOxPKCDStMUzZinVnsvcFQs3O-alqCrYeEb6j1X5E7qtRv6IhMqtJDn3dE-ww8ODm31pEguI4gUfQD7Ng2iie9KNRePbDl4nJ7R1h9rhaO0iK-8Lvz2sz0KnQiKfFsktTUNsl6CC07_kJR780IasIL3Bi7KTcljfJZv_ICoFdjmM6o__2k7DogbEMTv6mbNeEhqdpC-cWKmRj1kmAOEP9ZM5s_Dslt_KSBSwDvqyzdyVS8RVpRx' }}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.4)']}
                            style={{ position: 'absolute', inset: 0 }}
                        />
                    </CardContainer>

                    {/* Hero Text */}
                    <HeroTextContainer>
                        <Title>
                            {t('paywall.hero.title_lines')}
                        </Title>
                        <Subtitle>
                            {t('paywall.hero.subtitle')}
                        </Subtitle>
                    </HeroTextContainer>

                    {/* Features */}
                    <FeaturesList>
                        <FeatureItem>
                            <FeatureIconCircle>
                                <MessageCircle color={darkTheme.colors.primary} size={20} />
                            </FeatureIconCircle>
                            <FeatureTextCol>
                                <FeatureTitle>{t('paywall.features.oracle.title')}</FeatureTitle>
                                <FeatureDesc>{t('paywall.features.oracle.desc')}</FeatureDesc>
                            </FeatureTextCol>
                        </FeatureItem>

                        <FeatureItem>
                            <FeatureIconCircle>
                                <Moon color={darkTheme.colors.primary} size={20} />
                            </FeatureIconCircle>
                            <FeatureTextCol>
                                <FeatureTitle>{t('paywall.features.ads.title')}</FeatureTitle>
                                <FeatureDesc>{t('paywall.features.ads.desc')}</FeatureDesc>
                            </FeatureTextCol>
                        </FeatureItem>

                        <FeatureItem>
                            <FeatureIconCircle>
                                <History color={darkTheme.colors.primary} size={20} />
                            </FeatureIconCircle>
                            <FeatureTextCol>
                                <FeatureTitle>{t('paywall.features.history.title')}</FeatureTitle>
                                <FeatureDesc>{t('paywall.features.history.desc')}</FeatureDesc>
                            </FeatureTextCol>
                        </FeatureItem>

                        <FeatureItem>
                            <FeatureIconCircle>
                                <BarChart2 color={darkTheme.colors.primary} size={20} />
                            </FeatureIconCircle>
                            <FeatureTextCol>
                                <FeatureTitle>{t('paywall.features.analytics.title')}</FeatureTitle>
                                <FeatureDesc>{t('paywall.features.analytics.desc')}</FeatureDesc>
                            </FeatureTextCol>
                        </FeatureItem>

                        {Platform.OS === 'ios' && (
                            <FeatureItem>
                                <FeatureIconCircle>
                                    <FileText color={darkTheme.colors.primary} size={20} />
                                </FeatureIconCircle>
                                <FeatureTextCol>
                                    <FeatureTitle>{t('paywall.features.notes.title')}</FeatureTitle>
                                    <FeatureDesc>{t('paywall.features.notes.desc')}</FeatureDesc>
                                </FeatureTextCol>
                            </FeatureItem>
                        )}
                    </FeaturesList>

                </ScrollContent>

                {/* Sticky Footer */}
                <Footer
                    colors={['rgba(15, 23, 42, 0)', darkTheme.colors.background[0], darkTheme.colors.background[1]]}
                    locations={[0, 0.2, 1]}
                >
                    <PricingInfo>
                        <Badge>
                            <BadgeText>{t('paywall.pricing.badge')}</BadgeText>
                        </Badge>
                        <PriceRow>
                            {loading ? (
                                <ActivityIndicator color={darkTheme.colors.text} />
                            ) : (
                                <PriceText>{displayPrice}</PriceText>
                            )}
                            <PriceSub>{t('paywall.pricing.lifetime')}</PriceSub>
                        </PriceRow>
                    </PricingInfo>

                    <CTAButton onPress={handlePurchase} activeOpacity={0.9} disabled={purchasing || loading}>
                        {purchasing ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <CTAButtonText>{t('paywall.cta')}</CTAButtonText>
                                <ArrowRight color="#fff" size={24} />
                            </>
                        )}
                    </CTAButton>

                    <FooterLinks>
                        <TouchableOpacity onPress={() => Linking.openURL('https://cbeeapps.wixsite.com/cardtarot')}>
                            <LinkText>{t('paywall.links.privacy')}</LinkText>
                        </TouchableOpacity>
                    </FooterLinks>
                    <View style={{ height: bottom }} />
                </Footer>

            </ContentContainer>
        </Container>
    );
}

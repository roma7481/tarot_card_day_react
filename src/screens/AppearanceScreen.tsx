import React from 'react';
import { View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import styled, { useTheme } from 'styled-components/native'; // Styled Components theme
import { useTheme as useAppTheme } from '../theme/ThemeContext'; // App Logic
import { availableCardBacks } from '../theme/cardBacks';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Type, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const Container = styled(LinearGradient)`
  flex: 1;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  background-color: transparent;
  z-index: 50;
`;

const IconButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.05)'};
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const HeaderTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 18px;
`;

const Section = styled.View`
  margin-bottom: 32px;
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 18px;
  margin-bottom: 16px;
`;

// -- Theme Grid --
const ThemeGrid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 16px;
`;

const ThemeCard = styled.TouchableOpacity<{ isSelected: boolean }>`
    width: 100%; /* For now full width or 48% */
    border-radius: 12px;
    border-width: 2px;
    border-color: ${props => props.isSelected ? props.theme.colors.gold : 'transparent'};
    overflow: hidden;
    position: relative;
    margin-bottom: 12px;
`;

const ThemePreview = styled(LinearGradient)`
    height: 80px;
    padding: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const ThemeName = styled.Text<{ isSelected: boolean; isLight?: boolean }>`
    color: ${props => props.isLight ? '#000000' : '#fff'}; /* Black for light themes, white otherwise */
    font-family: 'Manrope_700Bold';
    font-size: 16px;
`;

const CheckCircle = styled.View`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: ${props => props.theme.colors.gold};
    align-items: center;
    justify-content: center;
`;

// -- Text Size --
const SizeOption = styled.TouchableOpacity<{ isSelected: boolean }>`
    flex-direction: row;
    align-items: center;
    padding: 16px;
    background-color: ${props => props.theme.colors.surface};
    border-radius: 12px;
    border-width: 1px;
    border-color: ${props => props.isSelected ? props.theme.colors.gold : props.theme.colors.border};
    margin-bottom: 8px;
`;

const SizeLabel = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Manrope_600SemiBold';
    font-size: 16px;
    margin-left: 12px;
    flex: 1;
`;

// DeckStack style replication
const InnerBorder = styled.View`
  position: absolute;
  inset: 6px;
  border: 4px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

export default function AppearanceScreen() {
    const theme = useTheme(); // Styled theme
    const { themeId, setThemeId, availableThemes, textSize, setTextSize, cardBack, setCardBack } = useAppTheme(); // Logic
    const navigation = useNavigation();
    const { top } = useSafeAreaInsets();
    const { t } = useTranslation();

    return (
        <Container colors={theme.colors.background as any}>
            <Header style={{ marginTop: top }}>
                <IconButton onPress={() => navigation.goBack()}>
                    <ArrowLeft color={theme.colors.icon} size={24} />
                </IconButton>
                <HeaderTitle>{t('appearance.title')}</HeaderTitle>
                <View style={{ width: 40 }} />
            </Header>

            <Content>

                <Section>
                    <SectionTitle>{t('appearance.theme')}</SectionTitle>
                    <ThemeGrid>
                        {availableThemes.map((themeItem) => (
                            <ThemeCard
                                key={themeItem.id}
                                isSelected={themeId === themeItem.id}
                                onPress={() => setThemeId(themeItem.id)}
                            >
                                <ThemePreview colors={themeItem.theme.colors.background as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                    <ThemeName
                                        isSelected={themeId === themeItem.id}
                                        isLight={themeItem.id === 'light'}
                                    >
                                        {t(`themes.${themeItem.id}`, { defaultValue: themeItem.name })}
                                    </ThemeName>
                                    {themeId === themeItem.id && (
                                        <CheckCircle>
                                            <Check size={14} color="#fff" strokeWidth={3} />
                                        </CheckCircle>
                                    )}
                                </ThemePreview>
                            </ThemeCard>
                        ))}
                    </ThemeGrid>
                </Section>

                <Section>
                    <SectionTitle>{t('appearance.cardStyle')}</SectionTitle>
                    <ThemeGrid>
                        {availableCardBacks.map((cb) => (
                            <ThemeCard
                                key={cb.id}
                                isSelected={cardBack === cb.id}
                                onPress={() => setCardBack(cb.id)}
                                style={{ width: '48%', aspectRatio: 200 / 320 }}
                            >
                                <View style={{ flex: 1, width: '100%' }}>
                                    <ImageBackground
                                        source={cb.source}
                                        style={{ flex: 1, width: '100%', height: '100%' }}
                                        resizeMode="cover"
                                    >
                                        <LinearGradient
                                            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(255,255,255,0.1)']}
                                            style={{ flex: 1 }}
                                        />
                                        <InnerBorder />
                                    </ImageBackground>
                                    {cardBack === cb.id && (
                                        <View style={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: theme.colors.gold,
                                            width: 24,
                                            height: 24,
                                            borderRadius: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 10
                                        }}>
                                            <Check size={14} color="#fff" strokeWidth={3} />
                                        </View>
                                    )}
                                </View>
                            </ThemeCard>
                        ))}
                    </ThemeGrid>
                </Section>

                <Section>
                    <SectionTitle>{t('appearance.textSize')}</SectionTitle>
                    <SizeOption isSelected={textSize === 'medium'} onPress={() => setTextSize('medium')}>
                        <Type size={20} color={theme.colors.text} />
                        <SizeLabel>{t('appearance.textMedium')}</SizeLabel>
                        {textSize === 'medium' && <Check size={20} color={theme.colors.gold} />}
                    </SizeOption>
                    <SizeOption isSelected={textSize === 'large'} onPress={() => setTextSize('large')}>
                        <Type size={24} color={theme.colors.text} />
                        <SizeLabel style={{ fontSize: 18 }}>{t('appearance.textLarge')}</SizeLabel>
                        {textSize === 'large' && <Check size={20} color={theme.colors.gold} />}
                    </SizeOption>
                </Section>

                <View style={{ height: 100 }} />
            </Content>
        </Container>
    );
}

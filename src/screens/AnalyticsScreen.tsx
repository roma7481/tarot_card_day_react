import React, { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useHistory, DailyDraw } from '../hooks/useHistory';
import { calculateStats, CardStats } from '../utils/cardStats';
import { getCardImage } from '../utils/cardImageMapping';
import { CARD_NAME_MAPPING } from '../data/cardNameMapping';
import { BarChart3, PieChart, TrendingUp, Lock } from 'lucide-react-native';
import { usePremium } from '../hooks/usePremium';
import { Platform, StyleSheet } from 'react-native';

const Container = styled(LinearGradient)`
  flex: 1;
`;

const Content = styled.ScrollView`
  padding: 24px;
`;

const LockOverlay = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.6); 
    z-index: 100;
    padding: 20px;
`;

const LockContainer = styled.View`
    background-color: ${props => props.theme.colors.surface};
    padding: 24px;
    border-radius: 20px;
    align-items: center;
    width: 100%;
    max-width: 340px; 
    border-width: 1px;
    border-color: ${props => props.theme.colors.border};
`;

const LockTitle = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Manrope_700Bold';
    font-size: 20px;
    margin-top: 16px;
    margin-bottom: 8px;
    text-align: center;
`;

const LockDescription = styled.Text`
    color: ${props => props.theme.colors.textSub};
    font-family: 'Manrope_400Regular';
    font-size: 14px;
    text-align: center;
    margin-bottom: 24px;
    line-height: 20px;
`;

const UnlockButton = styled.TouchableOpacity`
    background-color: ${props => props.theme.colors.primary};
    padding-vertical: 12px;
    padding-horizontal: 16px;
    border-radius: 24px;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const UnlockButtonText = styled.Text`
    color: #fff;
    font-family: 'Manrope_700Bold';
    font-size: 16px;
`;

const Header = styled.View`
  margin-top: 20px;
  margin-bottom: 24px;
  align-items: center;
`;

const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 24px;
`;

const Section = styled.View`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 18px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
`;

// -- Bar Chart Utils --
const BarContainer = styled.View`
  margin-bottom: 12px;
`;
const BarLabel = styled.Text`
    color: ${props => props.theme.colors.textSub};
    font-family: 'Manrope_600SemiBold';
    font-size: 12px;
    margin-bottom: 6px;
    flex-direction: row;
    justify-content: space-between;
`;
const BarBackground = styled.View`
    height: 8px;
    background-color: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
`;
const BarFill = styled(LinearGradient) <{ width: number }>`
    height: 100%;
    width: ${props => props.width}%;
    border-radius: 4px;
`;

// -- Most Drawn --
const MostDrawnContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;
const MostDrawnImage = styled.Image`
    width: 60px;
    height: 100px;
    border-radius: 8px;
    margin-right: 16px;
`;
const MostDrawnInfo = styled.View`
    flex: 1;
`;
const MostDrawnName = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Manrope_700Bold';
    font-size: 18px;
    margin-bottom: 4px;
`;
const MostDrawnCount = styled.Text`
    color: ${props => props.theme.colors.gold};
    font-family: 'Manrope_600SemiBold';
    font-size: 14px;
`;

export default function AnalyticsScreen() {
    const { top } = useSafeAreaInsets();
    const theme = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { isPremium } = usePremium();
    const { getHistory, isReady } = useHistory();
    const [stats, setStats] = useState<CardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                if (isReady) {
                    const history = await getHistory();
                    const calculated = calculateStats(history);
                    setStats(calculated);
                    setLoading(false);
                }
            };
            load();
        }, [isReady, getHistory])
    );

    if (loading) return <Container colors={theme.colors.background as any} />;

    return (
        <Container colors={theme.colors.background as any}>
            {!isPremium && (
                <LockOverlay>
                    <LockContainer>
                        <Lock size={48} color={theme.colors.gold} />
                        <LockTitle>{t('settings.premiumTitle') || 'Premium Feature'}</LockTitle>
                        <LockDescription>
                            {t('analytics.lockDescription') || 'Unlock comprehensive Tarot analytics and discover deeper patterns in your spiritual journey.'}
                        </LockDescription>
                        <UnlockButton onPress={() => navigation.navigate('Paywall' as never)}>
                            <UnlockButtonText>{t('settings.unlockPremium') || 'Unlock Premium'}</UnlockButtonText>
                        </UnlockButton>
                    </LockContainer>
                </LockOverlay>
            )}

            <Content
                scrollEnabled={isPremium}
                style={{ opacity: isPremium ? 1 : 0.3 }}
            >
                <Header style={{ marginTop: top + 20 }}>
                    <Title>Soul Analytics</Title>
                </Header>

                {(!stats || stats.total === 0) ? (
                    <>
                        <View style={{ alignItems: 'center', marginTop: 40 }}>
                            <TrendingUp size={48} color={theme.colors.textSub} style={{ marginBottom: 16, opacity: 0.5 }} />
                            <SectionTitle style={{ textAlign: 'center' }}>{t('analytics.noData')}</SectionTitle>
                            <BarLabel style={{ textAlign: 'center' }}>
                                {t('analytics.noDataDesc')}
                            </BarLabel>
                        </View>
                        {/* Mock data for preview if no real data and locked? User asked for preview. 
                            But if they have no data, preview is empty. 
                            Let's keep existing helper 'noData' but maybe show empty charts as placeholder if locked? 
                            For now, stick to covering what's there. if empty, they lock an empty screen basically.
                         */}
                    </>
                ) : (
                    <>
                        {/* Major / Minor Balance */}
                        <Section>
                            <SectionTitle>{t('analytics.majorMinor')}</SectionTitle>
                            <BarContainer>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <BarLabel>{stats.majors} {t('analytics.major')}</BarLabel>
                                    <BarLabel>{stats.minors} {t('analytics.minor')}</BarLabel>
                                </View>
                                <View style={{ flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden' }}>
                                    <View style={{ flex: stats.majors, backgroundColor: theme.colors.gold }} />
                                    <View style={{ flex: stats.minors, backgroundColor: theme.colors.textSub }} />
                                </View>
                                <BarLabel style={{ marginTop: 8 }}>
                                    {stats.majors > stats.minors ? t('analytics.focusMajor') : t('analytics.focusMinor')}
                                </BarLabel>
                            </BarContainer>
                        </Section>

                        {/* Element Balance */}
                        <Section>
                            <SectionTitle>{t('analytics.elemental')}</SectionTitle>

                            <BarContainer>
                                <BarLabel>{t('analytics.fire')} — {stats.suits.wands}</BarLabel>
                                <BarBackground>
                                    <BarFill
                                        colors={['#FF512F', '#DD2476']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        width={(stats.suits.wands / (Math.max(stats.suits.wands, stats.suits.cups, stats.suits.swords, stats.suits.pentacles) || 1)) * 100}
                                    />
                                </BarBackground>
                            </BarContainer>

                            <BarContainer>
                                <BarLabel>{t('analytics.water')} — {stats.suits.cups}</BarLabel>
                                <BarBackground>
                                    <BarFill
                                        colors={['#36D1DC', '#5B86E5']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        width={(stats.suits.cups / (Math.max(stats.suits.wands, stats.suits.cups, stats.suits.swords, stats.suits.pentacles) || 1)) * 100}
                                    />
                                </BarBackground>
                            </BarContainer>

                            <BarContainer>
                                <BarLabel>{t('analytics.air')} — {stats.suits.swords}</BarLabel>
                                <BarBackground>
                                    <BarFill
                                        colors={['#E0EAFC', '#CFDEF3']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        width={(stats.suits.swords / (Math.max(stats.suits.wands, stats.suits.cups, stats.suits.swords, stats.suits.pentacles) || 1)) * 100}
                                    />
                                </BarBackground>
                            </BarContainer>

                            <BarContainer>
                                <BarLabel>{t('analytics.earth')} — {stats.suits.pentacles}</BarLabel>
                                <BarBackground>
                                    <BarFill
                                        colors={['#11998e', '#38ef7d']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        width={(stats.suits.pentacles / (Math.max(stats.suits.wands, stats.suits.cups, stats.suits.swords, stats.suits.pentacles) || 1)) * 100}
                                    />
                                </BarBackground>
                            </BarContainer>
                        </Section>

                        {/* Most Drawn */}
                        {stats.mostDrawn && (
                            <Section>
                                <SectionTitle>{t('analytics.mostFrequent')}</SectionTitle>
                                <MostDrawnContainer>
                                    <MostDrawnImage source={getCardImage(stats.mostDrawn, 'en')} />
                                    <MostDrawnInfo>
                                        <MostDrawnName>{stats.mostDrawnName || CARD_NAME_MAPPING[stats.mostDrawn]}</MostDrawnName>
                                        <MostDrawnCount>{t('analytics.drawnTimes', { count: stats.mostDrawnCount })}</MostDrawnCount>
                                    </MostDrawnInfo>
                                </MostDrawnContainer>
                            </Section>
                        )}
                    </>
                )}

                <View style={{ height: 100 }} />
            </Content>
        </Container>
    );
}

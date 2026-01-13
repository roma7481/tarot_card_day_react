import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Layers as StyleIcon, History } from 'lucide-react-native';
import { useFonts, Manrope_300Light, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTarotData } from '../hooks/useTarotData';
import { TarotCard } from '../components/TarotCard';
import { DeckStack } from '../components/DeckStack';
import { RevealedCard } from '../components/RevealedCard';
import { colors, gradients } from '../theme/colors';
import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncWidgetData } from '../services/WidgetSyncService';
import { getCardImage } from '../utils/cardImageMapping';

// --- Styled Components ---

const Container = styled(LinearGradient)`
  flex: 1;
`;

const BackgroundGradient = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const TopGlow = styled.View`
  position: absolute;
  top: -100px;
  align-self: center;
  width: 500px;
  height: 300px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 9999px; 
  opacity: 0.15;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  z-index: 20;
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
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_700Bold';
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.8;
`;

const MainContent = styled.View`
  flex: 1;
  align-items: center;
  padding-horizontal: 24px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const DateText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_500Medium';
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
`;

const Headline = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 32px;
  margin-bottom: 30px;
`;

const FooterFn = styled.View`
  width: 100%;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
`;

const InstructionText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_400Regular';
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  max-width: 280px;
`;

const DrawButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary};
  height: 56px;
  border-radius: 28px;
  padding-horizontal: 32px;
  min-width: 200px;
  shadow-color: ${props => props.theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.4;
  shadow-radius: 12px;
  elevation: 8;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-family: 'Manrope_700Bold';
  font-size: 18px;
  margin-right: 8px;
`;

const HintContainer = styled.View`
  flex-direction: row;
  align-items: center;
  opacity: 0.5;
  gap: 8px;
`;

const HintText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_500Medium';
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;


import { useDailyCardManager } from '../hooks/useDailyCardManager';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useHistory } from '../hooks/useHistory';

export default function MainScreen() {
  const navigation = useNavigation<any>();
  const { dailyCard, isLoading, isNewCard, currentDate, navigateDay, isToday, drawDailyCard } = useDailyCardManager();

  // Local revealed state check removed as logic now relies on dailyCard existence.

  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { addDailyDraw } = useHistory();

  let [fontsLoaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  // Sync Revealed State - REMOVED, no longer needed as we serve truth from hook







  // ... (Header)

  // Wait, I need to check where "Ask the Oracle" is.
  // It's likely in the `FooterFn` or near the Reveal button if it's a feature. 
  // Ah, actually, "Ask the Oracle" is usually a separate button or link.
  // Let me check MainScreen again. 
  // ...
  // Actually, I don't see "Ask the Oracle" in the `MainScreen.tsx` I viewed earlier.
  // It might be in the `RevealedCard` component or I missed it. 
  // Let me double check `MainScreen` content.
  // Lines 302+: Deck logic.
  // If revealed => `RevealedCard`.
  // The user said "Main screen Ask the Oracle".
  // Maybe it's a floating button? Or in the Header?
  // Let me view MainScreen again to be sure.

  // Exception: We might want a "reveal animation" state, but `isNewCard` from hook handles that roughly.

  const handleDraw = async () => {
    if (isToday && !dailyCard) {
      const newCard = await drawDailyCard();

      // Record in Database for Analytics
      if (newCard) {
        await addDailyDraw(newCard.id, newCard.name);
      }

      // Sync Widget
      if (newCard) {
        const imageSource = getCardImage(newCard.id, i18n.language);
        const resolved = Image.resolveAssetSource(imageSource);
        if (resolved?.uri) {
          syncWidgetData(newCard.name, resolved.uri, new Date().toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' }));
        }
      }
    }
  };

  // Sync Widget on Load / Update
  useEffect(() => {
    const syncCurrentState = async () => {
      if (isLoading) return;

      if (dailyCard && isToday) {
        // App has a card for today -> Sync it to widget
        const imageSource = getCardImage(dailyCard.id, i18n.language);
        // @ts-ignore
        const { Image } = require('react-native');
        const resolved = Image.resolveAssetSource(imageSource);

        if (resolved?.uri) {
          const dateStr = new Date().toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' });
          await syncWidgetData(dailyCard.name, resolved.uri, dateStr);
        }
      } else if (!dailyCard && isToday) {
        // No card for today -> Sync "Tap to Reveal" state
        // We pass empty strings or specific "empty" markers to sync service
        // But our sync service might need a slight update to handle "empty" explicitly 
        // OR we just sync the "Tap to Reveal" text.
        // Actually, let's just sync the "Tap to Reveal" title and no image.
        await syncWidgetData("Tap to Reveal", "", new Date().toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' }));
      }
    };

    syncCurrentState();
  }, [dailyCard, isToday, isLoading, i18n.language]);

  if (!fontsLoaded || isLoading) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background[0] }} />;
  }

  return (
    <Container
      colors={(theme?.colors?.background || ['#000000', '#000000']) as any}
      start={{ x: 0, y: 0 }}
    >
      <BackgroundGradient />

      <Header style={{ marginTop: top }}>
        <View style={{ width: 40 }} />
        <HeaderTitle>{t('main.title')}</HeaderTitle>
        <IconButton onPress={() => navigation.navigate('History')}>
          <History color={theme.colors.icon} size={24} />
        </IconButton>
      </Header>

      <MainContent>

        {/* Date Navigation */}
        <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
          <IconButton onPress={() => navigateDay(-1)} style={{ marginRight: 16 }}>
            <ChevronLeft color={theme.colors.textSub} size={24} />
          </IconButton>

          <View style={{ alignItems: 'center' }}>
            <DateText>
              {(() => {
                const [y, m, d] = currentDate.split('-').map(Number);
                return new Date(y, m - 1, d).toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' });
              })()}
            </DateText>
            <Headline style={{ fontSize: 24, marginBottom: 0 }}>
              {t('main.yourCard')}
            </Headline>
          </View>

          <IconButton onPress={() => navigateDay(1)} style={{ marginLeft: 16, opacity: isToday ? 0.3 : 1 }} disabled={isToday}>
            <ChevronRight color={theme.colors.textSub} size={24} />
          </IconButton>
        </View>

        <View style={{ flex: 1, width: '100%' }}>
          {!dailyCard ? (
            isToday ? (
              // Case: Today, No Card Drawn -> Show Deck to Draw
              <>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <DeckStack onPress={handleDraw} />
                </View>
                <FooterFn>
                  <InstructionText>
                    {t('main.tapToReveal') || "Focus on your intention, then tap to reveal."}
                  </InstructionText>
                  <DrawButton onPress={handleDraw}>
                    <ButtonText>{t('main.tapToReveal')}</ButtonText>
                    <StyleIcon color="#fff" size={20} />
                  </DrawButton>
                </FooterFn>
              </>
            ) : (
              // Case: Past Day, No Card Drawn -> Show Empty Message
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textSub, textAlign: 'center' }}>{t('main.noCardDrawn')}</Text>
              </View>
            )
          ) : (
            // Case: Card Exists (Today or Past) -> Show Revealed Card
            <RevealedCard
              card={{ ...dailyCard, description: dailyCard.description || '' }}
              embed={true}
              onBack={() => { }} // No-op for embed mode
            />
          )}
        </View>
      </MainContent>
    </Container >
  );
}


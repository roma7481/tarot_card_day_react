import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Dimensions, Modal, ActivityIndicator } from 'react-native';
import styled, { useTheme as useStyledTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTarotDatabase } from '../hooks/useTarotDatabase';
import { getCardImage } from '../utils/cardImageMapping';
import { colors } from '../theme/colors';
import { RevealedCard } from '../components/RevealedCard';
import { TarotCard } from '../hooks/useTarotData';
import { adService } from '../services/AdService';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { BannerAdWrapper } from '../components/ads/BannerAdWrapper';

// --- Styled Components ---

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background[0]}; 
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

const GridItem = styled.TouchableOpacity`
  flex: 1;
  aspect-ratio: 0.6;
  margin: 6px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #1a1a1a;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const CardThumb = styled.Image`
  width: 100%;
  height: 100%;
  opacity: 0.9;
`;

const CardLabel = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0,0,0,0.7);
  padding: 4px;
`;

const LabelText = styled.Text`
  color: #fff;
  font-size: 10px;
  font-family: 'Manrope_600SemiBold';
  text-align: center;
`;

// --- Ad Placeholder for Demo ---
const AdPlaceholder = styled.View`
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? '#f0f0f0' : 'rgba(255,255,255,0.05)'};
  height: 60px;
  margin-bottom: 0;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-style: dashed;
  border-color: ${props => props.theme.colors.textSub};
  opacity: 0.6;
`;

const AdText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_600SemiBold';
  font-size: 12px;
`;

// --- Screen Component ---

export const DeckScreen = () => {
  const { top } = useSafeAreaInsets();
  const theme = useStyledTheme();
  const { t, i18n } = useTranslation();
  const { getAllCards, isReady } = useTarotDatabase();

  const [cards, setCards] = useState<{ id: string; name: string }[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      if (!isReady) return;
      setLoading(true);
      const all = await getAllCards();
      setCards(all);
      setLoading(false);
    };
    fetchCards();
  }, [isReady, i18n.language]); // Removed getAllCards to prevent loop

  const handleSelectCard = (id: string) => {
    adService.checkInterstitial(() => {
      setSelectedCardId(id);
    });
  };

  const handleCloseDetail = () => {
    setSelectedCardId(null);
  };

  const renderItem = ({ item }: { item: { id: string; name: string } }) => {
    return (
      <GridItem activeOpacity={0.7} onPress={() => handleSelectCard(item.id)}>
        <CardThumb
          source={getCardImage(item.id, i18n.language)}
          resizeMode="cover"
          onError={(e) => console.log(`Error loading image for ${item.id}:`, e.nativeEvent.error)}
        />
        <CardLabel>
          <LabelText numberOfLines={1}>{item.name}</LabelText>
        </CardLabel>
      </GridItem>
    );
  };

  return (
    <Container>
      <Header style={{ marginTop: top + 20 }}>
        <Title>{t('tabs.deck')}</Title>
      </Header>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.gold} />
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={3}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          maxToRenderPerBatch={6}
          ListHeaderComponent={
            <View style={{ alignItems: 'center', marginBottom: 10, marginHorizontal: 4 }}>
              <BannerAdWrapper
                adMobUnitId={TestIds.BANNER}
                appLovinUnitId="YOUR_APPLOVIN_BANNER_ID"
              />
            </View>
          }
        />
      )}

      <Modal
        visible={!!selectedCardId}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseDetail}
      >
        {selectedCardId && (
          <RevealedCard
            card={{
              id: selectedCardId,
              name: cards.find(c => c.id === selectedCardId)?.name || '',
              description: '', // Fetched inside RevealedCard
              image_url: '' // Handled by RevealedCard
            }}
            onBack={handleCloseDetail}
          />
        )}
      </Modal>
    </Container>
  );
};

export default DeckScreen;

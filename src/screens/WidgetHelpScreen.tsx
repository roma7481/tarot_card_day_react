import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { View, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, RefreshCw, Smartphone } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { WidgetPreview } from 'react-native-android-widget';

import { DailyTarotWidget } from '../widgets/DailyTarotWidget';
import { useDailyCardManager } from '../hooks/useDailyCardManager';
import { getCardImage } from '../utils/cardImageMapping';
import { Image } from 'react-native';
import { syncWidgetData } from '../services/WidgetSyncService';
import { useTranslation } from 'react-i18next';

const Container = styled(LinearGradient)`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const IconButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 18px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

const Section = styled.View`
  margin-bottom: 32px;
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_700Bold';
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const InstructionsBox = styled.View`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const StepRow = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
  align-items: flex-start;
`;

const StepNumber = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => props.theme.colors.primary};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  margin-top: 2px;
`;

const StepNumberText = styled.Text`
  color: #fff;
  font-family: 'Manrope_700Bold';
  font-size: 12px;
`;

const StepText = styled.Text`
  flex: 1;
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_500Medium';
  font-size: 15px;
  line-height: 22px;
`;

const PreviewContainer = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const PreviewLabel = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_400Regular';
  font-size: 12px;
  margin-bottom: 12px;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary};
  padding: 16px;
  border-radius: 12px;
  margin-top: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-family: 'Manrope_700Bold';
  font-size: 16px;
  margin-left: 8px;
`;

export default function WidgetHelpScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { dailyCard } = useDailyCardManager();
  const { t, i18n } = useTranslation();

  const handleBack = () => navigation.goBack();

  const handleForceSync = async () => {
    if (!dailyCard) {
      Alert.alert("No Card", "You haven't drawn a card yet today!");
      return;
    }

    try {
      const imageSource = getCardImage(dailyCard.id, i18n.language);
      const resolved = Image.resolveAssetSource(imageSource);
      if (resolved?.uri) {
        await syncWidgetData(dailyCard.name, resolved.uri);
        Alert.alert("Success", "Widget update requested!");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to sync widget.");
    }
  };

  // Prepare preview props
  const previewProps = dailyCard ? {
    cardName: dailyCard.name,
    // For preview, we might need a dummy URI or try to resolve the real one
    // WidgetPreview often needs checking if it supports remote/local images same as real widget
    imageUri: Image.resolveAssetSource(getCardImage(dailyCard.id, i18n.language))?.uri,
    date: new Date().toLocaleDateString(i18n.language, { weekday: 'long', month: 'short', day: 'numeric' })
  } : {
    date: "Today"
  };

  return (
    <Container
      colors={(theme?.colors?.background || ['#000000', '#000000']) as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Header style={{ marginTop: top }}>
        <IconButton onPress={handleBack}>
          <ArrowLeft color={theme.colors.text} size={24} />
        </IconButton>
        <Title>Widget Setup</Title>
        <View style={{ width: 40 }} />
      </Header>

      <Content>
        <Section>
          <PreviewContainer>
            <PreviewLabel>PREVIEW</PreviewLabel>
            {/* Widget Width/Height must be fixed for preview */}
            <WidgetPreview
              renderWidget={() => <DailyTarotWidget {...previewProps} />}
              width={160} // minWidth from app.json
              height={120} // minHeight from app.json
            />
          </PreviewContainer>
        </Section>

        <Section>
          <SectionTitle>How to Add</SectionTitle>
          <InstructionsBox>
            {[
              "Go to your Home Screen.",
              "Long press on an empty space.",
              "Select 'Widgets'.",
              "Scroll to find 'Daily Tarot'.",
              "Drag the widget to your screen."
            ].map((step, i) => (
              <StepRow key={i}>
                <StepNumber><StepNumberText>{i + 1}</StepNumberText></StepNumber>
                <StepText>{step}</StepText>
              </StepRow>
            ))}
          </InstructionsBox>
        </Section>

        <Section>
          <SectionTitle>Troubleshooting</SectionTitle>
          <ActionButton onPress={handleForceSync}>
            <RefreshCw color="#fff" size={20} />
            <ButtonText>Force Widget Update</ButtonText>
          </ActionButton>
          <StepText style={{ marginTop: 12, textAlign: 'center', fontSize: 13, color: theme.colors.textSub }}>
            Tap this if the widget isn't showing the correct card.
          </StepText>
        </Section>
      </Content>
    </Container>
  );
}

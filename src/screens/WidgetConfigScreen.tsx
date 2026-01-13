
import React, { useState, useEffect } from 'react';
import styled, { useTheme as useStyledTheme } from 'styled-components/native';
import { View, Text, ScrollView, Alert, Switch, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Sun, Moon, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';

import { syncWidgetData } from '../services/WidgetSyncService';
import { useHistory } from '../hooks/useHistory';
import { getCardImage } from '../utils/cardImageMapping';
import cardsData from '../data/cards.json';

// --- Styled Components ---

const Container = styled(LinearGradient)`
  flex: 1;
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

const HeaderTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 18px;
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
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SettingRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const SettingLabel = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_600SemiBold';
  font-size: 16px;
`;

const SettingValue = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_400Regular';
  font-size: 14px;
`;

// Preview Card
const PreviewContainer = styled.View<{ bgColor: string }>`
  height: 180px;
  background-color: ${props => props.bgColor};
  border-radius: 16px;
  padding: 16px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
  margin-bottom: 32px;
  align-self: center;
  width: 100%;
`;

const PreviewCardThumb = styled.View`
  width: 80px;
  height: 120px;
  border-radius: 8px;
  background-color: rgba(255,255,255,0.1);
  margin-right: 16px;
`;

const PreviewTextCol = styled.View`
  flex: 1;
  justify-content: center;
`;

const PreviewTitle = styled.Text<{ color: string }>`
  color: ${props => props.color};
  font-family: 'Manrope_700Bold';
  font-size: 18px;
  margin-bottom: 4px;
`;

const PreviewDate = styled.Text<{ color: string }>`
  color: ${props => props.color};
  font-family: 'Manrope_500Medium';
  font-size: 14px;
`;

const ThemeOption = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  height: 100px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${props => props.theme.colors.surface};
  margin-horizontal: 6px;
  align-items: center;
  justify-content: center;
`;

const ThemeRow = styled.View`
  flex-direction: row;
  margin-horizontal: -6px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding-vertical: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 20px;
`;

const SaveButtonText = styled.Text`
  color: #fff;
  font-family: 'Manrope_700Bold';
  font-size: 16px;
`;

export default function WidgetConfigScreen() {
  const theme = useStyledTheme();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { getTodaysDraw } = useHistory();

  const [widgetTheme, setWidgetTheme] = useState<'light' | 'dark'>('dark');
  const [transparency, setTransparency] = useState(0); // 0-100
  const [showDate, setShowDate] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const storedTheme = await AsyncStorage.getItem('widget_theme');
    const storedTransCheck = await AsyncStorage.getItem('widget_transparency');
    const storedShowDate = await AsyncStorage.getItem('widget_show_date');

    if (storedTheme) setWidgetTheme(storedTheme as 'light' | 'dark');
    if (storedTransCheck) setTransparency(parseInt(storedTransCheck, 10));
    if (storedShowDate !== null) setShowDate(storedShowDate !== 'false');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('widget_theme', widgetTheme);
      await AsyncStorage.setItem('widget_transparency', transparency.toString());
      await AsyncStorage.setItem('widget_show_date', showDate.toString());

      // Trigger sync
      const todaysDraw = await getTodaysDraw();
      if (todaysDraw) {
        const cardId = todaysDraw.card_id;
        // cardId might be number, c.id is string. Use loose equality or toString()
        const card = cardsData.find(c => c.id == cardId.toString());

        // Prioritize the name stored in history (which might be user-facing/localized if saved that way)
        // Fallback to cards.json data, then default.
        const cardName = todaysDraw.card_name || card?.name || "Daily Tarot";

        // Get Image URI
        // We need the resolved URI string (http or file)
        // This is tricky in Expo Go vs Native, but let's try passing the ID and let Service handle?
        // No, Service needs URI string.
        // Let's pass null for imageUri if we can't easily resolve it here, 
        // OR better: rely on the Service to do nothing if URI is bad, but at least pass settings.
        // Actually, if we pass "" for imageUri, the service might keep old image or clear it?
        // Let's passed undefined for imageUri to skip image update if we don't have it, 
        // BUT we need to update settings.
        // WidgetSyncService.syncWidgetData(cardName, imageUri, date)

        // If we just want to update SETTINGS (theme/transparency), we can pass empty strings?
        // The service logic:
        // if (imageUri) ... process
        // requestWidgetUpdate({ ... props })
        // The props use "finalImageUri".

        // We really want to "refresh" the widget with current card data + new settings.
        // So we need that image URI.
        // The only robust way to get image URI for a static asset (require) is `Image.resolveAssetSource`.
        const { Image } = require('react-native');
        const imageSourceId = getCardImage(cardId, 'en');
        const resolvedImage = Image.resolveAssetSource(imageSourceId);
        const imageUri = resolvedImage ? resolvedImage.uri : "";

        await syncWidgetData(cardName, imageUri, undefined);
      } else {
        // Even if no card, we might want to sync settings (theme) for empty state?
        // WidgetSyncService implementation requires cardName.
        // Let's skip if no card.
      }

      Alert.alert(t('common.success'), t('settings.saved'));
    } catch (e) {
      console.error(e);
      Alert.alert(t('common.error'), t('common.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  // Calculate Preview Colors
  const alphaVal = 1 - (transparency / 100);
  const bgBase = widgetTheme === 'dark' ? '0, 0, 0' : '255, 255, 255'; // Using rgba for RN preview
  // Actually hex is easier
  const bgHex = widgetTheme === 'dark' ? '#0F172A' : '#FFFFFF';

  // Manual Hex Alpha for Preview
  // We can use rgba for view style
  const bgRgb = widgetTheme === 'dark' ? '15, 23, 42' : '255, 255, 255';
  const previewBgColor = `rgba(${bgRgb}, ${alphaVal})`;

  const titleColor = widgetTheme === 'dark' ? '#F1F5F9' : '#1E293B';
  const subColor = widgetTheme === 'dark' ? '#94A3B8' : '#64748B';

  return (
    <Container
      colors={(theme?.colors?.background || ['#000000', '#000000']) as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Header style={{ marginTop: top }}>
        <IconButton onPress={() => navigation.goBack()}>
          <ArrowLeft color={theme.colors.icon} size={24} />
        </IconButton>
        <HeaderTitle>{t('settings.widget')}</HeaderTitle>
        <View style={{ width: 40 }} />
      </Header>

      <Content>
        {/* Preview */}
        <SectionTitle>{t('widget.preview')}</SectionTitle>
        <PreviewContainer bgColor={previewBgColor}>
          <PreviewCardThumb />
          <PreviewTextCol>
            {showDate && (
              <PreviewDate color={subColor}>Friday, Oct 24</PreviewDate>
            )}
            <PreviewTitle color={titleColor}>The Magician</PreviewTitle>
          </PreviewTextCol>
        </PreviewContainer>

        {/* Theme */}
        <Section>
          <SectionTitle>{t('settings.theme')}</SectionTitle>
          <ThemeRow>
            <ThemeOption selected={widgetTheme === 'light'} onPress={() => setWidgetTheme('light')}>
              <Sun color={widgetTheme === 'light' ? theme.colors.primary : theme.colors.textSub} size={24} />
              <Text style={{ color: theme.colors.text, marginTop: 8, fontFamily: 'Manrope_600SemiBold' }}>{t('widget.light')}</Text>
            </ThemeOption>
            <ThemeOption selected={widgetTheme === 'dark'} onPress={() => setWidgetTheme('dark')}>
              <Moon color={widgetTheme === 'dark' ? theme.colors.primary : theme.colors.textSub} size={24} />
              <Text style={{ color: theme.colors.text, marginTop: 8, fontFamily: 'Manrope_600SemiBold' }}>{t('widget.dark')}</Text>
            </ThemeOption>
          </ThemeRow>
        </Section>

        {/* Transparency */}
        <Section>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <SectionTitle style={{ marginBottom: 0 }}>{t('widget.transparency')}</SectionTitle>
            <SettingValue>{transparency}%</SettingValue>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            value={transparency}
            onValueChange={setTransparency}
            step={5}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
        </Section>

        {/* Show Date */}
        <Section>
          <SettingRow>
            <View>
              <SettingLabel>{t('widget.showDate')}</SettingLabel>
              <SettingValue>{t('widget.showDateDesc')}</SettingValue>
            </View>
            <Switch
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={'#fff'}
              onValueChange={setShowDate}
              value={showDate}
            />
          </SettingRow>
        </Section>



        <SaveButton onPress={handleSave}>
          <SaveButtonText>{saving ? t('common.saving') : t('notes.save')}</SaveButtonText>
        </SaveButton>

        <View style={{ height: 50 }} />
      </Content>
    </Container>
  );
}

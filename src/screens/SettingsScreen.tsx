import React, { useState } from 'react';
import styled, { useTheme as useStyledTheme } from 'styled-components/native';
import { Switch, Modal, TouchableWithoutFeedback, View, TouchableOpacity, Linking, Text, ScrollView, Alert, Share, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart3, Bot, Globe, Bell, Layout as WidgetIcon, Type, Palette, Shield, ChevronRight, Check, Share2, HelpCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useNotifications } from '../hooks/useNotifications';
import { Clock, Info, Mail } from 'lucide-react-native';
import { OtherAppsCarousel } from '../components/OtherAppsCarousel';
import * as Application from 'expo-application';
import { usePremium } from '../hooks/usePremium';


// --- Styled Components ---

const Container = styled(LinearGradient)`
  flex: 1;
`;

const ContentContainer = styled.ScrollView.attrs({
  contentContainerStyle: { paddingBottom: 160, paddingHorizontal: 20 },
})`
  flex: 1;
`;

const Header = styled.View`
  margin-top: 20px;
  margin-bottom: 32px;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 24px;
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_700Bold';
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
  margin-left: 8px;
  margin-top: 24px;
`;

const SettingsGroup = styled.View`
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? 'rgba(255,255,255,0.7)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 20px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  overflow: hidden;
`;

const RowContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const RowLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const IconBox = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.08)'};
  align-items: center;
  justify-content: center;
`;

const RowLabel = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_600SemiBold';
  font-size: 16px;
`;

const RowRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const RowValue = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_500Medium';
  font-size: 14px;
`;

// --- Modal Styled Components ---
const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  width: 80%;
  max-height: 70%;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 24px;
  padding: 24px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const ModalTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
`;

const ThemeOptionItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const ThemeName = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_600SemiBold';
  font-size: 16px;
`;

const ThemePreviewGradient = styled(LinearGradient)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

// --- Reusable Row Component ---

// --- Reusable Row Component ---

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  subtitle?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  onPress?: () => void;
  isLast?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  subtitle,
  isSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  isLast
}) => {
  const theme = useStyledTheme();
  return (
    <RowContainer
      onPress={isSwitch ? undefined : onPress}
      activeOpacity={isSwitch ? 1 : 0.7}
      style={{ borderBottomWidth: isLast ? 0 : 1 }}
    >
      <RowLeft>
        <IconBox>{icon}</IconBox>
        <View>
          <RowLabel>{label}</RowLabel>
          {subtitle && (
            <Text style={{
              color: theme.colors.textSub,
              fontFamily: 'Manrope_500Medium',
              fontSize: 12,
              marginTop: 2
            }}>
              {subtitle}
            </Text>
          )}
        </View>
      </RowLeft>

      <RowRight>
        {value && <RowValue>{value}</RowValue>}
        {isSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#334155', true: theme.colors.primary }}
            thumbColor={'#fff'}
          />
        ) : (
          <ChevronRight color={theme.colors.textSub} size={20} />
        )}
      </RowRight>
    </RowContainer>
  );
};

// --- Language Data ---
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'pl', label: 'Polski' },
];

export default function SettingsScreen() {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const theme = useStyledTheme();
  const { themeId, setThemeId, availableThemes, textSize, setTextSize } = useTheme();
  const { t, i18n } = useTranslation();
  const { isPremium } = usePremium();

  // Notification Hook
  const { enabled: notificationsEnabled, time: notificationTime, toggleNotifications, updateTime } = useNotifications();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [textSizeModalVisible, setTextSizeModalVisible] = useState(false);
  const [appInfoModalVisible, setAppInfoModalVisible] = useState(false);
  const [widgetHelpModalVisible, setWidgetHelpModalVisible] = useState(false);

  const toggleLanguage = async (langCode: string) => {
    i18n.changeLanguage(langCode);
    await import('@react-native-async-storage/async-storage').then(m => m.default.setItem('user-language', langCode));
    setLangModalVisible(false);
  };

  const getThemeName = (id: string) => {
    if (id === 'dark') return t('themes.dark');
    if (id === 'light') return t('themes.light');
    if (id === 'ethereal') return t('themes.ethereal');
    return '';
  };

  const getTextSizeLabel = (size: string) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      updateTime(`${hours}:${minutes}`);
    }
  };

  const handleShare = async () => {
    const androidUrl = 'https://play.google.com/store/apps/details?id=tarocard.crazybee.com.tarotcardoftheday';
    const iosUrl = 'https://apps.apple.com/us/app/tarot-card-of-the-day/id1556452544';
    const url = Platform.OS === 'ios' ? iosUrl : androidUrl;

    try {
      await Share.share({
        message: t('settings.shareMessage') + '\n\n' + url,
        url: url, // iOS helper
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container
      colors={(theme?.colors?.background || ['#000000', '#000000']) as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ContentContainer style={{ paddingTop: top }}>
        <Header>
          <HeaderTitle>{t('settings.title')}</HeaderTitle>
        </Header>

        <OtherAppsCarousel />

        {/* Premium Banner */}
        {isPremium ? (
          <View style={{
            marginHorizontal: 4,
            marginBottom: 24,
            marginTop: 8,
            overflow: 'hidden',
            borderRadius: 20,
            backgroundColor: theme.colors.surface === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.05)',
            borderWidth: 1,
            borderColor: theme.colors.primary + '40'
          }}>
            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontFamily: 'Manrope_700Bold', color: theme.colors.primary, fontSize: 16, marginBottom: 4 }}>
                  {t('settings.premiumActive') || "Premium Active"}
                </Text>
                <Text style={{ fontFamily: 'Manrope_500Medium', color: theme.colors.textSub, fontSize: 13 }}>
                  {t('settings.allFeaturesUnlocked') || "All features unlocked"}
                </Text>
              </View>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary + '20', alignItems: 'center', justifyContent: 'center' }}>
                <Shield color={theme.colors.primary} size={20} fill={theme.colors.primary + '40'} />
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Paywall' as never)}
            style={{
              marginHorizontal: 4,
              marginBottom: 24,
              marginTop: 8,
              overflow: 'hidden',
              borderRadius: 20
            }}
          >
            <LinearGradient
              colors={['#fff0fc', '#f5eff5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#d411d433' }}
            >
              <View>
                <Text style={{ fontFamily: 'Manrope_800ExtraBold', color: '#d411d4', fontSize: 18, marginBottom: 4 }}>{t('settings.unlockPremium')}</Text>
                <Text style={{ fontFamily: 'Manrope_500Medium', color: '#1b0d1b99', fontSize: 13 }}>{t('settings.premiumDesc')}</Text>
              </View>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#d411d41a', alignItems: 'center', justifyContent: 'center' }}>
                <Shield color="#d411d4" size={20} fill="#d411d420" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Preferences Section */}
        <SectionTitle>{t('settings.preferences')}</SectionTitle>
        <SettingsGroup>
          <SettingsRow
            icon={<Globe color="#A78BFA" size={20} />}
            label={t('settings.language')}
            value={t(`languages.${i18n.language}` as any)}
            onPress={() => setLangModalVisible(true)}
          />
          <SettingsRow
            icon={<Bell color="#F472B6" size={20} />}
            label={t('settings.notifications')}
            isSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={toggleNotifications}
            isLast={!notificationsEnabled}
          />

          {notificationsEnabled && (
            <SettingsRow
              icon={<Clock color={theme.colors.textSub} size={20} />}
              label={t('settings.notificationTime')}
              value={notificationTime}
              isLast
              onPress={() => setShowTimePicker(true)}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={(() => {
                const [h, m] = notificationTime.split(':').map(Number);
                const d = new Date();
                d.setHours(h);
                d.setMinutes(m);
                return d;
              })()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </SettingsGroup>

        <SectionTitle>Widgets</SectionTitle>
        <SettingsGroup>
          <SettingsRow
            icon={<WidgetIcon color="#60A5FA" size={20} />}
            label={t('settings.widget')}
            value={t('settings.configure')}
            onPress={() => navigation.navigate('WidgetConfig' as never)}
          />
          <SettingsRow
            icon={<HelpCircle color="#A78BFA" size={20} />}
            label={t('widget.howToAdd')}
            isLast
            onPress={() => setWidgetHelpModalVisible(true)}
          />
        </SettingsGroup>

        {/* Appearance Section */}
        <SectionTitle>{t('settings.appearance')}</SectionTitle>
        <SettingsGroup>
          <SettingsRow
            icon={<Palette color="#FBBF24" size={20} />}
            label={t('settings.customizeLook')}
            subtitle={getThemeName(themeId)}
            isLast
            onPress={() => navigation.navigate('Appearance' as never)}
          />
        </SettingsGroup>

        {/* About Section */}
        <SectionTitle>{t('settings.about')}</SectionTitle>
        <SettingsGroup>
          <SettingsRow
            icon={<Info color="#F59E0B" size={20} />}
            label={t('settings.appInfo')}
            onPress={() => setAppInfoModalVisible(true)}
          />
          <SettingsRow
            icon={<Share2 color="#3B82F6" size={20} />}
            label={t('settings.share')}
            onPress={handleShare}
          />
          <SettingsRow
            icon={<Mail color="#10B981" size={20} />} // Emerald Green
            label={t('settings.contactUs')}
            onPress={() => Linking.openURL('mailto:cbeeapps@gmail.com')}
          />
          <SettingsRow
            icon={<Shield color="#94A3B8" size={20} />}
            label={t('settings.privacy')}
            isLast
            onPress={() => Linking.openURL('https://cbeeapps.wixsite.com/cardtarot')}
          />
        </SettingsGroup>

        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Manrope_400Regular', color: theme.colors.textSub, fontSize: 12 }}>
            {t('settings.version')} {Application.nativeApplicationVersion} ({Application.nativeBuildVersion})
          </Text>
        </View>

        {/* Theme Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={themeModalVisible}
          onRequestClose={() => setThemeModalVisible(false)}
        >
          <ModalOverlay activeOpacity={1} onPress={() => setThemeModalVisible(false)}>
            <TouchableWithoutFeedback>
              <ModalContent>
                <View>
                  <ModalTitle>{t('settings.selectTheme')}</ModalTitle>
                  {availableThemes.map((item, index) => (
                    <ThemeOptionItem
                      key={item.id}
                      style={{ borderBottomWidth: index === availableThemes.length - 1 ? 0 : 1 }}
                      onPress={() => {
                        setThemeId(item.id);
                        setThemeModalVisible(false);
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <ThemePreviewGradient
                          colors={(item.theme.colors.background) as any}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        />
                        <ThemeName>{getThemeName(item.id)}</ThemeName>
                      </View>
                      {themeId === item.id && <Check size={20} color={theme.colors.primary} />}
                    </ThemeOptionItem>
                  ))}
                </View>
              </ModalContent>
            </TouchableWithoutFeedback>
          </ModalOverlay>
        </Modal>

        {/* Language Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={langModalVisible}
          onRequestClose={() => setLangModalVisible(false)}
        >
          <ModalOverlay activeOpacity={1} onPress={() => setLangModalVisible(false)}>
            <TouchableWithoutFeedback>
              <ModalContent style={{ maxHeight: '80%' }}>
                <View>
                  <ModalTitle>{t('settings.selectLanguage')}</ModalTitle>
                  <ScrollView style={{ maxHeight: 400 }}>
                    {LANGUAGES.map((lang, index) => (
                      <ThemeOptionItem
                        key={lang.code}
                        style={{ borderBottomWidth: index === LANGUAGES.length - 1 ? 0 : 1 }}
                        onPress={() => toggleLanguage(lang.code)}
                      >
                        <ThemeName>{lang.label}</ThemeName>
                        {i18n.language === lang.code && <Check size={20} color={theme.colors.primary} />}
                      </ThemeOptionItem>
                    ))}
                  </ScrollView>
                </View>
              </ModalContent>
            </TouchableWithoutFeedback>
          </ModalOverlay>
        </Modal>

        {/* App Info Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={appInfoModalVisible}
          onRequestClose={() => setAppInfoModalVisible(false)}
        >
          <ModalOverlay activeOpacity={1} onPress={() => setAppInfoModalVisible(false)}>
            <TouchableWithoutFeedback>
              <ModalContent>
                <View style={{ alignItems: 'center' }}>
                  <ModalTitle>{t('settings.appInfo')}</ModalTitle>
                  <Text style={{
                    color: theme.colors.text,
                    fontFamily: 'Manrope_400Regular',
                    fontSize: 16,
                    lineHeight: 24,
                    textAlign: 'center',
                    marginBottom: 20
                  }}>
                    {t('settings.appDescription')}
                  </Text>
                  <Text style={{
                    color: theme.colors.textSub,
                    fontFamily: 'Manrope_500Medium',
                    fontSize: 14
                  }}>
                    {t('settings.version')} {Application.nativeApplicationVersion} ({Application.nativeBuildVersion})
                  </Text>
                </View>
              </ModalContent>
            </TouchableWithoutFeedback>
          </ModalOverlay>
        </Modal>

        {/* Text Size Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={textSizeModalVisible}
          onRequestClose={() => setTextSizeModalVisible(false)}
        >
          <ModalOverlay activeOpacity={1} onPress={() => setTextSizeModalVisible(false)}>
            <TouchableWithoutFeedback>
              <ModalContent>
                <View>
                  <ModalTitle>{t('settings.textSize')}</ModalTitle>
                  {['medium', 'large'].map((size, index) => (
                    <ThemeOptionItem
                      key={size}
                      style={{ borderBottomWidth: index === 1 ? 0 : 1 }}
                      onPress={() => {
                        setTextSize(size as 'medium' | 'large');
                        setTextSizeModalVisible(false);
                      }}
                    >
                      <ThemeName style={{ fontSize: size === 'medium' ? 16 : 20 }}>
                        {getTextSizeLabel(size)}
                      </ThemeName>
                      {textSize === size && <Check size={20} color={theme.colors.primary} />}
                    </ThemeOptionItem>
                  ))}
                </View>
              </ModalContent>
            </TouchableWithoutFeedback>
          </ModalOverlay>
        </Modal>

        {/* Widget How To Add Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={widgetHelpModalVisible}
          onRequestClose={() => setWidgetHelpModalVisible(false)}
        >
          <ModalOverlay activeOpacity={1} onPress={() => setWidgetHelpModalVisible(false)}>
            <TouchableWithoutFeedback>
              <ModalContent>
                <View>
                  <ModalTitle>{t('widget.howToAdd')}</ModalTitle>
                  <View style={{ gap: 16 }}>
                    {[1, 2, 3, 4, 5].map((step) => (
                      <View key={step} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <View style={{
                          width: 24, height: 24, borderRadius: 12, backgroundColor: theme.colors.surface,
                          alignItems: 'center', justifyContent: 'center', marginRight: 12,
                          borderWidth: 1, borderColor: theme.colors.border, marginTop: 0
                        }}>
                          <Text style={{ color: theme.colors.primary, fontFamily: 'Manrope_700Bold', fontSize: 12 }}>{step}</Text>
                        </View>
                        <Text style={{ color: theme.colors.textSub, fontFamily: 'Manrope_400Regular', fontSize: 14, flex: 1, lineHeight: 22 }}>
                          {t(`widget.step${step}`)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    onPress={() => setWidgetHelpModalVisible(false)}
                    style={{
                      marginTop: 24,
                      backgroundColor: theme.colors.primary,
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ color: '#fff', fontFamily: 'Manrope_700Bold', fontSize: 16 }}>{t('common.ok')}</Text>
                  </TouchableOpacity>
                </View>
              </ModalContent>
            </TouchableWithoutFeedback>
          </ModalOverlay>
        </Modal>

      </ContentContainer >
    </Container >
  );
}

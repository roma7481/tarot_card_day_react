import React from 'react';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import './src/i18n'; // Initialize i18n
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Layers, Notebook, Settings, Sparkles, BarChart3 } from 'lucide-react-native';
import { useTheme as useStyledTheme } from 'styled-components/native';
import * as Notifications from 'expo-notifications';
import { ChatProvider } from './src/contexts/ChatContext';

// Configure notifications globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

import MainScreen from './src/screens/MainScreen';
import DeckScreen from './src/screens/DeckScreen';
import NotesScreen from './src/screens/NotesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import WidgetConfigScreen from './src/screens/WidgetConfigScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import { ThemeProvider } from './src/theme/ThemeContext'; // Keep this ThemeProvider for now, as the instruction implies a refactor but doesn't fully provide it.

const Tab = createBottomTabNavigator();

import { useTranslation } from 'react-i18next'; // Add import

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AppearanceScreen from './src/screens/AppearanceScreen';
import ChatScreen from './src/screens/ChatScreen';

import WidgetHelpScreen from './src/screens/WidgetHelpScreen';
import RateAppDialog from './src/components/RateAppDialog';
import { MigrationWrapper } from './src/components/MigrationWrapper'; // Added MigrationWrapper import
import { DatabaseProvider } from './src/data/DatabaseContext';

const Stack = createNativeStackNavigator();

import { adService } from './src/services/AdService';

// ... class/function ...

function TabNavigator() {
  const theme = useStyledTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Initialize Ads on mount
  React.useEffect(() => {
    adService.initialize().then(() => {
      console.log('[App] AdService initialized');
      // Preload first ad
      adService.loadInterstitial();
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background[0],
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 60 + insets.bottom + 8,
          paddingTop: 10,
          paddingBottom: insets.bottom + 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.silver,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainScreen}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Deck"
        component={DeckScreen}
        options={{
          tabBarLabel: t('tabs.deck'),
          tabBarIcon: ({ color, size }) => <Layers color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: t('tabs.analytics'),
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          tabBarLabel: t('tabs.notes'),
          tabBarIcon: ({ color, size }) => <Notebook color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

import { analyticsService } from './src/services/AnalyticsService';

function AppLayout() {
  const theme = useStyledTheme();
  const { t } = useTranslation();
  const routeNameRef = React.useRef<string | undefined>(undefined);
  const navigationRef = React.useRef<any>(null);


  const isDark = theme.colors.text !== '#334155';
  const MyTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background[0],
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={MyTheme}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          await analyticsService.logScreenView(currentRouteName, currentRouteName);
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <StatusBar style={theme.colors.text === '#334155' ? 'dark' : 'light'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ presentation: 'card' }} />
        <Stack.Screen name="WidgetConfig" component={WidgetConfigScreen} options={{ presentation: 'card' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ presentation: 'card' }} />
        <Stack.Screen name="Appearance" component={AppearanceScreen} options={{ presentation: 'card' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Paywall" component={PaywallScreen} options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="WidgetHelp" component={WidgetHelpScreen} options={{ presentation: 'card' }} />
      </Stack.Navigator>
      <RateAppDialog />
    </NavigationContainer>
  );
}

import { InitialLanguageModal } from './src/components/InitialLanguageModal'; // Add import

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const [isLanguageChecked, setIsLanguageChecked] = React.useState(false);
  const [showLanguageModal, setShowLanguageModal] = React.useState(false);

  // Restore Language & Init
  React.useEffect(() => {
    async function initialize() {
      // 1. Language
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const savedLang = await AsyncStorage.getItem('user-language');

        if (savedLang) {
          const i18nModule = (await import('./src/i18n')).default;
          await i18nModule.changeLanguage(savedLang);
        } else {
          setShowLanguageModal(true);
        }
      } catch (e) {
        console.error("Failed to restore language", e);
      } finally {
        setIsLanguageChecked(true);
      }

      // 2. Analytics
      import('./src/services/AnalyticsService').then(({ analyticsService }) => {
        analyticsService.setCrashlyticsCollectionEnabled(true);
        analyticsService.logEvent('app_open');
      });

      // 3. AdMob Consent
      import('./src/services/AdMobService').then(({ adMobService }) => {
        // Check consent (Production mode: no forced debug)
        if (adService.getProvider() !== 'applovin') {
          adMobService.checkConsent();
        } else {
          console.log('[App] AppLovin active, skipping AdMob consent.');
        }
      });
    }

    initialize();
  }, []);

  const handleLanguageSelect = async (lang: string) => {
    const i18nModule = (await import('./src/i18n')).default;
    await i18nModule.changeLanguage(lang);

    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem('user-language', lang);

    setShowLanguageModal(false);
  };

  if (!fontsLoaded || !isLanguageChecked) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <ThemeProvider>
          <ChatProvider>
            <MigrationWrapper>
              <AppLayout />
              <InitialLanguageModal visible={showLanguageModal} onSelect={handleLanguageSelect} />
            </MigrationWrapper>
          </ChatProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

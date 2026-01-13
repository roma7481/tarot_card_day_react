import React from 'react';
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import './src/i18n'; // Initialize i18n
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
          height: 85,
          paddingTop: 10,
          paddingBottom: 30,
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
  const routeNameRef = React.useRef<string | undefined>();
  const navigationRef = React.useRef<any>(null);

  return (
    <NavigationContainer
      ref={navigationRef}
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

export default function App() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  // Restore Language
  // Restore Language
  React.useEffect(() => {
    // 1. Language
    import('@react-native-async-storage/async-storage').then(async (m) => {
      const savedLang = await m.default.getItem('user-language');
      if (savedLang) {
        import('./src/i18n').then(i18nModule => {
          i18nModule.default.changeLanguage(savedLang);
        });
      }
    });

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
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <ThemeProvider>
          <ChatProvider>
            <MigrationWrapper>
              <AppLayout />
            </MigrationWrapper>
          </ChatProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

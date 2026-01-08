import React from 'react';
import './src/i18n'; // Initialize i18n
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, Layers, Notebook, Settings, Sparkles, BarChart3 } from 'lucide-react-native';
import { useTheme as useStyledTheme } from 'styled-components/native';
import * as Notifications from 'expo-notifications';

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
import { ThemeProvider } from './src/theme/ThemeContext';

const Tab = createBottomTabNavigator();

import { useTranslation } from 'react-i18next'; // Add import

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AppearanceScreen from './src/screens/AppearanceScreen';
import ChatScreen from './src/screens/ChatScreen';

import WidgetHelpScreen from './src/screens/WidgetHelpScreen';
import RateAppDialog from './src/components/RateAppDialog';

const Stack = createNativeStackNavigator();

function TabNavigator() {
  const theme = useStyledTheme();
  const { t } = useTranslation();

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

function AppContent() {
  const theme = useStyledTheme(); // Access the provided theme

  return (
    <NavigationContainer>
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
    </NavigationContainer >
  );
}

import { DatabaseProvider } from './src/data/DatabaseContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

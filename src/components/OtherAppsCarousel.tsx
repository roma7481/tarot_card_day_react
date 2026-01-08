import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { fetchOtherApps, OtherApp } from '../services/FirebaseService';

const Container = styled.View`
  margin-top: 20px;
  margin-bottom: 4px; /* Reduced from vertical 20 */
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_700Bold';
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 16px;
  text-align: center;
`;

const AppItem = styled.TouchableOpacity`
  width: 80px;
  align-items: center;
  margin-right: 16px;
`;

const AppIconContainer = styled.View`
  position: relative;
  margin-bottom: 8px;
`;

const AppIcon = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background-color: transparent;
  padding: 2px; /* Added padding */
`;

const AdBadge = styled.View`
  position: absolute;
  top: -4px;
  left: -4px;
  background-color: #3B82F6; /* Blue-ish */
  padding-horizontal: 4px;
  padding-vertical: 2px;
  border-radius: 4px;
`;

const AdText = styled.Text`
  color: white;
  font-size: 9px;
  font-weight: bold;
`;

const AppName = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_500Medium';
  font-size: 11px;
  text-align: center;
  line-height: 14px;
`;

export const OtherAppsCarousel = () => {
  const { t, i18n } = useTranslation();
  const [apps, setApps] = useState<OtherApp[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await fetchOtherApps(i18n.language);
      if (mounted) setApps(data);
    };
    load();
    return () => { mounted = false; };
  }, [i18n.language]);

  if (apps.length === 0) return null;

  return (
    <Container>
      <SectionTitle>{t('settings.otherApps')}</SectionTitle>
      <FlatList
        horizontal
        data={apps}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8 }}
        renderItem={({ item }) => (
          <AppItem onPress={() => Linking.openURL(item.link)}>
            <AppIconContainer>
              <AppIcon source={{ uri: item.imageLink }} resizeMode="cover" />
              <AdBadge><AdText>AD</AdText></AdBadge>
            </AppIconContainer>
            <AppName numberOfLines={3}>{item.name}</AppName>
          </AppItem>
        )}
      />
    </Container>
  );
};

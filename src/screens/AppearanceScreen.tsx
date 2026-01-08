import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import styled, { useTheme } from 'styled-components/native'; // Styled Components theme
import { useTheme as useAppTheme } from '../theme/ThemeContext'; // App Logic
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Type } from 'lucide-react-native';

const Container = styled(LinearGradient)`
  flex: 1;
`;

const Content = styled.ScrollView`
  padding: 24px;
`;

const Header = styled.View`
  padding-top: 60px;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 32px;
`;

const Section = styled.View`
  margin-bottom: 32px;
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 18px;
  margin-bottom: 16px;
`;

// -- Theme Grid --
const ThemeGrid = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
`;

const ThemeCard = styled.TouchableOpacity<{ isSelected: boolean }>`
    width: 100%; /* For now full width or 48% */
    border-radius: 12px;
    border-width: 2px;
    border-color: ${props => props.isSelected ? props.theme.colors.gold : 'transparent'};
    overflow: hidden;
    position: relative;
    margin-bottom: 12px;
`;

const ThemePreview = styled(LinearGradient)`
    height: 80px;
    padding: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const ThemeName = styled.Text<{ isSelected: boolean }>`
    color: #fff; /* Always white on gradient */
    font-family: 'Manrope_700Bold';
    font-size: 16px;
`;

const CheckCircle = styled.View`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: ${props => props.theme.colors.gold};
    align-items: center;
    justify-content: center;
`;

// -- Text Size --
const SizeOption = styled.TouchableOpacity<{ isSelected: boolean }>`
    flex-direction: row;
    align-items: center;
    padding: 16px;
    background-color: ${props => props.theme.colors.surface};
    border-radius: 12px;
    border-width: 1px;
    border-color: ${props => props.isSelected ? props.theme.colors.gold : props.theme.colors.border};
    margin-bottom: 8px;
`;

const SizeLabel = styled.Text`
    color: ${props => props.theme.colors.text};
    font-family: 'Manrope_600SemiBold';
    font-size: 16px;
    margin-left: 12px;
    flex: 1;
`;

export default function AppearanceScreen() {
    const theme = useTheme(); // Styled theme
    const { themeId, setThemeId, availableThemes, textSize, setTextSize } = useAppTheme(); // Logic

    return (
        <Container colors={theme.colors.background as any}>
            <Content>
                <Header>
                    <Title>Appearance</Title>
                </Header>

                <Section>
                    <SectionTitle>App Theme</SectionTitle>
                    <ThemeGrid>
                        {availableThemes.map((t) => (
                            <ThemeCard
                                key={t.id}
                                isSelected={themeId === t.id}
                                onPress={() => setThemeId(t.id)}
                            >
                                <ThemePreview colors={t.theme.colors.background as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                    <ThemeName isSelected={themeId === t.id}>{t.name}</ThemeName>
                                    {themeId === t.id && (
                                        <CheckCircle>
                                            <Check size={14} color="#fff" strokeWidth={3} />
                                        </CheckCircle>
                                    )}
                                </ThemePreview>
                            </ThemeCard>
                        ))}
                    </ThemeGrid>
                </Section>

                <Section>
                    <SectionTitle>Text Size</SectionTitle>
                    <SizeOption isSelected={textSize === 'medium'} onPress={() => setTextSize('medium')}>
                        <Type size={20} color={theme.colors.text} />
                        <SizeLabel>Medium (Default)</SizeLabel>
                        {textSize === 'medium' && <Check size={20} color={theme.colors.gold} />}
                    </SizeOption>
                    <SizeOption isSelected={textSize === 'large'} onPress={() => setTextSize('large')}>
                        <Type size={24} color={theme.colors.text} />
                        <SizeLabel style={{ fontSize: 18 }}>Large</SizeLabel>
                        {textSize === 'large' && <Check size={20} color={theme.colors.gold} />}
                    </SizeOption>
                </Section>

                <View style={{ height: 100 }} />
            </Content>
        </Container>
    );
}

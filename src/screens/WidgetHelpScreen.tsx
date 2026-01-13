
import React from 'react';
import styled from 'styled-components/native';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

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

const StepRow = styled.View`
  flex-direction: row;
  margin-bottom: 24px;
  padding-right: 16px;
`;

const StepCircle = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => props.theme.colors.surface};
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const StepNumber = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-family: 'Manrope_700Bold';
  font-size: 14px;
`;

const StepText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_400Regular';
  font-size: 16px;
  flex: 1;
  line-height: 24px;
`;

export default function WidgetHelpScreen() {
  // @ts-ignore
  const theme = styled.useTheme ? styled.useTheme() : { colors: { background: ['#000', '#000'], text: '#fff' } };

  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();

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
        <HeaderTitle>{t('widget.howToAdd')}</HeaderTitle>
        <View style={{ width: 40 }} />
      </Header>

      <Content>
        <Section>
          {[1, 2, 3, 4, 5].map((step) => (
            <StepRow key={step}>
              <StepCircle>
                <StepNumber>{step}</StepNumber>
              </StepCircle>
              <StepText>
                {t(`widget.step${step}`)}
              </StepText>
            </StepRow>
          ))}
        </Section>
      </Content>
    </Container>
  );
}

import React from 'react';
import { Modal, TouchableOpacity, Text, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useRateApp } from '../hooks/useRateApp';

// --- Styles ---
const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const DialogContainer = styled.View`
  width: 100%;
  max-width: 400px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 20px;
  padding: 24px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 20px;
  text-align: center;
  margin-bottom: 12px;
`;

const Message = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_400Regular';
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  margin-bottom: 24px;
`;

const ButtonStack = styled.View`
  width: 100%;
  gap: 12px;
`;

const ActionButton = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' | 'ghost' }>`
  width: 100%;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  background-color: ${props =>
    props.variant === 'primary' ? props.theme.colors.primary :
      props.variant === 'secondary' ? props.theme.colors.surface :
        'transparent'};
  border-width: ${props => props.variant === 'secondary' ? '1px' : '0px'};
  border-color: ${props => props.variant === 'secondary' ? props.theme.colors.border : 'transparent'};
`;

const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' | 'ghost' }>`
  color: ${props =>
    props.variant === 'primary' ? '#fff' :
      props.variant === 'ghost' ? props.theme.colors.textSub :
        props.theme.colors.text};
  font-family: 'Manrope_600SemiBold';
  font-size: 16px;
`;

export default function RateAppDialog() {
  const { isVisible, handleYes, handleLater, handleNo, loading } = useRateApp();
  const theme = useTheme();
  const { t } = useTranslation();

  // If loading or not visible, return nothing (or null)
  if (loading || !isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      hardwareAccelerated
    >
      <Overlay>
        <DialogContainer>
          <Title>{t('rate.title')}</Title>
          <Message>{t('rate.message')}</Message>

          <ButtonStack>
            <ActionButton variant="primary" onPress={handleYes}>
              <ButtonText variant="primary">{t('rate.yes')}</ButtonText>
            </ActionButton>

            <ActionButton variant="secondary" onPress={handleLater}>
              <ButtonText variant="secondary">{t('rate.later')}</ButtonText>
            </ActionButton>

            <ActionButton variant="ghost" onPress={handleNo}>
              <ButtonText variant="ghost">{t('rate.no')}</ButtonText>
            </ActionButton>
          </ButtonStack>
        </DialogContainer>
      </Overlay>
    </Modal>
  );
}

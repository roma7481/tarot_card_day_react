import React, { useState, useEffect } from 'react';
import { Modal, KeyboardAvoidingView, Platform, TouchableOpacity, View, ScrollView } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { X, Check, Plus, ArrowRight, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { getCardImage } from '../utils/cardImageMapping';

interface JournalModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string, mood?: string) => void;
  initialText?: string;
  cardName: string;
  cardId: string;
  cardDescription: string;
}

// --- Styled Components ---

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6); /* Dark overlay */
  justify-content: center;
  align-items: center;
`;

const Container = styled(LinearGradient).attrs(props => ({
  colors: props.theme.colors.background,
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 }
}))`
  width: 100%;
  height: 90%;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 24px;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.1);
  background-color: rgba(20, 20, 20, 0.95);
  z-index: 20;
`;

const HeaderTitleContainer = styled.View`
  align-items: center;
`;

const HeaderSubtitle = styled.Text`
  color: ${props => props.theme.colors.gold};
  font-family: 'Manrope_600SemiBold';
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 2px;
`;

const HeaderDate = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 14px;
`;

const CloseButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

// -- Card Snippet --
const CardSnippet = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 32px;
`;

const MiniCardImage = styled.Image`
  width: 48px;
  height: 72px;
  border-radius: 6px;
  margin-right: 16px;
  background-color: #000;
`;

const SnippetTextContainer = styled.View`
  flex: 1;
`;

const SnippetTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 16px;
`;



// -- Reflection Section --
const ReflectionContainer = styled.View`
  margin-bottom: 24px;
`;

const ReflectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
`;

const ReflectionLabel = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-family: 'Manrope_700Bold';
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const QuestionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 8px;
`;

const PromptText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_400Regular';
  font-size: 14px;
  line-height: 22px;
  opacity: 0.8;
`;

// ... (imports remain)

// -- Input --
const InputContainer = styled.View`
  position: relative;
  min-height: 300px;
  margin-bottom: 100px; /* Space for fixed button */
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-family: 'Manrope_400Regular';
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  line-height: 26px;
  text-align-vertical: top;
  padding-left: 16px;
  border-left-width: 2px;
  border-left-color: rgba(255, 255, 255, 0.2);
`;

// -- Bottom Action --
const Footer = styled(LinearGradient).attrs(props => ({
  colors: [
    'transparent',
    props.theme.colors.background[0] || '#000',
    props.theme.colors.background[0] || '#000'
  ],
  locations: [0, 0.3, 1]
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  padding-top: 48px;
`;

const SaveButton = styled.TouchableOpacity`
  width: 100%;
  height: 56px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  shadow-color: ${props => props.theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
`;

const SaveButtonText = styled.Text`
  color: #fff;
  font-family: 'Manrope_700Bold';
  font-size: 18px;
`;

export const JournalModal: React.FC<JournalModalProps> = ({
  visible, onClose, onSave, initialText = '', cardName, cardId, cardDescription
}) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const [text, setText] = useState(initialText);

  // Reset when opening
  useEffect(() => {
    if (visible) {
      console.log('JournalModal opened with initialText:', initialText);
      setText(initialText);
    }
  }, [visible, initialText]);

  const handleSave = () => {
    onSave(text, undefined);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <Container>
          <Header>
            <CloseButton onPress={onClose}>
              <X color={theme.colors.textSub} size={24} />
            </CloseButton>
            <HeaderTitleContainer>
              <HeaderSubtitle>{t('journal.dailyReading')}</HeaderSubtitle>
              <HeaderDate>{new Date().toLocaleDateString(i18n.language, { month: 'long', day: 'numeric', year: 'numeric' })}</HeaderDate>
            </HeaderTitleContainer>
            <View style={{ width: 40 }} />
          </Header>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <Content>
              <CardSnippet>
                <MiniCardImage source={getCardImage(cardId, i18n.language)} resizeMode="cover" />
                <SnippetTextContainer>
                  <SnippetTitle>{cardName}</SnippetTitle>
                </SnippetTextContainer>
              </CardSnippet>

              <ReflectionContainer>
                <ReflectionHeader>
                  <Sparkles size={16} color={theme.colors.primary} />
                  <ReflectionLabel>{t('journal.reflection')}</ReflectionLabel>
                </ReflectionHeader>
                <QuestionText>{t('journal.reflectionQuestion')}</QuestionText>
                <PromptText>{t('journal.reflectionPrompt', { cardName })}</PromptText>
              </ReflectionContainer>

              <InputContainer>
                <StyledInput
                  multiline
                  placeholder={t('journal.placeholder')}
                  placeholderTextColor={theme.colors.textSub}
                  value={text}
                  onChangeText={setText}
                />
              </InputContainer>
            </Content>

            <Footer pointerEvents="box-none">
              <SaveButton onPress={handleSave}>
                <SaveButtonText>{t('journal.saveEntry')}</SaveButtonText>
                <ArrowRight color="#fff" size={20} />
              </SaveButton>
            </Footer>

          </KeyboardAvoidingView>
        </Container>
      </ModalOverlay>
    </Modal>
  );
};

import { Modal, TouchableWithoutFeedback, View, TouchableOpacity, Text, Platform } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Copy, Share2, Save, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: flex-end;
  padding-bottom: ${Platform.OS === 'ios' ? '40px' : '20px'};
`;

const ContentContainer = styled(LinearGradient)`
  margin-horizontal: 16px;
  border-radius: 24px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 18px 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const ActionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_600SemiBold';
  font-size: 16px;
  margin-left: 16px;
`;

const CancelButton = styled.TouchableOpacity`
  margin-top: 12px;
  margin-horizontal: 16px;
  background-color: ${props => props.theme.colors.surface};
  padding: 18px;
  border-radius: 16px;
  align-items: center;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const CancelText = styled.Text`
  color: ${props => props.theme.colors.error || '#ef4444'};
  font-family: 'Manrope_700Bold';
  font-size: 16px;
`;

interface MessageOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onCopy: () => void;
    onShare: () => void;
    onSave: () => void;
}

export const MessageOptionsModal = ({ visible, onClose, onCopy, onShare, onSave }: MessageOptionsModalProps) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const gradientColors = (theme.colors.card === '#ffffff' || theme.colors.card === '#FFFFFF')
        ? ['#ffffff', '#f0f0f0']
        : ['#1E1E1E', '#121212'];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <Overlay>
                    <TouchableWithoutFeedback>
                        <View>
                            <ContentContainer colors={gradientColors as any} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
                                <ActionButton onPress={() => { onCopy(); onClose(); }}>
                                    <Copy size={20} color={theme.colors.textSub || "#A0A0A0"} />
                                    <ActionText>{t('chat.copy')}</ActionText>
                                </ActionButton>
                                <ActionButton onPress={() => { onShare(); onClose(); }}>
                                    <Share2 size={20} color={theme.colors.textSub || "#A0A0A0"} />
                                    <ActionText>{t('chat.share')}</ActionText>
                                </ActionButton>
                                <ActionButton onPress={() => { onSave(); onClose(); }}>
                                    <Save size={20} color={theme.colors.textSub || "#A0A0A0"} />
                                    <ActionText>{t('chat.saveNote')}</ActionText>
                                </ActionButton>
                            </ContentContainer>

                            <CancelButton onPress={onClose} activeOpacity={0.8}>
                                <CancelText>{t('common.cancel')}</CancelText>
                            </CancelButton>
                        </View>
                    </TouchableWithoutFeedback>
                </Overlay>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

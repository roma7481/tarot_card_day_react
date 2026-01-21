import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Share,
    Alert,
    Keyboard,
    LayoutAnimation,
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Bot, ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTarotData } from '../hooks/useTarotData';
import { useTarotDatabase } from '../hooks/useTarotDatabase';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { functions, httpsCallable } from '../services/FirebaseService';
import * as Clipboard from 'expo-clipboard';
import { useChat, Message } from '../contexts/ChatContext';
import { useNotes } from '../hooks/useNotes';
import { useCanAccessNotes } from '../hooks/useCanAccessNotes';
import { MessageOptionsModal } from '../components/MessageOptionsModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TipText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-size: 12px;
  text-align: center;
  margin-top: 16px;
  font-style: italic;
  opacity: 0.7;
`;

const SuggestionChip = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.surface};
  padding-horizontal: 16px;
  padding-vertical: 8px;
  border-radius: 20px;
  margin-right: 8px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const SuggestionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const Container = styled(LinearGradient)`
  flex: 1;
`;

const Header = styled.View`
  padding-top: 60px;
  padding-bottom: 16px;
  padding-horizontal: 24px;
  flex-direction: row;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-bottom-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 16px;
  padding: 4px;
`;

const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 20px;
  flex: 1;
  text-align: center;
`;

const ChatArea = styled.View`
  flex: 1;
`;

// -- Message Bubbles --
const MessageRow = styled.View<{ isUser: boolean }>`
  flex-direction: row;
  justify-content: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  padding: 8px 16px;
  margin-bottom: 8px;
`;

const Bubble = styled.TouchableOpacity<{ isUser: boolean }>`
  background-color: ${props => (props.isUser ? props.theme.colors.primary : props.theme.colors.surface)};
  padding: 12px 16px;
  border-radius: 20px;
  border-bottom-right-radius: ${props => (props.isUser ? '4px' : '20px')};
  border-bottom-left-radius: ${props => (!props.isUser ? '4px' : '20px')};
  max-width: 80%;
  border-width: 1px;
  border-color: ${props => (props.isUser ? 'transparent' : props.theme.colors.border)};
`;

const MessageText = styled.Text<{ isUser: boolean }>`
  color: ${props => (props.isUser ? '#fff' : props.theme.colors.text)};
  font-family: 'Manrope_500Medium';
  font-size: 15px;
  line-height: 22px;
`;

const Avatar = styled.View<{ isUser?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  align-items: center;
  justify-content: center;
  margin-right: ${props => (props.isUser ? 0 : 8)}px;
  margin-left: ${props => (props.isUser ? 8 : 0)}px;
`;

// -- Input Area --
const InputContainer = styled.View`
  padding: 16px;
  background-color: ${props => props.theme.colors.surface};
  border-top-width: 1px;
  border-color: ${props => props.theme.colors.border};
  flex-direction: row;
  align-items: center;
`;

const InputField = styled.TextInput`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 12px 20px;
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_500Medium';
  margin-right: 12px;
  max-height: 100px;
`;

const SendButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${props => props.theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export default function ChatScreen() {
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<any, 'Chat'>>();
    const { cardId: paramCardId, cardName: paramCardName } = route.params || {};

    const { t, i18n } = useTranslation();
    const { dailyCard, loading } = useTarotData();

    // Determine active card ID (param > daily)
    const activeCardId = paramCardId || dailyCard?.id;
    const isReady = activeCardId && !loading;
    const { getCardInterpretation } = useTarotDatabase();

    // Contexts
    const { getMessages, addMessage } = useChat();
    const { addNote } = useNotes();

    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const [cardName, setCardName] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    // Android-only: fallback to avoid keyboard overlay even if resize doesn't work
    const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);

    // NEW: track keyboard open/close to add a small extra "breathing" padding
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    // Use activeCardId instead of dailyCard.id
    const messages = activeCardId ? getMessages(activeCardId) : [];
    const insets = useSafeAreaInsets();

    // Better iOS offset: depends on safe-area + your header layout
    const keyboardOffsetIOS = useMemo(() => {
        // Header paddingTop = max(insets.top, 20) + 10
        // Plus the header row height (back button + title row). 56 is a safe default.
        return Math.max(insets.top, 20) + 10 + 56;
    }, [insets.top]);

    // FlatList needs extra bottom space so last msg isn't hidden behind chips+input
    const listBottomPadding = useMemo(() => {
        const chipsHeight = isTyping ? 0 : 50;
        const inputApproxHeight = 76; // 16 padding top/bottom + button height etc.
        const safeBottom = Math.max(insets.bottom, 16);
        return 16 + chipsHeight + inputApproxHeight + safeBottom;
    }, [insets.bottom, isTyping]);

    useEffect(() => {
        const load = async () => {
            if (loading && !paramCardId) return;

            if (paramCardName) {
                setCardName(paramCardName);
            } else if (activeCardId) {
                // If we have an ID but no name (e.g. daily, or passed ID only), fetch name
                const data = await getCardInterpretation(activeCardId);
                setCardName(data?.name || (dailyCard?.id === activeCardId ? (dailyCard?.name || '') : ''));
            } else {
                setCardName(t('chat.fallback'));
            }
        };
        load();
    }, [activeCardId, paramCardId, paramCardName, dailyCard, loading, i18n.language]);

    // Initial Greeting
    useEffect(() => {
        if (!isReady || !activeCardId) return;
        const currentMsgs = getMessages(activeCardId);

        if (cardName && currentMsgs.length === 0) {
            addMessage(activeCardId, {
                id: 'init',
                text: t('chat.init', { cardName }),
                isUser: false,
                timestamp: Date.now(),
            });
        }
    }, [cardName, isReady, activeCardId, getMessages, addMessage, t]);

    // Android fallback keyboard height (prevents overlay even if adjustResize isn't active)
    // + set isKeyboardOpen so we can add a small padding when keyboard is visible
    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsKeyboardOpen(true);

            if (Platform.OS === 'android') {
                setAndroidKeyboardHeight(e.endCoordinates?.height ?? 0);
            }

            requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
        });

        const hide = Keyboard.addListener('keyboardDidHide', () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsKeyboardOpen(false);

            if (Platform.OS === 'android') {
                setAndroidKeyboardHeight(0);
            }

            requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    const handleLongPress = (msg: Message) => {
        setSelectedMessage(msg);
    };

    const handleCopy = async () => {
        if (selectedMessage) {
            await Clipboard.setStringAsync(selectedMessage.text);
            setSelectedMessage(null);
        }
    };

    const handleShare = async () => {
        if (selectedMessage) {
            await Share.share({ message: selectedMessage.text });
            setSelectedMessage(null);
        }
    };

    const { canAccess } = useCanAccessNotes();

    const handleSaveNote = () => {
        if (!canAccess) {
            navigation.navigate('Paywall' as never);
            return;
        }

        if (selectedMessage && activeCardId) {
            addNote(activeCardId, selectedMessage.text, () => Alert.alert('Saved', 'Note saved to journal.'));
            setSelectedMessage(null);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !activeCardId) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: Date.now(),
        };

        addMessage(activeCardId, userMsg);
        const question = inputText;
        setInputText('');
        setIsTyping(true);

        requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));

        try {
            const currentLang = i18n.language || 'en';
            const langName = currentLang === 'ru' ? 'Russian' : currentLang === 'es' ? 'Spanish' : 'English';

            const askOracleFunc = httpsCallable(functions, 'askOracle');
            const result = await askOracleFunc({
                cardName: cardName,
                question: question,
                language: currentLang,
            });

            const data = result.data as any;
            const responseText = data.answer || t('chat.errorFallback') || 'The Oracle is meditating. Please try again.';

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                isUser: false,
                timestamp: Date.now(),
            };
            addMessage(activeCardId, botMsg);

            requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
        } catch (error) {
            console.error('Oracle Error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: t('chat.errorFallback') || 'The stars are clouded. I cannot answer right now.',
                isUser: false,
                timestamp: Date.now(),
            };
            addMessage(activeCardId, errorMsg);

            requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
        } finally {
            setIsTyping(false);
        }
    };

    // NEW: small extra padding when keyboard is open (tweak 8 -> 6/10/12 as you like)
    const extraInputPadding = isKeyboardOpen ? 8 : 0;

    // Keep your original baseline bottom padding logic
    const baseInputBottomPadding = Platform.OS === 'android' ? 16 : Math.max(insets.bottom, 16);

    return (
        <Container colors={theme.colors.background as any}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardOffsetIOS : 0}
            >
                <Header style={{ paddingTop: Math.max(insets.top, 20) + 10 }}>
                    <BackButton onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={theme.colors.text} />
                    </BackButton>
                    <Title>{t('chat.title')}</Title>
                    <View style={{ width: 28 }} />
                </Header>

                <ChatArea>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ padding: 16, paddingBottom: listBottomPadding }}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        renderItem={({ item }) => (
                            <MessageRow isUser={item.isUser}>
                                {!item.isUser && (
                                    <Avatar>
                                        <Bot size={16} color={theme.colors.textSub} />
                                    </Avatar>
                                )}
                                <Bubble isUser={item.isUser} onLongPress={() => handleLongPress(item)} delayLongPress={500}>
                                    <MessageText isUser={item.isUser}>{item.text}</MessageText>
                                </Bubble>
                            </MessageRow>
                        )}
                        ListFooterComponent={
                            <View style={{ paddingBottom: 20 }}>
                                {isTyping && (
                                    <MessageRow isUser={false}>
                                        <Avatar>
                                            <Bot size={16} color={theme.colors.textSub} />
                                        </Avatar>
                                        <MessageText
                                            isUser={false}
                                            style={{ color: theme.colors.textSub, marginLeft: 8, fontStyle: 'italic' }}
                                        >
                                            {t('chat.typing')}
                                        </MessageText>
                                    </MessageRow>
                                )}
                                <TipText>{t('chat.tip', { defaultValue: 'Tip: Long press a message to save or share' })}</TipText>
                            </View>
                        }
                    />
                </ChatArea>

                {/* Bottom area wrapper: Android keyboard-height padding fallback prevents overlay */}
                <View style={{ paddingBottom: Platform.OS === 'android' ? androidKeyboardHeight : 0 }}>
                    {/* Suggestion Chips */}
                    {!isTyping && (
                        <View style={{ height: 50 }}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
                            >
                                {['general', 'love', 'career', 'action'].map((key) => (
                                    <SuggestionChip
                                        key={key}
                                        onPress={() => {
                                            const text = t(`chat.suggestions.${key}`);
                                            setInputText(text);
                                            requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
                                        }}
                                    >
                                        <SuggestionText>{t(`chat.suggestions.${key}`)}</SuggestionText>
                                    </SuggestionChip>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* UPDATED: add small extra bottom padding when keyboard is open */}
                    <InputContainer style={{ paddingBottom: baseInputBottomPadding + extraInputPadding }}>
                        <InputField
                            placeholder={t('chat.placeholder')}
                            placeholderTextColor={theme.colors.textSub}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <SendButton onPress={handleSend}>
                            <Send size={20} color="#fff" />
                        </SendButton>
                    </InputContainer>
                </View>
            </KeyboardAvoidingView>

            <MessageOptionsModal
                visible={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                onCopy={handleCopy}
                onShare={handleShare}
                onSave={handleSaveNote}
            />
        </Container>
    );
}

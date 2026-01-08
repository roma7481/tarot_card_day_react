import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Bot, User, ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTarotData } from '../hooks/useTarotData';
import { useTarotDatabase, LocalizedCardData } from '../hooks/useTarotDatabase';
import { useNavigation } from '@react-navigation/native';
import { functions, httpsCallable } from '../services/FirebaseService';

const Container = styled(LinearGradient)`
  flex: 1;
`;

const Header = styled.View`
  padding-top: 60px;
  padding-bottom: 16px;
  padding-horizontal: 24px;
  flex-direction: row;
  align-items: center;
  background-color: rgba(0,0,0,0.2);
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
    justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
    padding: 8px 16px;
    margin-bottom: 8px;
`;

const Bubble = styled.View<{ isUser: boolean }>`
    background-color: ${props => props.isUser ? props.theme.colors.primary : props.theme.colors.surface};
    padding: 12px 16px;
    border-radius: 20px;
    border-bottom-right-radius: ${props => props.isUser ? '4px' : '20px'};
    border-bottom-left-radius: ${props => !props.isUser ? '4px' : '20px'};
    max-width: 80%;
    border-width: 1px;
    border-color: ${props => props.isUser ? 'transparent' : props.theme.colors.border};
`;

const MessageText = styled.Text<{ isUser: boolean }>`
    color: ${props => props.isUser ? '#fff' : props.theme.colors.text};
    font-family: 'Manrope_500Medium';
    font-size: 15px;
    line-height: 22px;
`;

const Avatar = styled.View`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-color: rgba(255,255,255,0.1);
    align-items: center;
    justify-content: center;
    margin-right: ${props => props.isUser ? 0 : 8}px;
    margin-left: ${props => props.isUser ? 8 : 0}px;
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
    background-color: rgba(255,255,255,0.05);
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

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: number;
}

export default function ChatScreen() {
    const theme = useTheme();
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const { dailyCard, loading } = useTarotData();
    const { getCardInterpretation } = useTarotDatabase();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const [cardName, setCardName] = useState('');

    useEffect(() => {
        const load = async () => {
            if (loading) return; // Wait for data

            if (dailyCard) {
                const data = await getCardInterpretation(dailyCard.id);
                setCardName(data?.name || dailyCard.name);
            } else {
                setCardName(t('chat.fallback'));
            }
        };
        load();
    }, [dailyCard, loading, i18n.language]);

    // Initial Greeting
    useEffect(() => {
        if (loading) return;
        if (cardName && messages.length === 0) {
            setMessages([{
                id: 'init',
                text: t('chat.init', { cardName }),
                isUser: false,
                timestamp: Date.now()
            }]);
        }
    }, [cardName, messages.length, loading, t]);

    // ...

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        const question = inputText; // Capture for closure
        setInputText('');
        setIsTyping(true);

        try {
            console.log("Calling askOracle function...");
            const askOracleFunc = httpsCallable(functions, 'askOracle');
            const result = await askOracleFunc({
                cardName: cardName,
                question: question
            });

            const data = result.data as any;
            const responseText = data.answer || t('chat.errorFallback') || "The Oracle is meditating. Please try again.";

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                isUser: false,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Oracle Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: t('chat.errorFallback') || "The stars are clouded. I cannot answer right now.",
                isUser: false,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <Container colors={theme.colors.background as any}>
            <Header>
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
                    contentContainerStyle={{ padding: 16 }}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    renderItem={({ item }) => (
                        <MessageRow isUser={item.isUser}>
                            {!item.isUser && <Avatar><Bot size={16} color={theme.colors.textSub} /></Avatar>}
                            <Bubble isUser={item.isUser}>
                                <MessageText isUser={item.isUser}>{item.text}</MessageText>
                            </Bubble>
                            {/* {item.isUser && <Avatar isUser><User size={16} color="#fff"/></Avatar>} */}
                        </MessageRow>
                    )}
                />
                {isTyping && (
                    <MessageRow isUser={false}>
                        <Avatar><Bot size={16} color={theme.colors.textSub} /></Avatar>
                        <MessageText isUser={false} style={{ color: theme.colors.textSub, marginLeft: 8, fontStyle: 'italic' }}>
                            {t('chat.typing')}
                        </MessageText>
                    </MessageRow>
                )}
            </ChatArea>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <InputContainer>
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
            </KeyboardAvoidingView>
        </Container>
    );
}

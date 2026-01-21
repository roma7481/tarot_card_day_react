import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import styled, { useTheme as useStyledTheme } from 'styled-components/native';
import Animated, {
    useSharedValue,
    withTiming,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    Share2,
    Sparkles,
    Heart,
    Briefcase,
    Banknote,
    Star,
    ChevronDown,
    Plus,
    Moon,
    Brain,
    Scale,
    Sun,
    Zap,
    Flame,
    Bot
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { TarotCard } from '../hooks/useTarotData';
import { getCardImage } from '../utils/cardImageMapping';
import { useTarotDatabase, LocalizedCardData } from '../hooks/useTarotDatabase';
import { useTheme } from '../theme/ThemeContext';
import { useNotes } from '../hooks/useNotes';
import { usePremium } from '../hooks/usePremium';
import { useCanAccessNotes } from '../hooks/useCanAccessNotes';
import { NoteItem } from './NoteItem';
import { JournalModal } from './JournalModal';
import { usePromoFlags } from '../hooks/usePromoFlags';

import { adService } from '../services/AdService';
import { NativeAdWrapper } from './ads/NativeAdWrapper';
import { analyticsService } from '../services/AnalyticsService';

// --- Types ---

interface Props {
    card: TarotCard;
    onBack: () => void;
    embed?: boolean;
}

// --- Icons Helper ---
const getCategoryIcon = (key: string, color: string) => {
    switch (key) {
        case 'general': return <Sparkles size={20} color={color} />;
        case 'love': return <Heart size={20} color={color} />;
        case 'career': return <Briefcase size={20} color={color} />;
        case 'finance': return <Banknote size={20} color={color} />;
        case 'health': return <Star size={20} color={color} />;
        case 'spirituality': return <Moon size={20} color={color} />;
        case 'advice': return <Brain size={20} color={color} />;
        case 'yes_no': return <Scale size={20} color={color} />;
        case 'astrology': return <Sun size={20} color={color} />;
        case 'reversed': return <Zap size={20} color={color} />;
        case 'personal': return <Flame size={20} color={color} />;
        default: return <Sparkles size={20} color={color} />;
    }
};

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
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_700Bold';
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.8;
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

const ContentScroll = styled(ScrollView).attrs({
    contentContainerStyle: { paddingBottom: 250 },
    showsVerticalScrollIndicator: false,
})`
  flex: 1;
`;

const HeroSection = styled.View`
  align-items: center;
  padding-vertical: 32px;
  padding-horizontal: 24px;
  width: 100%;
`;

const CardFrame = styled.View`
  width: 220px;
  height: 374px; 
  border-radius: 16px;
  overflow: hidden;
  background-color: #000;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const InnerGloss = styled(LinearGradient).attrs({
    colors: ['rgba(0,0,0,0.2)', 'rgba(255,255,255,0.1)'],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
})`
  position: absolute;
  inset: 0;
`;

const InnerBorder = styled(LinearGradient).attrs({
    colors: ['rgba(255,215,0,0.3)', 'rgba(255,215,0,0.1)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
})`
  position: absolute;
  inset: 0;
  border-radius: 16px; 
  opacity: 0.3;
`;

const CardTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_800ExtraBold';
  font-size: 32px;
  margin-bottom: 8px;
  text-align: center;
`;

const TagsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const TagText = styled.Text`
  color: ${props => props.theme.colors.gold};
  font-family: 'Manrope_600SemiBold';
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const DividerDot = styled(LinearGradient).attrs({
    colors: ['#FFD700', '#DAA520'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 }
})`
  width: 32px;
  height: 1px;
`;

const AccordionContainer = styled.View`
  padding-horizontal: 16px;
  gap: 12px;
  margin-top: 16px;
`;

const AccordionText = styled.Text<{ size: 'medium' | 'large' }>`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_400Regular';
  font-size: ${props => props.size === 'large' ? '20px' : '16px'};
  line-height: ${props => props.size === 'large' ? '30px' : '24px'};
  padding-horizontal: 18px;
  padding-bottom: 18px;
`;

const NotesContainer = styled.View`
  padding-horizontal: 16px;
  margin-top: 32px;
  margin-bottom: 100px;
`;

const NotesHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const NotesTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 20px;
`;

const AddNoteButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.1)'};
  padding-horizontal: 12px;
  padding-vertical: 8px;
  border-radius: 8px;
  gap: 6px;
`;

const AddNoteText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_600SemiBold';
  font-size: 14px;
`;

const ChatButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.primary};
    padding-vertical: 12px;
    padding-horizontal: 20px;
    border-radius: 24px;
    margin-top: 16px;
    align-self: center;
    gap: 8px;
    shadow-color: ${props => props.theme.colors.primary};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.3;
    shadow-radius: 8px;
    elevation: 4;
`;

const ChatButtonText = styled.Text`
    color: #fff;
    font-family: 'Manrope_700Bold';
    font-size: 16px;
`;

// --- Accordion Component ---

interface AccordionProps {
    title: string;
    icon: React.ReactNode;
    content: string | React.ReactNode;
    shareText?: string;
    isOpen?: boolean;
}

import { Share } from 'react-native';

// ...

const AccordionItem = ({ title, icon, content, shareText, isOpen: initialOpen = false }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const heightValue = useSharedValue(0);
    const rotateValue = useSharedValue(0);
    const theme = useStyledTheme();
    const { textSize } = useTheme();

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        heightValue.value = withTiming(!isOpen ? 1 : 0, { duration: 300 });
        rotateValue.value = withTiming(!isOpen ? 180 : 0, { duration: 300 });
    };

    const handleShare = async () => {
        try {
            const textToShare = shareText || (typeof content === 'string' ? content : '');
            if (!textToShare) return;

            await Share.share({
                message: `${title}\n\n${textToShare}`,
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    return (
        <View style={{
            backgroundColor: theme.colors.surface === '#ffffff' ? 'rgba(255,255,255,0.7)' : 'rgba(30, 41, 59, 0.4)',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            overflow: 'hidden'
        }}>
            <TouchableOpacity
                onPress={toggleOpen}
                activeOpacity={0.7}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 18
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    {icon}
                    <Text style={{
                        color: theme.colors.text,
                        fontFamily: 'Manrope_700Bold',
                        fontSize: 16,
                        flex: 1
                    }} numberOfLines={1}>{title}</Text>
                </View>
                <Animated.View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                    <ChevronDown color={theme.colors.gold} size={20} />
                </Animated.View>
            </TouchableOpacity>

            {isOpen && (
                <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
                    {typeof content === 'string' ? (
                        <AccordionText size={textSize}>
                            {content}
                        </AccordionText>
                    ) : (
                        content
                    )}
                    <View style={{ alignItems: 'flex-end', paddingRight: 18, paddingBottom: 12 }}>
                        <TouchableOpacity onPress={handleShare} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Share2 color={theme.colors.gold} size={18} />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

// --- Main Component ---

export const RevealedCard: React.FC<Props> = ({ card, onBack, embed = false }) => {
    const { top } = useSafeAreaInsets();
    const navigation = useNavigation();
    const theme = useStyledTheme();
    const { textSize } = useTheme();
    const { t, i18n } = useTranslation();
    const { getCardInterpretation, isReady } = useTarotDatabase();
    const [localizedData, setLocalizedData] = useState<LocalizedCardData | null>(null);
    const { flags, setPromoClicked } = usePromoFlags();

    const { notes, getNotesForCard, addNote, updateNote, deleteNote } = useNotes();
    const [isNoteModalVisible, setNoteModalVisible] = useState(false);
    const [currentNoteText, setCurrentNoteText] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (!isReady) return;
            try {
                const data = await getCardInterpretation(card.id);
                if (isMounted) {
                    setLocalizedData(data);
                }
            } catch (error) {
                console.warn("Failed to fetch localized card data:", error);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [card.id, i18n.language, isReady]);

    useEffect(() => {
        if (isReady) {
            getNotesForCard(card.id);
        }
    }, [card.id, isReady, getNotesForCard]);

    const { canAccess, loading: accessLoading } = useCanAccessNotes();
    const { isPremium } = usePremium();

    const handleAddNote = () => {
        if (!canAccess) {
            navigation.navigate('Paywall' as never);
            return;
        }
        setEditingNoteId(null);
        setCurrentNoteText('');
        setNoteModalVisible(true);
    };

    const handleEditNote = (note: any) => {
        console.log('Opening note (RevealedCard). Date:', note.date, 'TimeSaved:', note.timeSaved);
        if (!canAccess) {
            navigation.navigate('Paywall' as never);
            return;
        }
        setEditingNoteId(note.note_id);
        setCurrentNoteText(note.note);
        setNoteModalVisible(true);
    };

    const handleSaveNote = (text: string) => {
        if (!text.trim()) return;

        if (editingNoteId) {
            updateNote(editingNoteId, card.id, text, () => setNoteModalVisible(false));
        } else {
            addNote(card.id, text, () => setNoteModalVisible(false));
        }
    };

    const renderCategories = () => {
        if (localizedData) {
            const keys = Object.keys(localizedData).filter(key => key !== 'name' && localizedData[key as keyof LocalizedCardData]);
            const order = ['general', 'love', 'career', 'finance', 'health', 'personal', 'deep', 'advice', 'astrology'];
            const sortedKeys = keys.sort((a, b) => {
                const idxA = order.indexOf(a);
                const idxB = order.indexOf(b);
                if (idxA === -1 && idxB === -1) return 0;
                if (idxA === -1) return 1;
                if (idxB === -1) return -1;
                return idxA - idxB;
            });

            // Create mixed list with Ads
            const elements: React.ReactNode[] = [];
            sortedKeys.forEach((key, index) => {
                const textContent = localizedData[key as keyof LocalizedCardData] as string;
                let finalContent: React.ReactNode = textContent;

                if (key === 'general' && !flags.magic) {
                    finalContent = (
                        <View>
                            <AccordionText size={textSize}>{textContent}</AccordionText>
                            <View style={{ marginTop: 16, paddingHorizontal: 18, paddingBottom: 18 }}>
                                <Text style={{ color: theme.colors.textSub, fontFamily: 'Manrope_400Regular', fontSize: textSize === 'large' ? 20 : 16, lineHeight: textSize === 'large' ? 30 : 24 }}>
                                    {t('promo.magicText')}
                                    <Text
                                        style={{ color: theme.colors.gold, textDecorationLine: 'underline', fontFamily: 'Manrope_700Bold' }}
                                        onPress={() => {
                                            setPromoClicked('magic');
                                            analyticsService.logEvent('promo_link_click', { promo_name: 'tarot_magic' });
                                            Linking.openURL('https://play.google.com/store/apps/details?id=gadanie.dailymistika.ru.gadanie');
                                        }}
                                    >
                                        {t('promo.magicLink')}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    );
                } else if ((key === 'career' || key === 'health') && !flags.healing) {
                    finalContent = (
                        <View>
                            <AccordionText size={textSize}>{textContent}</AccordionText>
                            <View style={{ marginTop: 16, paddingHorizontal: 18, paddingBottom: 18 }}>
                                <Text style={{ color: theme.colors.textSub, fontFamily: 'Manrope_400Regular', fontSize: textSize === 'large' ? 20 : 16, lineHeight: textSize === 'large' ? 30 : 24 }}>
                                    {t('promo.healingText')}
                                    <Text
                                        style={{ color: theme.colors.gold, textDecorationLine: 'underline', fontFamily: 'Manrope_700Bold' }}
                                        onPress={() => {
                                            setPromoClicked('healing');
                                            analyticsService.logEvent('promo_link_click', { promo_name: 'healing_sounds' });
                                            Linking.openURL('https://play.google.com/store/apps/details?id=com.dailymistika.healingsounds');
                                        }}
                                    >
                                        {t('promo.healingLink')}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    );
                } else if (key === 'love' && Platform.OS === 'android' && !flags.astrology) {
                    finalContent = (
                        <View>
                            <AccordionText size={textSize}>{textContent}</AccordionText>
                            <View style={{ marginTop: 16, paddingHorizontal: 18, paddingBottom: 18 }}>
                                <Text style={{ color: theme.colors.textSub, fontFamily: 'Manrope_400Regular', fontSize: textSize === 'large' ? 20 : 16, lineHeight: textSize === 'large' ? 30 : 24 }}>
                                    {t('promo.astrologyText')}
                                    <Text
                                        style={{ color: theme.colors.gold, textDecorationLine: 'underline', fontFamily: 'Manrope_700Bold' }}
                                        onPress={() => {
                                            setPromoClicked('astrology');
                                            analyticsService.logEvent('promo_link_click', { promo_name: 'astrology_transits' });
                                            Linking.openURL('https://play.google.com/store/apps/details?id=com.cbeeapps.aiastrology');
                                        }}
                                    >
                                        {t('promo.astrologyLink')}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    );
                }

                elements.push(
                    <AccordionItem
                        key={key}
                        title={t(`card.${key}`)}
                        icon={getCategoryIcon(key, theme.colors.gold)}
                        content={finalContent}
                        shareText={textContent}
                        isOpen={index === 0}
                    />
                );

                // Inject Ad every 3 items looks like a category card
                if ((index + 1) % 3 === 0) {
                    elements.push(
                        <NativeAdWrapper
                            key={`ad-${index}`}
                            variant="default"
                            containerStyle={{ marginHorizontal: 0, marginTop: 4, marginBottom: 4 }}
                        />
                    );
                }
            });

            return elements;
        }

        return (
            <AccordionItem
                title={t('card.general')}
                icon={<Sparkles size={20} color={theme.colors.gold} />}
                content={card.description || ''}
                isOpen={true}
            />
        );
    };

    const contentContent = (
        <>
            {!embed && (
                <Header style={{ marginTop: top }}>
                    <IconButton onPress={() => {
                        onBack();
                    }}>
                        <ArrowLeft color={theme.colors.icon} size={20} />
                    </IconButton>

                </Header>
            )}

            <ContentScroll>
                <HeroSection>
                    <CardFrame>
                        <CardImage source={getCardImage(card.id, i18n.language)} resizeMode="cover" />
                        <InnerGloss colors={['transparent', 'transparent']} />
                        <InnerBorder colors={['transparent', 'transparent']} />
                    </CardFrame>

                    <CardTitle>{localizedData ? localizedData.name : card.name}</CardTitle>
                    <TagsRow>
                        <DividerDot colors={['#FFD700', '#DAA520']} />
                        <TagText style={{ marginHorizontal: 8 }}>{t('tags.intuition')} • {t('tags.mystery')}</TagText>
                        <DividerDot colors={['#FFD700', '#DAA520']} />
                    </TagsRow>

                    <ChatButton onPress={() => {
                        if (!isPremium) {
                            navigation.navigate('Paywall' as never);
                        } else {
                            navigation.navigate('Chat' as never, {
                                cardId: card.id,
                                cardName: localizedData ? localizedData.name : card.name
                            } as never);
                        }
                    }}>
                        <Bot size={20} color="#fff" />
                        <ChatButtonText>{t('main.askOracle')}</ChatButtonText>
                    </ChatButton>
                </HeroSection>

                <AccordionContainer>
                    {renderCategories()}
                </AccordionContainer>

                <NotesContainer>
                    <NotesHeader>
                        <NotesTitle>{t('card.notes') || 'My Notes'}</NotesTitle>
                        <AddNoteButton onPress={handleAddNote}>
                            <Plus size={16} color={theme.colors.text} />
                            <AddNoteText>{t('notes.addNote') || 'Add Note'}</AddNoteText>
                        </AddNoteButton>
                    </NotesHeader>

                    {notes && notes.length > 0 ? (
                        notes.map(note => (
                            <NoteItem
                                key={note.note_id}
                                note={note}
                                onEdit={handleEditNote}
                                onDelete={(id) => deleteNote(id, card.id)}
                            />
                        ))
                    ) : (
                        <Text style={{ color: theme.colors.textSub, textAlign: 'center', marginTop: 20 }}>
                            {t('notes.noNotes') || 'No notes yet. Start writing...'}
                        </Text>
                    )}
                </NotesContainer>

                <View style={{ marginBottom: 40 }}>
                    <NativeAdWrapper variant="default" containerStyle={{ marginHorizontal: 0 }} />
                </View>
            </ContentScroll>

            <JournalModal
                visible={isNoteModalVisible}
                onClose={() => setNoteModalVisible(false)}
                onSave={handleSaveNote}
                initialText={currentNoteText}
                cardName={localizedData ? localizedData.name : card.name}
                cardId={card.id}
                cardDescription={card.description}
            />
        </>
    );

    if (embed) {
        return <View style={{ flex: 1 }}>{contentContent}</View>;
    }

    return (
        <Container
            colors={(theme?.colors?.background || ['#000000', '#000000']) as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {contentContent}
        </Container>
    );

};

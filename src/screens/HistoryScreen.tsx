import React, { useEffect, useState, useMemo } from 'react';
import styled, { useTheme as useStyledTheme } from 'styled-components/native';
import { View, Text, SectionList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Clock, ArrowLeft, Filter, Layers, Zap } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useHistory, DailyDraw } from '../hooks/useHistory';
import { getCardImage } from '../utils/cardImageMapping';
// import cardsData from '../data/cards.json'; // Removed static data dependency
import { RevealedCard } from '../components/RevealedCard';
import { TarotCard } from '../hooks/useTarotData';
import { useTarotDatabase } from '../hooks/useTarotDatabase';
import { adService } from '../services/AdService';
import { usePremium } from '../hooks/usePremium';

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

const Subtitle = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_400Regular';
  font-size: 14px;
  margin-top: 4px;
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

const ListContainer = styled.View`
  flex: 1;
`;

const HistoryItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? '#ffffff' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  margin-horizontal: 16px; 
`;

const CardThumb = styled.Image`
  width: 48px;
  height: 80px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const ItemContent = styled.View`
  flex: 1;
  margin-left: 12px;
  justify-content: center;
  gap: 4px;
`;

const ItemTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 16px;
`;

const ItemSubtitle = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_400Regular';
  font-size: 12px;
`

const DateBadge = styled.View`
  align-items: flex-end;
  justify-content: center;
`;

const DateText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_500Medium';
  font-size: 12px;
`;

const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  padding-top: 100px;
`;

const SectionHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-horizontal: 32px;
  padding-vertical: 24px;
  width: 100%;
`;

const HeaderLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  opacity: 0.5;
`;

const SectionTitle = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_800ExtraBold';
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-horizontal: 16px;
`;

// --- Filter Styles ---
const FilterScroller = styled.ScrollView`
  max-height: 50px;
  margin-bottom: 10px;
`;

const FilterChip = styled.TouchableOpacity<{ active: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.active ? props.theme.colors.primary : (props.theme.colors.surface === '#ffffff' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)')};
  padding-vertical: 8px;
  padding-horizontal: 16px;
  border-radius: 20px;
  margin-right: 8px;
  border-width: 1px;
  border-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
`;

const FilterText = styled.Text<{ active: boolean }>`
  color: ${props => props.active ? '#fff' : props.theme.colors.text};
  font-family: 'Manrope_600SemiBold';
  font-size: 12px;
  margin-left: 6px;
`;

type FilterType = 'ALL' | 'MAJOR' | 'MINOR';

export default function HistoryScreen() {
    const theme = useStyledTheme();
    const { top } = useSafeAreaInsets();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const { getHistory } = useHistory();
    const { getAllCards } = useTarotDatabase();
    const [history, setHistory] = useState<DailyDraw[]>([]);
    const [selectedDraw, setSelectedDraw] = useState<DailyDraw | null>(null);
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [cardMap, setCardMap] = useState<Record<string, string>>({});

    // Premium Check
    const { isPremium, loading: premiumLoading } = usePremium();

    useEffect(() => {
        loadHistory();
        loadLocalizedMap();
    }, [i18n.language]);

    const loadHistory = async () => {
        const data = await getHistory();
        setHistory(data);
    };

    const loadLocalizedMap = async () => {
        const cards = await getAllCards();
        const map: Record<string, string> = {};
        cards.forEach(c => {
            map[c.id] = c.name;
        });
        setCardMap(map);
    };

    const handlePress = (item: DailyDraw) => {
        // Trigger Ad before showing details
        adService.checkInterstitial(() => {
            setSelectedDraw(item);
        });
    };

    // Filter Logic
    const filteredHistory = useMemo(() => {
        if (filter === 'ALL') return history;
        return history.filter(item => {
            const id = parseInt(item.card_id, 10);
            if (isNaN(id)) return false; // Should not happen
            const isMajor = id >= 1 && id <= 22; // Assuming 1-22 is Major
            return filter === 'MAJOR' ? isMajor : !isMajor;
        });
    }, [history, filter]);

    // Grouping Logic for SectionList
    const sections = useMemo(() => {
        const groups: { [key: string]: DailyDraw[] } = {};

        filteredHistory.forEach(item => {
            const [y, m, d] = item.date.split('-').map(Number);
            const date = new Date(y, m - 1, d); // Local date
            const key = date.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' }).toUpperCase();
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        // Convert key-value to array of sections
        // Sort keys if needed, but history is likely already sorted DESC by date.
        // If history is sorted DESC, we just preserve order of appearance of keys.
        const sectionArray = Object.keys(groups).map(title => ({
            title,
            data: groups[title]
        }));

        return sectionArray;

    }, [filteredHistory, i18n.language]);


    const renderItem = ({ item }: { item: DailyDraw }) => {
        // Use localized name if available, fallback to stored
        const displayName = cardMap[item.card_id] || item.card_name;

        // Description skipped for efficiency in list

        const [y, m, d] = item.date.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d); // Local time
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let dateLabel = dateObj.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });

        const isToday = dateObj.toDateString() === today.toDateString();
        const isYesterday = dateObj.toDateString() === yesterday.toDateString();

        if (isToday) dateLabel = t('date.today');
        if (isYesterday) dateLabel = t('date.yesterday');

        return (
            <HistoryItem onPress={() => handlePress(item)} activeOpacity={0.7}>
                <CardThumb source={getCardImage(item.card_id, i18n.language)} resizeMode="cover" />
                <ItemContent>
                    <ItemTitle>{displayName}</ItemTitle>
                </ItemContent>
                <DateBadge>
                    <DateText>{dateLabel}</DateText>
                    <ChevronRight color={theme.colors.textSub} size={16} />
                </DateBadge>
            </HistoryItem>
        );
    };

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <SectionHeaderContainer>
            <HeaderLine />
            <SectionTitle>{title}</SectionTitle>
            <HeaderLine />
        </SectionHeaderContainer>
    );

    const FilterComponent = () => (
        <View style={{ marginBottom: 4, paddingHorizontal: 16 }}>
            <FilterScroller horizontal showsHorizontalScrollIndicator={false}>
                <FilterChip active={filter === 'ALL'} onPress={() => setFilter('ALL')}>
                    <Filter color={filter === 'ALL' ? '#fff' : theme.colors.text} size={14} />
                    <FilterText active={filter === 'ALL'}>{t('settings.all')}</FilterText>
                </FilterChip>

                <FilterChip active={filter === 'MAJOR'} onPress={() => setFilter('MAJOR')}>
                    <Clock color={filter === 'MAJOR' ? '#fff' : theme.colors.text} size={14} />
                    <FilterText active={filter === 'MAJOR'}>{t('settings.major')}</FilterText>
                </FilterChip>

                <FilterChip active={filter === 'MINOR'} onPress={() => setFilter('MINOR')}>
                    <Layers color={filter === 'MINOR' ? '#fff' : theme.colors.text} size={14} />
                    <FilterText active={filter === 'MINOR'}>{t('settings.minor')}</FilterText>
                </FilterChip>
            </FilterScroller>
        </View>
    );

    if (selectedDraw) {
        // Construct TarotCard object with localized name
        const displayName = cardMap[selectedDraw.card_id] || selectedDraw.card_name;

        // We still need description? For now, we don't have descriptions loaded in bulk. 
        // We can pass empty and let RevealedCard handle fetches if it has internal logic, 
        // but currently we just display. 
        // Ideally, fetching full details on click would be better, but user just wants names fixed for now.

        // Fallback to static data for description if needed (but it's English only)
        // const allCards = (cardsData as any).cards || cardsData;
        // const cardDetails = allCards.find((c: any) => c.id == selectedDraw.card_id) || {};

        const tarotCard: TarotCard = {
            id: String(selectedDraw.card_id),
            name: displayName,
            // description: cardDetails.description || '', // English description fallback
            description: '', // We should probably fetch this properly or leave blank
            image_url: ''
        };

        return (
            <RevealedCard
                card={tarotCard}
                onBack={() => {
                    setSelectedDraw(null);
                }}
                embed={false}
            />
        );
    }

    // Lock Screen for Non-Premium
    if (!premiumLoading && !isPremium) {
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
                    <View>
                        <HeaderTitle>{t('settings.history')}</HeaderTitle>
                    </View>
                    <View style={{ width: 40 }} />
                </Header>

                <EmptyState>
                    <Layers color={theme.colors.gold} size={64} />
                    <Text style={{
                        color: theme.colors.text,
                        fontFamily: 'Manrope_700Bold',
                        fontSize: 20,
                        marginTop: 24,
                        textAlign: 'center'
                    }}>
                        {t('paywall.features.history.title') || "History is Locked"}
                    </Text>
                    <Text style={{
                        color: theme.colors.textSub,
                        fontFamily: 'Manrope_400Regular',
                        fontSize: 14,
                        marginTop: 12,
                        textAlign: 'center',
                        maxWidth: 280,
                        marginBottom: 32
                    }}>
                        {t('paywall.features.history.desc') || "Upgrade to Premium to view your past readings."}
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Paywall' as never)}
                        style={{
                            backgroundColor: theme.colors.primary,
                            paddingHorizontal: 24,
                            paddingVertical: 14,
                            borderRadius: 12
                        }}
                    >
                        <Text style={{ color: '#fff', fontFamily: 'Manrope_700Bold', fontSize: 16 }}>
                            {t('paywall.cta') || "Unlock Premium"}
                        </Text>
                    </TouchableOpacity>
                </EmptyState>
            </Container>
        );
    }

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
                <View>
                    <HeaderTitle>{t('settings.history')}</HeaderTitle>
                    <Subtitle>{t('settings.historySubtitle')}</Subtitle>
                </View>
                <View style={{ width: 40 }} />
            </Header>

            <ListContainer>
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    ListHeaderComponent={<FilterComponent />}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false}
                    ListEmptyComponent={
                        <EmptyState>
                            <Clock color={theme.colors.textSub} size={48} />
                            <Text style={{
                                color: theme.colors.textSub,
                                fontFamily: 'Manrope_500Medium',
                                marginTop: 16
                            }}>
                                {t('main.noHistory') || "Your journey hasn't started yet."}
                            </Text>
                        </EmptyState>
                    }
                    ListFooterComponent={
                        history.length > 0 ? (
                            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                                <Text style={{ color: theme.colors.textSub, fontSize: 10, fontFamily: 'Manrope_500Medium', letterSpacing: 2, textTransform: 'uppercase' }}>
                                    {t('settings.endOfHistory')}
                                </Text>
                            </View>
                        ) : null
                    }
                />
            </ListContainer>
        </Container>
    );
}

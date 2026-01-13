import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import styled, { useTheme as useStyledTheme } from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Layers, ChevronRight, ChevronDown, Trash2 } from 'lucide-react-native';

import { useNotes, Note } from '../hooks/useNotes';
import { useCanAccessNotes } from '../hooks/useCanAccessNotes';
import { useTarotDatabase } from '../hooks/useTarotDatabase';
import { NoteItem } from '../components/NoteItem';
import { getCardImage } from '../utils/cardImageMapping';
import { adService } from '../services/AdService';
import { NativeAdCard } from '../components/ads/NativeAdCard';

import { LEGACY_NAME_TO_ID } from '../data/legacyCardMapping';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Styled Components ---

const Container = styled(LinearGradient)`
  flex: 1;
`;

const Header = styled.View`
  margin-top: 20px;
  margin-bottom: 24px;
  align-items: center;
  padding-horizontal: 24px;
`;

const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 24px;
  margin-bottom: 24px;
`;

// -- Toggle --
const ToggleContainer = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'};
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 8px;
`;

const ToggleButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 8px;
  border-radius: 8px;
  background-color: ${props => props.active ? props.theme.colors.surface : 'transparent'};
  shadow-color: #000;
  shadow-offset: ${props => props.active ? '0px 2px' : '0px 0px'};
  shadow-opacity: ${props => props.active ? 0.1 : 0};
  shadow-radius: 4px;
  elevation: ${props => props.active ? 2 : 0};
`;

const ToggleText = styled.Text<{ active: boolean }>`
  font-family: 'Manrope_600SemiBold';
  font-size: 14px;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textSub};
  margin-left: 8px;
`;

const EmptyStateContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 40px;
`;

const EmptyStateText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_500Medium';
  font-size: 16px;
  text-align: center;
  margin-top: 16px;
`;

// -- By Date Item --
const HistoryItem = styled.View`
  flex-direction: row;
  padding: 16px 24px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  align-items: center;
`;

const StyledCardImage = styled.Image`
  width: 50px;
  height: 85px; 
  border-radius: 6px;
  margin-right: 16px;
  background-color: #333;
`;

const ItemContent = styled.View`
  flex: 1;
  justify-content: center;
`;

const DateText = styled.Text`
  color: ${props => props.theme.colors.gold || '#EAB308'};
  font-family: 'Manrope_700Bold';
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
`;

const CardNameText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 16px;
  margin-bottom: 6px;
`;

const NotePreviewText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_400Regular';
  font-size: 14px;
  line-height: 20px;
`;

// -- By Card Group --
const CardGroupContainer = styled.View`
  margin-bottom: 12px;
  margin-horizontal: 24px;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const GroupHeader = styled.TouchableOpacity`
  flex-direction: row;
  padding: 16px;
  align-items: center;
`;

const GroupImage = styled.Image`
  width: 40px;
  height: 68px;
  border-radius: 4px;
  margin-right: 12px;
  background-color: #222;
`;

const GroupInfo = styled.View`
  flex: 1;
`;

const GroupTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_700Bold';
  font-size: 16px;
  margin-bottom: 4px;
`;

const GroupSub = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_500Medium';
  font-size: 12px;
`;

const NotesListContainer = styled.View`
  padding: 16px;
  padding-top: 0px;
  background-color: ${props => props.theme.colors.surface}; /* Same as header */
`;

import { JournalModal } from '../components/JournalModal';
import { TarotCard } from '../hooks/useDailyCardManager'; // Or useTarotData, aligning interfaces

import { useNavigation } from '@react-navigation/native';

export default function NotesScreen() {
  const navigation = useNavigation<any>();
  const { top } = useSafeAreaInsets();
  const theme = useStyledTheme();
  const { t, i18n } = useTranslation();
  const { notes, getAllNotes, updateNote, deleteNote, addNote, loading } = useNotes();
  const { getAllCards, isReady: isTarotDBReady } = useTarotDatabase();

  const [viewMode, setViewMode] = useState<'date' | 'card'>('date');
  const [cardMap, setCardMap] = useState<Record<string, any>>({}); // Store partial card data
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Modal State
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Modal State

  // ... (existing imports)

  // 1. Initial Load of Card Names
  useEffect(() => {
    const loadCards = async () => {
      if (isTarotDBReady) {
        const allCards = await getAllCards();
        const map: Record<string, any> = {};

        // We can just use the map for ID -> Localized Name
        allCards.forEach((c: any) => {
          map[c.id] = c;
        });
        setCardMap(map);
      }
    };
    loadCards();
  }, [isTarotDBReady, i18n.language]);

  const resolveCardId = (storedValue: string): string => {
    // 1. Is it a direct ID? (e.g. "1", "78")
    if (cardMap[storedValue]) return storedValue;

    // 2. Is it a legacy localized name? (e.g. "РЫЦАРЬ МЕЧЕЙ")
    const legacyId = LEGACY_NAME_TO_ID[storedValue];
    if (legacyId) return legacyId;

    // 3. Fallback: maybe it's just broken or unknown
    return storedValue;
  };

  // Helper to get display name
  const getDisplayName = (storedValue: string) => {
    const id = resolveCardId(storedValue);
    // If we resolved it to an ID, show the CURRENT localized name
    if (cardMap[id]) return cardMap[id].name;
    // If not, show the raw stored value (legacy name)
    return storedValue;
  };

  // 2. Refresh notes on focus
  useFocusEffect(
    useCallback(() => {
      getAllNotes();
    }, [getAllNotes])
  );

  const handleDelete = async (id: number, cardId: string) => {
    await deleteNote(id, cardId);
    getAllNotes();
  };

  const { canAccess } = useCanAccessNotes();

  const handleEdit = (note: Note) => {
    if (!canAccess) {
      navigation.navigate('Paywall');
      return;
    }
    setEditingNote(note);
    setModalVisible(true);
  };

  const handleSaveNote = async (text: string) => {
    if (!editingNote) return;

    // notes table logic: updateNote(noteId, cardName(ID), text)
    await updateNote(editingNote.note_id, editingNote.cardName, text);
    setModalVisible(false);
    setEditingNote(null);
    getAllNotes();

    // Check for interstitial after saving
    adService.checkInterstitial(() => { });
  };

  const toggleExpand = (cardId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // 3. Prepare Data
  const notesByCard = useMemo(() => {
    const grouped: { [key: string]: Note[] } = {};
    notes.forEach(note => {
      if (!grouped[note.cardName]) {
        grouped[note.cardName] = [];
      }
      grouped[note.cardName].push(note);
    });

    return Object.keys(grouped).map(key => ({
      cardId: key,
      // Use getDisplayName logic here
      cardName: getDisplayName(key),
      data: grouped[key]
    })).sort((a, b) => a.cardName.localeCompare(b.cardName));
  }, [notes, cardMap, i18n.language]);

  // Renders
  const renderDateItem = ({ item, index }: { item: Note, index: number }) => {
    const card = cardMap[item.cardName];
    // Every 3 items
    const showAd = (index + 1) % 3 === 0;

    return (
      <View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => handleEdit(item)}>
          <HistoryItem>
            <StyledCardImage source={getCardImage(resolveCardId(item.cardName), i18n.language)} />
            <ItemContent>
              <DateText>
                {(() => {
                  const [y, m, d] = item.date.split('-').map(Number);
                  return new Date(y, m - 1, d).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' });
                })()}
              </DateText>
              <CardNameText>{getDisplayName(item.cardName)}</CardNameText>
              <NotePreviewText numberOfLines={1} ellipsizeMode="tail">
                {item.note.replace(/\[Mood:.*?\]\s*/, '')}
              </NotePreviewText>
            </ItemContent>
            {/* Delete Button for List Item */}
            <TouchableOpacity onPress={() => handleDelete(item.note_id, item.cardName)} style={{ padding: 8 }}>
              <Trash2 color={theme.colors.error || '#ef4444'} size={18} />
            </TouchableOpacity>
          </HistoryItem>
        </TouchableOpacity>
        {showAd && <NativeAdCard />}
      </View>
    );
  };

  const renderCardGroup = ({ item, index }: { item: { cardId: string, cardName: string, data: Note[] }, index: number }) => {
    const isExpanded = !!expandedCards[item.cardId];
    // Every 3 groups
    const showAd = (index + 1) % 3 === 0;

    return (
      <View>
        <CardGroupContainer>
          <GroupHeader onPress={() => toggleExpand(item.cardId)} activeOpacity={0.7}>
            <GroupImage source={getCardImage(resolveCardId(item.cardId), i18n.language)} />
            <GroupInfo>
              <GroupTitle>{item.cardName}</GroupTitle>
              <GroupSub>{t('card.numberOfNotes')}{item.data.length}</GroupSub>
            </GroupInfo>
            {isExpanded ? <ChevronDown color={theme.colors.textSub} size={20} /> : <ChevronRight color={theme.colors.textSub} size={20} />}
          </GroupHeader>

          {isExpanded && (
            <NotesListContainer>
              {item.data.map(note => (
                <NoteItem
                  key={note.note_id}
                  note={note}
                  onEdit={handleEdit}
                  onDelete={(id) => handleDelete(id, item.cardId)}
                />
              ))}
            </NotesListContainer>
          )}
        </CardGroupContainer>
        {showAd && <NativeAdCard />}
      </View>
    );
  };

  return (
    <Container
      colors={(theme?.colors?.background || ['#000000', '#000000']) as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Header style={{ marginTop: top + 20 }}>
        <Title>{t('tabs.notes')}</Title>
        <ToggleContainer>
          <ToggleButton active={viewMode === 'date'} onPress={() => setViewMode('date')}>
            <Calendar size={16} color={viewMode === 'date' ? theme.colors.text : theme.colors.textSub} />
            <ToggleText active={viewMode === 'date'}>{t('notes.byDate')}</ToggleText>
          </ToggleButton>
          <ToggleButton active={viewMode === 'card'} onPress={() => setViewMode('card')}>
            <Layers size={16} color={viewMode === 'card' ? theme.colors.text : theme.colors.textSub} />
            <ToggleText active={viewMode === 'card'}>{t('notes.byCard')}</ToggleText>
          </ToggleButton>
        </ToggleContainer>
      </Header>

      {loading ? (
        <EmptyStateContainer>
          {/* Spinner placeholder */}
        </EmptyStateContainer>
      ) : notes.length === 0 ? (
        <EmptyStateContainer>
          <Layers size={48} color={theme.colors.textSub} style={{ opacity: 0.5 }} />
          <EmptyStateText>No journal entries yet.</EmptyStateText>
        </EmptyStateContainer>
      ) : viewMode === 'date' ? (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.note_id.toString()}
          renderItem={renderDateItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListFooterComponent={
            <View style={{ marginTop: 24, marginBottom: 40 }}>
              <NativeAdCard />
            </View>
          }
        />
      ) : (
        <FlatList
          data={notesByCard}
          keyExtractor={(item) => item.cardId}
          renderItem={renderCardGroup}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListFooterComponent={
            <View style={{ marginTop: 24, marginBottom: 40 }}>
              <NativeAdCard />
            </View>
          }
        />
      )}

      {/* Edit Modal */}
      {editingNote && (
        <JournalModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveNote}
          initialText={editingNote.note}
          cardName={cardMap[editingNote.cardName]?.name || ''}
          cardId={editingNote.cardName}
          cardDescription={cardMap[editingNote.cardName]?.description || ''}
        />
      )}
    </Container>
  );
}

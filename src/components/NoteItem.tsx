import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { TouchableOpacity, Alert } from 'react-native';
import { Trash2, Edit2 } from 'lucide-react-native';

interface NoteItemProps {
    note: {
        note_id: number;
        note: string;
        date: string;
    };
    onEdit: (note: any) => void;
    onDelete: (id: number) => void;
}

// --- Styled Components ---

const Container = styled.View`
  background-color: ${props => props.theme.colors.surface === '#ffffff' ? 'rgba(0,0,0,0.03)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const DateText = styled.Text`
  color: ${props => props.theme.colors.textSub};
  font-family: 'Manrope_500Medium';
  font-size: 12px;
`;

const ActionsRow = styled.View`
  flex-direction: row;
  gap: 16px;
`;

const NoteText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Manrope_400Regular';
  font-size: 14px;
  line-height: 22px;
`;

export const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onDelete }) => {
    const theme = useTheme();

    const handleDelete = () => {
        Alert.alert(
            "Delete Note",
            "Are you sure you want to delete this note?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(note.note_id) }
            ]
        );
    };

    return (
        <Container>
            <HeaderRow>
                <DateText>{new Date(note.date).toLocaleDateString()} • {new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</DateText>
                <ActionsRow>
                    <TouchableOpacity onPress={() => onEdit(note)}>
                        <Edit2 color={theme.colors.textSub} size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete}>
                        <Trash2 color={theme.colors.error || '#ef4444'} size={16} />
                    </TouchableOpacity>
                </ActionsRow>
            </HeaderRow>
            <NoteText>{note.note}</NoteText>
        </Container>
    );
};


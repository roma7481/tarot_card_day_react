import { useState, useCallback } from 'react';
import { useNotesDatabase } from './useNotesDatabase';

export interface Note {
    note_id: number;
    cardName: string;
    card_id?: string; // Added via migration
    date: string;
    note: string;
    timeSaved: number;
}

export const useNotes = () => {
    const { db, isReady } = useNotesDatabase();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch notes for a specific card
    const getNotesForCard = useCallback(async (cardIdOrName: string) => {
        if (!isReady || !db) return;
        setLoading(true);
        try {
            // Try matching either card_id OR cardName for backward compat
            // But prefer card_id
            const results = await db.getAllAsync<Note>(
                'SELECT * FROM notes WHERE card_id = ? OR cardName = ? ORDER BY timeSaved DESC',
                [cardIdOrName, cardIdOrName]
            );
            setNotes(results);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    }, [db, isReady]);

    // Fetch ALL notes (for Notes Screen)
    const getAllNotes = useCallback(async () => {
        if (!isReady || !db) return;
        setLoading(true);
        try {
            const results = await db.getAllAsync<Note>(
                'SELECT * FROM notes ORDER BY timeSaved DESC'
            );
            setNotes(results);
        } catch (error) {
            console.error('Error fetching all notes:', error);
        } finally {
            setLoading(false);
        }
    }, [db, isReady]);

    // Add a new note
    const addNote = useCallback(async (cardId: string, text: string, onSuccess?: () => void) => {
        if (!isReady || !db) return;
        const now = new Date();
        // Store as YYYY-MM-DD in LOCAL TIME
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const timeSaved = Math.floor(now.getTime() / 1000);

        try {
            // We store cardId in BOTH columns for now to be safe, or just use it as cardName 
            // since our UI handles ID-as-ame gracefully now.
            const result = await db.runAsync(
                'INSERT INTO notes (card_id, cardName, note, date, timeSaved) VALUES (?, ?, ?, ?, ?)',
                [cardId, cardId, text, dateStr, timeSaved]
            );
            console.log('Note added with ID:', result.lastInsertRowId);
            getNotesForCard(cardId);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    }, [db, isReady, getNotesForCard]);

    // Update a note
    const updateNote = useCallback(async (noteId: number, cardId: string, newText: string, onSuccess?: () => void) => {
        if (!isReady || !db) return;
        try {
            await db.runAsync(
                'UPDATE notes SET note = ? WHERE note_id = ?',
                [newText, noteId]
            );
            console.log('Note updated');
            getNotesForCard(cardId);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    }, [db, isReady, getNotesForCard]);

    // Delete a note
    const deleteNote = useCallback(async (noteId: number, cardId: string) => {
        if (!isReady || !db) return;
        try {
            await db.runAsync(
                'DELETE FROM notes WHERE note_id = ?',
                [noteId]
            );
            console.log('Note deleted');
            getNotesForCard(cardId);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }, [db, isReady, getNotesForCard]);

    return {
        notes,
        loading,
        getNotesForCard,
        getAllNotes,
        addNote,
        updateNote,
        deleteNote
    };
};

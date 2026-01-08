import { useState, useCallback } from 'react';
import { useNotesDatabase } from './useNotesDatabase';

export interface Note {
    note_id: number;
    cardName: string;
    date: string;
    note: string;
    timeSaved: number;
}

export const useNotes = () => {
    const { db, isReady } = useNotesDatabase();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch notes for a specific card
    const getNotesForCard = useCallback(async (cardName: string) => {
        if (!isReady || !db) return;
        setLoading(true);
        try {
            const results = await db.getAllAsync<Note>(
                'SELECT * FROM notes WHERE cardName = ? ORDER BY timeSaved DESC',
                [cardName]
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
    const addNote = useCallback(async (cardName: string, text: string, onSuccess?: () => void) => {
        if (!isReady || !db) return;
        const now = new Date();
        const dateStr = now.toISOString();
        const timeSaved = Math.floor(now.getTime() / 1000);

        try {
            const result = await db.runAsync(
                'INSERT INTO notes (cardName, note, date, timeSaved) VALUES (?, ?, ?, ?)',
                [cardName, text, dateStr, timeSaved]
            );
            console.log('Note added with ID:', result.lastInsertRowId);
            getNotesForCard(cardName);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    }, [db, isReady, getNotesForCard]);

    // Update a note
    const updateNote = useCallback(async (noteId: number, cardName: string, newText: string, onSuccess?: () => void) => {
        if (!isReady || !db) return;
        try {
            await db.runAsync(
                'UPDATE notes SET note = ? WHERE note_id = ?',
                [newText, noteId]
            );
            console.log('Note updated');
            getNotesForCard(cardName);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    }, [db, isReady, getNotesForCard]);

    // Delete a note
    const deleteNote = useCallback(async (noteId: number, cardName: string) => {
        if (!isReady || !db) return;
        try {
            await db.runAsync(
                'DELETE FROM notes WHERE note_id = ?',
                [noteId]
            );
            console.log('Note deleted');
            getNotesForCard(cardName);
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

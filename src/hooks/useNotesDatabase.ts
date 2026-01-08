import { useDatabase } from '../data/DatabaseContext';

export const useNotesDatabase = () => {
    const { notesDb: db, isNotesReady: isReady } = useDatabase();

    // Error handling is now centralized in DatabaseContext or can be added here if needed
    const error = null;



    return { db, isReady, error };
};

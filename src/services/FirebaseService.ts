import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Config from google-services.json
const firebaseConfig = {
    apiKey: "AIzaSyCSATmXjr4vk6iyF5P4j4fgUCNKrEPNeak",
    authDomain: "tarotcardoftheday-744bc.firebaseapp.com",
    projectId: "tarotcardoftheday-744bc",
    storageBucket: "tarotcardoftheday-744bc.firebasestorage.app",
    messagingSenderId: "471236605148",
    appId: "1:471236605148:android:06327a165c2fc5ce"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const functions = getFunctions(app);

const PROJECT_ID = 'tarotcardoftheday-744bc';

export interface OtherApp {
    id: string;
    name: string;
    imageLink: string;
    link: string;
}

// Export for usage in components
export { functions, httpsCallable };

export const fetchOtherApps = async (language: string = 'en'): Promise<OtherApp[]> => {
    try {
        // Firestore REST API Endpoint
        // Structure: /{lang}/other_apps/android
        // Note: We defaulted to 'android' as per requirements, but could be dynamic if iOS exists.
        const platformCollection = Platform.OS === 'ios' ? 'ios' : 'android';

        // Firestore REST URL to list documents in a collection
        // Path: projects/{projectId}/databases/(default)/documents/{lang}/other_apps/{platformCollection}
        // We treat {lang} as a collection, 'other_apps' as a doc, {platformCollection} as a subcollection.
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${language}/other_apps/${platformCollection}`;

        console.log('Fetching Other Apps from:', url);

        const response = await fetch(url);

        if (!response.ok) {
            // Fallback for languages that might not exist, try 'en' if strict fail?
            // Or specific handling.
            console.warn(`Failed to fetch apps for ${language}: ${response.status}`);
            if (language !== 'en') {
                // Basic fallback purely in logic
                console.log('Falling back to EN');
                return fetchOtherApps('en');
            }
            return [];
        }

        const json = await response.json();

        if (!json.documents) {
            return [];
        }

        // Parse Firestore JSON format
        // Item format: { fields: { name: { stringValue: "..." }, ... } }
        const apps: OtherApp[] = json.documents.map((doc: any) => {
            const fields = doc.fields;
            // path looks like: .../documents/en/other_apps/android/dream_dictionary
            const id = doc.name.split('/').pop();

            return {
                id: id,
                name: fields.name?.stringValue || '',
                imageLink: fields.imageLink?.stringValue || '',
                link: fields.link?.stringValue || '',
            };
        });

        return apps;

    } catch (error) {
        console.error('Error fetching/parsing other apps:', error);
        return [];
    }
};

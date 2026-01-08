/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Define the secret for Gemini API Key
// You must set this secret via CLI: firebase functions:secrets:set GEMINI_API_KEY
const geminiApiKey = defineSecret("GEMINI_API_KEY");

export const askOracle = onCall({ secrets: [geminiApiKey] }, async (request) => {
    // 1. Validate Authentication (Optional but recommended)
    // if (!request.auth) {
    //     throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    // }

    // 2. Extract Data
    const { cardName, question, cardContext } = request.data;

    if (!cardName) {
        throw new HttpsError('invalid-argument', 'The function must be called with a "cardName".');
    }

    try {
        // 3. Initialize Gemini
        const apiKey = geminiApiKey.value();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // 4. Construct Prompt
        const userQuestion = question || "What does this card mean for me today?";
        const context = cardContext ? `Card Context/Meaning: ${cardContext}` : "";

        const prompt = `
            You are a mystical and wise Tarot Oracle. 
            The user has drawn the card: "${cardName}".
            ${context}
            
            User's Question: "${userQuestion}"
            
            Provide a short, insightful, and spiritual guidance based on this card. 
            Keep the response under 100 words. Be empathetic and mystical but grounded.
        `;

        // 5. Generate Content
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return {
            answer: text
        };

    } catch (error: any) {
        console.error("Error calling Gemini:", error);
        throw new HttpsError('internal', 'Failed to generate oracle response.', error.message);
    }
});

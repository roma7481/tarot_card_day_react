"use strict";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.askOracle = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const generative_ai_1 = require("@google/generative-ai");
const admin = require("firebase-admin");
// Initialize Firebase Admin
admin.initializeApp();
// Define the secret for Gemini API Key
// You must set this secret via CLI: firebase functions:secrets:set GEMINI_API_KEY
const geminiApiKey = (0, params_1.defineSecret)("GEMINI_API_KEY");
exports.askOracle = (0, https_1.onCall)({ secrets: [geminiApiKey] }, async (request) => {
    // 1. Validate Authentication (Optional but recommended)
    // if (!request.auth) {
    //     throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
    // }
    // 2. Extract Data
    const { cardName, question, cardContext, language } = request.data;
    if (!cardName) {
        throw new https_1.HttpsError('invalid-argument', 'The function must be called with a "cardName".');
    }
    try {
        // 3. Initialize Gemini
        const apiKey = geminiApiKey.value();
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        // 4. Construct Prompt
        const userQuestion = question || "What does this card mean for me today?";
        const context = cardContext ? `Card Context/Meaning: ${cardContext}` : "";
        const langInstruction = language ? `Answer in the following language: ${language}.` : "";
        const prompt = `
        You are a modern, wise Tarot Oracle.
        ${langInstruction}

        STYLE RULES (VERY IMPORTANT):
        - Use a respectful, neutral, contemporary tone.
        - Do NOT use archaic, theatrical, or patronizing language.
        - Do NOT refer to the user with titles like "my child", "seeker", "wanderer", "soul", or similar expressions (including in other languages).
        - Do NOT mention stars, astrology, planets, horoscopes, or cosmic forces.
        - Base the guidance ONLY on Tarot symbolism, the card, or the arcana.
        - Avoid phrases like "the stars say" or any astrology-related framing.
        - Address the user neutrally or with "you" (never labels or roles).

        Context:
        The user has drawn the Tarot card: "${cardName}".
        ${context ? `Card Meaning / Symbolism: ${context}` : ""}

        User's Question: "${userQuestion}"

        Task:
        Provide short, clear, grounded, and empathetic spiritual guidance based on this Tarot card.
        Keep it under 100 words.
        The tone should feel calm, insightful, and modern — not mystical theater.
        `;
        // 5. Generate Content
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return {
            answer: text
        };
    }
    catch (error) {
        console.error("Error calling Gemini:", error);
        throw new https_1.HttpsError('internal', 'Failed to generate oracle response.', error.message);
    }
});
//# sourceMappingURL=index.js.map
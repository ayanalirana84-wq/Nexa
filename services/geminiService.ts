
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const initChat = (systemInstruction: string): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
    return chat.sendMessageStream({ message });
};

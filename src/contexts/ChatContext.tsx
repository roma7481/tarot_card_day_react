import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: number;
}

interface ChatContextType {
    getMessages: (cardId: string) => Message[];
    addMessage: (cardId: string, message: Message) => void;
    clearMessages: (cardId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [chats, setChats] = useState<Record<string, Message[]>>({});

    const getMessages = (cardId: string) => chats[cardId] || [];

    const addMessage = (cardId: string, message: Message) => {
        setChats(prev => ({
            ...prev,
            [cardId]: [...(prev[cardId] || []), message]
        }));
    };

    const clearMessages = (cardId: string) => {
        setChats(prev => {
            const newChats = { ...prev };
            delete newChats[cardId];
            return newChats;
        });
    };

    return (
        <ChatContext.Provider value={{ getMessages, addMessage, clearMessages }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChat must be used within ChatProvider");
    return context;
};

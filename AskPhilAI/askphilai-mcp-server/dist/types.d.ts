export interface ChatMessage {
    [key: string]: unknown;
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
}
export interface Chat {
    [key: string]: unknown;
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: string;
    updatedAt: string;
    metadata: Record<string, string>;
}
export interface KnowledgeDocument {
    [key: string]: unknown;
    id: string;
    filename: string;
    mimeType: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    sizeBytes: number;
}
export interface AppSettings {
    [key: string]: unknown;
    systemPrompt: string;
    modelName: string;
    temperature: number;
    maxTokens: number;
    welcomeMessage: string;
    brandName: string;
    enableKnowledge: boolean;
    enableChatHistory: boolean;
}
export interface DataStore {
    chats: Record<string, Chat>;
    documents: Record<string, KnowledgeDocument>;
    settings: AppSettings;
}
export interface PaginatedResult<T> {
    total: number;
    count: number;
    offset: number;
    items: T[];
    has_more: boolean;
    next_offset?: number;
}
//# sourceMappingURL=types.d.ts.map
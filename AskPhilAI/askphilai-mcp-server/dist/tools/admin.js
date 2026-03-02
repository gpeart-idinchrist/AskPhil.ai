import { loadStore, saveStore } from "../services/storage.js";
import { GetSettingsSchema, UpdateSettingsSchema, GetStatsSchema, } from "../schemas/admin.js";
export function registerAdminTools(server) {
    // ─── Get Settings ───────────────────────────────────────
    server.registerTool("askphilai_get_settings", {
        title: "Get Settings",
        description: `Retrieve current AskPhilAI application settings.

Returns:
  All current settings including system prompt, model configuration, welcome message, brand name, and feature flags.`,
        inputSchema: GetSettingsSchema.shape,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async () => {
        const store = loadStore();
        const s = store.settings;
        const text = [
            "# AskPhilAI Settings",
            "",
            `**Brand Name:** ${s.brandName}`,
            `**Model:** ${s.modelName}`,
            `**Temperature:** ${s.temperature}`,
            `**Max Tokens:** ${s.maxTokens}`,
            `**Knowledge Base:** ${s.enableKnowledge ? "Enabled" : "Disabled"}`,
            `**Chat History:** ${s.enableChatHistory ? "Enabled" : "Disabled"}`,
            "",
            "**Welcome Message:**",
            s.welcomeMessage,
            "",
            "**System Prompt:**",
            s.systemPrompt,
        ].join("\n");
        return {
            content: [{ type: "text", text }],
            structuredContent: s,
        };
    });
    // ─── Update Settings ────────────────────────────────────
    server.registerTool("askphilai_update_settings", {
        title: "Update Settings",
        description: `Update one or more AskPhilAI application settings. Only provided fields are changed; omitted fields keep their current values.

Args:
  - system_prompt (string, optional): System prompt for the AI
  - model_name (string, optional): Model identifier
  - temperature (number 0–2, optional): Sampling temperature
  - max_tokens (number, optional): Max tokens per response
  - welcome_message (string, optional): Welcome greeting
  - brand_name (string, optional): Brand display name
  - enable_knowledge (boolean, optional): Toggle knowledge base
  - enable_chat_history (boolean, optional): Toggle chat saving

Returns:
  Updated settings object.`,
        inputSchema: UpdateSettingsSchema.shape,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async (params) => {
        const store = loadStore();
        const s = store.settings;
        if (params.system_prompt !== undefined)
            s.systemPrompt = params.system_prompt;
        if (params.model_name !== undefined)
            s.modelName = params.model_name;
        if (params.temperature !== undefined)
            s.temperature = params.temperature;
        if (params.max_tokens !== undefined)
            s.maxTokens = params.max_tokens;
        if (params.welcome_message !== undefined)
            s.welcomeMessage = params.welcome_message;
        if (params.brand_name !== undefined)
            s.brandName = params.brand_name;
        if (params.enable_knowledge !== undefined)
            s.enableKnowledge = params.enable_knowledge;
        if (params.enable_chat_history !== undefined)
            s.enableChatHistory = params.enable_chat_history;
        saveStore(store);
        return {
            content: [{ type: "text", text: "Settings updated successfully." }],
            structuredContent: s,
        };
    });
    // ─── Get Stats ──────────────────────────────────────────
    server.registerTool("askphilai_get_stats", {
        title: "Get Stats",
        description: `Get dashboard statistics for AskPhilAI.

Returns:
  Summary statistics including total chats, total messages, total documents, and total knowledge base size.`,
        inputSchema: GetStatsSchema.shape,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
        },
    }, async () => {
        const store = loadStore();
        const chats = Object.values(store.chats);
        const docs = Object.values(store.documents);
        const totalMessages = chats.reduce((sum, c) => sum + c.messages.length, 0);
        const totalKbSize = docs.reduce((sum, d) => sum + d.sizeBytes, 0);
        const recentChat = chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
        const stats = {
            totalChats: chats.length,
            totalMessages,
            totalDocuments: docs.length,
            totalKnowledgeSizeBytes: totalKbSize,
            totalKnowledgeSizeMB: +(totalKbSize / 1024 / 1024).toFixed(2),
            mostRecentChat: recentChat ? { id: recentChat.id, title: recentChat.title, updatedAt: recentChat.updatedAt } : null,
        };
        const text = [
            "# AskPhilAI Dashboard Stats",
            "",
            `**Total Chats:** ${stats.totalChats}`,
            `**Total Messages:** ${stats.totalMessages}`,
            `**Total Documents:** ${stats.totalDocuments}`,
            `**Knowledge Base Size:** ${stats.totalKnowledgeSizeMB} MB`,
            stats.mostRecentChat
                ? `**Most Recent Chat:** "${stats.mostRecentChat.title}" (${stats.mostRecentChat.updatedAt})`
                : "**Most Recent Chat:** None",
        ].join("\n");
        return {
            content: [{ type: "text", text }],
            structuredContent: stats,
        };
    });
}
//# sourceMappingURL=admin.js.map
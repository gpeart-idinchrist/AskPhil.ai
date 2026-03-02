import { z } from "zod";
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from "../constants.js";
// ─── Create Chat ────────────────────────────────────────────
export const CreateChatSchema = z
    .object({
    title: z
        .string()
        .min(1)
        .max(200)
        .describe("Title for the new chat session"),
    metadata: z
        .record(z.string())
        .optional()
        .default({})
        .describe("Optional key-value metadata for the chat"),
})
    .strict();
// ─── Send Message ───────────────────────────────────────────
export const SendMessageSchema = z
    .object({
    chat_id: z.string().uuid().describe("ID of the chat to send the message to"),
    role: z
        .enum(["user", "assistant", "system"])
        .describe("Role of the message sender"),
    content: z
        .string()
        .min(1)
        .max(100_000)
        .describe("Message content text"),
})
    .strict();
// ─── List Chats ─────────────────────────────────────────────
export const ListChatsSchema = z
    .object({
    limit: z
        .number()
        .int()
        .min(1)
        .max(MAX_PAGE_LIMIT)
        .default(DEFAULT_PAGE_LIMIT)
        .describe("Maximum number of chats to return"),
    offset: z
        .number()
        .int()
        .min(0)
        .default(0)
        .describe("Number of chats to skip for pagination"),
    search: z
        .string()
        .max(200)
        .optional()
        .describe("Optional search string to filter chat titles"),
})
    .strict();
// ─── Get Chat ───────────────────────────────────────────────
export const GetChatSchema = z
    .object({
    chat_id: z.string().uuid().describe("ID of the chat to retrieve"),
})
    .strict();
// ─── Delete Chat ────────────────────────────────────────────
export const DeleteChatSchema = z
    .object({
    chat_id: z.string().uuid().describe("ID of the chat to delete"),
})
    .strict();
// ─── Update Chat Title ──────────────────────────────────────
export const UpdateChatSchema = z
    .object({
    chat_id: z.string().uuid().describe("ID of the chat to update"),
    title: z
        .string()
        .min(1)
        .max(200)
        .optional()
        .describe("New title for the chat"),
    metadata: z
        .record(z.string())
        .optional()
        .describe("Metadata fields to merge into existing metadata"),
})
    .strict();
//# sourceMappingURL=chat.js.map
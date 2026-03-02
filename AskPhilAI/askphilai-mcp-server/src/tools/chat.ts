import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { v4 as uuidv4 } from "uuid";
import { loadStore, saveStore, paginate } from "../services/storage.js";
import {
  CreateChatSchema,
  SendMessageSchema,
  ListChatsSchema,
  GetChatSchema,
  DeleteChatSchema,
  UpdateChatSchema,
  type CreateChatInput,
  type SendMessageInput,
  type ListChatsInput,
  type GetChatInput,
  type DeleteChatInput,
  type UpdateChatInput,
} from "../schemas/chat.js";
import type { Chat, ChatMessage } from "../types.js";
import { CHARACTER_LIMIT } from "../constants.js";

/** Truncate text with an ellipsis indicator */
function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "\n…[truncated]" : text;
}

/** Format a chat for display */
function formatChat(chat: Chat, includeMessages: boolean): string {
  const lines: string[] = [
    `# ${chat.title}`,
    `**ID:** ${chat.id}`,
    `**Created:** ${chat.createdAt}`,
    `**Updated:** ${chat.updatedAt}`,
    `**Messages:** ${chat.messages.length}`,
  ];
  if (Object.keys(chat.metadata).length > 0) {
    lines.push(`**Metadata:** ${JSON.stringify(chat.metadata)}`);
  }
  if (includeMessages && chat.messages.length > 0) {
    lines.push("", "---", "");
    for (const msg of chat.messages) {
      lines.push(`**[${msg.role}]** (${msg.timestamp})`);
      lines.push(msg.content, "");
    }
  }
  return lines.join("\n");
}

export function registerChatTools(server: McpServer): void {
  // ─── Create Chat ────────────────────────────────────────

  server.registerTool(
    "askphilai_create_chat",
    {
      title: "Create Chat",
      description: `Create a new chat session in AskPhilAI.

Args:
  - title (string): Title for the new chat session (1–200 chars)
  - metadata (object, optional): Key-value metadata to attach to the chat

Returns:
  The newly created chat object with its generated ID.

Examples:
  - "Start a new conversation about cooking" → title="Cooking Tips"
  - "Create a customer support chat" → title="Support #1234", metadata={"customer":"1234"}`,
      inputSchema: CreateChatSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (params: CreateChatInput) => {
      const store = loadStore();
      const now = new Date().toISOString();
      const chat: Chat = {
        id: uuidv4(),
        title: params.title,
        messages: [],
        createdAt: now,
        updatedAt: now,
        metadata: params.metadata ?? {},
      };
      store.chats[chat.id] = chat;
      saveStore(store);

      const output = { id: chat.id, title: chat.title, createdAt: chat.createdAt };
      return {
        content: [{ type: "text" as const, text: `Chat created successfully.\n\n${formatChat(chat, false)}` }],
        structuredContent: output,
      };
    }
  );

  // ─── Send Message ───────────────────────────────────────

  server.registerTool(
    "askphilai_send_message",
    {
      title: "Send Message",
      description: `Add a message to an existing chat session.

Args:
  - chat_id (string, uuid): ID of the target chat
  - role ('user' | 'assistant' | 'system'): Who is sending the message
  - content (string): The message text (1–100 000 chars)

Returns:
  The created message object with its ID and timestamp.

Error Handling:
  - Returns error if chat_id does not exist.`,
      inputSchema: SendMessageSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (params: SendMessageInput) => {
      const store = loadStore();
      const chat = store.chats[params.chat_id];
      if (!chat) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: Chat '${params.chat_id}' not found. Use askphilai_list_chats to see available chats.` }],
        };
      }

      const message: ChatMessage = {
        id: uuidv4(),
        role: params.role,
        content: params.content,
        timestamp: new Date().toISOString(),
      };
      chat.messages.push(message);
      chat.updatedAt = message.timestamp;
      saveStore(store);

      const output = { id: message.id, chat_id: chat.id, role: message.role, timestamp: message.timestamp };
      return {
        content: [{ type: "text" as const, text: `Message added to "${chat.title}".\n\n**[${message.role}]** ${truncate(message.content, 200)}` }],
        structuredContent: output,
      };
    }
  );

  // ─── List Chats ─────────────────────────────────────────

  server.registerTool(
    "askphilai_list_chats",
    {
      title: "List Chats",
      description: `List all chat sessions with optional search and pagination.

Args:
  - limit (number, 1–100, default 20): Max chats to return
  - offset (number, default 0): Pagination offset
  - search (string, optional): Filter chats whose title contains this string (case-insensitive)

Returns:
  Paginated list of chat summaries (id, title, message count, timestamps).`,
      inputSchema: ListChatsSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: ListChatsInput) => {
      const store = loadStore();
      let chats = Object.values(store.chats).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      if (params.search) {
        const q = params.search.toLowerCase();
        chats = chats.filter((c) => c.title.toLowerCase().includes(q));
      }

      const page = paginate(chats, params.offset, params.limit);
      const lines = page.items.map(
        (c) => `- **${c.title}** (${c.id}) – ${c.messages.length} messages, updated ${c.updatedAt}`
      );
      const header = `Showing ${page.count} of ${page.total} chats (offset ${params.offset})`;
      const text = truncate([header, "", ...lines].join("\n"), CHARACTER_LIMIT);

      return {
        content: [{ type: "text" as const, text }],
        structuredContent: { ...page, items: page.items.map(({ id, title, messages, createdAt, updatedAt }) => ({ id, title, messageCount: messages.length, createdAt, updatedAt })) },
      };
    }
  );

  // ─── Get Chat ───────────────────────────────────────────

  server.registerTool(
    "askphilai_get_chat",
    {
      title: "Get Chat",
      description: `Retrieve a single chat session including its full message history.

Args:
  - chat_id (string, uuid): ID of the chat to retrieve

Returns:
  Complete chat object with all messages.

Error Handling:
  - Returns error if chat_id does not exist.`,
      inputSchema: GetChatSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: GetChatInput) => {
      const store = loadStore();
      const chat = store.chats[params.chat_id];
      if (!chat) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: Chat '${params.chat_id}' not found. Use askphilai_list_chats to see available chats.` }],
        };
      }

      const text = truncate(formatChat(chat, true), CHARACTER_LIMIT);
      return {
        content: [{ type: "text" as const, text }],
        structuredContent: chat,
      };
    }
  );

  // ─── Update Chat ────────────────────────────────────────

  server.registerTool(
    "askphilai_update_chat",
    {
      title: "Update Chat",
      description: `Update a chat's title or metadata.

Args:
  - chat_id (string, uuid): ID of the chat to update
  - title (string, optional): New title
  - metadata (object, optional): Metadata fields to merge

Returns:
  Updated chat summary.`,
      inputSchema: UpdateChatSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: UpdateChatInput) => {
      const store = loadStore();
      const chat = store.chats[params.chat_id];
      if (!chat) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: Chat '${params.chat_id}' not found.` }],
        };
      }

      if (params.title) chat.title = params.title;
      if (params.metadata) chat.metadata = { ...chat.metadata, ...params.metadata };
      chat.updatedAt = new Date().toISOString();
      saveStore(store);

      return {
        content: [{ type: "text" as const, text: `Chat updated.\n\n${formatChat(chat, false)}` }],
        structuredContent: { id: chat.id, title: chat.title, updatedAt: chat.updatedAt },
      };
    }
  );

  // ─── Delete Chat ────────────────────────────────────────

  server.registerTool(
    "askphilai_delete_chat",
    {
      title: "Delete Chat",
      description: `Permanently delete a chat session and all its messages.

Args:
  - chat_id (string, uuid): ID of the chat to delete

Returns:
  Confirmation with the deleted chat's title.

Error Handling:
  - Returns error if chat_id does not exist.`,
      inputSchema: DeleteChatSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (params: DeleteChatInput) => {
      const store = loadStore();
      const chat = store.chats[params.chat_id];
      if (!chat) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: Chat '${params.chat_id}' not found.` }],
        };
      }

      const title = chat.title;
      delete store.chats[params.chat_id];
      saveStore(store);

      return {
        content: [{ type: "text" as const, text: `Chat "${title}" (${params.chat_id}) deleted.` }],
        structuredContent: { deleted: true, id: params.chat_id, title },
      };
    }
  );
}

import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "../constants.js";
const DATA_FILE = path.join(DATA_DIR, "store.json");
const DEFAULT_SETTINGS = {
    systemPrompt: "You are AskPhilAI, a helpful and knowledgeable AI assistant. Answer questions clearly and concisely, referencing uploaded knowledge documents when relevant.",
    modelName: "claude-sonnet-4-20250514",
    temperature: 0.7,
    maxTokens: 4096,
    welcomeMessage: "Hello! I'm AskPhilAI. How can I help you today?",
    brandName: "AskPhilAI",
    enableKnowledge: true,
    enableChatHistory: true,
};
function defaultStore() {
    return {
        chats: {},
        documents: {},
        settings: { ...DEFAULT_SETTINGS },
    };
}
/** Ensure data directory exists */
function ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}
/** Load the data store from disk (or return defaults) */
export function loadStore() {
    ensureDir();
    if (!fs.existsSync(DATA_FILE)) {
        const store = defaultStore();
        saveStore(store);
        return store;
    }
    try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        return {
            chats: parsed.chats ?? {},
            documents: parsed.documents ?? {},
            settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        };
    }
    catch {
        console.error("[storage] Corrupt data file – resetting to defaults");
        const store = defaultStore();
        saveStore(store);
        return store;
    }
}
/** Persist the data store to disk */
export function saveStore(store) {
    ensureDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}
/** Helper: paginate an array of items */
export function paginate(items, offset, limit) {
    const total = items.length;
    const sliced = items.slice(offset, offset + limit);
    const has_more = offset + sliced.length < total;
    return {
        items: sliced,
        total,
        count: sliced.length,
        has_more,
        ...(has_more ? { next_offset: offset + sliced.length } : {}),
    };
}
//# sourceMappingURL=storage.js.map
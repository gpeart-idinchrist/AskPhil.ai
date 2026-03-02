import { z } from "zod";
// ─── Get Settings ───────────────────────────────────────────
export const GetSettingsSchema = z.object({}).strict();
// ─── Update Settings ────────────────────────────────────────
export const UpdateSettingsSchema = z
    .object({
    system_prompt: z
        .string()
        .min(1)
        .max(10_000)
        .optional()
        .describe("System prompt for the AI assistant"),
    model_name: z
        .string()
        .min(1)
        .max(100)
        .optional()
        .describe("Model identifier (e.g., 'claude-sonnet-4-20250514')"),
    temperature: z
        .number()
        .min(0)
        .max(2)
        .optional()
        .describe("Sampling temperature (0–2)"),
    max_tokens: z
        .number()
        .int()
        .min(1)
        .max(200_000)
        .optional()
        .describe("Maximum tokens per response"),
    welcome_message: z
        .string()
        .max(1_000)
        .optional()
        .describe("Welcome message shown to new users"),
    brand_name: z
        .string()
        .max(100)
        .optional()
        .describe("Brand name displayed in the UI"),
    enable_knowledge: z
        .boolean()
        .optional()
        .describe("Whether the knowledge base feature is enabled"),
    enable_chat_history: z
        .boolean()
        .optional()
        .describe("Whether chat history saving is enabled"),
})
    .strict();
// ─── Get Stats ──────────────────────────────────────────────
export const GetStatsSchema = z.object({}).strict();
//# sourceMappingURL=admin.js.map
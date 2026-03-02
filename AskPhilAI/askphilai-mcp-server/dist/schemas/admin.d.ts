import { z } from "zod";
export declare const GetSettingsSchema: z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>;
export type GetSettingsInput = z.infer<typeof GetSettingsSchema>;
export declare const UpdateSettingsSchema: z.ZodObject<{
    system_prompt: z.ZodOptional<z.ZodString>;
    model_name: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    max_tokens: z.ZodOptional<z.ZodNumber>;
    welcome_message: z.ZodOptional<z.ZodString>;
    brand_name: z.ZodOptional<z.ZodString>;
    enable_knowledge: z.ZodOptional<z.ZodBoolean>;
    enable_chat_history: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    temperature?: number | undefined;
    system_prompt?: string | undefined;
    model_name?: string | undefined;
    max_tokens?: number | undefined;
    welcome_message?: string | undefined;
    brand_name?: string | undefined;
    enable_knowledge?: boolean | undefined;
    enable_chat_history?: boolean | undefined;
}, {
    temperature?: number | undefined;
    system_prompt?: string | undefined;
    model_name?: string | undefined;
    max_tokens?: number | undefined;
    welcome_message?: string | undefined;
    brand_name?: string | undefined;
    enable_knowledge?: boolean | undefined;
    enable_chat_history?: boolean | undefined;
}>;
export type UpdateSettingsInput = z.infer<typeof UpdateSettingsSchema>;
export declare const GetStatsSchema: z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>;
export type GetStatsInput = z.infer<typeof GetStatsSchema>;
//# sourceMappingURL=admin.d.ts.map
import { z } from "zod";
export declare const CreateChatSchema: z.ZodObject<{
    title: z.ZodString;
    metadata: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
}, "strict", z.ZodTypeAny, {
    title: string;
    metadata: Record<string, string>;
}, {
    title: string;
    metadata?: Record<string, string> | undefined;
}>;
export type CreateChatInput = z.infer<typeof CreateChatSchema>;
export declare const SendMessageSchema: z.ZodObject<{
    chat_id: z.ZodString;
    role: z.ZodEnum<["user", "assistant", "system"]>;
    content: z.ZodString;
}, "strict", z.ZodTypeAny, {
    role: "user" | "assistant" | "system";
    content: string;
    chat_id: string;
}, {
    role: "user" | "assistant" | "system";
    content: string;
    chat_id: string;
}>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export declare const ListChatsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    offset: number;
    search?: string | undefined;
}, {
    search?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export type ListChatsInput = z.infer<typeof ListChatsSchema>;
export declare const GetChatSchema: z.ZodObject<{
    chat_id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    chat_id: string;
}, {
    chat_id: string;
}>;
export type GetChatInput = z.infer<typeof GetChatSchema>;
export declare const DeleteChatSchema: z.ZodObject<{
    chat_id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    chat_id: string;
}, {
    chat_id: string;
}>;
export type DeleteChatInput = z.infer<typeof DeleteChatSchema>;
export declare const UpdateChatSchema: z.ZodObject<{
    chat_id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strict", z.ZodTypeAny, {
    chat_id: string;
    title?: string | undefined;
    metadata?: Record<string, string> | undefined;
}, {
    chat_id: string;
    title?: string | undefined;
    metadata?: Record<string, string> | undefined;
}>;
export type UpdateChatInput = z.infer<typeof UpdateChatSchema>;
//# sourceMappingURL=chat.d.ts.map
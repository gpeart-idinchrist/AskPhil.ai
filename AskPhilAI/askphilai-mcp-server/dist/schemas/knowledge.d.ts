import { z } from "zod";
export declare const UploadDocumentSchema: z.ZodObject<{
    filename: z.ZodString;
    mime_type: z.ZodDefault<z.ZodEnum<["text/plain", "text/markdown", "text/html", "text/csv", "application/pdf", "application/json"]>>;
    content: z.ZodString;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strict", z.ZodTypeAny, {
    content: string;
    filename: string;
    tags: string[];
    mime_type: "text/plain" | "text/markdown" | "text/html" | "text/csv" | "application/pdf" | "application/json";
}, {
    content: string;
    filename: string;
    tags?: string[] | undefined;
    mime_type?: "text/plain" | "text/markdown" | "text/html" | "text/csv" | "application/pdf" | "application/json" | undefined;
}>;
export type UploadDocumentInput = z.infer<typeof UploadDocumentSchema>;
export declare const ListDocumentsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
    tag: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    offset: number;
    search?: string | undefined;
    tag?: string | undefined;
}, {
    search?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    tag?: string | undefined;
}>;
export type ListDocumentsInput = z.infer<typeof ListDocumentsSchema>;
export declare const GetDocumentSchema: z.ZodObject<{
    document_id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    document_id: string;
}, {
    document_id: string;
}>;
export type GetDocumentInput = z.infer<typeof GetDocumentSchema>;
export declare const DeleteDocumentSchema: z.ZodObject<{
    document_id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    document_id: string;
}, {
    document_id: string;
}>;
export type DeleteDocumentInput = z.infer<typeof DeleteDocumentSchema>;
export declare const SearchKnowledgeSchema: z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    query: string;
}, {
    query: string;
    limit?: number | undefined;
}>;
export type SearchKnowledgeInput = z.infer<typeof SearchKnowledgeSchema>;
export declare const UpdateDocumentSchema: z.ZodObject<{
    document_id: z.ZodString;
    filename: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strict", z.ZodTypeAny, {
    document_id: string;
    content?: string | undefined;
    filename?: string | undefined;
    tags?: string[] | undefined;
}, {
    document_id: string;
    content?: string | undefined;
    filename?: string | undefined;
    tags?: string[] | undefined;
}>;
export type UpdateDocumentInput = z.infer<typeof UpdateDocumentSchema>;
//# sourceMappingURL=knowledge.d.ts.map
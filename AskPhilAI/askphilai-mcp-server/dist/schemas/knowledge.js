import { z } from "zod";
import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT, SUPPORTED_DOCUMENT_TYPES } from "../constants.js";
// ─── Upload Document ────────────────────────────────────────
export const UploadDocumentSchema = z
    .object({
    filename: z
        .string()
        .min(1)
        .max(255)
        .describe("Name of the document file (e.g., 'guide.md')"),
    mime_type: z
        .enum(SUPPORTED_DOCUMENT_TYPES)
        .default("text/plain")
        .describe("MIME type of the document"),
    content: z
        .string()
        .min(1)
        .describe("Text content of the document"),
    tags: z
        .array(z.string().max(50))
        .optional()
        .default([])
        .describe("Tags for categorizing the document"),
})
    .strict();
// ─── List Documents ─────────────────────────────────────────
export const ListDocumentsSchema = z
    .object({
    limit: z
        .number()
        .int()
        .min(1)
        .max(MAX_PAGE_LIMIT)
        .default(DEFAULT_PAGE_LIMIT)
        .describe("Maximum number of documents to return"),
    offset: z
        .number()
        .int()
        .min(0)
        .default(0)
        .describe("Number of documents to skip for pagination"),
    tag: z
        .string()
        .max(50)
        .optional()
        .describe("Filter documents by tag"),
    search: z
        .string()
        .max(200)
        .optional()
        .describe("Search string to match against filename or content"),
})
    .strict();
// ─── Get Document ───────────────────────────────────────────
export const GetDocumentSchema = z
    .object({
    document_id: z.string().uuid().describe("ID of the document to retrieve"),
})
    .strict();
// ─── Delete Document ────────────────────────────────────────
export const DeleteDocumentSchema = z
    .object({
    document_id: z.string().uuid().describe("ID of the document to delete"),
})
    .strict();
// ─── Search Knowledge ───────────────────────────────────────
export const SearchKnowledgeSchema = z
    .object({
    query: z
        .string()
        .min(1)
        .max(500)
        .describe("Search query to match against all knowledge documents"),
    limit: z
        .number()
        .int()
        .min(1)
        .max(MAX_PAGE_LIMIT)
        .default(10)
        .describe("Maximum number of matching snippets to return"),
})
    .strict();
// ─── Update Document ────────────────────────────────────────
export const UpdateDocumentSchema = z
    .object({
    document_id: z.string().uuid().describe("ID of the document to update"),
    filename: z
        .string()
        .min(1)
        .max(255)
        .optional()
        .describe("New filename"),
    content: z
        .string()
        .min(1)
        .optional()
        .describe("Replacement content for the document"),
    tags: z
        .array(z.string().max(50))
        .optional()
        .describe("Replacement tags (overwrites existing)"),
})
    .strict();
//# sourceMappingURL=knowledge.js.map
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { v4 as uuidv4 } from "uuid";
import { loadStore, saveStore, paginate } from "../services/storage.js";
import {
  UploadDocumentSchema,
  ListDocumentsSchema,
  GetDocumentSchema,
  DeleteDocumentSchema,
  SearchKnowledgeSchema,
  UpdateDocumentSchema,
  type UploadDocumentInput,
  type ListDocumentsInput,
  type GetDocumentInput,
  type DeleteDocumentInput,
  type SearchKnowledgeInput,
  type UpdateDocumentInput,
} from "../schemas/knowledge.js";
import type { KnowledgeDocument } from "../types.js";
import { CHARACTER_LIMIT, MAX_DOCUMENT_SIZE } from "../constants.js";

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "\n…[truncated]" : text;
}

function formatDocSummary(doc: KnowledgeDocument): string {
  return `- **${doc.filename}** (${doc.id}) – ${doc.mimeType}, ${(doc.sizeBytes / 1024).toFixed(1)} KB, tags: [${doc.tags.join(", ")}], updated ${doc.updatedAt}`;
}

export function registerKnowledgeTools(server: McpServer): void {
  // ─── Upload Document ────────────────────────────────────

  server.registerTool(
    "askphilai_upload_document",
    {
      title: "Upload Document",
      description: `Upload a text document to the AskPhilAI knowledge base.

Args:
  - filename (string): Document filename (e.g., 'guide.md')
  - mime_type (string): MIME type (default 'text/plain'). Supported: text/plain, text/markdown, text/html, text/csv, application/pdf, application/json
  - content (string): Full text content of the document
  - tags (string[], optional): Tags for categorization

Returns:
  The created document object with its generated ID.

Error Handling:
  - Returns error if content exceeds 5 MB.`,
      inputSchema: UploadDocumentSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (params: UploadDocumentInput) => {
      const sizeBytes = Buffer.byteLength(params.content, "utf-8");
      if (sizeBytes > MAX_DOCUMENT_SIZE) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: Document exceeds maximum size of ${MAX_DOCUMENT_SIZE / 1024 / 1024} MB. Current size: ${(sizeBytes / 1024 / 1024).toFixed(2)} MB.` }],
        };
      }

      const store = loadStore();
      const now = new Date().toISOString();
      const doc: KnowledgeDocument = {
        id: uuidv4(),
        filename: params.filename,
        mimeType: params.mime_type,
        content: params.content,
        tags: params.tags ?? [],
        createdAt: now,
        updatedAt: now,
        sizeBytes,
      };

      store.documents[doc.id] = doc;
      saveStore(store);

      const output = { id: doc.id, filename: doc.filename, sizeBytes: doc.sizeBytes, tags: doc.tags };
      return {
        content: [{ type: "text" as const, text: `Document uploaded.\n\n${formatDocSummary(doc)}` }],
        structuredContent: output,
      };
    }
  );

  // ─── List Documents ─────────────────────────────────────

  server.registerTool(
    "askphilai_list_documents",
    {
      title: "List Documents",
      description: `List documents in the knowledge base with optional filtering and pagination.

Args:
  - limit (number, 1–100, default 20): Max documents to return
  - offset (number, default 0): Pagination offset
  - tag (string, optional): Filter by tag
  - search (string, optional): Search in filename or content

Returns:
  Paginated list of document summaries.`,
      inputSchema: ListDocumentsSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: ListDocumentsInput) => {
      const store = loadStore();
      let docs = Object.values(store.documents).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      if (params.tag) {
        const t = params.tag.toLowerCase();
        docs = docs.filter((d) => d.tags.some((tag) => tag.toLowerCase() === t));
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        docs = docs.filter(
          (d) => d.filename.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)
        );
      }

      const page = paginate(docs, params.offset, params.limit);
      const lines = page.items.map(formatDocSummary);
      const header = `Showing ${page.count} of ${page.total} documents (offset ${params.offset})`;
      const text = truncate([header, "", ...lines].join("\n"), CHARACTER_LIMIT);

      return {
        content: [{ type: "text" as const, text }],
        structuredContent: {
          ...page,
          items: page.items.map(({ id, filename, mimeType, tags, sizeBytes, createdAt, updatedAt }) => ({
            id, filename, mimeType, tags, sizeBytes, createdAt, updatedAt,
          })),
        },
      };
    }
  );

  // ─── Get Document ───────────────────────────────────────

  server.registerTool(
    "askphilai_get_document",
    {
      title: "Get Document",
      description: `Retrieve a single document including its full content.

Args:
  - document_id (string, uuid): ID of the document

Returns:
  Complete document object with content.`,
      inputSchema: GetDocumentSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: GetDocumentInput) => {
      const store = loadStore();
      const doc = store.documents[params.document_id];
      if (!doc) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: Document '${params.document_id}' not found. Use askphilai_list_documents to see available documents.` }],
        };
      }

      const text = truncate(
        [`# ${doc.filename}`, `**ID:** ${doc.id}`, `**Type:** ${doc.mimeType}`, `**Size:** ${(doc.sizeBytes / 1024).toFixed(1)} KB`, `**Tags:** ${doc.tags.join(", ") || "none"}`, `**Created:** ${doc.createdAt}`, `**Updated:** ${doc.updatedAt}`, "", "---", "", doc.content].join("\n"),
        CHARACTER_LIMIT
      );
      return {
        content: [{ type: "text" as const, text }],
        structuredContent: doc,
      };
    }
  );

  // ─── Update Document ────────────────────────────────────

  server.registerTool(
    "askphilai_update_document",
    {
      title: "Update Document",
      description: `Update a document's filename, content, or tags.

Args:
  - document_id (string, uuid): ID of the document to update
  - filename (string, optional): New filename
  - content (string, optional): Replacement content
  - tags (string[], optional): Replacement tags

Returns:
  Updated document summary.`,
      inputSchema: UpdateDocumentSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: UpdateDocumentInput) => {
      const store = loadStore();
      const doc = store.documents[params.document_id];
      if (!doc) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: Document '${params.document_id}' not found.` }],
        };
      }

      if (params.filename) doc.filename = params.filename;
      if (params.content) {
        const sizeBytes = Buffer.byteLength(params.content, "utf-8");
        if (sizeBytes > MAX_DOCUMENT_SIZE) {
          return {
            isError: true,
            content: [{ type: "text" as const, text: `Error: Updated content exceeds maximum size of ${MAX_DOCUMENT_SIZE / 1024 / 1024} MB.` }],
          };
        }
        doc.content = params.content;
        doc.sizeBytes = sizeBytes;
      }
      if (params.tags) doc.tags = params.tags;
      doc.updatedAt = new Date().toISOString();
      saveStore(store);

      return {
        content: [{ type: "text" as const, text: `Document updated.\n\n${formatDocSummary(doc)}` }],
        structuredContent: { id: doc.id, filename: doc.filename, updatedAt: doc.updatedAt },
      };
    }
  );

  // ─── Delete Document ────────────────────────────────────

  server.registerTool(
    "askphilai_delete_document",
    {
      title: "Delete Document",
      description: `Permanently delete a document from the knowledge base.

Args:
  - document_id (string, uuid): ID of the document to delete

Returns:
  Confirmation with deleted document's filename.`,
      inputSchema: DeleteDocumentSchema.shape,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async (params: DeleteDocumentInput) => {
      const store = loadStore();
      const doc = store.documents[params.document_id];
      if (!doc) {
        return {
          isError: true,
          content: [{ type: "text" as const, text: `Error: Document '${params.document_id}' not found.` }],
        };
      }

      const filename = doc.filename;
      delete store.documents[params.document_id];
      saveStore(store);

      return {
        content: [{ type: "text" as const, text: `Document "${filename}" (${params.document_id}) deleted.` }],
        structuredContent: { deleted: true, id: params.document_id, filename },
      };
    }
  );

  // ─── Search Knowledge ───────────────────────────────────

  server.registerTool(
    "askphilai_search_knowledge",
    {
      title: "Search Knowledge Base",
      description: `Search across all knowledge documents for relevant content snippets.

Performs a case-insensitive substring search across document filenames and content, returning matching snippets with surrounding context.

Args:
  - query (string): Search query (1–500 chars)
  - limit (number, 1–100, default 10): Max snippets to return

Returns:
  List of matching snippets with document ID, filename, and context.

Examples:
  - "Find info about authentication" → query="authentication"
  - "Search for deployment steps" → query="deployment"`,
      inputSchema: SearchKnowledgeSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: SearchKnowledgeInput) => {
      const store = loadStore();
      const docs = Object.values(store.documents);
      const q = params.query.toLowerCase();

      interface Snippet {
        documentId: string;
        filename: string;
        snippet: string;
        position: number;
      }

      const snippets: Snippet[] = [];
      const CONTEXT_CHARS = 200;

      for (const doc of docs) {
        const lower = doc.content.toLowerCase();
        let idx = lower.indexOf(q);
        while (idx !== -1 && snippets.length < params.limit) {
          const start = Math.max(0, idx - CONTEXT_CHARS);
          const end = Math.min(doc.content.length, idx + q.length + CONTEXT_CHARS);
          snippets.push({
            documentId: doc.id,
            filename: doc.filename,
            snippet: (start > 0 ? "…" : "") + doc.content.slice(start, end) + (end < doc.content.length ? "…" : ""),
            position: idx,
          });
          idx = lower.indexOf(q, idx + q.length);
        }
        if (snippets.length >= params.limit) break;
      }

      if (snippets.length === 0) {
        return {
          content: [{ type: "text" as const, text: `No results found for "${params.query}".` }],
          structuredContent: { total: 0, snippets: [] },
        };
      }

      const lines = snippets.map(
        (s, i) => `### ${i + 1}. ${s.filename} (pos ${s.position})\n\`\`\`\n${s.snippet}\n\`\`\``
      );
      const text = truncate(
        [`Found ${snippets.length} match(es) for "${params.query}"`, "", ...lines].join("\n"),
        CHARACTER_LIMIT
      );

      return {
        content: [{ type: "text" as const, text }],
        structuredContent: { total: snippets.length, snippets },
      };
    }
  );
}

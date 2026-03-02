/** Maximum characters for a single tool response */
export const CHARACTER_LIMIT = 50_000;

/** Default pagination limit */
export const DEFAULT_PAGE_LIMIT = 20;

/** Maximum pagination limit */
export const MAX_PAGE_LIMIT = 100;

/** Default data directory for persistent storage */
export const DATA_DIR = process.env.ASKPHILAI_DATA_DIR || "./data";

/** Maximum document content size (5 MB) */
export const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

/** Supported document MIME types */
export const SUPPORTED_DOCUMENT_TYPES = [
  "text/plain",
  "text/markdown",
  "text/html",
  "text/csv",
  "application/pdf",
  "application/json",
] as const;

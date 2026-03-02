# AskPhilAI MCP Server

An MCP (Model Context Protocol) server that powers the AskPhilAI chatbot platform, providing chat management, a document knowledge base, and admin configuration — all persisted to local JSON storage.

## Features

| Domain | Tools | Description |
|--------|-------|-------------|
| **Chat** | 6 tools | Create, list, get, update, delete chats; send messages |
| **Knowledge** | 7 tools | Upload, list, get, update, delete documents; search knowledge base |
| **Admin** | 3 tools | Get/update settings; dashboard stats |

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Run (stdio – default)
npm start

# Run (HTTP)
TRANSPORT=http PORT=3000 npm start
```

## Transport Modes

| Mode | Env Var | Use Case |
|------|---------|----------|
| **stdio** (default) | `TRANSPORT=stdio` | Local use, Claude Code, desktop apps |
| **HTTP** | `TRANSPORT=http` | Remote access, multi-client, web apps |

The HTTP server exposes:
- `POST /mcp` – MCP protocol endpoint
- `GET /health` – Health check

## Configuration

| Env Variable | Default | Description |
|---|---|---|
| `TRANSPORT` | `stdio` | Transport mode: `stdio` or `http` |
| `PORT` | `3000` | HTTP port (only when `TRANSPORT=http`) |
| `ASKPHILAI_DATA_DIR` | `./data` | Directory for persistent JSON storage |

## Tools Reference

### Chat Tools
- `askphilai_create_chat` – Start a new chat session
- `askphilai_send_message` – Add a message (user/assistant/system) to a chat
- `askphilai_list_chats` – List chats with search and pagination
- `askphilai_get_chat` – Get a chat with full message history
- `askphilai_update_chat` – Update chat title or metadata
- `askphilai_delete_chat` – Permanently delete a chat

### Knowledge Tools
- `askphilai_upload_document` – Upload a text document to the knowledge base
- `askphilai_list_documents` – List documents with tag/search filtering
- `askphilai_get_document` – Retrieve a document and its content
- `askphilai_update_document` – Update filename, content, or tags
- `askphilai_delete_document` – Remove a document from the knowledge base
- `askphilai_search_knowledge` – Full-text search across all documents

### Admin Tools
- `askphilai_get_settings` – View current app settings
- `askphilai_update_settings` – Change system prompt, model, temperature, etc.
- `askphilai_get_stats` – Dashboard statistics (chat count, doc count, KB size)

## Claude Desktop / Claude Code Configuration

Add to your `claude_desktop_config.json` or MCP settings:

```json
{
  "mcpServers": {
    "askphilai": {
      "command": "node",
      "args": ["/path/to/askphilai-mcp-server/dist/index.js"],
      "env": {
        "ASKPHILAI_DATA_DIR": "/path/to/your/data"
      }
    }
  }
}
```

## Data Storage

All data is stored as JSON in the configured data directory (`./data` by default):

```
data/
└── store.json   # Chats, documents, and settings
```

The store is created automatically on first run with sensible defaults.

## Development

```bash
# Watch mode
npm run dev

# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

## License

MIT

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { registerChatTools } from "./tools/chat.js";
import { registerKnowledgeTools } from "./tools/knowledge.js";
import { registerAdminTools } from "./tools/admin.js";
// ─── Server Setup ─────────────────────────────────────────
function createServer() {
    const server = new McpServer({
        name: "askphilai-mcp-server",
        version: "1.0.0",
    });
    // Register all tool groups
    registerChatTools(server);
    registerKnowledgeTools(server);
    registerAdminTools(server);
    return server;
}
// ─── stdio Transport ──────────────────────────────────────
async function runStdio() {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[askphilai-mcp] Running via stdio transport");
}
// ─── Streamable HTTP Transport ────────────────────────────
async function runHTTP() {
    const app = express();
    app.use(express.json());
    // Health check endpoint
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", server: "askphilai-mcp-server", version: "1.0.0" });
    });
    // MCP endpoint – stateless per-request transport
    app.post("/mcp", async (req, res) => {
        const server = createServer();
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        });
        res.on("close", () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    const port = parseInt(process.env.PORT || "3000", 10);
    app.listen(port, () => {
        console.error(`[askphilai-mcp] HTTP server listening on http://localhost:${port}/mcp`);
    });
}
// ─── Entrypoint ───────────────────────────────────────────
const transport = process.env.TRANSPORT || "stdio";
if (transport === "http") {
    runHTTP().catch((error) => {
        console.error("[askphilai-mcp] Fatal error:", error);
        process.exit(1);
    });
}
else {
    runStdio().catch((error) => {
        console.error("[askphilai-mcp] Fatal error:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map
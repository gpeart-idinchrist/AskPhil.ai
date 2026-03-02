import { useState, useEffect, useRef, useCallback } from "react";

// ─── Admin Config (mirrors your admin portal settings) ──────
const CONFIG = {
  brandName: "AskPhilAI",
  welcomeMessage: "Hello! I'm AskPhilAI. How can I help you today?",
  systemPrompt:
    "You are AskPhilAI, a helpful and knowledgeable AI assistant. Answer questions clearly and concisely. Be warm, professional, and thorough.",
  model: "claude-sonnet-4-20250514",
  temperature: 0.7,
  maxTokens: 4096,
  accent: "#6366f1",
  accentLight: "#818cf8",
  enableHistory: true,
};

// ─── Keyframes via style tag ────────────────────────────────
const STYLES = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes dotBounce1 {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }
  @keyframes dotBounce2 {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }
  @keyframes dotBounce3 {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }

  .chat-input:focus { 
    border-color: ${CONFIG.accent}50 !important;
    box-shadow: 0 0 0 3px ${CONFIG.accent}15, 0 2px 12px rgba(0,0,0,0.2) !important;
  }
  .send-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 20px ${CONFIG.accent}40;
  }
  .send-btn:active:not(:disabled) { transform: scale(0.95); }
  .history-item:hover { background: rgba(255,255,255,0.04) !important; }
  .new-chat-btn:hover { background: ${CONFIG.accent} !important; color: #fff !important; }
  .suggestion:hover { 
    background: rgba(255,255,255,0.06) !important; 
    border-color: ${CONFIG.accent}40 !important;
    transform: translateY(-1px);
  }

  * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent; }
  *::-webkit-scrollbar { width: 5px; }
  *::-webkit-scrollbar-track { background: transparent; }
  *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
`;

// ─── Theme ──────────────────────────────────────────────────
const t = {
  bg: "#09090b",
  bgPanel: "#111113",
  bgCard: "#18181b",
  bgBubbleAi: "#1c1c20",
  bgBubbleUser: CONFIG.accent,
  border: "rgba(255,255,255,0.06)",
  text: "#fafafa",
  textSoft: "#d4d4d8",
  textMuted: "#71717a",
  accent: CONFIG.accent,
  accentLight: CONFIG.accentLight,
  font: "'Outfit', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ─── Typing Indicator ───────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, animation: "fadeInUp 0.3s ease" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
      }}>φ</div>
      <div style={{
        background: t.bgBubbleAi, border: `1px solid ${t.border}`,
        borderRadius: "4px 16px 16px 16px", padding: "14px 18px",
        display: "flex", gap: 5, alignItems: "center",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: t.accent,
            animation: `dotBounce${i + 1} 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Message Bubble ─────────────────────────────────────────
function MessageBubble({ message, isLast }) {
  const isUser = message.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 10,
      animation: isLast ? `${isUser ? "slideInRight" : "slideInLeft"} 0.35s ease` : "none",
      maxWidth: "100%",
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700, color: "#fff",
        }}>φ</div>
      )}
      <div style={{
        maxWidth: "72%",
        padding: "12px 16px",
        borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
        background: isUser ? `linear-gradient(135deg, ${t.accent}, ${t.accentLight})` : t.bgBubbleAi,
        color: isUser ? "#fff" : t.textSoft,
        border: isUser ? "none" : `1px solid ${t.border}`,
        fontSize: 14,
        lineHeight: 1.65,
        fontWeight: 400,
        wordBreak: "break-word",
        boxShadow: isUser
          ? `0 2px 16px ${t.accent}25`
          : "0 2px 8px rgba(0,0,0,0.15)",
        whiteSpace: "pre-wrap",
      }}>
        {message.content}
      </div>
      <div style={{
        fontSize: 10, color: t.textMuted, flexShrink: 0,
        alignSelf: "flex-end", marginBottom: 2,
      }}>
        {message.time}
      </div>
    </div>
  );
}

// ─── Welcome Screen ─────────────────────────────────────────
function WelcomeScreen({ onSuggestion }) {
  const suggestions = [
    { icon: "💡", text: "What can you help me with?" },
    { icon: "📚", text: "Tell me about your knowledge base" },
    { icon: "🚀", text: "How do I get started?" },
    { icon: "🔧", text: "What features do you offer?" },
  ];

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 20px", textAlign: "center",
      animation: "fadeIn 0.6s ease",
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, fontWeight: 800, color: "#fff",
        marginBottom: 24,
        boxShadow: `0 8px 40px ${t.accent}30`,
        animation: "float 4s ease-in-out infinite",
      }}>φ</div>

      <h1 style={{
        fontSize: 28, fontWeight: 700, color: t.text,
        letterSpacing: -0.5, marginBottom: 8,
        fontFamily: t.font,
      }}>{CONFIG.welcomeMessage}</h1>

      <p style={{
        fontSize: 15, color: t.textMuted, maxWidth: 420,
        lineHeight: 1.6, marginBottom: 36,
      }}>
        I'm your AI assistant, ready to answer questions, explain concepts, and help you explore the knowledge base.
      </p>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 10, width: "100%", maxWidth: 460,
      }}>
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="suggestion"
            onClick={() => onSuggestion(s.text)}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${t.border}`,
              borderRadius: 12, padding: "14px 16px",
              cursor: "pointer", textAlign: "left",
              transition: "all 0.2s ease",
              animation: `fadeInUp 0.4s ease ${i * 0.08}s both`,
            }}
          >
            <span style={{ fontSize: 18, marginRight: 8 }}>{s.icon}</span>
            <span style={{ fontSize: 13, color: t.textSoft, fontWeight: 500 }}>{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chat History Sidebar ───────────────────────────────────
function HistorySidebar({ chats, activeId, onSelect, onNew, collapsed }) {
  if (collapsed) return null;
  return (
    <div style={{
      width: 260, background: t.bgPanel,
      borderRight: `1px solid ${t.border}`,
      display: "flex", flexDirection: "column",
      flexShrink: 0, animation: "fadeIn 0.25s ease",
    }}>
      <div style={{ padding: "16px 16px 12px" }}>
        <button
          className="new-chat-btn"
          onClick={onNew}
          style={{
            width: "100%", padding: "10px 14px",
            background: "transparent",
            border: `1px dashed ${t.accent}60`,
            borderRadius: 10, color: t.accent,
            fontSize: 13, fontWeight: 600,
            fontFamily: t.font, cursor: "pointer",
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: 6,
            transition: "all 0.2s ease",
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      <div style={{ padding: "0 10px 6px" }}>
        <span style={{
          fontSize: 10, fontWeight: 600, color: t.textMuted,
          textTransform: "uppercase", letterSpacing: 1.2, padding: "0 6px",
        }}>History</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px" }}>
        {chats.length === 0 && (
          <div style={{ padding: "20px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 13, color: t.textMuted }}>No conversations yet</div>
          </div>
        )}
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="history-item"
            onClick={() => onSelect(chat.id)}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              cursor: "pointer",
              marginBottom: 2,
              background: activeId === chat.id ? `${t.accent}15` : "transparent",
              borderLeft: activeId === chat.id ? `2px solid ${t.accent}` : "2px solid transparent",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{
              fontSize: 13, fontWeight: activeId === chat.id ? 600 : 500,
              color: activeId === chat.id ? t.text : t.textSoft,
              whiteSpace: "nowrap", overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{chat.title}</div>
            <div style={{
              fontSize: 11, color: t.textMuted, marginTop: 3,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>{chat.messageCount} messages</span>
              <span>·</span>
              <span>{chat.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: "12px 14px", borderTop: `1px solid ${t.border}`,
        fontSize: 11, color: t.textMuted, textAlign: "center",
      }}>
        Powered by <span style={{ color: t.accent, fontWeight: 600 }}>{CONFIG.brandName}</span>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────
export default function AskPhilAIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: "h1", title: "Getting started with AskPhilAI", messageCount: 4, time: "Today" },
    { id: "h2", title: "Knowledge base questions", messageCount: 8, time: "Yesterday" },
    { id: "h3", title: "API integration help", messageCount: 12, time: "2 days ago" },
  ]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = { role: "user", content: text.trim(), time: getTimeString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Set active chat
    if (!activeChatId) {
      const newId = "h" + Date.now();
      const title = text.trim().slice(0, 50) + (text.trim().length > 50 ? "…" : "");
      setChatHistory(prev => [{ id: newId, title, messageCount: 1, time: "Just now" }, ...prev]);
      setActiveChatId(newId);
    }

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: CONFIG.model,
          max_tokens: CONFIG.maxTokens,
          system: CONFIG.systemPrompt,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const aiText = data.content
        ?.map((block) => (block.type === "text" ? block.text : ""))
        .filter(Boolean)
        .join("\n") || "I'm sorry, I wasn't able to generate a response. Please try again.";

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: aiText, time: getTimeString() },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please check your connection and try again.",
          time: getTimeString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    inputRef.current?.focus();
  };

  const hasMessages = messages.length > 0;

  return (
    <div style={{
      fontFamily: t.font, background: t.bg,
      color: t.text, display: "flex",
      height: "100vh", width: "100vw", overflow: "hidden",
    }}>
      <style>{STYLES}</style>

      {/* Background texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse at 20% 20%, ${t.accent}08 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 80%, ${t.accentLight}05 0%, transparent 50%)`,
      }} />

      {/* Sidebar */}
      {CONFIG.enableHistory && (
        <HistorySidebar
          chats={chatHistory}
          activeId={activeChatId}
          onSelect={(id) => setActiveChatId(id)}
          onNew={handleNewChat}
          collapsed={!showSidebar}
        />
      )}

      {/* Main Chat Area */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        position: "relative", zIndex: 1,
      }}>
        {/* Header */}
        <div style={{
          height: 60, flexShrink: 0,
          background: `${t.bgPanel}ee`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${t.border}`,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {CONFIG.enableHistory && (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                style={{
                  background: "none", border: "none",
                  color: t.textMuted, cursor: "pointer", padding: 4,
                  display: "flex", borderRadius: 6,
                }}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#fff",
            }}>φ</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.3 }}>
                {CONFIG.brandName}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#34d399",
                  boxShadow: "0 0 8px #34d39960",
                }} />
                <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 500 }}>Online</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {hasMessages && (
              <button
                onClick={handleNewChat}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${t.border}`,
                  borderRadius: 8, padding: "6px 12px",
                  color: t.textMuted, fontSize: 12,
                  fontWeight: 600, fontFamily: t.font,
                  cursor: "pointer", display: "flex",
                  alignItems: "center", gap: 5,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.accent}40`; e.currentTarget.style.color = t.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textMuted; }}
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New
              </button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1, overflowY: "auto",
          display: "flex", flexDirection: "column",
        }}>
          {!hasMessages ? (
            <WelcomeScreen onSuggestion={(text) => sendMessage(text)} />
          ) : (
            <div style={{
              flex: 1, padding: "24px 24px 12px",
              display: "flex", flexDirection: "column",
              gap: 20, maxWidth: 800, width: "100%",
              margin: "0 auto",
            }}>
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  message={msg}
                  isLast={i === messages.length - 1}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          flexShrink: 0, padding: "12px 24px 20px",
          background: `linear-gradient(to top, ${t.bg} 60%, transparent)`,
        }}>
          <div style={{
            maxWidth: 800, margin: "0 auto",
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            borderRadius: 16,
            display: "flex", alignItems: "flex-end",
            padding: "6px 6px 6px 16px",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
            onFocus={() => {}}
          >
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              style={{
                flex: 1, resize: "none",
                background: "transparent",
                border: "none", outline: "none",
                color: t.text, fontSize: 14,
                fontFamily: t.font, fontWeight: 400,
                padding: "10px 0",
                lineHeight: 1.5,
                maxHeight: 120,
              }}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              style={{
                width: 40, height: 40, flexShrink: 0,
                borderRadius: 12,
                background: input.trim() && !isTyping
                  ? `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`
                  : "rgba(255,255,255,0.05)",
                border: "none",
                color: input.trim() && !isTyping ? "#fff" : t.textMuted,
                cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>

          <div style={{
            textAlign: "center", marginTop: 10,
            fontSize: 11, color: t.textMuted,
          }}>
            {CONFIG.brandName} can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
}

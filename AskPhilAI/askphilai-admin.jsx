import { useState, useEffect, useCallback } from "react";

// ─── Design Tokens ───────────────────────────────────────────
const T = {
  bgRoot: "#0e0f11",
  bgSidebar: "#141518",
  bgCard: "#1a1b1f",
  bgCardHover: "#222328",
  bgInput: "#16171b",
  border: "rgba(255,255,255,0.06)",
  borderFocus: "rgba(99,102,241,0.5)",
  textPrimary: "#f4f4f5",
  textSecondary: "#e4e4e7",
  textMuted: "#71717a",
  accent: "#6366f1",
  accentHover: "#818cf8",
  accentFaded: "rgba(99,102,241,0.12)",
  success: "#34d399",
  successFaded: "rgba(52,211,153,0.12)",
  warning: "#fbbf24",
  warningFaded: "rgba(251,191,36,0.12)",
  danger: "#f87171",
  dangerFaded: "rgba(248,113,113,0.12)",
  radius: 12,
  radiusSm: 8,
  font: "'DM Sans', sans-serif",
};

// ─── SVG Icons ───────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  chat: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  knowledge: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <line x1="9" y1="7" x2="16" y2="7" />
      <line x1="9" y1="11" x2="14" y2="11" />
    </svg>
  ),
  ai: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  brand: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  integrations: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  upload: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  trash: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  eye: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  copy: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  arrowUp: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  arrowDown: (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
};

// ─── Pages Config ────────────────────────────────────────────
const PAGES = [
  { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { id: "conversations", label: "Conversations", icon: Icons.chat },
  { id: "knowledge", label: "Knowledge Base", icon: Icons.knowledge },
  { id: "ai-config", label: "AI Configuration", icon: Icons.ai },
  { id: "branding", label: "Branding", icon: Icons.brand },
  { id: "integrations", label: "Integrations", icon: Icons.integrations },
];

// ─── Reusable Components ─────────────────────────────────────

function Card({ children, style, hover, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: hovered ? T.bgCardHover : T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        padding: 20,
        transition: "all 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, change, up, icon }) {
  return (
    <Card style={{ flex: 1, minWidth: 180 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
            {label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.textPrimary, letterSpacing: -0.5 }}>
            {value}
          </div>
        </div>
        {icon && (
          <div style={{ color: T.accent, opacity: 0.5, marginTop: 2 }}>{icon}</div>
        )}
      </div>
      {change && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: 12, fontWeight: 600, color: up ? T.success : T.danger }}>
          {up ? Icons.arrowUp : Icons.arrowDown}
          <span>{change}</span>
          <span style={{ color: T.textMuted, fontWeight: 400, marginLeft: 4 }}>vs last period</span>
        </div>
      )}
    </Card>
  );
}

function Toggle({ on, onToggle, label }) {
  return (
    <div
      onClick={onToggle}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "10px 0" }}
    >
      <span style={{ fontSize: 13, color: T.textSecondary }}>{label}</span>
      <div
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: on ? T.accent : "rgba(255,255,255,0.1)",
          position: "relative",
          transition: "background 0.2s ease",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: "#fff",
            position: "absolute",
            top: 3,
            left: on ? 21 : 3,
            transition: "left 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}

function Badge({ text, color }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        padding: "3px 8px",
        borderRadius: 6,
        color,
        background: color + "1a",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function Button({ children, variant = "primary", style: customStyle, onClick, disabled, small }) {
  const [hovered, setHovered] = useState(false);
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: small ? 12 : 13,
    fontWeight: 600,
    fontFamily: T.font,
    padding: small ? "6px 12px" : "9px 16px",
    borderRadius: T.radiusSm,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all 0.15s ease",
  };
  const variants = {
    primary: { background: hovered ? T.accentHover : T.accent, color: "#fff" },
    secondary: { background: hovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)", color: T.textSecondary, border: `1px solid ${T.border}` },
    danger: { background: hovered ? "#ef4444" : T.dangerFaded, color: T.danger },
    ghost: { background: hovered ? "rgba(255,255,255,0.06)" : "transparent", color: T.textMuted },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...variants[variant], ...customStyle }}
    >
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, textarea, type = "text", style: customStyle }) {
  const Comp = textarea ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 16, ...customStyle }}>
      {label && (
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
          {label}
        </label>
      )}
      <Comp
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={textarea ? 5 : undefined}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          fontSize: 13,
          fontFamily: T.font,
          color: T.textPrimary,
          background: T.bgInput,
          border: `1px solid ${T.border}`,
          borderRadius: T.radiusSm,
          outline: "none",
          resize: textarea ? "vertical" : "none",
          transition: "border-color 0.15s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = T.borderFocus)}
        onBlur={(e) => (e.target.style.borderColor = T.border)}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 13,
          fontFamily: T.font,
          color: T.textPrimary,
          background: T.bgInput,
          border: `1px solid ${T.border}`,
          borderRadius: T.radiusSm,
          outline: "none",
          cursor: "pointer",
          appearance: "none",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 20, maxWidth: 360, margin: "0 auto 20px" }}>{description}</div>
      {action}
    </div>
  );
}

// ─── SAMPLE DATA ─────────────────────────────────────────────
const SAMPLE_CHATS = [
  { id: "c1", title: "Help with React hooks", messages: 12, lastMessage: "Thanks, that cleared things up!", status: "resolved", time: "2 min ago", avatar: "🧑‍💻" },
  { id: "c2", title: "Deployment troubleshooting", messages: 8, lastMessage: "I'm still getting the 502 error...", status: "active", time: "5 min ago", avatar: "👩‍🔧" },
  { id: "c3", title: "API rate limiting question", messages: 4, lastMessage: "What's the recommended approach?", status: "active", time: "12 min ago", avatar: "🧑‍🔬" },
  { id: "c4", title: "Database migration help", messages: 22, lastMessage: "Migration completed successfully!", status: "resolved", time: "1 hr ago", avatar: "🧑‍💼" },
  { id: "c5", title: "CSS Grid layout issue", messages: 6, lastMessage: "Let me try that approach.", status: "waiting", time: "3 hr ago", avatar: "🎨" },
  { id: "c6", title: "Authentication flow design", messages: 15, lastMessage: "OAuth2 with PKCE sounds right.", status: "resolved", time: "5 hr ago", avatar: "🔐" },
];

const SAMPLE_DOCS = [
  { id: "d1", filename: "getting-started.md", type: "text/markdown", size: "12.4 KB", tags: ["guide", "onboarding"], updated: "2 days ago" },
  { id: "d2", filename: "api-reference.json", type: "application/json", size: "45.2 KB", tags: ["api", "reference"], updated: "1 week ago" },
  { id: "d3", filename: "faq.md", type: "text/markdown", size: "8.1 KB", tags: ["faq", "support"], updated: "3 days ago" },
  { id: "d4", filename: "troubleshooting.md", type: "text/markdown", size: "15.7 KB", tags: ["support", "debug"], updated: "5 days ago" },
  { id: "d5", filename: "changelog.md", type: "text/markdown", size: "22.0 KB", tags: ["release"], updated: "1 day ago" },
];

const INTEGRATIONS = [
  { id: "i1", name: "Slack", desc: "Send notifications and receive commands", icon: "💬", connected: true, color: "#4A154B" },
  { id: "i2", name: "GitHub", desc: "Link repos and track issues", icon: "🐙", connected: true, color: "#333" },
  { id: "i3", name: "Notion", desc: "Sync knowledge base pages", icon: "📝", connected: false, color: "#000" },
  { id: "i4", name: "Zapier", desc: "Automate workflows with 5000+ apps", icon: "⚡", connected: false, color: "#FF4A00" },
  { id: "i5", name: "Discord", desc: "Bot integration for communities", icon: "🎮", connected: false, color: "#5865F2" },
  { id: "i6", name: "Webhooks", desc: "Custom HTTP event callbacks", icon: "🔗", connected: true, color: "#6366f1" },
];

// ─── PAGE: Dashboard ─────────────────────────────────────────
function DashboardPage() {
  const recentChats = SAMPLE_CHATS.slice(0, 4);
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, letterSpacing: -0.5, marginBottom: 4 }}>Dashboard</div>
      <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 28 }}>Overview of your AskPhilAI instance</div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <StatCard label="Total Conversations" value="1,284" change="+12.5%" up icon={Icons.chat} />
        <StatCard label="Messages Today" value="847" change="+8.2%" up icon={Icons.chat} />
        <StatCard label="Knowledge Docs" value="23" change="+2" up icon={Icons.knowledge} />
        <StatCard label="Avg. Response Time" value="1.2s" change="-0.3s" up icon={Icons.ai} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Recent Conversations</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: T.radiusSm,
                  transition: "background 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: 22 }}>{chat.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.title}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{chat.lastMessage}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: T.textMuted }}>{chat.time}</span>
                  <Badge
                    text={chat.status}
                    color={chat.status === "active" ? T.success : chat.status === "waiting" ? T.warning : T.textMuted}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Knowledge Base Activity</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SAMPLE_DOCS.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: T.radiusSm,
                  transition: "background 0.15s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, background: T.accentFaded, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, flexShrink: 0 }}>
                  {Icons.knowledge}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{doc.filename}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{doc.size} · Updated {doc.updated}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {doc.tags.map((tag) => (
                    <Badge key={tag} text={tag} color={T.accent} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Usage (Last 7 Days)</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
          {[65, 48, 72, 90, 55, 82, 95].map((val, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: "100%",
                  height: `${val}%`,
                  background: `linear-gradient(to top, ${T.accent}, ${T.accentHover})`,
                  borderRadius: 6,
                  minHeight: 8,
                  opacity: i === 6 ? 1 : 0.6,
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => { if (i !== 6) e.currentTarget.style.opacity = "0.6"; }}
              />
              <span style={{ fontSize: 10, color: T.textMuted, fontWeight: 500 }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── PAGE: Conversations ─────────────────────────────────────
function ConversationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = SAMPLE_CHATS.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, letterSpacing: -0.5 }}>Conversations</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{SAMPLE_CHATS.length} total conversations</div>
        </div>
        <Button>{Icons.plus} New Chat</Button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textMuted }}>{Icons.search}</div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px 10px 36px",
              fontSize: 13,
              fontFamily: T.font,
              color: T.textPrimary,
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: T.radiusSm,
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "waiting", "resolved"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "primary" : "secondary"}
              small
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 16 }}>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          {filtered.map((chat, i) => (
            <div
              key={chat.id}
              onClick={() => setSelected(selected === chat.id ? null : chat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 20px",
                cursor: "pointer",
                background: selected === chat.id ? "rgba(99,102,241,0.08)" : "transparent",
                borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => { if (selected !== chat.id) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
              onMouseLeave={(e) => { if (selected !== chat.id) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ fontSize: 28, flexShrink: 0 }}>{chat.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{chat.title}</span>
                  <Badge
                    text={chat.status}
                    color={chat.status === "active" ? T.success : chat.status === "waiting" ? T.warning : T.textMuted}
                  />
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {chat.lastMessage}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: T.textMuted }}>{chat.time}</span>
                <span style={{ fontSize: 11, color: T.textMuted }}>{chat.messages} msgs</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <EmptyState icon="🔍" title="No conversations found" description="Try adjusting your search or filter." />
          )}
        </Card>

        {selected && (() => {
          const chat = SAMPLE_CHATS.find((c) => c.id === selected);
          if (!chat) return null;
          const sampleMessages = [
            { role: "user", content: "Hey, I need some help with this.", time: "10:42 AM" },
            { role: "assistant", content: "Of course! I'd be happy to help. What specifically are you working on?", time: "10:42 AM" },
            { role: "user", content: chat.lastMessage, time: "10:45 AM" },
          ];
          return (
            <Card style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 28 }}>{chat.avatar}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary }}>{chat.title}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{chat.messages} messages · {chat.time}</div>
                  </div>
                </div>
                <Button variant="danger" small>{Icons.trash} Delete</Button>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                {sampleMessages.map((msg, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "10px 14px",
                        borderRadius: 12,
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: msg.role === "user" ? "#fff" : T.textSecondary,
                        background: msg.role === "user" ? T.accent : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {msg.content}
                      <div style={{ fontSize: 10, color: msg.role === "user" ? "rgba(255,255,255,0.6)" : T.textMuted, marginTop: 4 }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })()}
      </div>
    </div>
  );
}

// ─── PAGE: Knowledge Base ────────────────────────────────────
function KnowledgePage() {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const filtered = SAMPLE_DOCS.filter(
    (d) => !search || d.filename.toLowerCase().includes(search.toLowerCase()) || d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, letterSpacing: -0.5 }}>Knowledge Base</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Manage documents that power your AI's responses</div>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>{Icons.upload} Upload Document</Button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Total Documents" value={SAMPLE_DOCS.length.toString()} icon={Icons.knowledge} />
        <StatCard label="Total Size" value="103.4 KB" icon={Icons.knowledge} />
        <StatCard label="Categories" value="5" icon={Icons.knowledge} />
      </div>

      {showUpload && (
        <Card style={{ marginBottom: 20, border: `1px dashed ${T.accent}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Upload New Document</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Filename" value="" onChange={() => {}} placeholder="e.g., product-guide.md" />
            <Select
              label="Document Type"
              value="text/markdown"
              onChange={() => {}}
              options={[
                { value: "text/markdown", label: "Markdown" },
                { value: "text/plain", label: "Plain Text" },
                { value: "application/json", label: "JSON" },
                { value: "text/html", label: "HTML" },
                { value: "text/csv", label: "CSV" },
              ]}
            />
          </div>
          <Input label="Content" value="" onChange={() => {}} placeholder="Paste document content here..." textarea />
          <Input label="Tags" value="" onChange={() => {}} placeholder="e.g., guide, api, support (comma-separated)" />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowUpload(false)}>Cancel</Button>
            <Button>Upload</Button>
          </div>
        </Card>
      )}

      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textMuted }}>{Icons.search}</div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents by name or tag..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px 10px 36px",
            fontSize: 13,
            fontFamily: T.font,
            color: T.textPrimary,
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: T.radiusSm,
            outline: "none",
          }}
        />
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 100px 160px 100px",
            padding: "10px 20px",
            fontSize: 11,
            fontWeight: 600,
            color: T.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <span>Filename</span>
          <span>Type</span>
          <span>Size</span>
          <span>Tags</span>
          <span>Actions</span>
        </div>
        {filtered.map((doc, i) => (
          <div
            key={doc.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 100px 160px 100px",
              alignItems: "center",
              padding: "12px 20px",
              borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
              transition: "background 0.15s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 6, background: T.accentFaded, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {doc.filename.split(".").pop()?.toUpperCase().slice(0, 3)}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary }}>{doc.filename}</span>
            </div>
            <span style={{ fontSize: 12, color: T.textMuted }}>{doc.type.split("/")[1]}</span>
            <span style={{ fontSize: 12, color: T.textMuted }}>{doc.size}</span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {doc.tags.map((tag) => (
                <Badge key={tag} text={tag} color={T.accent} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <Button variant="ghost" small>{Icons.eye}</Button>
              <Button variant="ghost" small style={{ color: T.danger }}>{Icons.trash}</Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <EmptyState icon="📄" title="No documents found" description="Upload your first document to start building your knowledge base." />
        )}
      </Card>
    </div>
  );
}

// ─── PAGE: AI Configuration ──────────────────────────────────
function AIConfigPage() {
  const [systemPrompt, setSystemPrompt] = useState(
    "You are AskPhilAI, a helpful and knowledgeable AI assistant. Answer questions clearly and concisely, referencing uploaded knowledge documents when relevant."
  );
  const [model, setModel] = useState("claude-sonnet-4-20250514");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [knowledgeEnabled, setKnowledgeEnabled] = useState(true);
  const [historyEnabled, setHistoryEnabled] = useState(true);
  const [streaming, setStreaming] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, letterSpacing: -0.5 }}>AI Configuration</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Tune your AI assistant's behavior and capabilities</div>
        </div>
        <Button onClick={handleSave}>
          {saved ? Icons.check : null}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>System Prompt</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Define your AI's personality, behavior, and response style</div>
            <Input
              value={systemPrompt}
              onChange={setSystemPrompt}
              textarea
              placeholder="Enter system prompt..."
              style={{ marginBottom: 0 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: T.textMuted }}>{systemPrompt.length} / 10,000 characters</span>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Model Settings</div>
            <Select
              label="Model"
              value={model}
              onChange={setModel}
              options={[
                { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4 (Recommended)" },
                { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (Fast)" },
                { value: "claude-opus-4-6", label: "Claude Opus 4.6 (Most Capable)" },
              ]}
            />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
                Temperature: {temperature}
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, color: T.textMuted }}>Precise</span>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: T.accent }}
                />
                <span style={{ fontSize: 11, color: T.textMuted }}>Creative</span>
              </div>
            </div>
            <Input
              label="Max Tokens"
              type="number"
              value={maxTokens.toString()}
              onChange={(v) => setMaxTokens(parseInt(v) || 0)}
              placeholder="4096"
            />
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>Feature Toggles</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>Enable or disable core capabilities</div>
            <Toggle on={knowledgeEnabled} onToggle={() => setKnowledgeEnabled(!knowledgeEnabled)} label="Knowledge Base" />
            <Toggle on={historyEnabled} onToggle={() => setHistoryEnabled(!historyEnabled)} label="Chat History" />
            <Toggle on={streaming} onToggle={() => setStreaming(!streaming)} label="Streaming Responses" />
          </Card>

          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 4 }}>Quick Stats</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Current usage this month</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "API Calls", value: "12,847", pct: 64 },
                { label: "Tokens Used", value: "2.1M", pct: 42 },
                { label: "Storage", value: "103 KB", pct: 8 },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: T.textSecondary }}>{item.label}</span>
                    <span style={{ color: T.textPrimary, fontWeight: 600 }}>{item.value}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ height: "100%", width: `${item.pct}%`, borderRadius: 2, background: `linear-gradient(90deg, ${T.accent}, ${T.accentHover})` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ background: "rgba(99,102,241,0.06)", border: `1px solid rgba(99,102,241,0.15)` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.accent, marginBottom: 6 }}>💡 Pro Tip</div>
            <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>
              Lower temperature (0.1–0.3) works best for factual Q&A from your knowledge base. Increase to 0.7+ for more creative, conversational responses.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: Branding ──────────────────────────────────────────
function BrandingPage() {
  const [brandName, setBrandName] = useState("AskPhilAI");
  const [welcomeMsg, setWelcomeMsg] = useState("Hello! I'm AskPhilAI. How can I help you today?");
  const [accent, setAccent] = useState("#6366f1");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, letterSpacing: -0.5 }}>Branding</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Customize how your chatbot looks and feels</div>
        </div>
        <Button onClick={handleSave}>
          {saved ? Icons.check : null}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Identity</div>
            <Input label="Brand Name" value={brandName} onChange={setBrandName} placeholder="Your chatbot name" />
            <Input label="Welcome Message" value={welcomeMsg} onChange={setWelcomeMsg} placeholder="First message users see..." textarea />
          </Card>

          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Theme</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 }}>
                Accent Color
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  style={{ width: 40, height: 40, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }}
                />
                <span style={{ fontSize: 13, color: T.textSecondary, fontFamily: "monospace" }}>{accent}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6"].map((c) => (
                <div
                  key={c}
                  onClick={() => setAccent(c)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: c,
                    cursor: "pointer",
                    border: accent === c ? "2px solid #fff" : "2px solid transparent",
                    transition: "border-color 0.15s ease",
                  }}
                />
              ))}
            </div>
          </Card>
        </div>

        <Card style={{ height: "fit-content" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>Preview</div>
          <div
            style={{
              background: "#0a0a0b",
              borderRadius: 12,
              border: `1px solid ${T.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: accent,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                {brandName.charAt(0)}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{brandName}</span>
              <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: T.success }} />
            </div>

            <div style={{ padding: 16, minHeight: 200, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  AI
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px 12px 12px 12px", padding: "8px 12px", fontSize: 12, color: T.textSecondary, maxWidth: "80%" }}>
                  {welcomeMsg}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ background: accent, borderRadius: "12px 4px 12px 12px", padding: "8px 12px", fontSize: 12, color: "#fff", maxWidth: "80%" }}>
                  Tell me about your features
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  AI
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px 12px 12px 12px", padding: "8px 12px", fontSize: 12, color: T.textSecondary, maxWidth: "80%" }}>
                  I'd be happy to walk you through everything! ✨
                </div>
              </div>
            </div>

            <div style={{ padding: "8px 12px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
              <input
                placeholder="Type a message..."
                disabled
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  fontSize: 12,
                  fontFamily: T.font,
                  color: T.textMuted,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  outline: "none",
                }}
              />
              <button
                disabled
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: accent,
                  border: "none",
                  color: "#fff",
                  fontSize: 14,
                  cursor: "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ↑
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PAGE: Integrations ──────────────────────────────────────
function IntegrationsPage() {
  const [items, setItems] = useState(INTEGRATIONS);

  const toggle = (id) => {
    setItems(items.map((it) => (it.id === id ? { ...it, connected: !it.connected } : it)));
  };

  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, letterSpacing: -0.5, marginBottom: 4 }}>Integrations</div>
      <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 28 }}>Connect AskPhilAI to your favorite tools and services</div>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <StatCard label="Connected" value={items.filter((i) => i.connected).length.toString()} icon={Icons.integrations} />
        <StatCard label="Available" value={items.length.toString()} icon={Icons.integrations} />
        <StatCard label="Events Today" value="342" change="+18%" up icon={Icons.integrations} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {items.map((item) => (
          <Card key={item.id} hover>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary }}>{item.name}</div>
                  <Badge text={item.connected ? "Connected" : "Available"} color={item.connected ? T.success : T.textMuted} />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16, lineHeight: 1.5 }}>{item.desc}</div>
            <Button
              variant={item.connected ? "danger" : "primary"}
              small
              onClick={() => toggle(item.id)}
              style={{ width: "100%" }}
            >
              {item.connected ? "Disconnect" : "Connect"}
            </Button>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: 20, background: "rgba(99,102,241,0.04)", border: `1px solid rgba(99,102,241,0.1)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 24 }}>🔌</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>MCP Server Connection</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Your AskPhilAI MCP server is running locally via stdio transport</div>
          </div>
          <Badge text="Active" color={T.success} />
          <div style={{ marginLeft: "auto" }}>
            <Button variant="secondary" small>{Icons.copy} Copy Config</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Page Router ─────────────────────────────────────────────
const pageComponents = {
  dashboard: DashboardPage,
  conversations: ConversationsPage,
  knowledge: KnowledgePage,
  "ai-config": AIConfigPage,
  branding: BrandingPage,
  integrations: IntegrationsPage,
};

// ─── Main App ────────────────────────────────────────────────
export default function AskPhilAIAdmin() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarHover, setSidebarHover] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const PageComponent = pageComponents[activePage] || DashboardPage;

  return (
    <div
      style={{
        fontFamily: T.font,
        background: T.bgRoot,
        color: T.textSecondary,
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontSize: 14,
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Sidebar ──────────────────────────────── */}
      <div
        style={{
          width: 240,
          background: T.bgSidebar,
          borderRight: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${T.accent}, ${T.accentHover})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              φ
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, letterSpacing: -0.3 }}>AskPhilAI</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav Section: Main */}
        <div style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.2, padding: "8px 10px 6px", marginBottom: 2 }}>
            Main
          </div>
          {PAGES.slice(0, 3).map((page) => {
            const isActive = activePage === page.id;
            const isHovered = sidebarHover === page.id;
            return (
              <div
                key={page.id}
                onClick={() => setActivePage(page.id)}
                onMouseEnter={() => setSidebarHover(page.id)}
                onMouseLeave={() => setSidebarHover(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: T.radiusSm,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? T.textPrimary : isHovered ? T.textSecondary : T.textMuted,
                  background: isActive ? T.accentFaded : isHovered ? "rgba(255,255,255,0.03)" : "transparent",
                  transition: "all 0.15s ease",
                  marginBottom: 2,
                }}
              >
                <div style={{ color: isActive ? T.accent : "inherit", display: "flex" }}>{page.icon}</div>
                {page.label}
              </div>
            );
          })}

          <div style={{ fontSize: 10, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.2, padding: "16px 10px 6px", marginBottom: 2 }}>
            Settings
          </div>
          {PAGES.slice(3).map((page) => {
            const isActive = activePage === page.id;
            const isHovered = sidebarHover === page.id;
            return (
              <div
                key={page.id}
                onClick={() => setActivePage(page.id)}
                onMouseEnter={() => setSidebarHover(page.id)}
                onMouseLeave={() => setSidebarHover(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: T.radiusSm,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? T.textPrimary : isHovered ? T.textSecondary : T.textMuted,
                  background: isActive ? T.accentFaded : isHovered ? "rgba(255,255,255,0.03)" : "transparent",
                  transition: "all 0.15s ease",
                  marginBottom: 2,
                }}
              >
                <div style={{ color: isActive ? T.accent : "inherit", display: "flex" }}>{page.icon}</div>
                {page.label}
              </div>
            );
          })}
        </div>

        {/* Bottom User */}
        <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, #f97316, #ec4899)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Admin</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>admin@askphilai.com</div>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div
          style={{
            height: 54,
            background: T.bgSidebar,
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <span style={{ color: T.textMuted }}>AskPhilAI</span>
            <span style={{ color: T.textMuted }}>/</span>
            <span style={{ color: T.textPrimary, fontWeight: 600 }}>
              {PAGES.find((p) => p.id === activePage)?.label}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: T.textMuted }}>
              {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.success }} />
              <span style={{ fontSize: 12, color: T.success, fontWeight: 600 }}>System Online</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
          <PageComponent />
        </div>
      </div>
    </div>
  );
}

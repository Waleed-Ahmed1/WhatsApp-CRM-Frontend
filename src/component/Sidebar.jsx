import { NavLink } from "react-router-dom";

const NAV = [
  { path: "/dashboard/live-chats", label: "Live Chats", icon: "💬" },
  { path: "/dashboard/users", label: "System Users", icon: "👤" },
  { path: "/dashboard/groups", label: "Groups", icon: "👥" },
  { path: "/dashboard/contacts", label: "Contacts", icon: "📇" },
  { path: "/dashboard/broadcast", label: "Broadcast", icon: "📢" },
  { path: "/dashboard/templates", label: "Templates", icon: "📝" },
  { path: "/dashboard/keywords", label: "Keywords", icon: "🔑" },
  { path: "/dashboard/uploads", label: "Uploads", icon: "📁" },
  { path: "/dashboard/analytics", label: "Analytics", icon: "📊" },
  { path: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar({
  onLogout,
  totalUsers = 0,
  username = "Admin",
}) {
  return (
    <div
      style={{
        width: 216,
        background: "#141824",
        borderRight: "1px solid #232838",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "22px 18px 18px",
          borderBottom: "1px solid #232838",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#25d366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 18px rgba(37,211,102,0.28)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              BotControl
            </div>

            <div
              style={{
                color: "#25d366",
                fontSize: 10,
                fontFamily: "monospace",
              }}
            >
              ● LIVE
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "10px 8px",
          overflowY: "auto",
        }}
      >
        {NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "9px 12px",
              borderRadius: 9,
              marginBottom: 2,
              textDecoration: "none",
              background: isActive
                ? "rgba(37,211,102,0.12)"
                : "transparent",
              color: isActive ? "#25d366" : "#9aa0ac",
              fontFamily: "sans-serif",
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              transition: "all .15s",
            })}
          >
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "14px 10px",
          borderTop: "1px solid #232838",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#25d366",
              color: "#0b0d12",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {username.charAt(0).toUpperCase()}
          </div>

          <div>
            <div
              style={{
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {username}
            </div>

            <div
              style={{
                color: "#6b7280",
                fontSize: 10,
                fontFamily: "monospace",
              }}
            >
              {totalUsers.toLocaleString()} users
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            width: "100%",
            padding: "7px 12px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "rgba(248,113,113,0.1)",
            color: "#f87171",
            fontSize: 13,
            fontFamily: "sans-serif",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>

          Sign Out
        </button>
      </div>
    </div>
  );
}
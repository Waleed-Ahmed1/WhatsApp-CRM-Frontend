import { NavLink } from "react-router-dom";
import "../css/sidebar.css";
import { FaWhatsapp, FaBox, FaTags } from "react-icons/fa";
import { useState } from "react";
import { MdContacts, MdContactPhone, MdContactMail } from 'react-icons/md';

const NAV = [
  { path: "/dashboard/chat", label: "Live Chats", icon: <FaWhatsapp size={18} color="#25D366" /> },
  { path: "/dashboard/users", label: "System Users", icon: "👤" },
  { path: "/dashboard/groups", label: "Groups", icon: "👥" },
  { path: "/dashboard/contacts", label: "Contacts", icon: <MdContacts color="white" size={16}/> },
  { path: "/dashboard/broadcast", label: "Broadcast", icon: "📢" },
  { path: "/dashboard/templates", label: "Templates", icon: "📝" },
  { path: "/dashboard/keywords", label: "Keywords", icon: "🔑" },
  { path: "/dashboard/uploads", label: "Uploads", icon: "📁" },
  { path: "/dashboard/analytics", label: "Analytics", icon: "📊" },
  { path: "/dashboard/categories", label: "Category", icon: <FaTags size={13} /> },
  { path: "/dashboard/products", label: "Products", icon: <FaBox size={11} color="#a4c063" /> },
  { path: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar({
  onLogout,
  email = "example@gmail.com",
  username = "Admin",
}) {

  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className="mobile-header">
        <button
          className="hamburger-btn"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>
        <div className="mobile-header-title">
          WhatsApp Panel
        </div>
      </div>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <div className={isOpen ? "sidebar sidebar-open" : "sidebar"}>

        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo-row">
            <div className="sidebar-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>

            <div>
              <div className="sidebar-title">Whatsapp Panel</div>
              <div className="sidebar-live">● LIVE</div>
            </div>
          </div>

        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="sidebar-username">{username}</div>
              <div className="sidebar-email">{email}</div>
            </div>
          </div>

          <button onClick={onLogout} className="logout-btn">
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
    </>

  );
}
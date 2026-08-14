import { NavLink } from "react-router-dom";
import { FaWhatsapp, FaUser, FaBullhorn } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { MdCategory, MdContacts, MdGroup } from "react-icons/md";
import { LogOut, LucidePackage, Settings } from "lucide-react";
import logo from "../../public/favicon.png";

const NAV = [
  {
    path: "/dashboard/chat",
    label: "Live Chats",
    icon: <FaWhatsapp size={18} />,
    tint: "text-white",
  },
  {
    path: "/dashboard/users",
    label: "System Users",
    icon: <FaUser size={18} />,
    tint: "text-white",
  },
  {
    path: "/dashboard/groups",
    label: "Groups",
    icon: <MdGroup size={18} />,
    tint: "text-white",
  },
  {
    path: "/dashboard/contacts",
    label: "Contacts",
    icon: <MdContacts size={18} />,
    tint: "text-white",
  },
  {
    path: "/dashboard/broadcast",
    label: "Broadcast",
    icon: <FaBullhorn size={18} />,
    tint: "text-white",
  },
  {
    path: "/dashboard/categories",
    label: "Category",
    icon: <MdCategory size={18} />,
    tint: "text-white",
  },
  {
    path: "/dashboard/products",
    label: "Products",
    icon: <LucidePackage size={18} />,
    tint: "text-white",
  },
  {
    path: "/dashboard/settings",
    label: "Settings",
    icon: <Settings size={18} />,
    tint: "text-white",
  },
];

export default function Sidebar({ isExpanded, setIsExpanded, onLogout, email = "example@gmail.com", username = "Admin" }) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isExpanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isExpanded]);

  return (
    <>

      <div className="flex items-center gap-3 bg-[#0B6F60] px-4 py-3 lg:hidden">
        <button
          className="text-xl text-white"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>

        <span className="font-semibold text-white">WhatsApp Panel</span>
      </div>


      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}


      <div
        ref={sidebarRef}
        onDoubleClick={() => setIsExpanded(true)}
        className={`fixed inset-y-0 left-0 z-30 hidden bg-[#0B6F60] py-5 transition-all duration-300 lg:flex ${
          isExpanded
            ? "w-60 flex-col items-start px-4"
            : "w-[55px] flex-col items-center"
        }`}
      >
        {/* Logo */}

        <div
          className={`mb-6 flex items-center gap-3 ${
            isExpanded ? "w-full" : ""
          }`}
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white">
            <img
              src={logo}
              alt="WhatsApp CRM"
              className="h-full w-full object-fill"
            />
          </div>

          {isExpanded && (
            <span className="text-lg font-semibold text-white">
              WhatsApp CRM
            </span>
          )}
        </div>

        {/* Navigation */}

        <nav
          className={`flex flex-1 flex-col gap-2 ${
            isExpanded ? "w-full" : "items-center"
          }`}
        >
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl p-3 transition ${
                  isExpanded ? "w-full" : "h-11 w-11 justify-center"
                } ${
                  isActive
                    ? "bg-[#0EA894] text-white shadow-[0_4px_10px_rgba(14,168,148,0.4)]"
                    : `${item.tint} hover:brightness-110`
                }`
              }
            >
              {item.icon}

              {isExpanded && (
                <span className="text-sm font-medium">{item.label}</span>
              )}

              {!isExpanded && <Tooltip>{item.label}</Tooltip>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}

        <div
          className={`mt-4 ${
            isExpanded ? "w-full" : "flex flex-col items-center"
          }`}
        >
          <button
            onClick={onLogout}
            className={`group relative flex items-center gap-3 rounded-2xl p-3 text-white transition ${
              isExpanded ? "w-full" : "h-11 w-11 justify-center"
            }`}
          >
            <LogOut />

            {isExpanded && <span>Sign Out</span>}

            {!isExpanded && <Tooltip>Sign Out</Tooltip>}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}

      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#111827] transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src={logo}
              alt="WhatsApp CRM"
              className="h-full w-full object-fill"
            />
          </div>

          <div>
            <div className="text-sm font-semibold text-white">
              WhatsApp Panel
            </div>

            <div className="text-xs text-[#4ADE80]">● LIVE</div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[#0EA894] text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg">
                {item.icon}
              </span>

              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0EA894] text-sm font-semibold text-white">
              {username.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="text-sm font-medium text-white">{username}</div>

              <div className="text-xs text-gray-400">{email}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={16} />

            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

function Tooltip({ children }) {
  return (
    <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 scale-95 whitespace-nowrap rounded-lg bg-[#1F2937] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition duration-150 group-hover:scale-100 group-hover:opacity-100">
      <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#1F2937]" />

      {children}
    </div>
  );
}
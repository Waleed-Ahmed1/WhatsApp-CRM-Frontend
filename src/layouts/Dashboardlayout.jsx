import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import { logoutuser } from "../api/auth";
import toast from "react-hot-toast";
import api from "../api/api.js";

export default function DashboardLayout() {
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  let local_store = null;
  try {
    local_store = JSON.parse(localStorage.getItem("user"));
  } catch {
    local_store = null;
  }
  const user_name = local_store?.name || "unknown";
  const email_user = local_store?.email || "unknown@gmail.com";

  const logout = async () => {
    try {
      const res = await logoutuser();
      toast.success(res.data.message || "Logged out Successfully.");
    } catch (err) {
      // Server-side logout may fail (e.g. the refresh-token cookie not being
      // sent cross-site — see BUG-AUTH-005). Either way, don't trap the user
      // on the dashboard: the finally block below always clears local state.
      console.error(err);
      toast.error(
        err.response?.data?.message || "Logout Failed! Try Again later.",
      );
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get("/meta/meta-status");

        setTokenValid(res.data.valid);
      } catch {
        setTokenValid(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (

    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#EAF7F4]">
      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onLogout={logout}
        username={user_name}
        email={email_user}
      />
      {!tokenValid && (
        <div className="bg-red-50 text-red-700 px-4 py-2 text-sm font-medium text-center">
          ⚠️ WhatsApp access token expired. Replies are paused until it's refreshed.
        </div>
      )}
      <main
        className={`min-h-0 flex-1 overflow-hidden transition-all duration-300 ${isExpanded ? "lg:ml-60" : "lg:ml-[55px]"
          }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import { logoutuser } from "../api/auth";
import toast from "react-hot-toast";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const local_store = JSON.parse(localStorage.getItem("user"));
  const user_name = local_store?.name || "unknown";
  const email_user = local_store?.email || "unknown@gmail.com";

  const logout = async () => {
    try {
      const res = await logoutuser();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success(res.data.message || "Logged out Successfully.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Logout Failed! Try Again later.",
      );
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#EAF7F4]">
      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onLogout={logout}
        username={user_name}
        email={email_user}
      />

      <main
        className={`min-h-0 flex-1 overflow-hidden transition-all duration-300 ${
          isExpanded ? "lg:ml-60" : "lg:ml-[55px]"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

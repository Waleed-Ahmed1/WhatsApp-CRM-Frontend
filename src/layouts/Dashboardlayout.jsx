import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import {logoutuser} from "../api/auth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function DashboardLayout() {

    const navigate = useNavigate()

    const logout = async () => {
        try{
            const res = await logoutuser();
            localStorage.removeItem("token");
            toast.success(res.data.message|| "Logged out Successfully.")
            navigate('/login')
        }catch(err){
            console.error(err)
            toast.error(err.response?.data?.message|| "Logout Failed! Try Again later.")
        }
    }

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar onLogout={logout} />

            <div style={{ flex: 1 }}>
                <Outlet />
            </div>
        </div>
  
    );
}
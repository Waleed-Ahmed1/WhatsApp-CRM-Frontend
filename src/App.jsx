import "./App.css";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Logout from "./pages/logout.jsx";
import LiveChats from "./pages/livechats.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FaCircleCheck } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import DashboardLayout from "./layouts/Dashboardlayout.jsx";
import SystemUsers from "./pages/systemusers.jsx";
import Settings from "./pages/setting.jsx";
import Products from "./pages/products.jsx";
import Categories from "./pages/categories.jsx";
import ProductView from "./pages/productview.jsx";
import Contacts from "./pages/contacts.jsx";
import Groups from "./pages/groups.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import SessionGate from "./component/SessionGate.jsx";
import Broadcast from "./pages/broadcast.jsx";
import ForgotPassword from "./pages/forgotpassword.jsx";

function App() {
    return (
        <>
            <Toaster
                position="right-bottom"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000,
                    style: {
                        margin: "0 20px 20px 0",
                        background: "#FFFFFF",
                        color: "#1F2937",
                        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                        border: "1px solid #E5E7EB",
                        borderRadius: "14px",
                        padding: "14px 16px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        fontSize: "14px",
                        fontWeight: "500",
                        minWidth: "300px",
                    },
                    success: {
                        icon: (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF7F4]">
                                <FaCircleCheck color="#0B6F60" size={17} />
                            </div>
                        ),
                        style: { borderLeft: "4px solid #0B6F60" },
                    },
                    error: {
                        icon: (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FEE2E2]">
                                <MdErrorOutline color="#DC2626" size={19} />
                            </div>
                        ),
                        style: { borderLeft: "4px solid #DC2626" },
                    },
                }}
            />

            <Routes>
                <Route path="/" element={<SessionGate />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/forgot_password" element={<ForgotPassword />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="chat" replace />} />
                        <Route path="chat" element={<LiveChats />} />
                        <Route path="users" element={<SystemUsers />} />
                        <Route path="groups" element={<Groups />} />
                        <Route path="broadcast" element={<Broadcast />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="products" element={<Products />} />
                        <Route path="products/:id" element={<ProductView />} />
                        <Route path="contacts" element={<Contacts />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
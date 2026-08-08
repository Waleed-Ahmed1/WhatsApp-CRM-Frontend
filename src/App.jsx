import './App.css'
import Login from "./pages/login.jsx"
import Register from "./pages/register.jsx"
import Logout from './pages/logout.jsx';
import LiveChats from './pages/livechats.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FaCircleCheck } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import DashboardLayout from './layouts/Dashboardlayout.jsx';
import SystemUsers from './pages/systemusers.jsx';


function App() {
  return (
    <BrowserRouter>
      <Toaster position="right-bottom" reverseOrder={false} toastOptions={{ duration: 4000, style: { margin: "0px 30px 30px 0px" ,background: "#141824", color: "#fff", fontFamily: "'Poppins', sans-serif",border: "1px solid #232838", borderRadius: "10px", padding: "14px 16px" }, success: {icon: <FaCircleCheck color="#25d366" size={20} />}, error: {icon: <MdErrorOutline color="#ef4444" size={20} />,} }} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path='chat' element={<LiveChats />} />
          <Route path="users" element={<SystemUsers />} />
          {/* <Route path="groups" element={<Groups />} />
          <Route path="broadcast" element={<Broadcast />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

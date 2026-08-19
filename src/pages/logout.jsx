import React from "react";
import { logoutuser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Logout(){
    const  navigate = useNavigate()

    const logoutbutton = async ()=>{
        try {
            const res = await logoutuser()
            localStorage.removeItem("accessToken");
            toast.success(res.data.message || "Logged out successfully")
            navigate('/login')
        } catch(err){
            console.error(err);
            toast.error(err.response?.data?.message || "Logout failed");
        }
    }

    
    return(
        <div>
            <h1>Logout Button </h1>

            <button onClick={logoutbutton}>Logout Button</button>
        </div>
        
    )
}

export default Logout;
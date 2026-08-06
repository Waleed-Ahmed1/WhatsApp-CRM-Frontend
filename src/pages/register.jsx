import React from "react";
import { useState } from "react";
import "./register.css";
import { Link,useNavigate } from "react-router-dom";
import {toast,Toaster} from "react-hot-toast";
import { registeruser } from "../api/auth";

// test the commit 
function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const registerbutton = async () => {
        setLoading(true);

        try {
        
            const res = await registeruser(name,email,password)

            toast.success(res.data.message|| "User Created Successfully.");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
                        
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <div className="login-header">
                    <div className="login-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <h1 className="login-title">BotControl</h1>
                    <p className="login-subtitle">Create an Admin Account</p>
                </div>

                <div className="login-card">
                    <div className="field">
                        <label className="label">Name</label>
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Your Name"
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Email</label>
                        <input
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="abc@gmail.com"
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Password</label>
                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && registerbutton()}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button className="submit-btn" onClick={registerbutton} disabled={loading}>
                        {loading ? "Creating account…" : "Register"}
                    </button>
                </div>

                <p className="login-footer">Already have an account? <Link to="/login" className="footer-link">Sign in</Link></p>
            </div>
        </div>
    );
}

export default Register;
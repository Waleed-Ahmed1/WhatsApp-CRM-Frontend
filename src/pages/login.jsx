import React from "react";
import { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import {toast,Toaster} from "react-hot-toast";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const loginbutton = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Invalid credentials");
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            // navigate("/dashboard");
            toast.success(data.message || "Login successful");

        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
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
                    <p className="login-subtitle">WhatsApp Automation Dashboard</p>
                </div>

                <div className="login-card">
                    <div className="field">
                        <label className="label">Email</label>
                        <input
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin"
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
                            onKeyDown={(e) => e.key === "Enter" && loginbutton()}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button className="submit-btn" onClick={loginbutton} disabled={loading}>
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </div>

                <p className="login-footer">
                    Don't have an account? <Link to="/register" className="footer-link">Sign up</Link>
                </p>

                <p className="login-footer">Sign in with your admin credentials</p>
            </div>
        </div>
    );
}

export default Login;
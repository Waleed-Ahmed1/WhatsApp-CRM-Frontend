import React, { useState } from "react";
import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginuser } from "../api/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/auth.slice";

function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const loginbutton = async () => {

        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }

        setLoading(true);

        try {

            const res = await loginuser(email, password);

            if (res.data.accessToken) {

                // Redux state
                dispatch(
                    loginSuccess({
                        user: res.data.user,
                        accessToken: res.data.accessToken,
                    })
                );

                // Local storage
                localStorage.setItem(
                    "token",
                    res.data.accessToken
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(res.data.user)
                );

                toast.success(
                    res.data.message || "Login successful"
                );

                // Go to dashboard
                navigate("/dashboard/chat", {
                    replace: true,
                });
            }

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="login-page">

            <div className="login-wrapper">

                <div className="login-header">

                    <div className="login-logo">

                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="white"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>

                    </div>

                    <h1 className="login-title">
                        Whatsapp Panel
                    </h1>

                    <p className="login-subtitle">
                        WhatsApp Automation Dashboard
                    </p>

                </div>


                <div className="login-card">

                    <div className="field">

                        <label className="label">
                            Email
                        </label>

                        <input
                            className="input"
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="admin@example.com"
                            autoComplete="off"
                            required
                        />

                    </div>


                    <div className="field">

                        <label className="label">
                            Password
                        </label>

                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                loginbutton()
                            }
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    <button
                        className="submit-btn"
                        onClick={loginbutton}
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in…"
                            : "Sign In"
                        }

                    </button>

                </div>


                <p className="login-footer">
                    Don't have an account?
                    {" "}
                    <Link
                        to="/register"
                        className="footer-link"
                    >
                        Sign up
                    </Link>
                </p>
                <p className="login-footer">
                    Sign in with your admin credentials
                </p>

            </div>

        </div>
    );
}

export default Login;




// import React from "react";
// import { useState } from "react";
// import "../css/login.css";
// import { Link } from "react-router-dom";
// import {toast,Toaster} from "react-hot-toast";
// import { loginuser } from "../api/auth";
// import { useNavigate } from "react-router-dom";

// function Login() {

//     const navigate = useNavigate();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);

//     const loginbutton = async () => {
//         setLoading(true);
//         try {

//             const res = await loginuser(email,password)
            

//             if (res.data.accessToken) {
//                 localStorage.setItem("token", res.data.accessToken);
//                 localStorage.setItem("user",JSON.stringify(res.data.user))
//                 navigate("/dashboard/chat");
//                 toast.success(res.data.message || "Login successful");
//             }

//         } catch (err) {
//             console.error(err);
//             toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="login-page">
//             <div className="login-wrapper">
//                 <div className="login-header">
//                     <div className="login-logo">
//                         <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
//                             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//                         </svg>
//                     </div>
//                     <h1 className="login-title">Whatsapp Panel</h1>
//                     <p className="login-subtitle">WhatsApp Automation Dashboard</p>
//                 </div>

//                 <div className="login-card">
//                     <div className="field">
//                         <label className="label">Email</label>
//                         <input
//                             className="input"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="admin"
//                             autoComplete="off"
//                             required
//                         />
//                     </div>

//                     <div className="field">
//                         <label className="label">Password</label>
//                         <input
//                             className="input"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             onKeyDown={(e) => e.key === "Enter" && loginbutton()}
//                             placeholder="••••••••"
//                             autoComplete="new-password"
//                             required
//                         />
//                     </div>

//                     <button className="submit-btn" onClick={loginbutton} disabled={loading}>
//                         {loading ? "Signing in…" : "Sign In"}
//                     </button>
//                 </div>

//                 <p className="login-footer">
//                     Don't have an account? <Link to="/register" className="footer-link">Sign up</Link>
//                 </p>

//                 <p className="login-footer">Sign in with your admin credentials</p>
//             </div>
//         </div>
//     );
// }

// export default Login;


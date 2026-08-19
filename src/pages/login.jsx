import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginuser } from "../api/auth";
import { loginSuccess } from "../redux/auth.slice";
import { Eye, EyeOff } from "lucide-react";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const loginbutton = async () => {
        if (!email || !password) {
            toast.error("Email and password are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }


        setLoading(true);

        try {
            const res = await loginuser(email, password);

            if (res.data.accessToken) {
                const { password, ...safeUser } = res.data.user;

                dispatch(
                    loginSuccess({
                        user: safeUser,
                        accessToken: res.data.accessToken,
                    })
                );

                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("user", JSON.stringify(safeUser));
                toast.success(`Welcome ${safeUser.name}`)
                navigate("/dashboard/chat", { replace: true });
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#EAF7F4] items-center">
            <div className="flex flex-1 items-center justify-center px-4">
                <div className="w-full max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto overflow-hidden rounded-[24px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <div className="grid lg:grid-cols-2 ">
                        {/* Left Column - Image */}
                        <div className="hidden lg:block">
                            <img
                                src="bot-image.jpg"
                                alt="Login"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Right Column - Form */}
                        <div className="flex flex-col justify-center px-6 py-10 sm:px-8 md:px-10 lg:px-12">

                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-semibold text-[#0B6F60]">
                                    Welcome Back
                                </h2>
                                <p className="mt-1 text-sm text-[#6B7280]">
                                    Sign in to your account
                                </p>
                            </div>

                            <div className="flex w-full flex-col gap-4 items-center">
                                <div className="flex h-12 items-center rounded-xl border border-[#E5E7EB] px-4 mx-auto max-w-md w-full focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20 transition-all duration-200">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@example.com"
                                        className="w-full bg-transparent outline-none text-[#1F2937] placeholder:text-[#abafb7] p-2"
                                    />
                                </div>

                                <div className="flex h-12 items-center rounded-xl border border-[#E5E7EB] px-2 mx-auto max-w-md w-full focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20 transition-all duration-200">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && loginbutton()}
                                        placeholder="••••••••"
                                        className="flex-1 px-4 bg-transparent outline-none text-[#1F2937] placeholder:text-[#abafb7]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="mr-3 flex items-center justify-center text-[#6B7280] hover:text-[#374151]"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <button
                                    onClick={loginbutton}
                                    disabled={loading}
                                    className="mt-2 flex h-12 w-full max-w-md mx-auto items-center justify-center gap-2 rounded-xl bg-[#0B6F60] font-medium text-white transition hover:bg-[#0B8A79] disabled:opacity-70"
                                >
                                    {loading ? "Signing in..." : "Sign In"}
                                </button>
                                 <Link
                                        to="/forgot_password"
                                        className="text-sm text-[#0EA894] hover:text-[#0B8A79] transition-colors"
                                    >
                                        Forgot Password
                                    </Link>

                            </div>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-[#6B7280]">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/register"
                                        className="font-medium text-[#0EA894] hover:text-[#0B8A79] transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
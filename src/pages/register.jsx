import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { registeruser } from "../api/auth";
import { Eye, EyeOff } from "lucide-react";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const registerbutton = async () => {
        if (!name || !email || !password) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);

        try {
            const res = await registeruser(
                name,
                email,
                password
            );

            toast.success(
                res.data.message ||
                    "User created successfully."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);
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
        <div className="flex min-h-screen items-center bg-[#EAF7F4]">
            <div className="flex flex-1 items-center justify-center px-4">
                <div className="mx-auto w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] sm:max-w-lg md:max-w-3xl lg:max-w-5xl">
                    <div className="grid lg:grid-cols-2">
                        {/* Left Image */}

                        <div className="hidden lg:block">
                            <img
                                src="bot-image.jpg"
                                alt="Register"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Right Form */}

                        <div className="flex flex-col justify-center px-6 py-10 sm:px-8 md:px-10 lg:px-12">
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-semibold text-[#0B6F60]">
                                    Create Account
                                </h2>

                                <p className="mt-1 text-sm text-[#6B7280]">
                                    Create your admin account
                                </p>
                            </div>

                            <div className="flex w-full flex-col items-center gap-4">
                                {/* Name */}

                                <div className="flex h-12 w-full max-w-md items-center rounded-xl border border-[#E5E7EB] px-4 transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Full name"
                                        className="w-full bg-transparent p-2 text-[#1F2937] outline-none placeholder:text-[#6B7280]"
                                    />
                                </div>

                                {/* Email */}

                                <div className="flex h-12 w-full max-w-md items-center rounded-xl border border-[#E5E7EB] px-4 transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        placeholder="admin@example.com"
                                        className="w-full bg-transparent p-2 text-[#1F2937] outline-none placeholder:text-[#6B7280]"
                                    />
                                </div>

                                {/* Password */}

                                <div className="flex h-12 w-full max-w-md items-center rounded-xl border border-[#E5E7EB] px-2 transition-all duration-200 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20">
                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            e.key ===
                                                "Enter" &&
                                            registerbutton()
                                        }
                                        placeholder="••••••••"
                                        className="flex-1 px-4 text-[#1F2937] outline-none placeholder:text-[#6B7280]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (s) => !s
                                            )
                                        }
                                        className="mr-3 text-[#6B7280] hover:text-[#374151]"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>

                                {/* Button */}

                                <button
                                    onClick={
                                        registerbutton
                                    }
                                    disabled={loading}
                                    className="mt-2 flex h-12 w-full max-w-md items-center justify-center rounded-xl bg-[#0B6F60] font-medium text-white transition hover:bg-[#0B8A79] disabled:opacity-70"
                                >
                                    {loading
                                        ? "Creating account..."
                                        : "Create Account"}
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-[#6B7280]">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="font-medium text-[#0EA894] transition-colors hover:text-[#0B8A79]"
                                    >
                                        Sign in
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

export default Register;
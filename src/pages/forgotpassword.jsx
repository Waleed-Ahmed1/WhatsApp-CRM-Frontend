import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Mail, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { forgotPassword, resetPassword } from "../api/auth"; // your existing API

function ForgotPassword() {
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    // Step 1: Email
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Step 2: OTP + Password
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [verifying, setVerifying] = useState(false);

    // Success
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);

    // Timer
    useEffect(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setCanResend(true);
        }
    }, [step, timer]);

    // ===== Send OTP =====
    const handleSendOtp = async () => {
        if (!email) {
            toast.error("Email is required");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);
        try {
            const res = await forgotPassword(email);
            // Always treat status 200 as success (even if success: false for security)
            if (res.status === 200) {
                toast.success("If this email exists, an OTP has been sent!");
                setStep(2);
                setTimer(60);
                setCanResend(false);
                setTimeout(() => {
                    if (inputRefs.current[0]) inputRefs.current[0].focus();
                }, 100);
            } else {
                toast.error(res.data?.message || "Failed to send OTP");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to send OTP. Please check your connection."
            );
        } finally {
            setLoading(false);
        }
    };

    // ===== Resend OTP =====
    const handleResendOtp = async () => {
        setCanResend(false);
        setTimer(60);
        try {
            await forgotPassword(email);
            toast.success("If this email exists, a new OTP has been sent!");
        } catch {
            toast.success("If this email exists, a new OTP has been sent!");
            setCanResend(true);
        }
    };

    // ===== OTP input handlers =====
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(0, 1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        const pastedArray = pastedData.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        pastedArray.forEach((value, index) => {
            if (index < 6) newOtp[index] = value;
        });
        setOtp(newOtp);
        const lastFilledIndex = Math.min(pastedArray.length, 5);
        if (lastFilledIndex < 6) {
            inputRefs.current[lastFilledIndex].focus();
        }
    };

    // ===== Reset Password =====
    const handleResetPassword = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            toast.error("Please enter complete 6-digit OTP");
            return;
        }
        if (!newPassword) {
            toast.error("New password is required");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setVerifying(true);
        try {
            const res = await resetPassword(email, newPassword, otpString);
            if (res.data.success) {
                setIsResetSuccessful(true);
                toast.success("Password reset successfully!");
                setTimeout(() => navigate("/login", { replace: true }), 3000);
            } else {
                toast.error(res.data.message || "Reset failed");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Reset failed. Please check your OTP and try again."
            );
        } finally {
            setVerifying(false);
        }
    };

    // ===== Success View =====
    if (isResetSuccessful) {
        return (
            <div className="flex min-h-screen bg-[#EAF7F4] items-center justify-center px-4">
                <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-8">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF7F4]">
                            <CheckCircle className="h-8 w-8 text-[#0B6F60]" />
                        </div>
                        <h2 className="text-2xl font-semibold text-[#0B6F60]">
                            Password Reset Successful!
                        </h2>
                        <p className="mt-2 text-sm text-[#6B7280]">
                            Your password has been reset. Redirecting to login...
                        </p>
                        <Link
                            to="/login"
                            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#0B6F60] font-medium text-white transition hover:bg-[#0B8A79]"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ===== Step 1: Email =====
    if (step === 1) {
        return (
            <div className="flex min-h-screen bg-[#EAF7F4] items-center justify-center px-4">
                <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <div className="p-6 sm:p-8 md:p-10">
                        <Link
                            to="/login"
                            className="mb-6 inline-flex items-center gap-2 text-sm text-[#6B7280] transition hover:text-[#0B6F60]"
                        >
                            <ArrowLeft size={18} /> Back to Login
                        </Link>
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F4]">
                                <Mail className="h-6 w-6 text-[#0B6F60]" />
                            </div>
                            <h2 className="text-2xl font-semibold text-[#0B6F60]">
                                Forgot Password
                            </h2>
                            <p className="mt-1 text-sm text-[#6B7280]">
                                Enter your email to receive an OTP
                            </p>
                        </div>
                        <div className="flex w-full flex-col gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                                    Email Address
                                </label>
                                <div className="flex h-12 items-center rounded-xl border border-[#E5E7EB] px-4 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20 transition-all duration-200">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                                        placeholder="admin@example.com"
                                        className="w-full bg-transparent outline-none text-[#1F2937] placeholder:text-[#abafb7]"
                                        disabled={loading}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B6F60] font-medium text-white transition hover:bg-[#0B8A79] disabled:opacity-70"
                            >
                                {loading ? (
                                    <>
                                        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        Sending OTP...
                                    </>
                                ) : "Send OTP"}
                            </button>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-[#6B7280]">
                                    Remember your password?{" "}
                                    <Link
                                        to="/login"
                                        className="font-medium text-[#0EA894] hover:text-[#0B8A79] transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===== Step 2: OTP + Password =====
    return (
        <div className="flex min-h-screen bg-[#EAF7F4] items-center justify-center px-4">
            <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                <div className="p-6 sm:p-8 md:p-10">
                    <button
                        onClick={() => {
                            setStep(1);
                            setOtp(["", "", "", "", "", ""]);
                            setNewPassword("");
                            setConfirmPassword("");
                        }}
                        className="mb-6 inline-flex items-center gap-2 text-sm text-[#6B7280] transition hover:text-[#0B6F60]"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F4]">
                            <Shield className="h-6 w-6 text-[#0B6F60]" />
                        </div>
                        <h2 className="text-2xl font-semibold text-[#0B6F60]">
                            Reset Password
                        </h2>
                        <p className="mt-1 text-sm text-[#6B7280]">
                            Enter the OTP sent to
                        </p>
                        <p className="font-medium text-[#0B6F60]">{email}</p>
                    </div>

                    <div className="flex w-full flex-col gap-4">
                        {/* OTP Input */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                                OTP Code
                            </label>
                            <div className="flex justify-center gap-2 sm:gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        onPaste={handleOtpPaste}
                                        className="h-12 w-12 rounded-xl border border-[#E5E7EB] text-center text-xl font-semibold text-[#1F2937] outline-none transition-all focus:border-[#0EA894] focus:ring-2 focus:ring-[#0EA894]/20 sm:h-14 sm:w-14"
                                    />
                                ))}
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                                <p className="text-xs text-[#6B7280]">Enter 6-digit code</p>
                                {canResend ? (
                                    <button
                                        onClick={handleResendOtp}
                                        className="text-xs font-medium text-[#0EA894] hover:text-[#0B8A79] transition-colors"
                                    >
                                        Resend OTP
                                    </button>
                                ) : (
                                    <p className="text-xs text-[#6B7280]">
                                        Resend in <span className="font-medium text-[#0B6F60]">{timer}s</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                                New Password
                            </label>
                            <div className="flex h-12 items-center rounded-xl border border-[#E5E7EB] px-2 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20 transition-all duration-200">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="flex-1 px-4 bg-transparent outline-none text-[#1F2937] placeholder:text-[#abafb7]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((s) => !s)}
                                    className="mr-3 flex items-center justify-center text-[#6B7280] hover:text-[#374151]"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-[#6B7280]">Must be at least 8 characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[#374151]">
                                Confirm Password
                            </label>
                            <div className="flex h-12 items-center rounded-xl border border-[#E5E7EB] px-2 focus-within:border-[#0EA894] focus-within:ring-2 focus-within:ring-[#0EA894]/20 transition-all duration-200">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                                    placeholder="••••••••"
                                    className="flex-1 px-4 bg-transparent outline-none text-[#1F2937] placeholder:text-[#abafb7]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((s) => !s)}
                                    className="mr-3 flex items-center justify-center text-[#6B7280] hover:text-[#374151]"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={handleResetPassword}
                            disabled={verifying}
                            className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B6F60] font-medium text-white transition hover:bg-[#0B8A79] disabled:opacity-70"
                        >
                            {verifying ? (
                                <>
                                    <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Resetting...
                                </>
                            ) : "Reset Password"}
                        </button>

                        <button
                            onClick={() => {
                                setStep(1);
                                setOtp(["", "", "", "", "", ""]);
                                setNewPassword("");
                                setConfirmPassword("");
                            }}
                            className="text-sm text-[#6B7280] hover:text-[#0B6F60] transition-colors"
                        >
                            ← Change email address
                        </button>

                        <div className="mt-2 text-center">
                            <p className="text-sm text-[#6B7280]">
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className="font-medium text-[#0EA894] hover:text-[#0B8A79] transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
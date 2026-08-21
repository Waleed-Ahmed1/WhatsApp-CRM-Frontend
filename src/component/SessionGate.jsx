import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { loginSuccess, logout } from "../redux/auth.slice";

function SessionGate() {
    const dispatch = useDispatch();
    const [status, setStatus] = useState("checking"); // checking | authed | guest

    useEffect(() => {
        const checkSession = async () => {
            const hasToken = !!localStorage.getItem("accessToken");

            if (!hasToken) {
                setStatus("guest");
                return;
            }

            try {
                const { data } = await api.post("/auth/refresh");

                dispatch(
                    loginSuccess({
                        user: JSON.parse(localStorage.getItem("user") || "null"),
                        accessToken: data.accessToken,
                    })
                );

                setStatus("authed");
            } catch {
                dispatch(logout());
                setStatus("guest");
            }
        };

        checkSession();
    }, [dispatch]);

    if (status === "checking") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#EAF7F4]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA894] border-t-transparent" />
            </div>
        );
    }

    return status === "authed"
        ? <Navigate to="/dashboard/chat" replace />
        : <Navigate to="/login" replace />;
}

export default SessionGate;
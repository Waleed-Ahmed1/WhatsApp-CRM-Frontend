// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// function ProtectedRoute() {
//     const { isAuthenticated } = useSelector(
//         (state) => state.auth
//     );

//     return isAuthenticated
//         ? <Outlet />
//         : <Navigate to="/login" replace />;
// }

// export default ProtectedRoute;


import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { loginSuccess, logout } from "../redux/auth.slice";

function ProtectedRoute() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // "checking" = still verifying the session, "ready" = verification done
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        const verifySession = async () => {
            const hasStoredToken = !!localStorage.getItem("accessToken");

            // No token at all locally — nothing to verify, go straight to login.
            if (!hasStoredToken) {
                setStatus("ready");
                return;
            }

            // A token exists locally, but we don't actually know if it (or the
            // refresh cookie backing it) is still valid until we ask the server.
            // This runs once per app load, BEFORE any protected page renders,
            // instead of waiting for a random API call to fail with 401 first.
            try {
                const { data } = await api.post("/auth/refresh");
                localStorage.setItem("accessToken", data.accessToken);

                dispatch(
                    loginSuccess({
                        user: user || JSON.parse(localStorage.getItem("user") || "null"),
                        accessToken: data.accessToken,
                    })
                );
            } catch (error) {
                // Refresh cookie is gone/expired/invalid — genuinely logged out.
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                dispatch(logout());
            } finally {
                setStatus("ready");
            }
        };

        verifySession();
        // Only run once, on mount — not on every isAuthenticated change,
        // otherwise this would loop each time loginSuccess/logout fires.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (status === "checking") {
        // Replace with your app's loading spinner/skeleton if you have one.
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#EAF7F4]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0EA894] border-t-transparent" />
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
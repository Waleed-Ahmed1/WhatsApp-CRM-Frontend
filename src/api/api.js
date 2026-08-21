import axios from "axios";

const ACCESS_TOKEN_KEY = "accessToken";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Attach the access token to every outgoing request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Single, consolidated 401 handler: on an expired access token, try one
// silent refresh, retry the original request, and bail out cleanly if the
// refresh itself fails. (Previously this logic was duplicated across two
// separate interceptors with two different localStorage keys — merged here.)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthEndpoint =
            originalRequest?.url?.includes("/auth/refresh") ||
            originalRequest?.url?.includes("/auth/login");

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isAuthEndpoint
        ) {
            originalRequest._retry = true;
            try {
                const { data } = await api.post("/auth/refresh");
                localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
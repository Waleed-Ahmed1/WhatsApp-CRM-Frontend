import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

// attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// refresh the access token simply when any request gets a 401 means token expiry
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );
                localStorage.setItem("token", data.accessToken);
                original.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(original);
            } catch (err) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
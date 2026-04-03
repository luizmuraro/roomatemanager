import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? "");
    const pathname = window.location.pathname;
    const isAuthRequest =
      requestUrl.includes("/api/auth/login") || requestUrl.includes("/api/auth/register");
    const isPublicAuthPage = pathname === "/login" || pathname === "/register";

    if (status === 401 && !isAuthRequest && !isPublicAuthPage) {
      window.location.assign("/");
    }

    return Promise.reject(error);
  },
);

import axios from "axios";

type ApiClientRequestConfig = {
  skipAuthRedirect?: boolean;
};

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
    const skipAuthRedirect = Boolean((error?.config as ApiClientRequestConfig | undefined)?.skipAuthRedirect);
    const isAuthRequest =
      requestUrl.includes("/api/auth/login") || requestUrl.includes("/api/auth/register");
    const isPublicAuthPage = pathname === "/login" || pathname === "/register";
    const isAuthBootstrapRequest = requestUrl.includes("/api/auth/me");

    if (
      status === 401 &&
      !isAuthRequest &&
      !isPublicAuthPage &&
      !isAuthBootstrapRequest &&
      !skipAuthRedirect
    ) {
      window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);

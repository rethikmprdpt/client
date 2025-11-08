import { useEffect } from "react";
// IMPORTANT: Update this import path to point to your
// existing, pre-configured Axios client.
import apiClient from "../api/axios";
import { useAuth } from "../context/authContext";

/**
 * A hook that attaches Axios interceptors to handle
 * automatic token attachment and 401 (token refresh) logic.
 * * This should be called ONCE from a component that is a child
 * of AuthProvider (e.g., App.jsx).
 */
const useApiInterceptor = () => {
  const { accessToken, setAccessToken, logout } = useAuth();

  useEffect(() => {
    // === 1. Request Interceptor ===
    // Attaches the access token to every outgoing request.
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        // If the token exists and the request doesn't already have an Auth header,
        // attach the token.
        if (accessToken && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // === 2. Response Interceptor ===
    // Handles 401 Unauthorized errors by trying to refresh the token.
    const responseInterceptor = apiClient.interceptors.response.use(
      // For successful responses, just return them.
      (response) => response,

      // For error responses, handle the 401.
      async (error) => {
        const originalRequest = error.config;

        // Check for 401 error and ensure it's not a retry
        // We also check that the error was not for the refresh endpoint itself
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          error.config.url !== "/auth/refresh"
        ) {
          originalRequest._retry = true; // Mark as retried

          try {
            // Attempt to refresh the token
            const refreshResponse = await apiClient.post("/auth/refresh");
            const newAccessToken = refreshResponse.data.access_token;

            // Update the token in context (which updates 'accessToken' for future calls)
            setAccessToken(newAccessToken);

            // Update the auth header for the *original* failed request
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            // Re-run the original request with the new token
            return apiClient(originalRequest);
          } catch (refreshError) {
            // If refresh fails, log the user out
            console.error("Token refresh failed:", refreshError);
            logout(); // This will clear state
            return Promise.reject(refreshError);
          }
        }

        // For all other errors, just reject the promise
        return Promise.reject(error);
      }
    );

    // Cleanup function:
    // Eject interceptors when the component unmounts
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };

    // Re-run this effect if the dependencies change
  }, [accessToken, setAccessToken, logout]);

  // This hook doesn't need to return anything
};

export default useApiInterceptor;

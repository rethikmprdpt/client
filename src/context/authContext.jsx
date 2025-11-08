/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
// IMPORTANT: Update this import path to point to your
// existing, pre-configured Axios client.
import apiClient from "../api/axios";
import { Loader2 } from "lucide-react"; // Or your preferred loading icon

// --- 1. Create the Context ---
const AuthContext = createContext(null);

// --- 2. Create the AuthProvider Component ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true); // App-wide loading state

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        // 1. Try to get a new access token
        const refreshResponse = await apiClient.post("/auth/refresh");
        const newAccessToken = refreshResponse.data.access_token;
        setAccessToken(newAccessToken);

        // 2. Use the new token to get user data
        // We set the header here manually *just* for this one call,
        // as the interceptor might not be set up yet.
        const userResponse = await apiClient.get("/auth/me", {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });
        setUser(userResponse.data);
      } catch (error) {
        // If refresh fails (no cookie, expired, etc.), user is not logged in
        console.log(error);
        setUser(null);
        setAccessToken(null);
      } finally {
        // We are done checking, so let the app render
        setLoading(false);
      }
    };
    checkInitialAuth();
  }, []); // Empty dependency array means this runs only once

  /**
   * Logs in the user.
   * Takes username and password, sends as FormData.
   */
  const login = async (username, password) => {
    // 1. Create FormData for the API
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // 2. Get access token
    const tokenResponse = await apiClient.post("/auth/token", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const newAccessToken = tokenResponse.data.access_token;
    setAccessToken(newAccessToken);

    // 3. Get user data
    const userResponse = await apiClient.get("/auth/me", {
      headers: { Authorization: `Bearer ${newAccessToken}` },
    });
    setUser(userResponse.data);

    // Return the user data in case the login page wants to use it
    return userResponse.data;
  };

  /**
   * Logs out the user.
   * Calls the backend to clear the HttpOnly cookie.
   */
  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if logout API fails, we must clear frontend state
    } finally {
      // Always clear frontend state
      setUser(null);
      setAccessToken(null);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      login,
      logout,
      setAccessToken, // Exposed for the interceptor
      setUser, // Exposed for the interceptor
    }),
    [user, accessToken, loading]
  );

  // While loading, show a full-screen spinner
  // This prevents any "flicker" of the app/login page
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
        <p className="ml-4 text-lg text-gray-700">Loading Application...</p>
      </div>
    );
  }

  // Once loading is false, render the app
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// --- 3. Create the Custom Hook ---
/**
 * Custom hook to easily access auth context.
 * e.g. const { user, login } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { Lock, User, LogIn, AlertCircle } from "lucide-react";

/**
 * The Login Page component.
 * This is the public-facing route for authentication.
 */
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user was trying to access before being redirected
  // If no path, default to '/' (our role-based Home)
  const from = location.state?.from?.pathname || "/";

  // If a user is already logged in, redirect them away from the login page
  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    try {
      // Call the login function from our AuthContext
      await login(username, password);

      // On success, navigate to the page they originally intended
      // or to the dashboard
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Log In
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Error Message Display */}
          {error && (
            <div className="mb-4 flex items-center p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="mb-4 relative">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Username
            </label>
            <User className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
          >
            {isLoggingIn ? (
              <LoadingSpinner size="sm" />
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            <span>{isLoggingIn ? "Logging In..." : "Log In"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

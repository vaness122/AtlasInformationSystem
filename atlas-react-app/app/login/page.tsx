"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const IconEye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const IconEyeOff = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.46m3.06-1.57A.99 0 0 1 12 7.02c4.4 0 9 4 9 4s-4.3 8-11 8a10.07 10.07 0 0 1-5.94-2.06"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, logout, userInfo } = useAuth();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Function to determine redirect path based on user role
  const getRedirectPath = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'superadmin':
        return '/superadmin/dashboard';
      case 'municipalityadmin':
        return '/municipalityadmin/dashboard';
      case 'barangayadmin':
        return '/barangayadmin/dashboard';
      default:
        return '/dashboard';
    }
  };

  useEffect(() => {
    // If user is already authenticated, redirect them to appropriate dashboard
    if (isAuthenticated && userInfo) {
      const redirectPath = getRedirectPath(userInfo.Role);
      router.push(redirectPath);
    }
  }, [isAuthenticated, userInfo, router]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage("");

      if (!email.trim() || !password) {
        setMessage("Please enter both email and password.");
        return;
      }

      setLoading(true);
      setMessage("Authenticating...");

      try {
        const response = await fetch("https://localhost:44336/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });

        if (!response.ok) {
          let errorMsg = "Login failed. Please check your credentials.";
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorData.errorMessage || errorMsg;
          } catch {
            // no JSON body or error parsing it
          }
          setMessage(errorMsg);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.token) {
          // Extract user info from the response and pass to login function
          const userData = {
            userId: data.userId || data.user?.userId,
            Email: data.email || data.user?.email,
            Role: data.role || data.user?.role,
            BarangayId: data.barangayId || data.user?.barangayId,
            MunicipalityId: data.municipalityId || data.user?.municipalityId,
            FirstName: data.firstName || data.user?.firstName
          };
          
          login(data.token, userData);
          setMessage("Login successful! Redirecting...");
          
          // Determine redirect path based on user role
          const userRole = userData.Role || data.role;
          const redirectPath = getRedirectPath(userRole);
          
          setTimeout(() => {
            router.push(redirectPath);
          }, 1000);
        } else {
          setMessage("Login failed: No token received.");
        }
      } catch (error) {
        console.error("Login error:", error);
        setMessage("A network error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, router]
  );

  return (
    <main
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/images/background.png")' }}
    >
      <div
        id="login"
        className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl backdrop-blur-sm"
      >
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">Atlas Login</h1>

        {isAuthenticated ? (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-green-700 font-semibold">Login Successful!</span>
            </div>
            <p className="text-green-600 text-sm">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (message) setMessage("");
                }}
                required
                placeholder="user@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (message) setMessage("");
                  }}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-center ${
                message.toLowerCase().includes("success") ||
                message.toLowerCase().includes("redirecting")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}>
                <p className="text-sm font-medium">
                  {message}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </span>
              ) : "Log In"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 font-medium hover:underline transition duration-150"
          >
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}
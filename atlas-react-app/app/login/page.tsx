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
  const { login, isAuthenticated, logout } = useAuth(); // Ensure logout is available if needed

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect them to the dashboard
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

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
          login(data.token); // This should set isAuthenticated to true in your context
          setMessage("Login successful! Redirecting...");
          setTimeout(() => {
            router.push("/dashboard");
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
          <div className="text-center text-green-600 font-medium">
            You are already logged in.
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
              <p
                className={`mt-4 text-center text-sm font-medium ${
                  message.toLowerCase().includes("success") ||
                  message.toLowerCase().includes("redirecting")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Logging In..." : "Log In"}
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

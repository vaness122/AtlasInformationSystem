'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // new state

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Please enter both email and password.');
      return;
    }

    // TODO: Replace this with real login logic
    setMessage(`Logging in with email: ${email}`);
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/images/background.png")' }}
    >
      <div id="login" className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Log In</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {showPassword ? <FiEyeOff/>: <FiEye/>}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
  Don&apos;t have an account?{' '}
  <Link href="/signup" className="text-blue-600 hover:underline">
    Sign Up
  </Link>
</p>

      </div>
    </main>
  );
}

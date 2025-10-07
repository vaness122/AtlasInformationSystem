'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const roleOptions = [
  { label: 'Select Role', value: -1 },
  { label: 'Super Admin', value: 0 },
  { label: 'Municipality Admin', value: 1 },
  { label: 'Barangay Admin', value: 2 },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: -1,
    municipalityId: null as number | null,
    barangayId: null as number | null,
    zoneId: null as number | null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (['role', 'municipalityId', 'barangayId', 'zoneId'].includes(name)) {
      const num = value === '' ? null : parseInt(value);
      setFormData((prev) => ({
        ...prev,
        [name]: num,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let {
      firstName,
      lastName,
      userName,
      email,
      password,
      confirmPassword,
      role,
      municipalityId,
      barangayId,
      zoneId,
    } = formData;

    // Basic validations
    if (!firstName || !lastName || !userName || !email || !password || !confirmPassword) {
      setMessage('Please fill in all required fields.');
      return;
    }
    if (role === -1) {
      setMessage('Please select a role.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    // Fix: set municipalityId and barangayId to null for SuperAdmin role before sending
    if (role === 0) {
      municipalityId = null;
      barangayId = null;
    }

    setLoading(true);
    setMessage('Registering...');

    const payload = {
      firstName,
      lastName,
      userName,
      email,
      password,
      role,
      municipalityId,
      barangayId,
      zoneId,
    };

    try {
      const response = await fetch('https://localhost:44336/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let errorMsg = `Error ${response.status}`;
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMsg = errorData.errorMessage || JSON.stringify(errorData);
        } else {
          errorMsg = await response.text();
        }
        setMessage(errorMsg);
        setLoading(false);
        return;
      }

      await response.json();
      setMessage('Registration successful!');
      setLoading(false);

      setFormData({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: -1,
        municipalityId: null,
        barangayId: null,
        zoneId: null,
      });
    } catch (error: any) {
      setMessage(error.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/images/background.png")' }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />

          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          >
            {roleOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="municipalityId"
            placeholder="Municipality ID"
            value={formData.municipalityId ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            min={0}
            disabled={formData.role === 0} // Disabled for SuperAdmin
          />

          <input
            type="number"
            name="barangayId"
            placeholder="Barangay ID"
            value={formData.barangayId ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            min={0}
            disabled={formData.role === 0} // Disabled for SuperAdmin
          />

          <input
            type="number"
            name="zoneId"
            placeholder="Zone ID"
            value={formData.zoneId ?? ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            min={0}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-blue-600"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition'
            }`}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.toLowerCase().includes('successful') ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

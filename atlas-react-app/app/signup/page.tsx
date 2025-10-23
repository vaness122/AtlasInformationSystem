'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

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
    municipalityName: '',
    barangayId: null as number | null,
    barangayName: '',
    zoneId: null as number | null,
    zoneName: '',
  });

  const [municipalities, setMunicipalities] = useState<{ id: number; name: string }[]>([]);
  const [barangays, setBarangays] = useState<{ id: number; name: string }[]>([]);
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Load municipalities on mount
  useEffect(() => {
    fetch('https://localhost:44336/api/municipalities')
      .then((res) => res.json())
      .then(setMunicipalities)
      .catch((err) => console.error('Failed to load municipalities', err));
  }, []);

  // Load barangays when municipality changes
  useEffect(() => {
    if (formData.municipalityId !== null) {
      fetch(`https://localhost:44336/api/municipalities/${formData.municipalityId}/barangays`)
        .then((res) => res.json())
        .then(setBarangays)
        .catch((err) => {
          console.error('Failed to load barangays', err);
          setBarangays([]);
        });
    } else {
      setBarangays([]);
    }

    setFormData((prev) => ({
      ...prev,
      barangayId: null,
      barangayName: '',
      zoneId: null,
      zoneName: '',
    }));
    setZones([]);
  }, [formData.municipalityId]);

  // Load zones when barangay changes
  useEffect(() => {
    if (formData.barangayId !== null) {
      fetch(`https://localhost:44336/api/barangays/${formData.barangayId}/zones`)
        .then((res) => res.json())
        .then(setZones)
        .catch((err) => {
          console.error('Failed to load zones', err);
          setZones([]);
        });
    } else {
      setZones([]);
    }

    setFormData((prev) => ({
      ...prev,
      zoneId: null,
      zoneName: '',
    }));
  }, [formData.barangayId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'role') {
      const roleValue = parseInt(value);
      setFormData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: roleValue,
        municipalityId: null,
        municipalityName: '',
        barangayId: null,
        barangayName: '',
        zoneId: null,
        zoneName: '',
      });
      setBarangays([]);
      setZones([]);
    } else if (name === 'municipalityId') {
      const selectedId = value === '' ? null : Number(value);
      const selected = municipalities.find((m) => m.id === selectedId);
      setFormData((prev) => ({
        ...prev,
        municipalityId: selectedId,
        municipalityName: selected?.name ?? '',
        barangayId: null,
        barangayName: '',
        zoneId: null,
        zoneName: '',
      }));
    } else if (name === 'barangayId') {
      const selectedId = value === '' ? null : Number(value);
      const selected = barangays.find((b) => b.id === selectedId);
      setFormData((prev) => ({
        ...prev,
        barangayId: selectedId,
        barangayName: selected?.name ?? '',
        zoneId: null,
        zoneName: '',
      }));
    } else if (name === 'zoneId') {
      const selectedId = value === '' ? null : Number(value);
      const selected = zones.find((z) => z.id === selectedId);
      setFormData((prev) => ({
        ...prev,
        zoneId: selectedId,
        zoneName: selected?.name ?? '',
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

    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      confirmPassword,
      role,
      municipalityId,
      municipalityName,
      barangayId,
      barangayName,
      zoneId,
      zoneName,
    } = formData;

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
    if ((role === 1 || role === 2) && !municipalityId) {
      setMessage('Please select a municipality.');
      return;
    }
    if ((role === 1 || role === 2) && !barangayId) {
      setMessage('Please select a barangay.');
      return;
    }
    if (role === 2 && !zoneId) {
      setMessage('Please select a zone.');
      return;
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
      municipalityId: role === 0 ? null : municipalityId,
      municipalityName: role === 0 ? null : municipalityName,
      barangayId: role === 0 ? null : barangayId,
      barangayName: role === 0 ? null : barangayName,
      zoneId: role === 2 ? zoneId : null,
      zoneName: role === 2 ? zoneName : null,
    };

    try {
      const response = await fetch('https://localhost:44336/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        let errorMsg = `Error ${response.status}`;
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMsg = errorData.errorMessage || JSON.stringify(errorData) || errorMsg;
        } else {
          const text = await response.text();
          errorMsg = text || errorMsg;
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
        municipalityName: '',
        barangayId: null,
        barangayName: '',
        zoneId: null,
        zoneName: '',
      });
      setBarangays([]);
      setZones([]);
    } catch (error) {
      console.error('Registration exception:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred during registration.';
      setMessage(errorMessage);
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

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-600"
              tabIndex={-1}
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
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Role select */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Municipality select (only for Municipality Admin or Barangay Admin) */}
          {(formData.role === 1 || formData.role === 2) && (
            <select
              name="municipalityId"
              value={formData.municipalityId ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Municipality</option>
              {municipalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}

          {/* Barangay select (only for Municipality Admin or Barangay Admin) */}
          {(formData.role === 1 || formData.role === 2) && (
            <select
              name="barangayId"
              value={formData.barangayId ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
              disabled={!formData.municipalityId}
            >
              <option value="">Select Barangay</option>
              {barangays.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}

          {/* Zone select (only for Barangay Admin) */}
          {formData.role === 2 && (
            <select
              name="zoneId"
              value={formData.zoneId ?? ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
              disabled={!formData.barangayId}
            >
              <option value="">Select Zone</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          )}

          {message && (
            <div className={`text-center text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface UserInfo {
  userId: string;
  Email: string;
  Role: string;
  BarangayId?: string | null;
  MunicipalityId?: string | null;
  FirstName?: string;
}

export default function DashboardPage() {
  const { token, logout, isAuthenticated, loading } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;

    fetch("https://localhost:44336/api/auth/me", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(async (res) => {
    if (res.status === 401) {
      logout();
      return null;
    }
    if (!res.ok) {
      const text = await res.text();
      console.error("API error:", res.status, text);
      throw new Error(`API error: ${res.status}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  })
  .then((data) => {
    if (data) setUserInfo(data);
  })
  .catch((err) => {
    console.error("Error fetching user info:", err);
  });

  }, [token, isAuthenticated, loading, logout]);

  if (!isAuthenticated) return <p>Please login to see this page.</p>;

  return (
    <div>
      <h1>Dashboard (Protected)</h1>
      <button onClick={logout} className="btn-logout">
        Logout
      </button>

      {userInfo ? (
        <div>
          <p>
            <strong>User ID:</strong> {userInfo.userId}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.Email}
          </p>
          <p>
            <strong>Role:</strong> {userInfo.Role}
          </p>
          <p>
            <strong>Barangay ID:</strong> {userInfo.BarangayId ?? "N/A"}
          </p>
          <p>
            <strong>Municipality ID:</strong> {userInfo.MunicipalityId ?? "N/A"}
          </p>
          {userInfo.FirstName && (
            <p>
              <strong>First Name:</strong> {userInfo.FirstName}
            </p>
          )}
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from  "../context/authContext";

export default function DashboardPage() {
  const { token, logout, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("https://localhost:5001/api/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          logout(); // token invalid, force logout
          return null;
        }
        return res.json();
      })
      .then(setData)
      .catch(console.error);
  }, [token, isAuthenticated, logout]);

  if (!isAuthenticated) return <p>Please login to see this page.</p>;

  return (
    <div>
      <h1>Dashboard (Protected)</h1>
      <button onClick={logout} className="btn-logout">Logout</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserInfo {
  userId: string;
  Email: string;
  Role: string;
  BarangayId?: string | null;
  MunicipalityId?: string | null;
  FirstName?: string;
}

interface AuthContextType {
  token: string | null;
  userInfo: UserInfo | null; // Add this
  login: (token: string, userData?: UserInfo) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userInfo: null, // Add this
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // Add this state
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserInfo = localStorage.getItem("userInfo");
    
    if (savedToken) {
      setToken(savedToken);
    }
    
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }
    
    setLoading(false);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        setToken(event.newValue);
      }
      if (event.key === "userInfo") {
        setUserInfo(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (newToken: string, userData?: UserInfo) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    
    if (userData) {
      localStorage.setItem("userInfo", JSON.stringify(userData));
      setUserInfo(userData);
    }
    
    router.push("/barangayadmin/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setToken(null);
    setUserInfo(null);
    router.push("/login");
  };

  const isAuthenticated = !!token;

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      token, 
      userInfo, // Add this
      login, 
      logout, 
      isAuthenticated, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
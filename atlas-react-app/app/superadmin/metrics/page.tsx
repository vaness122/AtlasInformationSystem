"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

interface SystemStatisticsDto {
  totalMunicipalities: number;
  totalBarangays: number;
  totalZones: number;
  totalHouseholds: number;
  totalResidents: number;
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  adminsByRole: { [key: string]: number };
  averageHouseholdSize: number;
}

interface MunicipalityStatisticsDto {
  municipalityId: number;
  municipalityName: string;
  totalBarangays: number;
  totalZones: number;
  totalHouseholds: number;
  totalResidents: number;
  averageHouseholdSize: number;
  populationDensity: number;
  barangayStatistics: BarangayStatisticsDto[];
  activeAdmins: number;
}

interface BarangayStatisticsDto {
  barangayId: number;
  barangayName: string;
  totalZones: number;
  totalHouseholds: number;
  totalResidents: number;
  averageHouseholdSize: number;
}

interface ActivityData {
  time: string;
  logins: number;
  registrations: number;
  updates: number;
}

// Mock data for fallback
const MOCK_STATS: SystemStatisticsDto = {
  totalMunicipalities: 1,
  totalBarangays: 3,
  totalZones: 4,
  totalHouseholds: 2,
  totalResidents: 8,
  totalAdmins: 5,
  activeAdmins: 5,
  inactiveAdmins: 0,
  adminsByRole: {
    "MunicipalityAdmin": 4,
    "BarangayAdmin": 1
  },
  averageHouseholdSize: 4.0
};

const MOCK_MUNICIPALITY_STATS: MunicipalityStatisticsDto[] = [
  {
    municipalityId: 1,
    municipalityName: "Ajuy",
    totalBarangays: 3,
    totalZones: 4,
    totalHouseholds: 2,
    totalResidents: 8,
    averageHouseholdSize: 4.0,
    populationDensity: 0,
    activeAdmins: 5,
    barangayStatistics: [
      {
        barangayId: 1,
        barangayName: "Adcadarao",
        totalZones: 4,
        totalHouseholds: 2,
        totalResidents: 8,
        averageHouseholdSize: 4.0
      }
    ]
  }
];

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
}

function MetricCard({ title, value, subtitle, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600", 
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {subtitle && (
            <p className="text-sm text-green-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Overview Card Component
interface OverviewCardProps {
  title: string;
  value: string;
  color: "green" | "blue";
}

function OverviewCard({ title, value, color }: OverviewCardProps) {
  const colorClasses = {
    green: "bg-green-50 border-green-200 text-green-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const iconClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600"
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]} hover:shadow-sm transition-shadow`}>
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${iconClasses[color]}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminMetrics() {
  const { token, logout, isAuthenticated, loading, userInfo } = useAuth();
  const [statistics, setStatistics] = useState<SystemStatisticsDto | null>(null);
  const [municipalityStats, setMunicipalityStats] = useState<MunicipalityStatisticsDto[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const API_BASE_URL = 'https://localhost:44336/api';

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMetrics();
    }
  }, [token, isAuthenticated]);

  const fetchMetrics = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      const [statsResponse, municipalityStatsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/super-admin/statistics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Accept": "application/json"
          },
        }),
        fetch(`${API_BASE_URL}/super-admin/municipalities/statistics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Accept": "application/json"
          },
        })
      ]);

      if (!statsResponse.ok) {
        throw new Error(`Statistics API failed with status: ${statsResponse.status}`);
      }

      if (!municipalityStatsResponse.ok) {
        throw new Error(`Municipalities API failed with status: ${municipalityStatsResponse.status}`);
      }

      const statsData = await statsResponse.json();
      const municipalityStatsData = await municipalityStatsResponse.json();

      setStatistics(statsData);
      setMunicipalityStats(municipalityStatsData);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError("Failed to load metrics data. Showing demo data.");
      
      // Use mock data as fallback
      setStatistics(MOCK_STATS);
      setMunicipalityStats(MOCK_MUNICIPALITY_STATS);
      setLastUpdated(new Date());
    } finally {
      setLoadingData(false);
    }
  };

  const refreshData = () => {
    fetchMetrics();
  };

  const generateActivityData = (): ActivityData[] => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => ({
      time: `${hour.toString().padStart(2, '0')}:00`,
      logins: Math.floor(Math.random() * 20) + 5,
      registrations: Math.floor(Math.random() * 10) + 1,
      updates: Math.floor(Math.random() * 50) + 10
    }));
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatTimeAgo = (date: Date | null): string => {
    if (!date) return "Never";
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  const metrics = statistics ? {
    totalMunicipalities: statistics.totalMunicipalities,
    totalBarangays: statistics.totalBarangays,
    totalZones: statistics.totalZones,
    totalHouseholds: statistics.totalHouseholds,
    totalResidents: statistics.totalResidents,
    totalAdmins: statistics.totalAdmins,
    activeAdmins: statistics.activeAdmins,
    inactiveAdmins: statistics.inactiveAdmins,
    averageHouseholdSize: statistics.averageHouseholdSize,
    adminsByRole: statistics.adminsByRole
  } : null;

  const activityData = generateActivityData();
  const maxLogins = Math.max(...activityData.map(d => d.logins));

  // Get user display name safely
  const getUserDisplayName = () => {
    if (!userInfo) return "Super Admin";
    
    if (userInfo.FirstName) return userInfo.FirstName;
    if (userInfo.Email) return userInfo.Email.split('@')[0];
    
    return "Super Admin";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Please login to see this page.</p>
          <Link 
            href="/login" 
            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
              <p className="text-sm text-gray-600">System Administration</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li key="dashboard-nav">
              <Link href="/superadmin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li key="profile-nav">
              <Link href="/superadmin/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </Link>
            </li>
            <li key="users-nav">
              <Link href="/superadmin/users" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Admin Users</span>
              </Link>
            </li>
            <li key="metrics-nav">
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">Metrics & Analytics</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-lg border border-red-200 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Metrics & Analytics</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {getUserDisplayName()}! Comprehensive overview of system performance and user activity.
                {lastUpdated && (
                  <span className="text-sm text-gray-500 ml-2">
                    • Last updated: {formatTimeAgo(lastUpdated)}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={loadingData}
              className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg 
                className={`w-5 h-5 ${loadingData ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Demo Mode
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {loadingData ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-600">Loading metrics data...</p>
              </div>
            </div>
          ) : metrics ? (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Municipalities"
                  value={metrics.totalMunicipalities}
                  icon={
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  }
                  color="blue"
                />
                <MetricCard
                  title="Barangays"
                  value={metrics.totalBarangays}
                  icon={
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                  color="green"
                />
                <MetricCard
                  title="Total Records"
                  value={metrics.totalHouseholds + metrics.totalResidents}
                  icon={
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  }
                  color="purple"
                />
                <MetricCard
                  title="Admin Users"
                  value={metrics.totalAdmins}
                  subtitle={`${metrics.activeAdmins} active`}
                  icon={
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  }
                  color="orange"
                />
              </div>

              {/* Admin Roles Breakdown */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Roles Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(metrics.adminsByRole).map(([role, count]) => (
                    <div key={`role-${role}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 capitalize">{role.replace('Admin', ' Admin')}</span>
                      <span className="text-2xl font-bold text-blue-600">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Activity Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity Pattern</h3>
                  <div className="h-64">
                    <div className="grid grid-cols-6 gap-2 h-48">
                      {activityData.map((data, index) => (
                        <div key={`activity-${index}`} className="flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-500 rounded transition-all duration-300 hover:opacity-80"
                            style={{ 
                              height: `${(data.logins / maxLogins) * 100}%`,
                              opacity: data.logins / maxLogins
                            }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">{data.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                      <span>Peak: {maxLogins} logins/hour</span>
                      <span>Total: {activityData.reduce((sum, d) => sum + d.logins, 0)} daily logins</span>
                    </div>
                  </div>
                </div>

                {/* Top Municipalities */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Municipality Overview</h3>
                  <div className="h-64 overflow-y-auto">
                    {municipalityStats.slice(0, 8).map((location, index) => (
                      <div key={`municipality-overview-${location.municipalityId}`} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{location.municipalityName}</p>
                            <p className="text-sm text-gray-500">{location.totalBarangays} barangays • {location.totalZones} zones</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatNumber(location.totalResidents)}</p>
                          <p className="text-sm text-gray-500">residents</p>
                        </div>
                      </div>
                    ))}
                    {municipalityStats.length === 0 && (
                      <p className="text-gray-500 text-center py-8">No municipality data available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Municipality Performance Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Municipality Performance</h3>
                  <span className="text-sm text-gray-500">{municipalityStats.length} municipalities</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipality</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barangays</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zones</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Households</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residents</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Household</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Admins</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {municipalityStats.map((location) => (
                        <tr key={`municipality-table-${location.municipalityId}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{location.municipalityName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{location.totalBarangays}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{location.totalZones}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(location.totalHouseholds)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(location.totalResidents)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{location.averageHouseholdSize.toFixed(1)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{location.activeAdmins}</td>
                        </tr>
                      ))}
                      {municipalityStats.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            No municipality statistics available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Overview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <OverviewCard
                    title="Total Zones"
                    value={`${metrics.totalZones} zones`}
                    color="green"
                  />
                  <OverviewCard
                    title="Household Size"
                    value={`${metrics.averageHouseholdSize.toFixed(1)} avg`}
                    color="green"
                  />
                  <OverviewCard
                    title="Active Admins"
                    value={`${metrics.activeAdmins} users`}
                    color="green"
                  />
                  <OverviewCard
                    title="Data Status"
                    value={error ? "Demo Data" : "Live Data"}
                    color={error ? "blue" : "green"}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No metrics data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
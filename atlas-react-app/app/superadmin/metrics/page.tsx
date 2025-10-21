"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalMunicipalities: number;
  totalBarangays: number;
  totalRecords: number;
  newRegistrations: number;
  systemUptime: string;
  averageResponseTime: number;
}

interface UserGrowthData {
  date: string;
  users: number;
  municipalities: number;
  barangays: number;
}

interface ActivityData {
  time: string;
  logins: number;
  registrations: number;
  updates: number;
}

interface LocationStats {
  municipality: string;
  barangays: number;
  users: number;
  records: number;
  growth: number;
}

export default function SuperAdminMetrics() {
  const { token, logout, isAuthenticated, loading } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [locationStats, setLocationStats] = useState<LocationStats[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchMetrics();
  }, [token, isAuthenticated, timeRange]);

  const fetchMetrics = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      // Simulate API calls for metrics data
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock metrics data
      const mockMetrics: SystemMetrics = {
        totalUsers: 1542,
        activeUsers: 1348,
        totalMunicipalities: 12,
        totalBarangays: 186,
        totalRecords: 28476,
        newRegistrations: 47,
        systemUptime: "99.8%",
        averageResponseTime: 124
      };

      // Mock growth data
      const mockGrowth: UserGrowthData[] = generateGrowthData(timeRange);
      
      // Mock activity data
      const mockActivity: ActivityData[] = generateActivityData();
      
      // Mock location stats
      const mockLocations: LocationStats[] = [
        {
          municipality: "Ajuy",
          barangays: 33,
          users: 428,
          records: 8452,
          growth: 12.5
        },
        {
          municipality: "Concepcion",
          barangays: 25,
          users: 312,
          records: 6231,
          growth: 8.3
        },
        {
          municipality: "San Dionisio",
          barangays: 29,
          users: 287,
          records: 5214,
          growth: 15.2
        },
        {
          municipality: "Batad",
          barangays: 24,
          users: 198,
          records: 3892,
          growth: 5.7
        },
        {
          municipality: "Sara",
          barangays: 42,
          users: 317,
          records: 4678,
          growth: 9.1
        }
      ];

      setMetrics(mockMetrics);
      setUserGrowth(mockGrowth);
      setActivityData(mockActivity);
      setLocationStats(mockLocations);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError("Failed to load metrics data");
    } finally {
      setLoadingData(false);
    }
  };

  // Helper functions to generate mock data
  const generateGrowthData = (range: "7d" | "30d" | "90d"): UserGrowthData[] => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const data: UserGrowthData[] = [];
    let users = 1200;
    let municipalities = 8;
    let barangays = 150;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      users += Math.floor(Math.random() * 10);
      municipalities += i % 10 === 0 ? 1 : 0;
      barangays += i % 3 === 0 ? 1 : 0;

      data.push({
        date: date.toISOString().split('T')[0],
        users,
        municipalities,
        barangays
      });
    }

    return data;
  };

  const generateActivityData = (): ActivityData[] => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => ({
      time: `${hour.toString().padStart(2, '0')}:00`,
      logins: Math.floor(Math.random() * 50) + 10,
      registrations: Math.floor(Math.random() * 20) + 2,
      updates: Math.floor(Math.random() * 100) + 30
    }));
  };

  const getGrowthPercentage = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Please login to see this page.</p>
          <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
     {/* Sidebar */}
<div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
  <div className="p-6 border-b border-gray-200">
    <Link href="/superadmin/dashboard" className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>Back to Dashboard</span>
    </Link>
  </div>

  <nav className="flex-1 p-4">
    <ul className="space-y-2">
      {/* ONLY THESE 4 NAVIGATION ITEMS */}
      <li>
        <Link href="/superadmin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link href="/superadmin/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profile</span>
        </Link>
      </li>
      <li>
        <Link href="/superadmin/users" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <span>Admin Users</span>
        </Link>
      </li>
      <li>
        <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg border border-blue-100">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-medium">Metrics & Analytics</span>
        </a>
      </li>
      {/* END OF 4 NAVIGATION ITEMS */}
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Metrics & Analytics</h1>
                <p className="text-gray-600 mt-2">Comprehensive overview of system performance and user activity.</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as "7d" | "30d" | "90d")}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
                <button
                  onClick={fetchMetrics}
                  disabled={loadingData}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    <strong>Error:</strong> {error}
                  </h3>
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
          ) : metrics && (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalUsers)}</p>
                      <p className="text-sm text-green-600 mt-1">
                        +{metrics.newRegistrations} new this week
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.activeUsers)}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}% active rate
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Records</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalRecords)}</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Across {metrics.totalBarangays} barangays
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">System Uptime</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.systemUptime}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Avg. response: {metrics.averageResponseTime}ms
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts and Detailed Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* User Growth Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
                  <div className="h-64">
                    <div className="flex items-end justify-between h-48 space-x-1">
                      {userGrowth.slice(-14).map((data, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="flex items-end space-x-1 flex-1 w-full">
                            <div 
                              className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                              style={{ height: `${(data.users / Math.max(...userGrowth.map(d => d.users))) * 80}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                            {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                      <span>Start: {userGrowth[0]?.date}</span>
                      <span>End: {userGrowth[userGrowth.length - 1]?.date}</span>
                    </div>
                  </div>
                </div>

                {/* Activity Heatmap */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity Pattern</h3>
                  <div className="h-64">
                    <div className="grid grid-cols-6 gap-2 h-48">
                      {activityData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-full rounded transition-all duration-300 hover:opacity-80"
                            style={{ 
                              height: `${(data.logins / Math.max(...activityData.map(d => d.logins))) * 100}%`,
                              backgroundColor: `rgba(59, 130, 246, ${data.logins / Math.max(...activityData.map(d => d.logins))})`
                            }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">{data.time}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                      <span>Peak: {Math.max(...activityData.map(d => d.logins))} logins/hour</span>
                      <span>Total: {activityData.reduce((sum, d) => sum + d.logins, 0)} daily logins</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Statistics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Municipality Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipality</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barangays</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {locationStats.map((location, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{location.municipality}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{location.barangays}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(location.users)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(location.records)}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              location.growth >= 10 ? 'bg-green-100 text-green-800' :
                              location.growth >= 5 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {location.growth > 0 ? '+' : ''}{location.growth}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">User Engagement</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Daily Active Users</span>
                        <span className="font-medium">1,248</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly Retention</span>
                        <span className="font-medium">64%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">System Health</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Response Time</span>
                      <span className="text-sm font-medium text-green-600">124ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Error Rate</span>
                      <span className="text-sm font-medium text-green-600">0.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Server Load</span>
                      <span className="text-sm font-medium text-yellow-600">42%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Data Insights</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Records Today</span>
                      <span className="text-sm font-medium">147</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Accuracy</span>
                      <span className="text-sm font-medium text-green-600">98.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Backup Status</span>
                      <span className="text-sm font-medium text-green-600">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
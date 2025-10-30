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

export default function SuperAdminMetrics() {
  const { token, logout, isAuthenticated, loading, userInfo } = useAuth();
  const [statistics, setStatistics] = useState<SystemStatisticsDto | null>(null);
  const [municipalityStats, setMunicipalityStats] = useState<MunicipalityStatisticsDto[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'https://localhost:44336/api';

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchMetrics();
  }, [token, isAuthenticated]);

  const fetchMetrics = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      const [statsResponse, municipalityStatsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/super-admin/statistics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        }),
        fetch(`${API_BASE_URL}/super-admin/municipalities/statistics`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        })
      ]);

      if (statsResponse.ok && municipalityStatsResponse.ok) {
        const statsData = await statsResponse.json();
        const municipalityStatsData = await municipalityStatsResponse.json();

        setStatistics(statsData);
        setMunicipalityStats(municipalityStatsData);
      } else {
        console.error("Failed to fetch metrics data");
        setError("Failed to load metrics data");
        
        const mockStats: SystemStatisticsDto = {
          totalMunicipalities: 1,
          totalBarangays: 1,
          totalZones: 5,
          totalHouseholds: 50,
          totalResidents: 200,
          totalAdmins: 3,
          activeAdmins: 2,
          inactiveAdmins: 1,
          adminsByRole: {
            "SuperAdmin": 1,
            "MunicipalityAdmin": 1,
            "BarangayAdmin": 1
          },
          averageHouseholdSize: 4.0
        };

        const mockMunicipalityStats: MunicipalityStatisticsDto[] = [
          {
            municipalityId: 1,
            municipalityName: "Ajuy",
            totalBarangays: 1,
            totalZones: 5,
            totalHouseholds: 50,
            totalResidents: 200,
            averageHouseholdSize: 4.0,
            populationDensity: 100.5,
            activeAdmins: 2,
            barangayStatistics: [
              {
                barangayId: 1,
                barangayName: "Adcadarao",
                totalZones: 5,
                totalHouseholds: 50,
                totalResidents: 200,
                averageHouseholdSize: 4.0
              }
            ]
          }
        ];

        setStatistics(mockStats);
        setMunicipalityStats(mockMunicipalityStats);
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError("Failed to load metrics data");
      
      const mockStats: SystemStatisticsDto = {
        totalMunicipalities: 1,
        totalBarangays: 1,
        totalZones: 5,
        totalHouseholds: 50,
        totalResidents: 200,
        totalAdmins: 3,
        activeAdmins: 2,
        inactiveAdmins: 1,
        adminsByRole: {
          "SuperAdmin": 1,
          "MunicipalityAdmin": 1,
          "BarangayAdmin": 1
        },
        averageHouseholdSize: 4.0
      };

      const mockMunicipalityStats: MunicipalityStatisticsDto[] = [
        {
          municipalityId: 1,
          municipalityName: "Ajuy",
          totalBarangays: 1,
          totalZones: 5,
          totalHouseholds: 50,
          totalResidents: 200,
          averageHouseholdSize: 4.0,
          populationDensity: 100.5,
          activeAdmins: 2,
          barangayStatistics: [
            {
              barangayId: 1,
              barangayName: "Adcadarao",
              totalZones: 5,
              totalHouseholds: 50,
              totalResidents: 200,
              averageHouseholdSize: 4.0
            }
          ]
        }
      ];

      setStatistics(mockStats);
      setMunicipalityStats(mockMunicipalityStats);
    } finally {
      setLoadingData(false);
    }
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

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">System Metrics & Analytics</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {userInfo?.FirstName || "Super Admin"}! Comprehensive overview of system performance and user activity.
            </p>
          </div>

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
          ) : metrics ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Municipalities</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalMunicipalities)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Barangays</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalBarangays)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Records</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalHouseholds + metrics.totalResidents)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Admin Users</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalAdmins)}</p>
                      <p className="text-sm text-green-600 mt-1">
                        {metrics.activeAdmins} active
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Municipalities</h3>
                  <div className="h-64 overflow-y-auto">
                    {municipalityStats.slice(0, 8).map((location, index) => (
                      <div key={location.municipalityId} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{location.municipalityName}</p>
                            <p className="text-sm text-gray-500">{location.totalBarangays} barangays</p>
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

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Municipality Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipality</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barangays</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Households</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residents</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Household</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Population Density</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {municipalityStats.map((location) => (
                        <tr key={location.municipalityId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{location.municipalityName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{location.totalBarangays}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(location.totalHouseholds)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatNumber(location.totalResidents)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{location.averageHouseholdSize.toFixed(1)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{location.populationDensity.toFixed(1)}</td>
                        </tr>
                      ))}
                      {municipalityStats.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No municipality statistics available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Total Zones</p>
                        <p className="text-xs text-green-600">{metrics.totalZones} zones</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Household Size</p>
                        <p className="text-xs text-green-600">{metrics.averageHouseholdSize.toFixed(1)} avg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Active Admins</p>
                        <p className="text-xs text-green-600">{metrics.activeAdmins} users</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">Last Updated</p>
                        <p className="text-xs text-blue-600">Just now</p>
                      </div>
                    </div>
                  </div>
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
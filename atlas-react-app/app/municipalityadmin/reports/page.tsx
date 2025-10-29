"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

interface MunicipalityStatistics {
  municipalityId: number;
  totalBarangays: number;
  totalZones: number;
  totalHouseholds: number;
  totalResidents: number;
  averageHouseholdSize: number;
  populationDensity: number;
  barangayStatistics: BarangayStatistic[];
}

interface BarangayStatistic {
  barangayId: number;
  barangayName: string;
  totalZones: number;
  totalHouseholds: number;
  totalResidents: number;
  averageHouseholdSize: number;
  activeResidents: number;
  householdHeads: number;
  zoneStatistics: ZoneStatistic[];
}

interface ZoneStatistic {
  zoneId: number;
  zoneName: string;
  barangayName: string;
  totalHouseholds: number;
  totalResidents: number;
  averageHouseholdSize: number;
  activeResidents: number;
  householdHeads: number;
  genderDistribution: Record<string, number>;
}

interface ResidentStatistics {
  totalResidents: number;
  activeResidents: number;
  householdHeads: number;
  averageAge: number;
  genderDistribution: Record<string, number>;
  ageDistribution: Record<string, number>;
  residentsByBarangay: BarangayResidentCount[];
}

interface BarangayResidentCount {
  barangayId: number;
  barangayName: string;
  residentCount: number;
}

interface HouseholdStatistics {
  totalHouseholds: number;
  averageHouseholdSize: number;
  householdsByBarangay: BarangayHouseholdCount[];
  householdDistribution: Record<string, number>;
}

interface BarangayHouseholdCount {
  barangayId: number;
  barangayName: string;
  householdCount: number;
}

interface ReportData {
  generatedAt: string;
  municipalityStatistics: MunicipalityStatistics;
  householdStatistics: HouseholdStatistics;
  residentStatistics: ResidentStatistics;
  summary: string;
}

export default function ReportsPage() {
  const { token, logout, isAuthenticated, loading } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [municipalityStats, setMunicipalityStats] = useState<MunicipalityStatistics | null>(null);
  const [residentStats, setResidentStats] = useState<ResidentStatistics | null>(null);
  const [householdStats, setHouseholdStats] = useState<HouseholdStatistics | null>(null);
  const [zonesStats, setZonesStats] = useState<ZoneStatistic[]>([]);
  const [barangaysStats, setBarangaysStats] = useState<BarangayStatistic[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    fetchReportsData();
  }, [token, isAuthenticated]);

  const fetchReportsData = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchReport(),
        fetchMunicipalityStatistics(),
        fetchResidentStatistics(),
        fetchHouseholdStatistics(),
        fetchZonesStatistics(),
        fetchBarangaysStatistics()
      ]);
    } catch (err) {
      console.error("Error fetching reports data:", err);
      setError("Failed to load reports data");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchReport = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/reports", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      } else {
        console.error("Failed to fetch report");
      }
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  const fetchMunicipalityStatistics = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/statistics", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        setMunicipalityStats(data);
      } else {
        console.error("Failed to fetch municipality statistics");
      }
    } catch (err) {
      console.error("Error fetching municipality statistics:", err);
    }
  };

  const fetchResidentStatistics = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/residents/statistics", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        setResidentStats(data);
      } else {
        console.error("Failed to fetch resident statistics");
      }
    } catch (err) {
      console.error("Error fetching resident statistics:", err);
    }
  };

  const fetchHouseholdStatistics = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/households/statistics", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHouseholdStats(data);
      } else {
        console.error("Failed to fetch household statistics");
      }
    } catch (err) {
      console.error("Error fetching household statistics:", err);
    }
  };

  const fetchZonesStatistics = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/zones/statistics", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        setZonesStats(data);
      } else {
        console.error("Failed to fetch zones statistics");
      }
    } catch (err) {
      console.error("Error fetching zones statistics:", err);
    }
  };

  const fetchBarangaysStatistics = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/barangays/statistics", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBarangaysStats(data);
      } else {
        console.error("Failed to fetch barangays statistics");
      }
    } catch (err) {
      console.error("Error fetching barangays statistics:", err);
    }
  };

  const exportToPDF = async () => {
    setExportLoading(true);
    try {
      // In a real implementation, you would call a PDF generation endpoint
      // For now, we'll create a simple client-side PDF download
      const reportContent = generateReportContent();
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `municipality-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting report:", err);
      setError("Failed to export report");
    } finally {
      setExportLoading(false);
    }
  };

  const generateReportContent = () => {
    const report = [
      "MUNICIPALITY STATISTICAL REPORT",
      "================================\n",
      `Generated on: ${new Date().toLocaleString()}`,
      `Municipality ID: ${municipalityStats?.municipalityId || 'N/A'}\n`,
      
      "OVERVIEW STATISTICS",
      "-------------------",
      `Total Barangays: ${municipalityStats?.totalBarangays || 0}`,
      `Total Zones: ${municipalityStats?.totalZones || 0}`,
      `Total Households: ${municipalityStats?.totalHouseholds || 0}`,
      `Total Residents: ${municipalityStats?.totalResidents || 0}`,
      `Average Household Size: ${municipalityStats?.averageHouseholdSize?.toFixed(2) || 0}`,
      `Population Density: ${municipalityStats?.populationDensity || 0}\n`,

      "RESIDENT DEMOGRAPHICS",
      "---------------------",
      `Active Residents: ${residentStats?.activeResidents || 0}`,
      `Household Heads: ${residentStats?.householdHeads || 0}`,
      `Average Age: ${residentStats?.averageAge || 0}\n`,

      "GENDER DISTRIBUTION",
      "-------------------",
    ];

    if (residentStats?.genderDistribution) {
      Object.entries(residentStats.genderDistribution).forEach(([gender, count]) => {
        const percentage = ((count / residentStats.totalResidents) * 100).toFixed(1);
        report.push(`${gender}: ${count} (${percentage}%)`);
      });
    }

    report.push(
      "",
      "BARANGAY BREAKDOWN",
      "------------------"
    );

    barangaysStats.forEach(barangay => {
      report.push(
        `\n${barangay.barangayName} (ID: ${barangay.barangayId})`,
        `  Zones: ${barangay.totalZones}`,
        `  Households: ${barangay.totalHouseholds}`,
        `  Residents: ${barangay.totalResidents}`,
        `  Avg. Household Size: ${barangay.averageHouseholdSize?.toFixed(2)}`,
        `  Active Residents: ${barangay.activeResidents}`,
        `  Household Heads: ${barangay.householdHeads}`
      );
    });

    return report.join('\n');
  };

  const getGenderPercentage = (gender: string) => {
    if (!residentStats?.genderDistribution || !residentStats.totalResidents) return 0;
    const count = residentStats.genderDistribution[gender] || 0;
    return ((count / residentStats.totalResidents) * 100).toFixed(1);
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
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/municipalityadmin/dashboard" className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/municipalityadmin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/municipalityadmin/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link href="/municipalityadmin/barangays" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Barangays</span>
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">Reports</span>
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Municipality Reports</h1>
                <p className="text-gray-600 mt-2">Comprehensive statistical reports and analytics for your municipality.</p>
                {reportData && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last generated: {new Date(reportData.generatedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={fetchReportsData}
                  disabled={loadingData}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{loadingData ? "Refreshing..." : "Refresh Data"}</span>
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={exportLoading || loadingData}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{exportLoading ? "Exporting..." : "Export Report"}</span>
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

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {[
                  { id: "overview", name: "Overview" },
                  { id: "residents", name: "Residents" },
                  { id: "households", name: "Households" },
                  { id: "barangays", name: "Barangays" },
                  { id: "zones", name: "Zones" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-900">{municipalityStats?.totalBarangays || 0}</div>
                      <div className="text-sm text-blue-700">Total Barangays</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-900">{municipalityStats?.totalHouseholds || 0}</div>
                      <div className="text-sm text-green-700">Total Households</div>
                      <div className="text-xs text-green-600 mt-1">
                        Avg. size: {municipalityStats?.averageHouseholdSize?.toFixed(2) || 0}
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-900">{municipalityStats?.totalResidents || 0}</div>
                      <div className="text-sm text-orange-700">Total Residents</div>
                      <div className="text-xs text-orange-600 mt-1">
                        Active: {residentStats?.activeResidents || 0}
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-900">{municipalityStats?.totalZones || 0}</div>
                      <div className="text-sm text-purple-700">Total Zones</div>
                    </div>
                  </div>

                  {/* Summary */}
                  {reportData && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Report Summary</h3>
                      <p className="text-gray-700">{reportData.summary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Residents Tab */}
              {activeTab === "residents" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">{residentStats?.totalResidents || 0}</div>
                      <div className="text-sm text-gray-700">Total Residents</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">{residentStats?.activeResidents || 0}</div>
                      <div className="text-sm text-gray-700">Active Residents</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-900">{residentStats?.householdHeads || 0}</div>
                      <div className="text-sm text-gray-700">Household Heads</div>
                    </div>
                  </div>

                  {/* Gender Distribution */}
                  {residentStats?.genderDistribution && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-c-4 gap-4">
                        {Object.entries(residentStats.genderDistribution).map(([gender, count]) => (
                          <div key={gender} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">{gender}</span>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">{count}</div>
                              <div className="text-sm text-gray-500">
                                {getGenderPercentage(gender)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Residents by Barangay */}
                  {residentStats?.residentsByBarangay && residentStats.residentsByBarangay.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Residents by Barangay</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">Barangay</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-700">Residents</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-700">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {residentStats.residentsByBarangay.map((barangay) => (
                              <tr key={barangay.barangayId}>
                                <td className="px-4 py-2 text-gray-900">{barangay.barangayName}</td>
                                <td className="px-4 py-2 text-right text-gray-900">{barangay.residentCount}</td>
                                <td className="px-4 py-2 text-right text-gray-500">
                                  {((barangay.residentCount / residentStats.totalResidents) * 100).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Households Tab */}
              {activeTab === "households" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="text-3xl font-bold text-gray-900">{householdStats?.totalHouseholds || 0}</div>
                      <div className="text-lg text-gray-700">Total Households</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="text-3xl font-bold text-gray-900">{householdStats?.averageHouseholdSize?.toFixed(2) || 0}</div>
                      <div className="text-lg text-gray-700">Average Household Size</div>
                    </div>
                  </div>

                  {/* Households by Barangay */}
                  {householdStats?.householdsByBarangay && householdStats.householdsByBarangay.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Households by Barangay</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium text-gray-700">Barangay</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-700">Households</th>
                              <th className="px-4 py-2 text-right font-medium text-gray-700">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {householdStats.householdsByBarangay.map((barangay) => (
                              <tr key={barangay.barangayId}>
                                <td className="px-4 py-2 text-gray-900">{barangay.barangayName}</td>
                                <td className="px-4 py-2 text-right text-gray-900">{barangay.householdCount}</td>
                                <td className="px-4 py-2 text-right text-gray-500">
                                  {((barangay.householdCount / householdStats.totalHouseholds) * 100).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Barangays Tab */}
              {activeTab === "barangays" && (
                <div className="space-y-6">
                  {barangaysStats.map((barangay) => (
                    <div key={barangay.barangayId} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{barangay.barangayName}</h3>
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          ID: {barangay.barangayId}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{barangay.totalZones}</div>
                          <div className="text-sm text-gray-600">Zones</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{barangay.totalHouseholds}</div>
                          <div className="text-sm text-gray-600">Households</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{barangay.totalResidents}</div>
                          <div className="text-sm text-gray-600">Residents</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{barangay.averageHouseholdSize?.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">Avg. HH Size</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Zones Tab */}
              {activeTab === "zones" && (
                <div className="space-y-6">
                  {zonesStats.map((zone) => (
                    <div key={zone.zoneId} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{zone.zoneName}</h3>
                          <p className="text-gray-600">{zone.barangayName}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                          Zone ID: {zone.zoneId}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{zone.totalHouseholds}</div>
                          <div className="text-sm text-gray-600">Households</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{zone.totalResidents}</div>
                          <div className="text-sm text-gray-600">Residents</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{zone.averageHouseholdSize?.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">Avg. HH Size</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
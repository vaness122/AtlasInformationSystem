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
  householdCount: number;
  residentCount: number;
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

interface Barangay {
  id: number;
  name: string;
  code: string;
  municipalityId: number;
  municipalityName: string;
}

interface Resident {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  civilStatus: string;
  occupation: string;
  email: string;
  address: string;
  zoneId: number;
  municipalityId: number;
  barangayId: number;
  isHead: boolean;
  isActive: boolean;
  municipalityName: string;
  barangayName: string;
  zoneName: string;
  householdName: string;
  householdId: string;
}

interface Household {
  id: number;
  houseHoldName: string;
  zoneId: number;
  zoneName: string;
  residentCount: number;
}

interface Zone {
  id: number;
  name: string;
  description: string;
  barangayId: number;
  barangayName: string;
}

interface HouseholdMember {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: string;
  gender: string;
  civilStatus: string;
  occupation: string;
  email: string;
  isHead: boolean;
  isActive: boolean;
  relationshipToHead: string;
}

interface HouseholdDetails {
  id: number;
  houseHoldName: string;
  zoneId: number;
  zoneName: string;
  barangayId: number;
  barangayName: string;
  residentCount: number;
  members: HouseholdMember[];
}

export default function MunicipalityDashboard() {
  const { token, logout, isAuthenticated, loading, userInfo } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [municipalityStats, setMunicipalityStats] = useState<MunicipalityStatistics | null>(null);
  const [residentStats, setResidentStats] = useState<ResidentStatistics | null>(null);
  const [householdStats, setHouseholdStats] = useState<HouseholdStatistics | null>(null);
  const [zonesStats, setZonesStats] = useState<ZoneStatistic[]>([]);
  const [barangaysStats, setBarangaysStats] = useState<BarangayStatistic[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [allHouseholds, setAllHouseholds] = useState<Household[]>([]);
  const [allZones, setAllZones] = useState<Zone[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New states for detailed view
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayStatistic | null>(null);
  const [barangayResidents, setBarangayResidents] = useState<Resident[]>([]);
  const [barangayHouseholds, setBarangayHouseholds] = useState<Household[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<"residents" | "households">("residents");
  
  // Search states
  const [residentSearchTerm, setResidentSearchTerm] = useState("");
  const [householdSearchTerm, setHouseholdSearchTerm] = useState("");

  // Household details state
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdDetails | null>(null);
  const [showHouseholdModal, setShowHouseholdModal] = useState(false);
  const [loadingHouseholdDetails, setLoadingHouseholdDetails] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    fetchDashboardData();
  }, [token, isAuthenticated]);

  // Debug useEffect to check data
  useEffect(() => {
    console.log("Data loaded:", {
      allResidents: allResidents.length,
      allHouseholds: allHouseholds.length,
      allZones: allZones.length,
      barangays: barangays.length
    });
    
    if (allResidents.length > 0) {
      console.log("Sample resident:", {
        id: allResidents[0].id,
        householdId: allResidents[0].householdId,
        householdName: allResidents[0].householdName
      });
    }
    
    if (allHouseholds.length > 0) {
      console.log("Sample household:", {
        id: allHouseholds[0].id,
        name: allHouseholds[0].houseHoldName
      });
    }
  }, [allResidents, allHouseholds, allZones, barangays]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      // Fetch basic data first
      await Promise.all([
        fetchAllResidents(),
        fetchAllHouseholds(),
        fetchAllZones(),
        fetchBarangays()
      ]);
      
      // Then fetch statistics
      await Promise.all([
        fetchReport(),
        fetchResidentStatistics(),
        fetchHouseholdStatistics(),
        fetchBarangaysStatistics()
      ]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
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
        console.log("Barangay Statistics:", data);
        setBarangaysStats(data);
      } else {
        console.error("Failed to fetch barangays statistics");
      }
    } catch (err) {
      console.error("Error fetching barangays statistics:", err);
    }
  };

  const fetchBarangays = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/barangays", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBarangays(data);
      } else {
        console.error("Failed to fetch barangays");
      }
    } catch (err) {
      console.error("Error fetching barangays:", err);
    }
  };

  // Fetch all residents
  const fetchAllResidents = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/residents", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched residents:", data.length);
        setAllResidents(data);
      } else {
        console.error("Failed to fetch residents:", res.status);
        throw new Error(`Failed to fetch residents: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching residents:", err);
      throw err;
    }
  };

  // Fetch all households
  const fetchAllHouseholds = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/households", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched households:", data.length);
        setAllHouseholds(data);
      } else {
        console.error("Failed to fetch households");
        throw new Error(`Failed to fetch households: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching households:", err);
      throw err;
    }
  };

  // Fetch all zones
  const fetchAllZones = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/zones", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched zones:", data.length);
        setAllZones(data);
      } else {
        console.error("Failed to fetch zones");
        throw new Error(`Failed to fetch zones: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching zones:", err);
      throw err;
    }
  };

  // Get accurate resident count for a household - FIXED
  const getHouseholdResidentCount = (householdId: number) => {
    const count = allResidents.filter(resident => {
      // Handle both string and number comparisons
      const residentHouseholdId = resident.householdId?.toString();
      const targetHouseholdId = householdId.toString();
      return residentHouseholdId === targetHouseholdId;
    }).length;
    
    console.log(`Household ${householdId} resident count:`, count);
    return count;
  };

  // Handle view details click - FIXED
  const handleViewDetails = async (barangay: BarangayStatistic) => {
    setSelectedBarangay(barangay);
    setLoadingDetails(true);
    setShowDetailsModal(true);
    setActiveTab("residents");
    setResidentSearchTerm("");
    setHouseholdSearchTerm("");

    try {
      // Filter residents for the selected barangay - FIXED
      const filteredResidents = allResidents.filter(resident => {
        return resident.barangayId === barangay.barangayId;
      });

      // Filter households for the selected barangay - FIXED
      const filteredHouseholds = allHouseholds.filter(household => {
        // Find the zone to get barangayId
        const zone = allZones.find(z => z.id === household.zoneId);
        return zone?.barangayId === barangay.barangayId;
      });

      console.log(`Barangay ${barangay.barangayName} details:`, {
        residents: filteredResidents.length,
        households: filteredHouseholds.length,
        barangayId: barangay.barangayId
      });

      setBarangayResidents(filteredResidents);
      setBarangayHouseholds(filteredHouseholds);
    } catch (err) {
      console.error("Error filtering barangay details:", err);
      setError("Failed to load barangay details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle view household details - FIXED
  const handleViewHouseholdDetails = async (household: Household) => {
    setLoadingHouseholdDetails(true);
    
    try {
      // Find the zone to get barangay info
      const zone = allZones.find(z => z.id === household.zoneId);
      
      // Filter residents for this household - FIXED: Proper comparison
      const householdMembers = allResidents
        .filter(resident => {
          // Convert both to string for safe comparison
          const residentHouseholdId = resident.householdId?.toString();
          const targetHouseholdId = household.id.toString();
          return residentHouseholdId === targetHouseholdId;
        })
        .map(resident => ({
          id: resident.id,
          firstName: resident.firstName,
          middleName: resident.middleName,
          lastName: resident.lastName,
          birthdate: resident.birthdate,
          gender: resident.gender,
          civilStatus: resident.civilStatus,
          occupation: resident.occupation,
          email: resident.email,
          isHead: resident.isHead,
          isActive: resident.isActive,
          relationshipToHead: resident.isHead ? "Head" : "Member"
        }));

      // Calculate actual resident count from filtered members
      const actualResidentCount = householdMembers.length;

      console.log(`Household ${household.id} details:`, {
        name: household.houseHoldName,
        members: householdMembers.length,
        zone: zone?.barangayName
      });

      const householdDetails: HouseholdDetails = {
        id: household.id,
        houseHoldName: household.houseHoldName,
        zoneId: household.zoneId,
        zoneName: household.zoneName,
        barangayId: zone?.barangayId || 0,
        barangayName: zone?.barangayName || "Unknown",
        residentCount: actualResidentCount,
        members: householdMembers
      };

      setSelectedHousehold(householdDetails);
      setShowHouseholdModal(true);
    } catch (err) {
      console.error("Error loading household details:", err);
      setError("Failed to load household details");
    } finally {
      setLoadingHouseholdDetails(false);
    }
  };

  // Filter residents based on search term
  const filteredResidents = barangayResidents.filter(resident =>
    `${resident.firstName} ${resident.middleName} ${resident.lastName}`
      .toLowerCase()
      .includes(residentSearchTerm.toLowerCase()) ||
    resident.gender.toLowerCase().includes(residentSearchTerm.toLowerCase()) ||
    resident.civilStatus.toLowerCase().includes(residentSearchTerm.toLowerCase()) ||
    resident.occupation.toLowerCase().includes(residentSearchTerm.toLowerCase()) ||
    resident.zoneName.toLowerCase().includes(residentSearchTerm.toLowerCase()) ||
    resident.householdName.toLowerCase().includes(residentSearchTerm.toLowerCase())
  );

  // Filter households based on search term
  const filteredHouseholds = barangayHouseholds.filter(household =>
    household.houseHoldName.toLowerCase().includes(householdSearchTerm.toLowerCase()) ||
    household.zoneName.toLowerCase().includes(householdSearchTerm.toLowerCase()) ||
    household.id.toString().includes(householdSearchTerm)
  );

  // Helper function to get gender distribution percentage
  const getGenderPercentage = (gender: string) => {
    if (!residentStats?.genderDistribution || !residentStats.totalResidents) return 0;
    const count = residentStats.genderDistribution[gender] || 0;
    return ((count / residentStats.totalResidents) * 100).toFixed(1);
  };

  // Get barangay details for the statistics
  const getBarangayDetails = (barangayId: number) => {
    return barangays.find(b => b.id === barangayId);
  };

  // Calculate total statistics from barangays data
  const calculateTotalStats = () => {
    const totalBarangays = barangaysStats.length || barangays.length;
    const totalHouseholds = barangaysStats.reduce((sum, stats) => sum + stats.totalHouseholds, 0) || allHouseholds.length;
    const totalResidents = barangaysStats.reduce((sum, stats) => sum + stats.totalResidents, 0) || allResidents.length;
    const totalZones = barangaysStats.reduce((sum, stats) => sum + stats.totalZones, 0) || allZones.length;
    
    const avgHouseholdSize = totalHouseholds > 0 ? totalResidents / totalHouseholds : 0;

    return {
      totalBarangays,
      totalHouseholds,
      totalResidents,
      totalZones,
      avgHouseholdSize
    };
  };

  const totalStats = calculateTotalStats();

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
      {/* Household Details Modal - FIXED Z-INDEX */}
      {showHouseholdModal && selectedHousehold && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedHousehold.houseHoldName}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Household ID: {selectedHousehold.id} | 
                  Zone: {selectedHousehold.zoneName} | 
                  Barangay: {selectedHousehold.barangayName} | 
                  Residents: <span className="font-semibold text-green-600">{selectedHousehold.residentCount}</span>
                </p>
              </div>
              <button 
                onClick={() => setShowHouseholdModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[60vh]">
              {loadingHouseholdDetails ? (
                <div className="text-center py-8">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600">Loading household details...</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Household Residents</h4>
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                        {selectedHousehold.members.length} Resident{selectedHousehold.members.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {selectedHousehold.members.length > 0 ? (
                      <div className="space-y-4">
                        {selectedHousehold.members.map((member) => (
                          <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h5 className="font-medium text-gray-900">
                                    {member.firstName} {member.middleName} {member.lastName}
                                  </h5>
                                  {member.isHead && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      Head
                                    </span>
                                  )}
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {member.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Gender:</span> {member.gender}
                                  </div>
                                  <div>
                                    <span className="font-medium">Birth Date:</span> {new Date(member.birthdate).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <span className="font-medium">Civil Status:</span> {member.civilStatus}
                                  </div>
                                  <div>
                                    <span className="font-medium">Occupation:</span> {member.occupation || 'N/A'}
                                  </div>
                                </div>
                                
                                {member.email && (
                                  <div className="mt-2 text-sm">
                                    <span className="font-medium">Email:</span> {member.email}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-2">No residents found</p>
                        <p className="text-gray-600">This household doesn't have any registered residents yet.</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Household Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Total Residents</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedHousehold.residentCount}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Active Residents</p>
                        <p className="text-2xl font-bold text-green-900">
                          {selectedHousehold.members.filter(m => m.isActive).length}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">Household Head</p>
                        <p className="text-lg font-bold text-yellow-900">
                          {selectedHousehold.members.find(m => m.isHead) ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">Zone</p>
                        <p className="text-lg font-bold text-purple-900">{selectedHousehold.zoneName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Barangay Details Modal - FIXED Z-INDEX */}
      {showDetailsModal && selectedBarangay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[90] p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedBarangay.barangayName} Details</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Barangay ID: {selectedBarangay.barangayId} | 
                  Total Residents: <span className="font-semibold">{selectedBarangay.totalResidents}</span> | 
                  Total Households: <span className="font-semibold">{selectedBarangay.totalHouseholds}</span>
                </p>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("residents")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "residents"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Residents ({barangayResidents.length})
                </button>
                <button
                  onClick={() => setActiveTab("households")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "households"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Households ({barangayHouseholds.length})
                </button>
              </nav>
            </div>

            <div className="p-6 overflow-auto max-h-[60vh]">
              {loadingDetails ? (
                <div className="text-center py-8">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600">Loading details...</p>
                  </div>
                </div>
              ) : activeTab === "residents" ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Residents List ({barangayResidents.length} residents)
                    </h4>
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Search residents..."
                        value={residentSearchTerm}
                        onChange={(e) => setResidentSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                      <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {filteredResidents.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-500 mb-2">
                        Showing {filteredResidents.length} of {barangayResidents.length} residents
                        {residentSearchTerm && (
                          <span> for "{residentSearchTerm}"</span>
                        )}
                      </div>
                      {filteredResidents.map((resident) => (
                        <div key={resident.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {resident.firstName} {resident.middleName} {resident.lastName}
                                {resident.isHead && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Head
                                  </span>
                                )}
                              </h5>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                                <div>
                                  <span className="font-medium">Gender:</span> {resident.gender}
                                </div>
                                <div>
                                  <span className="font-medium">Birth Date:</span> {new Date(resident.birthdate).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Civil Status:</span> {resident.civilStatus}
                                </div>
                                <div>
                                  <span className="font-medium">Occupation:</span> {resident.occupation}
                                </div>
                                <div>
                                  <span className="font-medium">Zone:</span> {resident.zoneName}
                                </div>
                                <div>
                                  <span className="font-medium">Household:</span> {resident.householdName}
                                </div>
                              </div>
                              {resident.email && (
                                <div className="mt-2">
                                  <span className="font-medium">Email:</span> {resident.email}
                                </div>
                              )}
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              resident.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {resident.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {residentSearchTerm ? (
                        <div>
                          <p>No residents found matching "{residentSearchTerm}"</p>
                          <button
                            onClick={() => setResidentSearchTerm("")}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                          >
                            Clear search
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <p className="text-lg font-medium text-gray-900 mb-2">No residents found</p>
                          <p className="text-gray-600">There are no residents registered in this barangay yet.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Households List ({barangayHouseholds.length} households)
                    </h4>
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Search households..."
                        value={householdSearchTerm}
                        onChange={(e) => setHouseholdSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                      <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {filteredHouseholds.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-500 mb-2">
                        Showing {filteredHouseholds.length} of {barangayHouseholds.length} households
                        {householdSearchTerm && (
                          <span> for "{householdSearchTerm}"</span>
                        )}
                      </div>
                      {filteredHouseholds.map((household) => {
                        // Calculate actual resident count for this household
                        const actualResidentCount = getHouseholdResidentCount(household.id);

                        return (
                          <div key={household.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">
                                  {household.houseHoldName}
                                </h5>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                                  <div>
                                    <span className="font-medium">Zone:</span> {household.zoneName}
                                  </div>
                                  <div>
                                    <span className="font-medium">Resident Count:</span> 
                                    <span className={`ml-1 font-semibold ${
                                      actualResidentCount === 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                      {actualResidentCount}
                                      {household.residentCount === 0 && actualResidentCount > 0 && (
                                        <span className="text-xs text-yellow-600 ml-1">(calculated)</span>
                                      )}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Household ID:</span> {household.id}
                                  </div>
                                  <div>
                                    <span className="font-medium">Zone ID:</span> {household.zoneId}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  actualResidentCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {actualResidentCount > 0 ? 'Has Residents' : 'No Residents'}
                                </span>
                                <button
                                  onClick={() => handleViewHouseholdDetails(household)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                >
                                  View Residents
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {householdSearchTerm ? (
                        <div>
                          <p>No households found matching "{householdSearchTerm}"</p>
                          <button
                            onClick={() => setHouseholdSearchTerm("")}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                          >
                            Clear search
                          </button>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <p className="text-lg font-medium text-gray-900 mb-2">No households found</p>
                          <p className="text-gray-600">There are no households registered in this barangay yet.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Municipality Admin</h1>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </a>
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
              <Link href="/municipalityadmin/reports" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Reports</span>
              </Link>
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
            <h1 className="text-3xl font-bold text-gray-900">Municipality Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {userInfo?.FirstName || "Municipality Admin"}! Here's an overview of your municipality.
            </p>
            {reportData && (
              <p className="text-sm text-gray-500 mt-1">
                Report generated: {new Date(reportData.generatedAt).toLocaleString()}
              </p>
            )}
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Barangays</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStats.totalBarangays}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Households</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStats.totalHouseholds}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Avg. size: {totalStats.avgHouseholdSize.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Residents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStats.totalResidents}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Active: {residentStats?.activeResidents || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Zones</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStats.totalZones}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Barangays Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Barangays Overview</h2>
              <Link 
                href="/municipalityadmin/barangays"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Manage Barangays
              </Link>
            </div>

            {loadingData ? (
              <div className="text-center py-8">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="text-gray-600">Loading barangays data...</p>
                </div>
              </div>
            ) : barangaysStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {barangaysStats.map((barangay) => {
                  const barangayDetails = getBarangayDetails(barangay.barangayId);
                  return (
                    <div key={barangay.barangayId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{barangay.barangayName}</h3>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            ID: {barangay.barangayId}
                          </span>
                          {barangayDetails && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              {barangayDetails.code}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Zones */}
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Zones</span>
                          </div>
                          <span className="text-lg font-bold text-blue-600">{barangay.totalZones}</span>
                        </div>

                        {/* Households */}
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Households</span>
                          </div>
                          <span className="text-lg font-bold text-green-600">{barangay.totalHouseholds}</span>
                        </div>

                        {/* Residents */}
                        <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Residents</span>
                          </div>
                          <span className="text-lg font-bold text-orange-600">{barangay.totalResidents}</span>
                        </div>

                        {/* Average Household Size */}
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Avg. HH Size</span>
                          </div>
                          <span className="text-lg font-bold text-purple-600">
                            {barangay.averageHouseholdSize?.toFixed(2) || "0.00"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleViewDetails(barangay)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-md text-sm font-medium transition-colors block"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : barangays.length > 0 ? (
              // Fallback to basic barangays list if statistics are not available
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {barangays.map((barangay) => (
                  <div key={barangay.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{barangay.name}</h3>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          ID: {barangay.id}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {barangay.code}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Municipality:</span>
                        <span className="font-medium">{barangay.municipalityName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Municipality ID:</span>
                        <span className="font-medium">{barangay.municipalityId}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleViewDetails({
                          barangayId: barangay.id,
                          barangayName: barangay.name,
                          totalZones: 0,
                          totalHouseholds: 0,
                          totalResidents: 0,
                          averageHouseholdSize: 0,
                          activeResidents: 0,
                          householdHeads: 0,
                          zoneStatistics: []
                        })}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-md text-sm font-medium transition-colors block"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-2">No barangays found</p>
                <p className="text-gray-600 mb-4">There are no barangays registered in your municipality yet.</p>
                <Link 
                  href="/municipalityadmin/barangays"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block"
                >
                  Add First Barangay
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Municipality Statistics</p>
                  <p className="text-xs text-gray-500">
                    {totalStats.totalBarangays} barangays, {totalStats.totalResidents} residents, {totalStats.totalHouseholds} households
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Resident Demographics</p>
                  <p className="text-xs text-gray-500">
                    {residentStats?.householdHeads || 0} household heads, Average age: {residentStats?.averageAge || 0}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Latest Report</p>
                  <p className="text-xs text-gray-500">
                    {reportData?.summary || "Comprehensive municipality report available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Resident {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  isHead: boolean;
  isActive: boolean;
  birthdate?: string;
  gender?: string;
  civilStatus?: string;
  occupation?: string;
  email?: string;
  address?: string;
  householdId: number;
}

interface Household {
  id: number;
  houseHoldName: string;
  zoneId: number;
  zoneName: string;
  residentCount: number;
}

interface HouseholdWithResidents extends Household {
  residents: Resident[];
}

interface Statistics {
  barangayId: number;
  barangayName: string;
  totalZones: number;
  totalHouseholds: number;
  totalResidents: number;
  averageHouseholdSize: number;
  activeResidents: number;
  householdHeads: number;
  zoneStatistics: Array<{
    zoneId: number;
    zoneName: string;
    householdCount: number;
    residentCount: number;
  }>;
}

export default function HouseholdsPage() {
  const { token, logout, isAuthenticated, loading, userInfo } = useAuth();
  const router = useRouter();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdWithResidents | null>(null);
  const [showHouseholdModal, setShowHouseholdModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Add/edit household form state
  const [formData, setFormData] = useState({
    houseHoldName: "",
    zoneId: "",
  });

  // Edit household state
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchData();
  }, [token, isAuthenticated]);

  // Auto-hide success messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchData = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      await Promise.all([fetchHouseholds(), fetchStatistics()]);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchHouseholds = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/barangay-admin/households", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const householdsData = await res.json();
        console.log("Households API Response:", householdsData);
        console.log("Available household IDs:", householdsData.map((h: Household) => ({id: h.id, name: h.houseHoldName, residentCount: h.residentCount})));
        setHouseholds(householdsData);
      } else {
        console.error("Failed to fetch households data");
        setError("Failed to load households data");
        setHouseholds([]);
      }
    } catch (err) {
      console.error("Error fetching households:", err);
      setError("Failed to load households data");
      setHouseholds([]);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/barangay-admin/statistics", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const statsData = await res.json();
        console.log("Statistics API Response:", statsData);
        setStatistics(statsData);
      } else {
        console.error("Failed to fetch statistics data");
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  const fetchHouseholdResidents = async (householdId: number): Promise<Resident[]> => {
    try {
      console.log(`🔍 Fetching residents for household ID: ${householdId} (type: ${typeof householdId})`);
      
      const residentsRes = await fetch("https://localhost:44336/api/barangay-admin/residents", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (residentsRes.ok) {
        const allResidents: Resident[] = await residentsRes.json();
        console.log(`📊 Total residents from API: ${allResidents.length}`);
        
        // Filter residents by householdId - ensure both are numbers
        const householdResidents = allResidents.filter(resident => {
          const residentHouseholdId = Number(resident.householdId);
          const targetHouseholdId = Number(householdId);
          const matches = residentHouseholdId === targetHouseholdId;
          
          if (matches) {
            console.log(`✅ Resident ${resident.id} (${resident.firstName} ${resident.lastName}) matches household ${householdId}`);
          }
          
          return matches;
        });
        
        console.log(`🎯 Found ${householdResidents.length} residents for household ${householdId}`);
        
        if (householdResidents.length === 0) {
          console.log("❌ No residents found. Checking all residents household IDs:");
          allResidents.forEach(resident => {
            console.log(`   Resident ${resident.id}: householdId=${resident.householdId} (type: ${typeof resident.householdId})`);
          });
        }
        
        return householdResidents;
      } else {
        console.error("Failed to fetch residents:", residentsRes.status);
        return [];
      }
    } catch (err) {
      console.error("Error fetching residents:", err);
      return [];
    }
  };

  const handleAddHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.houseHoldName || !formData.zoneId) {
        setError("Please fill in all required fields (Household Name and Zone)");
        setActionLoading(false);
        return;
      }

      const householdData = {
        houseHoldName: formData.houseHoldName,
        zoneId: parseInt(formData.zoneId),
        barangayId: userInfo?.BarangayId ? parseInt(userInfo.BarangayId) : 1
      };

      console.log("Sending household data:", householdData);

      const res = await fetch("https://localhost:44336/api/barangay-admin/households", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(householdData)
      });

      if (res.ok) {
        const newHousehold = await res.json();
        console.log("New household response:", newHousehold);
        
        setSuccess(`Household "${newHousehold.houseHoldName}" added successfully!`);
        setHouseholds(prev => [...prev, newHousehold]);
        setShowAddModal(false);
        resetForm();
        // Refresh statistics to get updated counts
        fetchStatistics();
      } else {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to add household: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error adding household:", err);
      setError("Failed to add household: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHousehold) return;
    
    setActionLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.houseHoldName || !formData.zoneId) {
        setError("Please fill in all required fields (Household Name and Zone)");
        setActionLoading(false);
        return;
      }

      const householdData = {
        houseHoldName: formData.houseHoldName,
        zoneId: parseInt(formData.zoneId),
        barangayId: userInfo?.BarangayId ? parseInt(userInfo.BarangayId) : 1
      };

      console.log("Updating household data:", householdData);

      const res = await fetch(`https://localhost:44336/api/barangay-admin/households/${editingHousehold.id}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(householdData)
      });

      if (res.ok) {
        const updatedHousehold = await res.json();
        console.log("Updated household response:", updatedHousehold);
        
        setSuccess(`Household "${updatedHousehold.houseHoldName}" updated successfully!`);
        setHouseholds(prev => prev.map(h => h.id === editingHousehold.id ? updatedHousehold : h));
        setShowEditModal(false);
        setEditingHousehold(null);
        resetForm();
        // Refresh statistics to get updated counts
        fetchStatistics();
      } else {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to update household: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error updating household:", err);
      setError("Failed to update household: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHousehold = async (householdId: number, householdName: string) => {
    if (!confirm(`Are you sure you want to delete the household "${householdName}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://localhost:44336/api/barangay-admin/households/${householdId}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        setSuccess(`Household "${householdName}" deleted successfully!`);
        setHouseholds(prev => prev.filter(h => h.id !== householdId));
        // Close modal if the deleted household is currently open
        if (selectedHousehold?.id === householdId) {
          setShowHouseholdModal(false);
          setSelectedHousehold(null);
        }
        // Refresh statistics to get updated counts
        fetchStatistics();
      } else {
        const errorText = await res.text();
        throw new Error(`Failed to delete household: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error deleting household:", err);
      setError("Failed to delete household: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      houseHoldName: "",
      zoneId: "",
    });
    setEditingHousehold(null);
  };

  const handleEditClick = (household: Household) => {
    setEditingHousehold(household);
    setFormData({
      houseHoldName: household.houseHoldName,
      zoneId: household.zoneId.toString(),
    });
    setShowEditModal(true);
  };

  // Get household head from residents
  const getHouseholdHead = (residents: Resident[]): Resident | null => {
    if (!residents || !Array.isArray(residents)) return null;
    return residents.find(resident => resident.isHead) || null;
  };

  // Get active residents count
  const getActiveResidentsCount = (residents: Resident[]): number => {
    if (!residents || !Array.isArray(residents)) return 0;
    return residents.filter(resident => resident.isActive).length;
  };

  // Filter households based on search term and selected zone
  const filteredHouseholds = households.filter(household => {
    const matchesSearch = 
      household.houseHoldName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesZone = selectedZone === "all" || household.zoneName === selectedZone;
    
    return matchesSearch && matchesZone;
  });

  // Get unique zones for filter dropdown
  const uniqueZones = Array.from(new Set(households.map(h => h.zoneName).filter(Boolean)));

  const handleViewHouseholdDetails = async (household: Household) => {
    setLoadingDetails(true);
    setShowHouseholdModal(true);
    
    try {
      console.log("👁️ Viewing household details for:", household);
      console.log("🏠 Household ID:", household.id, "Name:", household.houseHoldName);
      
      const residents = await fetchHouseholdResidents(household.id);
      
      const householdWithResidents: HouseholdWithResidents = {
        ...household,
        residents: residents
      };
      
      setSelectedHousehold(householdWithResidents);
      console.log("✅ Final household data with residents:", householdWithResidents);
    } catch (err) {
      console.error("❌ Error loading household details:", err);
      setError("Failed to load household details");
      setShowHouseholdModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Use statistics data for the dashboard stats with fallback to calculated values
  const totalHouseholds = statistics?.totalHouseholds || households.length;
  const totalResidents = statistics?.totalResidents || households.reduce((total, household) => total + household.residentCount, 0);
  const averagePerHousehold = statistics?.averageHouseholdSize || (totalHouseholds > 0 ? Math.round(totalResidents / totalHouseholds) : 0);
  const zonesCovered = statistics?.totalZones || uniqueZones.length;

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
      {/* Add Household Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Household</h3>
              <button 
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddHousehold} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Household Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.houseHoldName}
                    onChange={(e) => setFormData(prev => ({ ...prev, houseHoldName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter household name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zone *</label>
                  <select
                    value={formData.zoneId}
                    onChange={(e) => setFormData(prev => ({ ...prev, zoneId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Zone</option>
                    <option value="1">Zone 1</option>
                    <option value="2">Zone 2</option>
                    <option value="3">Zone 3</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {actionLoading ? "Adding..." : "Add Household"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Household Modal */}
      {showEditModal && editingHousehold && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Household</h3>
              <button 
                onClick={() => { setShowEditModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditHousehold} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Household Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.houseHoldName}
                    onChange={(e) => setFormData(prev => ({ ...prev, houseHoldName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter household name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zone *</label>
                  <select
                    value={formData.zoneId}
                    onChange={(e) => setFormData(prev => ({ ...prev, zoneId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Zone</option>
                    <option value="1">Zone 1</option>
                    <option value="2">Zone 2</option>
                    <option value="3">Zone 3</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {actionLoading ? "Updating..." : "Update Household"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Household Details Modal */}
      {showHouseholdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedHousehold?.houseHoldName || 'Household'} Details
                {loadingDetails && <span className="ml-2 text-sm text-gray-500">Loading...</span>}
              </h3>
              <button 
                onClick={() => {
                  setShowHouseholdModal(false);
                  setSelectedHousehold(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {loadingDetails ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="ml-3 text-gray-600">Loading household details...</p>
                </div>
              ) : selectedHousehold ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Household Name</label>
                      <p className="text-gray-900 font-semibold">{selectedHousehold.houseHoldName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Zone</label>
                      <p className="text-gray-900">{selectedHousehold.zoneName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Members</label>
                      <p className="text-gray-900 font-semibold">{selectedHousehold.residents.length}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Active Members</label>
                      <p className="text-gray-900 font-semibold text-green-600">
                        {getActiveResidentsCount(selectedHousehold.residents)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Household Head</label>
                      <p className="text-gray-900">
                        {getHouseholdHead(selectedHousehold.residents) 
                          ? `${getHouseholdHead(selectedHousehold.residents)?.firstName} ${getHouseholdHead(selectedHousehold.residents)?.lastName}`
                          : "Not assigned"
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Household ID</label>
                      <p className="text-gray-900 font-mono">HH-{selectedHousehold.id.toString().padStart(3, '0')}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                      Household Members ({selectedHousehold.residents.length})
                    </h4>
                    {selectedHousehold.residents.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedHousehold.residents.map((resident) => (
                          <div key={resident.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {resident.firstName} {resident.lastName}
                                {resident.isHead && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Head
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-500">
                                {resident.gender || 'Not specified'} • {resident.civilStatus || 'Not specified'} • {resident.occupation || "No occupation"}
                              </p>
                              {resident.birthdate && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Born: {new Date(resident.birthdate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              resident.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {resident.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>No residents in this household</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowHouseholdModal(false);
                        setSelectedHousehold(null);
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Failed to load household details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/barangayadmin/dashboard" className="flex items-center space-x-3 text-blue-600 hover:text-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/barangayadmin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/barangayadmin/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link href="/barangayadmin/zones" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Zones</span>
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">Households</span>
              </a>
            </li>
              <li>
              <Link href="/barangayadmin/residents" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Residents</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Households Management</h1>
            <p className="text-gray-600 mt-2">Manage and view all households in your barangay.</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-fade-in">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    <strong>Success:</strong> {success}
                  </h3>
                </div>
                <button 
                  onClick={() => setSuccess(null)}
                  className="ml-auto text-green-400 hover:text-green-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

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

          {/* Quick Stats - Using Statistics API Data with fallbacks */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Households</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHouseholds}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadowSm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Residents</p>
                  <p className="text-2xl font-bold text-gray-900">{totalResidents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadowSm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average per Household</p>
                  <p className="text-2xl font-bold text-gray-900">{averagePerHousehold}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadowSm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Zones Covered</p>
                  <p className="text-2xl font-bold text-gray-900">{zonesCovered}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadowSm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search households by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Zones</option>
                    {uniqueZones.map(zone => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add New Household
                </button>
                <button 
                  onClick={fetchData}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Households List */}
          {loadingData ? (
            <div className="bg-white rounded-lg shadowSm border border-gray-200 p-8 text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-600">Loading households data...</p>
              </div>
            </div>
          ) : filteredHouseholds.length > 0 ? (
            <div className="bg-white rounded-lg shadowSm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Households ({filteredHouseholds.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Household No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Household Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Members
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHouseholds.map((household) => (
                      <tr key={household.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">HH-{household.id.toString().padStart(3, '0')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{household.houseHoldName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {household.zoneName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleViewHouseholdDetails(household)}
                            className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                          >
                            {household.residentCount > 0 ? `${household.residentCount} ${household.residentCount === 1 ? 'resident' : 'residents'}` : 'View details'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(household)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteHousehold(household.id, household.houseHoldName)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 disabled:text-red-300"
                          >
                            {actionLoading ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadowSm border border-gray-200 p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">No households found</p>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedZone !== "all" 
                  ? 'No households match your search criteria.' 
                  : 'No households data available.'
                }
              </p>
              <div className="flex space-x-3 justify-center">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add Your First Household
                </button>
                <button 
                  onClick={fetchData}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
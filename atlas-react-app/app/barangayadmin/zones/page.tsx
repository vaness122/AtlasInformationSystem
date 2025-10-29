"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

interface Zone {
  id: number;
  name: string;
  description: string;
  barangayId: number;
  barangayName: string | null;
}

interface Household {
  id: number;
  houseHoldName: string;
  zoneId: number;
  zoneName?: string;
  residentCount?: number;
}

interface Resident {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  birthdate?: string;
  gender?: string;
  civilStatus?: string;
  occupation?: string;
  email?: string;
  address?: string;
  zoneId: number;
  municipalityId: number;
  barangayId: number;
  householdId: number;
  isHead: boolean;
  isActive: boolean;
  municipalityName?: string;
  barangayName?: string;
  zoneName?: string;
  householdName?: string;
}

interface CreateZoneDto {
  name: string;
  description: string;
  barangayId: number;
}

export default function ZonesPage() {
  const { token, logout, isAuthenticated, loading } = useAuth();
  const [zones, setZones] = useState<Zone[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showResidentsModal, setShowResidentsModal] = useState(false);
  const [zoneResidents, setZoneResidents] = useState<Resident[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    fetchZones();
    fetchHouseholds();
    fetchResidents();
  }, [token, isAuthenticated]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchZones = async () => {
    setZonesLoading(true);
    setError(null);
    
    try {
      const res = await fetch("https://localhost:44336/api/barangay-admin/zones", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const zonesData = await res.json();
        console.log("Zones API Response:", zonesData);
        setZones(zonesData);
      } else if (res.status === 401) {
        setError("Session expired. Please login again.");
        logout();
      } else {
        console.error("Failed to fetch zones");
        setError("Failed to load zones data");
      }
    } catch (err) {
      console.error("Error fetching zones:", err);
      setError("Failed to load zones data");
    } finally {
      setZonesLoading(false);
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
        setHouseholds(householdsData);
      } else {
        console.error("Failed to fetch households data");
      }
    } catch (err) {
      console.error("Error fetching households:", err);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/barangay-admin/residents", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const residentsData = await res.json();
        console.log("Residents API Response:", residentsData);
        setResidents(residentsData);
      } else {
        console.error("Failed to fetch residents data");
      }
    } catch (err) {
      console.error("Error fetching residents:", err);
    }
  };

  const createZone = async (zoneData: CreateZoneDto) => {
    setFormLoading(true);
    setError(null);
    
    try {
      const res = await fetch("https://localhost:44336/api/barangay-admin/zones", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(zoneData)
      });

      if (res.ok) {
        const newZone = await res.json();
        setZones(prev => [...prev, newZone]);
        setSuccess("Zone created successfully!");
        setShowCreateModal(false);
        setFormData({ name: "", description: "" });
        
        // Refresh households and residents to ensure data consistency
        fetchHouseholds();
        fetchResidents();
      } else {
        const errorText = await res.text();
        throw new Error(`Failed to create zone: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error creating zone:", err);
      setError("Failed to create zone: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setFormLoading(false);
    }
  };

  const updateZone = async (zoneId: number, zoneData: { name: string; description: string }) => {
    setFormLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`https://localhost:44336/api/barangay-admin/zones/${zoneId}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(zoneData)
      });

      if (res.ok) {
        const updatedZone = await res.json();
        setZones(prev => prev.map(zone => zone.id === zoneId ? updatedZone : zone));
        setSuccess("Zone updated successfully!");
        setShowEditModal(false);
        setEditingZone(null);
        setFormData({ name: "", description: "" });
      } else {
        const errorText = await res.text();
        throw new Error(`Failed to update zone: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error updating zone:", err);
      setError("Failed to update zone: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Zone name is required");
      return;
    }

    // Get barangayId from token or use default (you might want to get this from user context)
    const barangayId = 1; // This should come from your auth context or user data
    
    createZone({
      name: formData.name.trim(),
      description: formData.description.trim(),
      barangayId
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !editingZone) {
      setError("Zone name is required");
      return;
    }

    updateZone(editingZone.id, {
      name: formData.name.trim(),
      description: formData.description.trim()
    });
  };

  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      description: zone.description || ""
    });
    setShowEditModal(true);
  };

  const handleDeleteZone = async (zoneId: number) => {
    if (!confirm("Are you sure you want to delete this zone? This action cannot be undone.")) return;
    
    setActionLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`https://localhost:44336/api/barangay-admin/zones/${zoneId}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        setZones(prev => prev.filter(zone => zone.id !== zoneId));
        setSuccess("Zone deleted successfully!");
        // Refresh households and residents data
        fetchHouseholds();
        fetchResidents();
      } else {
        const errorText = await res.text();
        throw new Error(`Failed to delete zone: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error deleting zone:", err);
      setError("Failed to delete zone: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const filteredZones = zones.filter(zone => 
    zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (zone.description && zone.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate household count for a zone
  const calculateHouseholdCount = (zoneId: number): number => {
    return households.filter(household => household.zoneId === zoneId).length;
  };

  // Calculate total residents count for a zone
  const calculateTotalResidents = (zoneId: number): number => {
    const zoneHouseholds = households.filter(household => household.zoneId === zoneId);
    const zoneHouseholdIds = zoneHouseholds.map(household => household.id);
    return residents.filter(resident => 
      zoneHouseholdIds.includes(resident.householdId) && resident.isActive
    ).length;
  };

  // Get residents for a specific zone
  const getZoneResidents = (zoneId: number): Resident[] => {
    const zoneHouseholds = households.filter(household => household.zoneId === zoneId);
    const zoneHouseholdIds = zoneHouseholds.map(household => household.id);
    return residents.filter(resident => 
      zoneHouseholdIds.includes(resident.householdId) && resident.isActive
    );
  };

  // Calculate total households across all zones
  const totalHouseholds = households.length;

  // Calculate total residents across all zones
  const totalResidents = residents.filter(resident => resident.isActive).length;

  // Sort zones by household count
  const sortedZones = [...filteredZones].sort((a, b) => {
    const countA = calculateHouseholdCount(a.id);
    const countB = calculateHouseholdCount(b.id);
    return countB - countA;
  });

  const mostPopulated = sortedZones.length > 0 ? sortedZones[0] : null;

  const handleViewResidents = (zone: Zone) => {
    setSelectedZone(zone);
    const zoneResidentsData = getZoneResidents(zone.id);
    setZoneResidents(zoneResidentsData);
    setShowResidentsModal(true);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate age from birthdate
  const calculateAge = (birthdate?: string) => {
    if (!birthdate) return "Unknown";
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setError(null);
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
      {/* Create Zone Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Zone</h3>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Zone Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter zone name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter zone description (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Creating..." : "Create Zone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Zone Modal */}
      {showEditModal && editingZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Zone</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingZone(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Zone Name *
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter zone name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter zone description (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingZone(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Updating..." : "Update Zone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Residents Details Modal */}
      {showResidentsModal && selectedZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">
                Residents in {selectedZone.name}
              </h3>
              <button 
                onClick={() => setShowResidentsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-900">Total Residents</p>
                    <p className="text-2xl font-bold text-blue-700">{zoneResidents.length}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-medium text-green-900">Household Heads</p>
                    <p className="text-2xl font-bold text-green-700">
                      {zoneResidents.filter(r => r.isHead).length}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="font-medium text-purple-900">Male Residents</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {zoneResidents.filter(r => r.gender === 'Male').length}
                    </p>
                  </div>
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <p className="font-medium text-pink-900">Female Residents</p>
                    <p className="text-2xl font-bold text-pink-700">
                      {zoneResidents.filter(r => r.gender === 'Female').length}
                    </p>
                  </div>
                </div>
              </div>

              {zoneResidents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Household
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Occupation
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {zoneResidents.map((resident) => (
                        <tr key={resident.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-xs">
                                  {resident.firstName.charAt(0)}{resident.lastName.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {resident.firstName} {resident.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {resident.email || "No email"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{resident.householdName}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {calculateAge(resident.birthdate)} years old
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(resident.birthdate)}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              resident.gender === 'Male' ? 'bg-blue-100 text-blue-800' :
                              resident.gender === 'Female' ? 'bg-pink-100 text-pink-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {resident.gender || "Not specified"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">
                              {resident.occupation || "Not specified"}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              resident.isHead ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {resident.isHead ? 'Household Head' : 'Member'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 mb-2">No residents found</p>
                  <p className="text-gray-600">There are no active residents in this zone.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowResidentsModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Close
              </button>
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
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Zones</span>
              </a>
            </li>
            <li>
              <Link href="/barangayadmin/household" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Households</span>
              </Link>
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
            <h1 className="text-3xl font-bold text-gray-900">Zones Management</h1>
            <p className="text-gray-600 mt-2">Manage and view all zones in your barangay.</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Zones</p>
                  <p className="text-2xl font-bold text-gray-900">{zones.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Households</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHouseholds}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{totalResidents}</p>
                </div>
              </div>
            </div>

            {mostPopulated && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Most Households</p>
                    <p className="text-lg font-bold text-gray-900">{mostPopulated.name}</p>
                    <p className="text-sm text-gray-500">{calculateHouseholdCount(mostPopulated.id)} households</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search and Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="relative max-w-md">
                  <input
                    type="text"
                    placeholder="Search zones by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add New Zone
                </button>
                <button 
                  onClick={() => {
                    fetchZones();
                    fetchHouseholds();
                    fetchResidents();
                    setSuccess("Data refreshed successfully!");
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Zones List */}
          {zonesLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-600">Loading zones data...</p>
              </div>
            </div>
          ) : sortedZones.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Zones</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zone Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Households
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Residents
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedZones.map((zone) => (
                      <tr key={zone.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{zone.description || "No description"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            calculateHouseholdCount(zone.id) > 5 ? 'bg-green-100 text-green-800' :
                            calculateHouseholdCount(zone.id) > 2 ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {calculateHouseholdCount(zone.id)} households
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {calculateTotalResidents(zone.id)} residents
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewResidents(zone)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View Residents
                          </button>
                          <button
                            onClick={() => handleEditZone(zone)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteZone(zone.id)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 disabled:text-red-300"
                          >
                            {actionLoading ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">No zones found</p>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No zones match your search criteria.' : 'No zones data available.'}
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add Your First Zone
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
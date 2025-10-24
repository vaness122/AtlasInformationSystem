"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

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
  household?: string;
  zone?: string;
  isHead: boolean;
  isActive: boolean;
  municipality?: {
    id: number;
    name: string;
    code: string;
    region: string;
    province: string;
  };
  barangay?: {
    id: number;
    name: string;
    code: string;
    municipalityId: number;
  };
}

interface Household {
  id: number;
  houseHoldName: string;
  residents: Resident[];
  zoneId: number;
  zone?: string;
  zoneName?: string;
  residentCount?: number;
}

export default function ResidentsPage() {
  const { token, logout, isAuthenticated, loading, userInfo } = useAuth();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHousehold, setSelectedHousehold] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    occupation: "",
    birthdate: "",
    civilStatus: "",
    email: "",
    address: "",
    isHead: false,
    isActive: true,
    householdId: "",
    zoneId: "",
    barangayId: "",
    municipalityId: ""
  });

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchData();
  }, [token, isAuthenticated]);

  // Auto-hide success messages after 5 seconds
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
      // Fetch households first, then residents
      await fetchHouseholds();
      await fetchResidents();
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
        setHouseholds(householdsData);
      } else {
        console.error("Failed to fetch households data");
        setHouseholds([]);
      }
    } catch (err) {
      console.error("Error fetching households:", err);
      setHouseholds([]);
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
        
        // Map residents with household information using current households state
        const residentsWithHouseholdInfo = residentsData.map((resident: Resident) => {
          const household = households.find(h => h.id === resident.householdId);
          return {
            ...resident,
            household: household?.houseHoldName,
            zone: household?.zoneName || household?.zone || `Zone ${household?.zoneId || resident.zoneId}`
          };
        });
        
        setResidents(residentsWithHouseholdInfo);
      } else {
        console.error("Failed to fetch residents data");
        setError("Failed to load residents data");
        setResidents([]);
      }
    } catch (err) {
      console.error("Error fetching residents:", err);
      setError("Failed to load residents data");
      setResidents([]);
    }
  };

  // Refresh residents when households change to ensure proper household info
  useEffect(() => {
    if (households.length > 0 && residents.length > 0) {
      const residentsWithHouseholdInfo = residents.map(resident => {
        const household = households.find(h => h.id === resident.householdId);
        return {
          ...resident,
          household: household?.houseHoldName,
          zone: household?.zoneName || household?.zone || `Zone ${household?.zoneId || resident.zoneId}`
        };
      });
      setResidents(residentsWithHouseholdInfo);
    }
  }, [households]);

  // Calculate statistics - FIXED VERSION
  const totalResidents = residents.length;
  const activeResidents = residents.filter(r => r.isActive === true).length;
  const householdHeads = residents.filter(r => r.isHead === true).length;
  const totalHouseholds = households.length;

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.householdId) {
        setError("Please fill in all required fields (First Name, Last Name, and Household)");
        setActionLoading(false);
        return;
      }

      // Get selected household to get zone info
      const selectedHousehold = households.find(h => h.id === parseInt(formData.householdId));
      
      // Prepare resident data according to API schema
      const residentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || "",
        gender: formData.gender || "",
        occupation: formData.occupation || "",
        birthdate: formData.birthdate ? new Date(formData.birthdate).toISOString() : null,
        civilStatus: formData.civilStatus || "",
        email: formData.email || "",
        address: formData.address || "",
        isHead: formData.isHead,
        isActive: formData.isActive,
        householdId: parseInt(formData.householdId),
        zoneId: selectedHousehold?.zoneId || 1,
        barangayId: userInfo?.BarangayId ? parseInt(userInfo.BarangayId) : 1,
        municipalityId: userInfo?.MunicipalityId ? parseInt(userInfo.MunicipalityId) : 1
      };

      console.log("Sending resident data:", residentData);

      // API call to add resident using barangay-admin endpoint
      const res = await fetch("https://localhost:44336/api/barangay-admin/residents", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(residentData)
      });

      if (res.ok) {
        const newResident = await res.json();
        console.log("New resident response:", newResident);
        
        setSuccess(`Resident "${newResident.firstName} ${newResident.lastName}" added successfully!`);
        
        // Add household info to the new resident and add to state
        const household = households.find(h => h.id === newResident.householdId);
        const residentWithHouseholdInfo = {
          ...newResident,
          household: household?.houseHoldName,
          zone: household?.zoneName || household?.zone || `Zone ${household?.zoneId || newResident.zoneId}`
        };
        
        setResidents(prev => [...prev, residentWithHouseholdInfo]);
        setShowAddModal(false);
        resetForm();
        // Refresh households data to update resident counts
        fetchHouseholds();
      } else {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to add resident: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error adding resident:", err);
      setError("Failed to add resident: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditResident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;
    
    setActionLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.householdId) {
        setError("Please fill in all required fields (First Name, Last Name, and Household)");
        setActionLoading(false);
        return;
      }

      // Get selected household to get zone info
      const selectedHousehold = households.find(h => h.id === parseInt(formData.householdId));
      
      // Prepare resident data according to API schema - FIXED VERSION
      const residentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || "",
        gender: formData.gender || "",
        occupation: formData.occupation || "",
        birthdate: formData.birthdate ? new Date(formData.birthdate).toISOString() : null,
        civilStatus: formData.civilStatus || "",
        email: formData.email || "",
        address: formData.address || "",
        isHead: formData.isHead,
        isActive: formData.isActive,
        householdId: parseInt(formData.householdId),
        zoneId: selectedHousehold?.zoneId || selectedResident.zoneId,
        barangayId: userInfo?.BarangayId ? parseInt(userInfo.BarangayId) : selectedResident.barangayId,
        municipalityId: userInfo?.MunicipalityId ? parseInt(userInfo.MunicipalityId) : selectedResident.municipalityId
      };

      console.log("Updating resident data:", residentData);

      const res = await fetch(`https://localhost:44336/api/barangay-admin/residents/${selectedResident.id}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(residentData)
      });

      if (res.ok) {
        const updatedResident = await res.json();
        console.log("Updated resident response:", updatedResident);
        
        setSuccess(`Resident "${updatedResident.firstName} ${updatedResident.lastName}" updated successfully!`);
        
        // Add household info to the updated resident
        const household = households.find(h => h.id === updatedResident.householdId);
        const residentWithHouseholdInfo = {
          ...updatedResident,
          household: household?.houseHoldName,
          zone: household?.zoneName || household?.zone || `Zone ${household?.zoneId || updatedResident.zoneId}`
        };
        
        setResidents(prev => prev.map(resident => 
          resident.id === selectedResident.id ? residentWithHouseholdInfo : resident
        ));
        setShowEditModal(false);
        setSelectedResident(null);
        resetForm();
        fetchHouseholds();
      } else {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to update resident: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error updating resident:", err);
      setError("Failed to update resident: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteResident = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resident?")) return;
    
    setActionLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`https://localhost:44336/api/barangay-admin/residents/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const deletedResident = residents.find(r => r.id === id);
        setSuccess(`Resident "${deletedResident?.firstName} ${deletedResident?.lastName}" deleted successfully!`);
        setResidents(prev => prev.filter(resident => resident.id !== id));
        fetchHouseholds();
      } else {
        const errorText = await res.text();
        throw new Error(`Failed to delete resident: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error deleting resident:", err);
      setError("Failed to delete resident: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      middleName: "",
      gender: "",
      occupation: "",
      birthdate: "",
      civilStatus: "",
      email: "",
      address: "",
      isHead: false,
      isActive: true,
      householdId: "",
      zoneId: "",
      barangayId: "",
      municipalityId: ""
    });
  };

  const openEditModal = (resident: Resident) => {
    setSelectedResident(resident);
    setFormData({
      firstName: resident.firstName,
      lastName: resident.lastName,
      middleName: resident.middleName || "",
      gender: resident.gender || "",
      occupation: resident.occupation || "",
      birthdate: resident.birthdate ? resident.birthdate.split('T')[0] : "", // Format date for input
      civilStatus: resident.civilStatus || "",
      email: resident.email || "",
      address: resident.address || "",
      isHead: resident.isHead,
      isActive: resident.isActive,
      householdId: resident.householdId?.toString() || "",
      zoneId: resident.zoneId?.toString() || "",
      barangayId: resident.barangayId?.toString() || "",
      municipalityId: resident.municipalityId?.toString() || ""
    });
    setShowEditModal(true);
  };

  const filteredResidents = residents.filter(resident => {
    const fullName = `${resident.firstName} ${resident.lastName} ${resident.middleName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      resident.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHousehold = selectedHousehold === "all" || resident.householdId?.toString() === selectedHousehold;
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "active" && resident.isActive) ||
      (selectedStatus === "inactive" && !resident.isActive);
    
    return matchesSearch && matchesHousehold && matchesStatus;
  });

  // Helper functions for display
  const getHouseholdInfo = (resident: Resident) => {
    if (resident.household) return resident.household;
    const household = households.find(h => h.id === resident.householdId);
    return household ? household.houseHoldName : "No household assigned";
  };

  const getZoneInfo = (resident: Resident) => {
    if (resident.zone) return resident.zone;
    const household = households.find(h => h.id === resident.householdId);
    return household?.zoneName || household?.zone || `Zone ${household?.zoneId || resident.zoneId}` || "No zone";
  };

  // Refresh data when needed
  const refreshData = () => {
    fetchData();
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
      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Add New Resident</h3>
              <button 
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddResident} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                  <select
                    value={formData.civilStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, civilStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Household *</label>
                  <select
                    value={formData.householdId}
                    onChange={(e) => setFormData(prev => ({ ...prev, householdId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Household</option>
                    {households.map(household => (
                      <option key={household.id} value={household.id}>
                        {household.houseHoldName} - {household.zoneName || household.zone || `Zone ${household.zoneId}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isHead}
                      onChange={(e) => setFormData(prev => ({ ...prev, isHead: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Household Head</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {actionLoading ? "Adding..." : "Add Resident"}
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

      {/* Edit Resident Modal */}
      {showEditModal && selectedResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Edit Resident</h3>
              <button 
                onClick={() => { setShowEditModal(false); setSelectedResident(null); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditResident} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                  <select
                    value={formData.civilStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, civilStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Household *</label>
                  <select
                    value={formData.householdId}
                    onChange={(e) => setFormData(prev => ({ ...prev, householdId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Household</option>
                    {households.map(household => (
                      <option key={household.id} value={household.id}>
                        {household.houseHoldName} - {household.zoneName || household.zone || `Zone ${household.zoneId}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isHead}
                      onChange={(e) => setFormData(prev => ({ ...prev, isHead: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Household Head</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {actionLoading ? "Updating..." : "Update Resident"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedResident(null); resetForm(); }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
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
              <Link href="/barangayadmin/household" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Households</span>
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Residents</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Residents Management</h1>
            <p className="text-gray-600 mt-2">Manage and view all residents in your barangay.</p>
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Residents</p>
                  <p className="text-2xl font-bold text-gray-900">{totalResidents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Residents</p>
                  <p className="text-2xl font-bold text-gray-900">{activeResidents}</p>
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
                  <p className="text-sm font-medium text-gray-600">Household Heads</p>
                  <p className="text-2xl font-bold text-gray-900">{householdHeads}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadowSm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Households</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHouseholds}</p>
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
                      placeholder="Search residents by name, occupation, or address..."
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
                    value={selectedHousehold}
                    onChange={(e) => setSelectedHousehold(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Households</option>
                    {households.map(household => (
                      <option key={household.id} value={household.id.toString()}>
                        {household.houseHoldName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-48">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add New Resident
                </button>
                <button 
                  onClick={refreshData}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Residents List */}
          {loadingData ? (
            <div className="bg-white rounded-lg shadowSm border border-gray-200 p-8 text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-600">Loading residents data...</p>
              </div>
            </div>
          ) : filteredResidents.length > 0 ? (
            <div className="bg-white rounded-lg shadowSm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Residents ({filteredResidents.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resident
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Household
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Occupation
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
                    {filteredResidents.map((resident) => (
                      <tr key={resident.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {resident.firstName} {resident.lastName}
                              {resident.isHead && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Head
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {resident.gender} • {resident.civilStatus || 'Not specified'}
                            </div>
                            {resident.birthdate && (
                              <div className="text-xs text-gray-400">
                                Born: {new Date(resident.birthdate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getHouseholdInfo(resident)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getZoneInfo(resident)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{resident.occupation || "Not specified"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            resident.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {resident.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(resident)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteResident(resident.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">No residents found</p>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedHousehold !== "all" || selectedStatus !== "all"
                  ? 'No residents match your search criteria.' 
                  : 'No residents data available.'
                }
              </p>
              <div className="flex space-x-3 justify-center">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add Your First Resident
                </button>
                <button 
                  onClick={refreshData}
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
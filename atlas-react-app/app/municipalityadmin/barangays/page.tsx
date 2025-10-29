"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

interface Barangay {
  id: number;
  name: string;
  code: string;
  municipalityId: number;
  municipalityName: string | null;
  isActive?: boolean;
  dateCreated?: string;
}

interface BarangayStatistics {
  barangayId: number;
  barangayName: string;
  totalZones: number;
  totalHouseholds: number;
  totalResidents: number;
  averageHouseholdSize: number;
  activeResidents: number;
  householdHeads: number;
  zoneStatistics: any[];
}

export default function MunicipalityBarangays() {
  const { token, logout, isAuthenticated, loading, userInfo } = useAuth();
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [barangayStats, setBarangayStats] = useState<BarangayStatistics[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    municipalityId: 1 // Default to user's municipality
  });

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchBarangays();
    fetchBarangayStatistics();
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

  const fetchBarangays = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/barangays", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const barangaysData = await res.json();
        console.log("Barangays API Response:", barangaysData);
        setBarangays(barangaysData);
      } else {
        console.error("Failed to fetch barangays data");
        setError("Failed to load barangays data");
      }
    } catch (err) {
      console.error("Error fetching barangays:", err);
      setError("Failed to load barangays data");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchBarangayStatistics = async () => {
    try {
      const res = await fetch("https://localhost:44336/api/municipality-admin/barangays/statistics", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const statsData = await res.json();
        console.log("Barangay Statistics API Response:", statsData);
        setBarangayStats(statsData);
      } else {
        console.error("Failed to fetch barangay statistics");
      }
    } catch (err) {
      console.error("Error fetching barangay statistics:", err);
    }
  };

  const getBarangayStats = (barangayId: number) => {
    return barangayStats.find(stats => stats.barangayId === barangayId);
  };

  const filteredBarangays = barangays.filter(barangay => {
    const matchesSearch = 
      barangay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barangay.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Since the API doesn't return isActive, we'll assume all are active
    const matchesStatus = selectedStatus === "all" || selectedStatus === "active";
    
    return matchesSearch && matchesStatus;
  });

  const handleAddBarangay = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.code) {
        setError("Please fill in all required fields");
        setActionLoading(false);
        return;
      }

      const barangayData = {
        name: formData.name,
        code: formData.code,
        municipalityId: formData.municipalityId
      };

      console.log("Sending barangay data:", barangayData);

      const res = await fetch("https://localhost:44336/api/municipality-admin/barangays", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(barangayData)
      });

      if (res.ok) {
        const newBarangay = await res.json();
        console.log("New barangay response:", newBarangay);
        
        setSuccess(`Barangay "${newBarangay.name}" added successfully!`);
        setBarangays(prev => [...prev, newBarangay]);
        setShowAddModal(false);
        resetForm();
        // Refresh statistics
        fetchBarangayStatistics();
      } else {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to add barangay: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error adding barangay:", err);
      setError("Failed to add barangay: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditBarangay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarangay) return;
    
    setActionLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.code) {
        setError("Please fill in all required fields");
        setActionLoading(false);
        return;
      }

      const barangayData = {
        name: formData.name,
        code: formData.code,
        municipalityId: selectedBarangay.municipalityId
      };

      console.log("Updating barangay data:", barangayData);

      const res = await fetch(`https://localhost:44336/api/municipality-admin/barangays/${selectedBarangay.id}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(barangayData)
      });

      if (res.ok) {
        const updatedBarangay = await res.json();
        console.log("Updated barangay response:", updatedBarangay);
        
        setSuccess(`Barangay "${updatedBarangay.name}" updated successfully!`);
        setBarangays(prev => prev.map(barangay => 
          barangay.id === selectedBarangay.id ? updatedBarangay : barangay
        ));
        setShowEditModal(false);
        setSelectedBarangay(null);
        resetForm();
        // Refresh statistics
        fetchBarangayStatistics();
      } else {
        const errorText = await res.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to update barangay: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error updating barangay:", err);
      setError("Failed to update barangay: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBarangay = async (id: number) => {
    if (!confirm("Are you sure you want to delete this barangay? This action cannot be undone.")) return;
    
    setActionLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`https://localhost:44336/api/municipality-admin/barangays/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (res.ok) {
        const deletedBarangay = barangays.find(b => b.id === id);
        setSuccess(`Barangay "${deletedBarangay?.name}" deleted successfully!`);
        setBarangays(prev => prev.filter(barangay => barangay.id !== id));
        // Refresh statistics
        fetchBarangayStatistics();
      } else {
        const errorText = await res.text();
        throw new Error(`Failed to delete barangay: ${res.status} ${errorText}`);
      }
    } catch (err) {
      console.error("Error deleting barangay:", err);
      setError("Failed to delete barangay: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      municipalityId: 1
    });
  };

  const openEditModal = (barangay: Barangay) => {
    setSelectedBarangay(barangay);
    setFormData({
      name: barangay.name,
      code: barangay.code,
      municipalityId: barangay.municipalityId
    });
    setShowEditModal(true);
  };

  // Calculate statistics
  const totalBarangays = barangays.length;
  const totalHouseholds = barangayStats.reduce((total, stats) => total + stats.totalHouseholds, 0);
  const totalResidents = barangayStats.reduce((total, stats) => total + stats.totalResidents, 0);
  const totalZones = barangayStats.reduce((total, stats) => total + stats.totalZones, 0);

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
      {/* Add Barangay Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Barangay</h3>
              <button 
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddBarangay}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barangay Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter barangay name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barangay Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter barangay code"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>Municipality: {userInfo?.MunicipalityId || "Your Municipality"}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {actionLoading ? "Adding..." : "Add Barangay"}
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

      {/* Edit Barangay Modal */}
      {showEditModal && selectedBarangay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Barangay</h3>
              <button 
                onClick={() => { setShowEditModal(false); setSelectedBarangay(null); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditBarangay}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barangay Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barangay Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>Municipality ID: {selectedBarangay.municipalityId}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {actionLoading ? "Updating..." : "Update Barangay"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedBarangay(null); resetForm(); }}
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
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg border border-blue-100">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium">Barangays</span>
              </a>
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
            <h1 className="text-3xl font-bold text-gray-900">Barangays Management</h1>
            <p className="text-gray-600 mt-2">Manage all barangays under your municipality.</p>
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
                    {success}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Barangays</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBarangays}</p>
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Zones</p>
                  <p className="text-2xl font-bold text-gray-900">{totalZones}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search barangays by name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Add New Barangay
                </button>
                <button 
                  onClick={() => {
                    fetchBarangays();
                    fetchBarangayStatistics();
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Barangays List */}
          {loadingData ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-600">Loading barangays data...</p>
              </div>
            </div>
          ) : filteredBarangays.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Barangays ({filteredBarangays.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Barangay Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Households
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Residents
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. HH Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBarangays.map((barangay) => {
                      const stats = getBarangayStats(barangay.id);
                      return (
                        <tr key={barangay.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{barangay.name}</div>
                            <div className="text-xs text-gray-500">ID: {barangay.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{barangay.code}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {stats?.totalHouseholds || 0} households
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {stats?.totalResidents || 0} residents
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {stats?.totalZones || 0} zones
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {stats?.averageHouseholdSize?.toFixed(2) || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openEditModal(barangay)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteBarangay(barangay.id)}
                              disabled={actionLoading}
                              className="text-red-600 hover:text-red-900 disabled:text-red-300"
                            >
                              {actionLoading ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">No barangays found</p>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'No barangays match your search criteria.' 
                  : 'No barangays have been created yet.'
                }
              </p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add Your First Barangay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
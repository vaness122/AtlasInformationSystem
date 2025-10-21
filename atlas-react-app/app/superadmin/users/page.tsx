"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  municipalityId?: number;
  municipalityName?: string;
  barangayId?: number;
  barangayName?: string;
  isActive: boolean;
  dateCreated: string;
  lastLogin?: string;
}

interface Municipality {
  id: number;
  name: string;
  code: string;
}

interface Barangay {
  id: number;
  name: string;
  code: string;
  municipalityId: number;
}

export default function SuperAdminUsers() {
  const { token, logout, isAuthenticated, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "MunicipalityAdmin",
    municipalityId: "",
    barangayId: "",
    isActive: true
  });

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetchData();
  }, [token, isAuthenticated]);

  const fetchData = async () => {
    setLoadingData(true);
    setError(null);
    
    try {
      // Fetch municipalities and barangays for dropdowns
      const municipalitiesRes = await fetch("https://localhost:44336/api/Municipalities", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      const barangaysRes = await fetch("https://localhost:44336/api/Barangays", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (municipalitiesRes.ok && barangaysRes.ok) {
        const municipalitiesData = await municipalitiesRes.json();
        const barangaysData = await barangaysRes.json();
        
        setMunicipalities(municipalitiesData);
        setBarangays(barangaysData);
        
        // For now, use mock user data since we don't have a users API
        // In a real app, you would fetch from /api/Users or /api/AdminUsers
        const mockUsers: AdminUser[] = [
          {
            id: 1,
            firstName: "Municipality",
            lastName: "Admin",
            email: "admin@ajuy.gov",
            role: "MunicipalityAdmin",
            municipalityId: 1,
            municipalityName: "Ajuy",
            isActive: true,
            dateCreated: "2024-01-15",
            lastLogin: "2024-01-20T08:30:00Z"
          },
          {
            id: 2,
            firstName: "Barangay",
            lastName: "Official",
            email: "official@adcadarao.gov",
            role: "BarangayAdmin",
            barangayId: 1,
            barangayName: "Adcadarao",
            municipalityId: 1,
            municipalityName: "Ajuy",
            isActive: true,
            dateCreated: "2024-01-16",
            lastLogin: "2024-01-20T09:15:00Z"
          },
          {
            id: 3,
            firstName: "System",
            lastName: "Administrator",
            email: "superadmin@system.gov",
            role: "SuperAdmin",
            isActive: true,
            dateCreated: "2024-01-01",
            lastLogin: "2024-01-20T10:00:00Z"
          }
        ];
        
        setUsers(mockUsers);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load users data");
      // Use sample data for demonstration
      setMunicipalities([
        { id: 1, name: "Ajuy", code: "AJY" }
      ]);
      setBarangays([
        { id: 1, name: "Adcadarao", code: "ADC", municipalityId: 1 }
      ]);
      setUsers([
        {
          id: 1,
          firstName: "Municipality",
          lastName: "Admin",
          email: "admin@ajuy.gov",
          role: "MunicipalityAdmin",
          municipalityId: 1,
          municipalityName: "Ajuy",
          isActive: true,
          dateCreated: "2024-01-15",
          lastLogin: "2024-01-20T08:30:00Z"
        }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.municipalityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.barangayName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "active" && user.isActive) ||
      (selectedStatus === "inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      // API call to add user
      // In a real app, you would call your Users API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const newUser: AdminUser = {
        id: users.length + 1,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        municipalityId: formData.municipalityId ? parseInt(formData.municipalityId) : undefined,
        municipalityName: municipalities.find(m => m.id === parseInt(formData.municipalityId))?.name,
        barangayId: formData.barangayId ? parseInt(formData.barangayId) : undefined,
        barangayName: barangays.find(b => b.id === parseInt(formData.barangayId))?.name,
        isActive: formData.isActive,
        dateCreated: new Date().toISOString().split('T')[0]
      };
      
      setUsers(prev => [...prev, newUser]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setActionLoading(true);
    
    try {
      // API call to update user
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      const updatedUser: AdminUser = {
        ...selectedUser,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        municipalityId: formData.municipalityId ? parseInt(formData.municipalityId) : undefined,
        municipalityName: municipalities.find(m => m.id === parseInt(formData.municipalityId))?.name,
        barangayId: formData.barangayId ? parseInt(formData.barangayId) : undefined,
        barangayName: barangays.find(b => b.id === parseInt(formData.barangayId))?.name,
        isActive: formData.isActive
      };
      
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      ));
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    setActionLoading(true);
    
    try {
      // API call to delete user
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setActionLoading(true);
    
    try {
      // API call to toggle user status
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, isActive: !currentStatus } : user
      ));
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "MunicipalityAdmin",
      municipalityId: "",
      barangayId: "",
      isActive: true
    });
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "", // Don't pre-fill password for security
      role: user.role,
      municipalityId: user.municipalityId?.toString() || "",
      barangayId: user.barangayId?.toString() || "",
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  // Filter barangays based on selected municipality
  const filteredBarangays = formData.municipalityId 
    ? barangays.filter(barangay => barangay.municipalityId === parseInt(formData.municipalityId))
    : [];

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
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Add New Admin User</h3>
              <button 
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MunicipalityAdmin">Municipality Admin</option>
                    <option value="BarangayAdmin">Barangay Admin</option>
                    <option value="SuperAdmin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                  <select
                    value={formData.municipalityId}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipalityId: e.target.value, barangayId: "" }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Municipality</option>
                    {municipalities.map(municipality => (
                      <option key={municipality.id} value={municipality.id}>
                        {municipality.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                  <select
                    value={formData.barangayId}
                    onChange={(e) => setFormData(prev => ({ ...prev, barangayId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.municipalityId}
                  >
                    <option value="">Select Barangay</option>
                    {filteredBarangays.map(barangay => (
                      <option key={barangay.id} value={barangay.id}>
                        {barangay.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Active User</label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {actionLoading ? "Adding..." : "Add User"}
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

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button 
                onClick={() => { setShowEditModal(false); setSelectedUser(null); resetForm(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MunicipalityAdmin">Municipality Admin</option>
                    <option value="BarangayAdmin">Barangay Admin</option>
                    <option value="SuperAdmin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                  <select
                    value={formData.municipalityId}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipalityId: e.target.value, barangayId: "" }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Municipality</option>
                    {municipalities.map(municipality => (
                      <option key={municipality.id} value={municipality.id}>
                        {municipality.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                  <select
                    value={formData.barangayId}
                    onChange={(e) => setFormData(prev => ({ ...prev, barangayId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.municipalityId}
                  >
                    <option value="">Select Barangay</option>
                    {filteredBarangays.map(barangay => (
                      <option key={barangay.id} value={barangay.id}>
                        {barangay.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Active User</label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {actionLoading ? "Updating..." : "Update User"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedUser(null); resetForm(); }}
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
        <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 bg-blue-50 rounded-lg border border-blue-100">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <span className="font-medium">Admin Users</span>
        </a>
      </li>
      <li>
        <Link href="/superadmin/metrics" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Metrics & Analytics</span>
        </Link>
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Users Management</h1>
            <p className="text-gray-600 mt-2">Manage all system administrator users and their permissions.</p>
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

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search users by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="SuperAdmin">Super Admin</option>
                    <option value="MunicipalityAdmin">Municipality Admin</option>
                    <option value="BarangayAdmin">Barangay Admin</option>
                  </select>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loadingData ? (
              <div className="p-8 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="text-gray-600">Loading users data...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'SuperAdmin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'MunicipalityAdmin' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role.replace('Admin', ' Admin')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.municipalityName && (
                              <div>{user.municipalityName}</div>
                            )}
                            {user.barangayName && (
                              <div className="text-gray-500">{user.barangayName}</div>
                            )}
                            {!user.municipalityName && !user.barangayName && (
                              <span className="text-gray-400">System-wide</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastLogin ? (
                              new Date(user.lastLogin).toLocaleDateString()
                            ) : (
                              'Never'
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal(user)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                disabled={actionLoading}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleStatus(user.id, user.isActive)}
                                className={`${
                                  user.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'
                                } transition-colors`}
                                disabled={actionLoading}
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                disabled={actionLoading}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No users found matching your criteria.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Super Admins</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'SuperAdmin').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Municipality Admins</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {users.filter(u => u.role === 'MunicipalityAdmin').length}
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
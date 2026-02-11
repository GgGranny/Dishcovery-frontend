import React, { useState, useEffect } from "react";
import {
  FiUsers, FiUserCheck, FiStar, FiUserPlus,
  FiSearch, FiFilter, FiTrash2, FiCalendar,
  FiCheckCircle, FiDownload, FiRefreshCw, FiUserX,
  FiAlertCircle, FiEye
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:8080/api/admin";

const Users = () => {
  // ---------- Filters ----------
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ---------- API state ----------
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------- Pagination ----------
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalPages: 1,
    totalElements: 0
  });

  // ---------- Stats – only Total Users is dynamic ----------
  const stats = [
    {
      title: "Total Users",
      value: pagination.totalElements.toLocaleString(),
      icon: <FiUsers className="text-3xl" />,
      color: "from-blue-500 to-blue-600",
      change: "+2.1% this month"
    },
    {
      title: "Active Users",
      value: pagination.totalElements.toLocaleString(),
      icon: <FiUserCheck className="text-3xl" />,
      color: "from-green-500 to-green-600",
      change: "78% active rate"
    },
    {
      title: "Featured Chefs",
      value: pagination.totalElements.toLocaleString(),
      icon: <FiStar className="text-3xl" />,
      color: "from-yellow-500 to-yellow-600",
      change: "Top contributors"
    },
    {
      title: "New Users This Week",
      value: pagination.totalElements.toLocaleString(),
      icon: <FiUserPlus className="text-3xl" />,
      color: "from-purple-500 to-purple-600",
      change: "+8 from last week"
    }
  ];

  // ---------- Helper: Format profile picture URL (copied from recipe thumbnail logic) ----------
  const formatProfilePictureUrl = (picture) => {
    if (!picture) return null;

    if (picture.startsWith('http') || picture.startsWith('data:')) return picture;

    const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
    if (base64Pattern.test(picture) && picture.length > 50) {
      if (picture.startsWith('/9j/')) return `data:image/jpeg;base64,${picture}`;
      if (picture.startsWith('iVBORw0KGgo')) return `data:image/png;base64,${picture}`;
      return `data:image/jpeg;base64,${picture}`;
    }

    if (picture.startsWith('/')) return `http://localhost:8080${picture}`;
    return picture;
  };

  // ---------- Token size check (prevent 431) ----------
  const validateToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return null;
    }
    if (token.length > 4000) {
      setError("Token too large. Please log out and log in again.");
      localStorage.removeItem("token");
      return null;
    }
    return token;
  };

  // ---------- Fetch users (with token) ----------
  const fetchUsers = async (page, size) => {
    setLoading(true);
    setError(null);

    const token = validateToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/fetch-users?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        setError("Session expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch users (Status: ${response.status})`);
      }

      const data = await response.json();
      const userList = data.content || data;
      setUsers(userList);
      setPagination({
        page,
        size,
        totalPages: data.totalPages || 1,
        totalElements: data.totalElements || userList.length
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.page, pagination.size);
  }, [pagination.page, pagination.size]);

  // ---------- Page navigation ----------
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // ---------- Handlers ----------
  const handleRefresh = () => fetchUsers(pagination.page, pagination.size);
  const handleExport = () => alert("Exporting user data...");

  // ---------- Client-side filtering (current page only) ----------
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || roleFilter === "user";
    const matchesStatus = statusFilter === "all" || statusFilter === "active";
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ---------- New action handlers ----------
  const handleSendWarning = (userId) => {
    alert(`Send warning to user ${userId}`);
    // TODO: call POST /api/admin/users/{userId}/warn
  };

  const handleViewProfile = (userId) => {
    alert(`View profile of user ${userId}`);
    // TODO: navigate to profile page or open modal
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));
      // TODO: call DELETE /api/admin/users/{userId}
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
  };

  // ---------- Helpers ----------
  const getInitials = (username) =>
    username
      ?.split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  // ---------- Badges (static) ----------
  const getStatusBadge = (status = "active") => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiCheckCircle className="mr-1" /> Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <FiUserX className="mr-1" /> Inactive
      </span>
    );
  };

  const getRoleBadge = () => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      User
    </span>
  );

  return (
    <div className="space-y-6">
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-2">Manage platform users, roles, and permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiDownload className="mr-2" /> Export
          </button>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* ---------- Stats Grid ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- Search & Filters ---------- */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* ---------- Users Table ---------- */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading users...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, idx) => {
                  const userId = user.id || `temp-${idx}`;
                  const username = user.username || "Unknown";
                  const email = user.email || "—";
                  const recipeCount = user.recipeCount || 0;
                  const profilePicture = user.profilePicture;
                  const formattedPicture = formatProfilePictureUrl(profilePicture);

                  return (
                    <tr key={userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {formattedPicture ? (
                              <img
                                src={formattedPicture}
                                alt={username}
                                className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.parentNode.innerHTML += `<div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">${getInitials(username)}</div>`;
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                {getInitials(username)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{recipeCount}</div>
                        <div className="text-xs text-gray-500">recipes</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiCalendar className="mr-2 text-gray-400" /> —
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusBadge("active")}
                          <button
                            onClick={() => toggleUserStatus(userId)}
                            className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                          >
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {/* Send Warning */}
                          <button
                            onClick={() => handleSendWarning(userId)}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                            title="Send Warning"
                          >
                            <FiAlertCircle />
                          </button>
                          {/* View Profile */}
                          <button
                            onClick={() => handleViewProfile(userId)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View Profile"
                          >
                            <FiEye />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(userId)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete User"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ---------- Pagination ---------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
            <span className="font-medium">{pagination.totalElements}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else {
                const start = Math.max(1, pagination.page - 2);
                pageNum = start + i;
                if (pageNum > pagination.totalPages) return null;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`px-3 py-1 border rounded text-sm ${
                    pageNum === pagination.page
                      ? "bg-green-600 text-white border-green-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 1 && (
              <button
                onClick={() => goToPage(pagination.totalPages)}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                {pagination.totalPages}
              </button>
            )}
            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Bulk Actions (static) ---------- */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bulk Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
            Send Email to Selected
          </button>
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium">
            Assign to Group
          </button>
          <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm font-medium">
            Change Role
          </button>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
            Delete Selected
          </button>
        </div>
      </div>

      {/* ---------- Quick Stats (static) ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl border border-blue-100">
          <h4 className="font-semibold text-blue-800 mb-2">User Activity</h4>
          <div className="text-2xl font-bold text-gray-800">85%</div>
          <p className="text-sm text-gray-600">Active users in the last 7 days</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-2xl border border-green-100">
          <h4 className="font-semibold text-green-800 mb-2">New Registrations</h4>
          <div className="text-2xl font-bold text-gray-800">+3.2%</div>
          <p className="text-sm text-gray-600">Growth rate this month</p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-2xl border border-purple-100">
          <h4 className="font-semibold text-purple-800 mb-2">Top Contributors</h4>
          <div className="text-2xl font-bold text-gray-800">42</div>
          <p className="text-sm text-gray-600">Users with 20+ recipes</p>
        </div>
      </div>
    </div>
  );
};

export default Users;
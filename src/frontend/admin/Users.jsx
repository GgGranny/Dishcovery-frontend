import React, { useState } from "react";
import {
  FiUsers, FiUserCheck, FiStar, FiUserPlus,
  FiSearch, FiFilter, FiMoreVertical, FiEdit,
  FiTrash2, FiEye, FiMail, FiCalendar, FiCheckCircle,
  FiXCircle, FiDownload, FiRefreshCw, FiUserX
} from "react-icons/fi";

const Users = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Statistics data
  const stats = [
    {
      title: "Total Users",
      value: "12,865",
      icon: <FiUsers className="text-3xl" />,
      color: "from-blue-500 to-blue-600",
      change: "+2.1% this month"
    },
    {
      title: "Active Users",
      value: "10,000",
      icon: <FiUserCheck className="text-3xl" />,
      color: "from-green-500 to-green-600",
      change: "78% active rate"
    },
    {
      title: "Featured Chefs",
      value: "200",
      icon: <FiStar className="text-3xl" />,
      color: "from-yellow-500 to-yellow-600",
      change: "Top contributors"
    },
    {
      title: "New Users This Week",
      value: "50",
      icon: <FiUserPlus className="text-3xl" />,
      color: "from-purple-500 to-purple-600",
      change: "+8 from last week"
    }
  ];

  // Sample user data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Sagish Maharjan",
      email: "sagishmhr@gmail.com",
      avatar: "SM",
      role: "contributor",
      recipes: 40,
      joined: "2024-01-01",
      status: "active",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "SJ",
      role: "premium",
      recipes: 28,
      joined: "2024-02-15",
      status: "active",
      lastActive: "30 minutes ago"
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      avatar: "MC",
      role: "admin",
      recipes: 0,
      joined: "2024-03-10",
      status: "active",
      lastActive: "Now"
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.w@example.com",
      avatar: "EW",
      role: "contributor",
      recipes: 15,
      joined: "2024-01-22",
      status: "inactive",
      lastActive: "2 days ago"
    },
    {
      id: 5,
      name: "David Kim",
      email: "david.kim@example.com",
      avatar: "DK",
      role: "user",
      recipes: 8,
      joined: "2024-02-28",
      status: "active",
      lastActive: "5 hours ago"
    },
    {
      id: 6,
      name: "Lisa Rodriguez",
      email: "lisa.r@example.com",
      avatar: "LR",
      role: "contributor",
      recipes: 32,
      joined: "2024-01-10",
      status: "suspended",
      lastActive: "1 week ago"
    },
    {
      id: 7,
      name: "Alex Turner",
      email: "alex.t@example.com",
      avatar: "AT",
      role: "user",
      recipes: 3,
      joined: "2024-03-05",
      status: "active",
      lastActive: "1 hour ago"
    },
    {
      id: 8,
      name: "Maria Garcia",
      email: "maria.g@example.com",
      avatar: "MG",
      role: "premium",
      recipes: 45,
      joined: "2024-01-18",
      status: "active",
      lastActive: "Now"
    }
  ]);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user actions
  const handleAction = (userId, action) => {
    switch (action) {
      case 'edit':
        alert(`Edit user ${userId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(user => user.id !== userId));
        }
        break;
      case 'view':
        alert(`View user ${userId}`);
        break;
      case 'email':
        alert(`Email user ${userId}`);
        break;
      default:
        break;
    }
  };

  // Handle status change
  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: user.status === 'active' ? 'inactive' : 'active',
            lastActive: user.status === 'active' ? 'Now' : user.lastActive
          }
        : user
    ));
  };

  // Handle export
  const handleExport = () => {
    alert('Exporting user data...');
  };

  // Handle refresh
  const handleRefresh = () => {
    alert('Refreshing user data...');
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FiUserX className="mr-1" /> Inactive
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiXCircle className="mr-1" /> Suspended
          </span>
        );
      default:
        return null;
    }
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleColors = {
      admin: "bg-purple-100 text-purple-800",
      premium: "bg-yellow-100 text-yellow-800",
      contributor: "bg-blue-100 text-blue-800",
      user: "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
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

      {/* Search and Filters */}
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
                <option value="admin">Admin</option>
                <option value="premium">Premium</option>
                <option value="contributor">Contributor</option>
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
                <option value="suspended">Suspended</option>
              </select>
            </div>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                          {user.avatar}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">Last active: {user.lastActive}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{user.recipes}</div>
                    <div className="text-xs text-gray-500">recipes</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiCalendar className="mr-2 text-gray-400" />
                      {user.joined}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusBadge(user.status)}
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAction(user.id, 'view')}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Profile"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleAction(user.id, 'email')}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Send Email"
                      >
                        <FiMail />
                      </button>
                      <button
                        onClick={() => handleAction(user.id, 'edit')}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                        title="Edit User"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleAction(user.id, 'delete')}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination and Summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
            <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              10
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
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

      {/* Quick Stats */}
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
import React, { useState } from "react";

const AdminSetting = () => {
  // ---------- Tab navigation ----------
  const [activeTab, setActiveTab] = useState("general");

  // ---------- Form states ----------
  const [siteName, setSiteName] = useState("FlavorShare");
  const [siteDescription, setSiteDescription] = useState(
    "Discover and share delicious recipes from around the world."
  );
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [defaultUserRole, setDefaultUserRole] = useState("user");
  // 💰 Payment settings – now using NRP as default
  const [premiumPrice, setPremiumPrice] = useState(999);
  const [currency, setCurrency] = useState("NRP");
  const [paymentGateway, setPaymentGateway] = useState("stripe");
  const [autoApproveRecipes, setAutoApproveRecipes] = useState(false);
  const [flagThreshold, setFlagThreshold] = useState(3);

  // ---------- Mock save handler ----------
  const handleSave = () => {
    alert("Settings saved (demo)");
  };

  // ---------- Tab content components ----------
  const renderGeneral = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Name
        </label>
        <input
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Site Description
        </label>
        <textarea
          rows={3}
          value={siteDescription}
          onChange={(e) => setSiteDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Maintenance Mode
        </span>
        <button
          onClick={() => setMaintenanceMode(!maintenanceMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            maintenanceMode ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              maintenanceMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Allow New Registrations
        </span>
        <button
          onClick={() => setAllowRegistration(!allowRegistration)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            allowRegistration ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              allowRegistration ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Default User Role
        </label>
        <select
          value={defaultUserRole}
          onChange={(e) => setDefaultUserRole(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="user">User</option>
          <option value="premium">Premium</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Total users:</span> 12,345
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Premium users:</span> 3,210
        </p>
        <button className="mt-3 text-sm text-green-600 hover:text-green-800 font-medium">
          Manage all users →
        </button>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Premium Subscription Price
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            value={premiumPrice}
            onChange={(e) => setPremiumPrice(parseFloat(e.target.value))}
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
            <option value="NRP">NRP (Nepalese Rupee)</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payment Gateway
        </label>
        <div className="space-y-2">
          {["Esewa", "phonepay"].map((gateway) => (
            <label key={gateway} className="flex items-center gap-2">
              <input
                type="radio"
                name="gateway"
                value={gateway}
                checked={paymentGateway === gateway}
                onChange={(e) => setPaymentGateway(e.target.value)}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 capitalize">{gateway}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Total revenue (all time):</span> Rs 456,789
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Monthly recurring:</span> Rs 34,560
        </p>
      </div>
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Auto‑approve recipes
        </span>
        <button
          onClick={() => setAutoApproveRecipes(!autoApproveRecipes)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            autoApproveRecipes ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              autoApproveRecipes ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reports threshold (flags to hide recipe)
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={flagThreshold}
          onChange={(e) => setFlagThreshold(parseInt(e.target.value))}
          className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Recipes with this many flags are automatically hidden.
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Pending approval:</span> 23 recipes
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Flagged content:</span> 7 items
        </p>
        <button className="mt-3 text-sm text-green-600 hover:text-green-800 font-medium">
          Go to moderation queue →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your platform configuration, users, payments and moderation.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Tabs navigation */}
          <div className="flex border-b border-gray-200">
            {[
              { id: "general", label: "General", icon: "⚙️" },
              { id: "users", label: "Users", icon: "👥" },
              { id: "payments", label: "Payments", icon: "💰" },
              { id: "moderation", label: "Moderation", icon: "🛡️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-4 text-sm font-medium flex items-center justify-center gap-2 transition ${
                  activeTab === tab.id
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6 md:p-8">
            {activeTab === "general" && renderGeneral()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "payments" && renderPayments()}
            {activeTab === "moderation" && renderModeration()}
          </div>

          {/* Save button bar */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition"
            >
              Save Changes
            </button>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          This is a demo UI. No actual changes are persisted.
        </p>
      </div>
    </div>
  );
};

export default AdminSetting;
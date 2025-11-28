import React, { useState } from "react";
import Footer from "../../components/Footer";
import Homenavbar from "../../components/Homenavbar";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [profile, setProfile] = useState({ username: "Aryan", email: "aryan@example.com" });
  const [notifications, setNotifications] = useState({
    recipeUpdates: true,
    comments: false,
    marketing: true,
    pushNotifications: true,
    smsNotifications: false
  });
  const [preferences, setPreferences] = useState({
    language: "English",
    theme: "Light",
    recipeView: "Grid",
    units: "Metric",
    timezone: "GMT+5:45"
  });

  const tabs = [
    { id: "account", label: "Account" },
    { id: "preferences", label: "Preferences" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy & Security" },
    { id: "integrations", label: "Integrations" },
    { id: "billing", label: "Billing & Subscriptions" },
    { id: "help", label: "Help & Support" },
  
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Homenavbar />
      <div className="max-w-7xl mx-auto p-6 pt-24 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-3xl shadow-lg p-6 sticky top-24 h-fit space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left p-3 rounded-xl w-full transition flex items-center justify-start gap-2 font-medium ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button className="mt-6 text-red-600 p-3 rounded-xl hover:bg-red-50 font-semibold w-full text-left">
              🚪 Logout
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Account Section */}
          {activeTab === "account" && (
            <section className="bg-white rounded-3xl shadow-lg p-8 space-y-6 hover:shadow-2xl transition">
              <h2 className="text-2xl font-bold text-gray-800">👤 Account</h2>
              <div className="flex items-center gap-6 relative">
                <img
                  src="https://via.placeholder.com/100"
                  className="h-28 w-28 rounded-full object-cover border-4 border-gray-200 shadow-xl"
                />
                <button className="absolute bottom-0 left-24 bg-green-500 text-white px-4 py-2 rounded-full text-sm shadow hover:bg-green-600 transition">
                  Change
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Username</label>
                  <input
                    className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <input
                    className="w-full border border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <button className="px-6 py-2 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition">
                  Save Changes
                </button>
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-2xl shadow-md hover:bg-gray-300 transition">
                  Delete Account
                </button>
              </div>
            </section>
          )}

          {/* Preferences Section */}
          {activeTab === "preferences" && (
            <section className="bg-white rounded-3xl shadow-lg p-8 space-y-6 hover:shadow-2xl transition">
              <h2 className="text-2xl font-bold text-gray-800">Preferences</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Language</label>
                  <select
                    className="p-3 border border-gray-300 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  >
                    <option>English</option>
                    <option>Nepali</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Theme</label>
                  <select
                    className="p-3 border border-gray-300 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                  >
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Recipe View</label>
                  <select
                    className="p-3 border border-gray-300 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    value={preferences.recipeView}
                    onChange={(e) => setPreferences({ ...preferences, recipeView: e.target.value })}
                  >
                    <option>Grid</option>
                    <option>List</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Units</label>
                  <select
                    className="p-3 border border-gray-300 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    value={preferences.units}
                    onChange={(e) => setPreferences({ ...preferences, units: e.target.value })}
                  >
                    <option>Metric</option>
                    <option>Imperial</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">Timezone</label>
                  <select
                    className="p-3 border border-gray-300 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  >
                    <option>GMT+5:45</option>
                    <option>GMT+0</option>
                    <option>GMT+1</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* Notifications Section */}
          {activeTab === "notifications" && (
            <section className="bg-white rounded-3xl shadow-lg p-8 space-y-4 hover:shadow-2xl transition">
              <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              {Object.keys(notifications).map((key) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <span className="capitalize text-gray-700">{key.replace(/([A-Z])/g, " $1")}</span>
                  <input
                    type="checkbox"
                    className="h-6 w-12 rounded-full accent-green-500 cursor-pointer"
                    checked={notifications[key]}
                    onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  />
                </label>
              ))}
            </section>
          )}

          {/* Privacy Section */}
          {activeTab === "privacy" && (
            <section className="bg-white rounded-3xl shadow-lg p-8 space-y-4 hover:shadow-2xl transition">
              <h2 className="text-2xl font-bold text-gray-800">Privacy & Security</h2>
              <p className="text-gray-600">Manage your login sessions, two-factor authentication, and privacy settings here.</p>
              <button className="px-6 py-2 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition">
                Enable Two-Factor Authentication
              </button>
              <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-2xl shadow-md hover:bg-gray-300 transition">
                View Login History
              </button>
            </section>
          )}

          {/* Integrations Section */}
          {activeTab === "integrations" && (
            <section className="bg-white rounded-3xl shadow-lg p-8 space-y-4 hover:shadow-2xl transition">
              <h2 className="text-2xl font-bold text-gray-800">Integrations</h2>
              <p className="text-gray-600">Connect your social media accounts and APIs.</p>
              <button className="px-6 py-2 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition">Connect Instagram</button>
              <button className="px-6 py-2 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition">Connect TikTok</button>
            </section>
          )}

          {/* Billing Section */}
          {activeTab === "billing" && (
            <section className="bg-white rounded-3xl shadow-lg p-8 space-y-4 hover:shadow-2xl transition">
              <h2 className="text-2xl font-bold text-gray-800">Billing & Subscriptions</h2>
              <p className="text-gray-600">Manage your subscription and payment methods.</p>
              <button className="px-6 py-2 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition">Upgrade Plan</button>
              <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-2xl shadow-md hover:bg-gray-300 transition">View Billing History</button>
            </section>
          )}

          {/* Help Section */}
          {activeTab === "help" && (
            <section className="bg-white rounded-3xl shadow-lg p-8 space-y-4 hover:shadow-2xl transition">
              <h2 className="text-2xl font-bold text-gray-800">Help & Support</h2>
              <button className="px-6 py-2 bg-green-500 text-white rounded-2xl shadow-md hover:bg-green-600 transition">Contact Support</button>
              <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-2xl shadow-md hover:bg-gray-300 transition">FAQ</button>
              <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-2xl shadow-md hover:bg-gray-300 transition">Terms & Privacy</button>
            </section>
          )}

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Setting;

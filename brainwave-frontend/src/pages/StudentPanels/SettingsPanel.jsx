import React, { useState } from "react";
import { BellIcon, LockClosedIcon, UserIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function SettingsPanel({ isDark }) {
  const [profile, setProfile] = useState({
    name: "Harsh Mehta",
    email: "harsh.mehta@student.com",
    rollNo: "BCA3B01",
    phone: "+91 9876543210",
  });

  const [notifications, setNotifications] = useState({
    assignments: true,
    grades: true,
    announcements: true,
    events: false,
  });

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Profile Information
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Full Name"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-900"
              }`}
            />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Email"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDark
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-900"
              }`}
            />
            <input
              type="text"
              value={profile.rollNo}
              disabled
              placeholder="Roll Number"
              className={`w-full px-4 py-2 rounded-lg border opacity-50 ${
                isDark
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-900"
              }`}
            />
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Notifications
          </h2>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <LockClosedIcon className="h-5 w-5" />
            Security
          </h2>
          <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
            Change Password
          </button>
        </div>

        {/* Privacy Settings */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5" />
            Privacy
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span>Make profile visible to other students</span>
          </label>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { PencilIcon, CheckIcon, XMarkIcon, MoonIcon, SunIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function SettingsPanel({
  isDark, setIsDark, profileDraft, setProfileDraft, editProfile, setEditProfile, handleLogout
}) {
  return (
    <div className="space-y-6">
      <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
        <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          Profile Settings
        </h3>
        {editProfile ? (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Full Name
              </label>
              <input
                type="text"
                value={profileDraft.name}
                onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Email
              </label>
              <input
                type="email"
                value={profileDraft.email}
                onChange={(e) => setProfileDraft({ ...profileDraft, email: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Department
              </label>
              <input
                type="text"
                value={profileDraft.department}
                onChange={(e) => setProfileDraft({ ...profileDraft, department: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Phone
              </label>
              <input
                type="text"
                value={profileDraft.phone}
                onChange={(e) => setProfileDraft({ ...profileDraft, phone: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditProfile(false)} className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600">
                <CheckIcon className="h-5 w-5" /> Save Changes
              </button>
              <button onClick={() => setEditProfile(false)} className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-600">
                <XMarkIcon className="h-5 w-5" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={`space-y-3 mb-4 ${isDark ? "text-gray-300" : ""}`}>
            <div className="flex justify-between">
              <span className={isDark ? "text-gray-400" : "text-gray-700"}>Name:</span>
              <span className="font-semibold">{profileDraft.name}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-gray-400" : "text-gray-700"}>Email:</span>
              <span className="font-semibold">{profileDraft.email}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-gray-400" : "text-gray-700"}>Department:</span>
              <span className="font-semibold">{profileDraft.department}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-gray-400" : "text-gray-700"}>Phone:</span>
              <span className="font-semibold">{profileDraft.phone}</span>
            </div>
            <button onClick={() => setEditProfile(true)} className="flex items-center gap-2 bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-600 mt-4">
              <PencilIcon className="h-5 w-5" /> Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
        <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDark ? (
              <MoonIcon className={`h-6 w-6 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
            ) : (
              <SunIcon className="h-6 w-6 text-yellow-500" />
            )}
            <span className={`font-semibold ${isDark ? "text-gray-300" : ""}`}>
              {isDark ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
          <button onClick={() => setIsDark(!isDark)} className={`px-4 py-2 rounded-lg font-bold text-white transition ${isDark ? "bg-gray-700 hover:bg-gray-800" : "bg-cyan-500 hover:bg-cyan-600"}`}>
            Toggle
          </button>
        </div>
      </div>

      <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
        <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          Account Actions
        </h3>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600">
          <ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout
        </button>
      </div>
    </div>
  );
}

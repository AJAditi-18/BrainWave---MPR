import React, { useState } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  TrophyIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// Student Panels - with lazy loading error handling
import OverviewPanel from "./StudentPanels/OverviewPanel";
import CourseworkPanel from "./StudentPanels/CourseworkPanel";
import LibraryPanel from "./StudentPanels/LibraryPanel";
import AlumniPanel from "./StudentPanels/AlumniPanel";
import MarketplacePanel from "./StudentPanels/MarketplacePanel";
import AssistantPanel from "./StudentPanels/AssistantPanel";
import CalendarPanel from "./StudentPanels/CalendarPanel";
import LeaderboardPanel from "./StudentPanels/LeaderboardPanel";
import SettingsPanel from "./StudentPanels/SettingsPanel";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDark, setIsDark] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { id: "overview", icon: HomeIcon, label: "Overview" },
    { id: "coursework", icon: BookOpenIcon, label: "Coursework" },
    { id: "library", icon: BookOpenIcon, label: "Library" },
    { id: "alumni", icon: UsersIcon, label: "Alumni" },
    { id: "marketplace", icon: ShoppingCartIcon, label: "Marketplace" },
    { id: "assistant", icon: ChatBubbleLeftRightIcon, label: "Assistant" },
    { id: "calendar", icon: CalendarIcon, label: "Calendar" },
    { id: "leaderboard", icon: TrophyIcon, label: "Leaderboard" },
    { id: "settings", icon: Cog6ToothIcon, label: "Settings" },
  ];

  const renderPanel = () => {
    try {
      switch (activeTab) {
        case "overview":
          return <OverviewPanel isDark={isDark} />;
        case "coursework":
          return <CourseworkPanel isDark={isDark} />;
        case "library":
          return <LibraryPanel isDark={isDark} />;
        case "alumni":
          return <AlumniPanel isDark={isDark} />;
        case "marketplace":
          return <MarketplacePanel isDark={isDark} />;
        case "assistant":
          return <AssistantPanel isDark={isDark} />;
        case "calendar":
          return <CalendarPanel isDark={isDark} />;
        case "leaderboard":
          return <LeaderboardPanel isDark={isDark} />;
        case "settings":
          return <SettingsPanel isDark={isDark} />;
        default:
          return <OverviewPanel isDark={isDark} />;
      }
    } catch (error) {
      console.error("Error rendering panel:", error);
      return (
        <div className={`p-8 rounded-lg ${isDark ? "bg-gray-700" : "bg-white"}`}>
          <p className="text-red-600 font-bold">Error loading panel: {error.message}</p>
        </div>
      );
    }
  };

  return (
    <div className={`flex flex-col h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Top Navbar */}
      <nav className={`${isDark ? "bg-gray-800" : "bg-white"} shadow-md border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className="px-8 py-4 flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-blue-600">Brainwave</h1>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 ${isDark ? "bg-gray-800" : "bg-white"} shadow-lg flex flex-col overflow-y-auto`}>
          {/* Logo & Branding */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">Brainwave</h1>
            <p className="text-sm text-gray-500">Student Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom Controls */}
          <div className={`p-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"} space-y-2`}>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg transition ${
                  isDark ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">{renderPanel()}</main>
      </div>
    </div>
  );
};

export default StudentDashboard;

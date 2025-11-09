import React from "react";
import { BookOpenIcon, CalendarIcon, TrophyIcon, ClipboardIcon } from "@heroicons/react/24/outline";

export default function OverviewPanel({ isDark }) {
  const stats = [
    { label: "Current GPA", value: "3.85", icon: TrophyIcon, color: "text-yellow-600" },
    { label: "Attendance", value: "92%", icon: CalendarIcon, color: "text-green-600" },
    { label: "Assignments Pending", value: "3", icon: ClipboardIcon, color: "text-red-600" },
    { label: "Courses Enrolled", value: "5", icon: BookOpenIcon, color: "text-blue-600" },
  ];

  const upcomingDeadlines = [
    { course: "Software Engineering", assignment: "Chapter 3 Assignment", dueDate: "2025-11-15", daysLeft: 7 },
    { course: "Database Systems", assignment: "Project Part B", dueDate: "2025-11-20", daysLeft: 12 },
    { course: "Web Development", assignment: "Final Project", dueDate: "2025-11-25", daysLeft: 17 },
  ];

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className={`h-12 w-12 ${stat.color} opacity-50`} />
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Deadlines */}
      <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
        <h2 className="text-2xl font-bold mb-4">Upcoming Deadlines</h2>
        <div className="space-y-3">
          {upcomingDeadlines.map((deadline, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-l-4 border-blue-600 ${isDark ? "bg-gray-600" : "bg-gray-50"}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{deadline.assignment}</p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{deadline.course}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{deadline.daysLeft} days</p>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{deadline.dueDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

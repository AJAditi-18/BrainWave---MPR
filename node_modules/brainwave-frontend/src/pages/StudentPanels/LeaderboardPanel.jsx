import React from "react";
import { TrophyIcon } from "@heroicons/react/24/outline";

export default function LeaderboardPanel({ isDark }) {
  const leaderboard = [
    { rank: 1, name: "Sneha Patel", rollNo: "BCA3B02", marks: 92, attendance: 95 },
    { rank: 2, name: "You", rollNo: "BCA3B01", marks: 85, attendance: 92 },
    { rank: 3, name: "Ankit Sharma", rollNo: "BCA3B03", marks: 78, attendance: 88 },
    { rank: 4, name: "Priya Jain", rollNo: "BCA3B04", marks: 75, attendance: 85 },
    { rank: 5, name: "Rahul Agarwal", rollNo: "BCA3B05", marks: 72, attendance: 80 },
  ];

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
        <div className="space-y-3">
          {leaderboard.map((student) => (
            <div
              key={student.rank}
              className={`flex items-center justify-between p-4 rounded-lg ${
                student.rank < 3
                  ? student.rank === 1
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                    : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                  : isDark
                  ? "bg-gray-600"
                  : "bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  student.rank < 3 ? "bg-white text-gray-900" : isDark ? "bg-gray-700" : "bg-white"
                }`}>
                  {student.rank < 3 ? (student.rank === 1 ? "🥇" : "🥈") : student.rank}
                </div>
                <div>
                  <p className="font-bold">{student.name}</p>
                  <p className={`text-xs ${isDark && student.rank > 2 ? "text-gray-400" : "opacity-70"}`}>{student.rollNo}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold">{student.marks}</p>
                  <p className="text-xs opacity-70">Marks</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{student.attendance}%</p>
                  <p className="text-xs opacity-70">Attendance</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import { TrophyIcon, CheckCircleIcon, XCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function StudentsPanel({
  isDark,
  classMap,
  assignmentsByClass,
  studentAssignments,
  setStudentAssignments,
  studentMarks,
  setStudentMarks,
  attendance,
}) {
  const [selectedClassKey, setSelectedClassKey] = useState(classMap?.[0]?.classKey || null);
  const [activeView, setActiveView] = useState("leaderboard"); // 'leaderboard' or 'details'

  // Calculate leaderboard data for selected class
  const leaderboardData = useMemo(() => {
    if (!selectedClassKey || !classMap) return [];

    const selectedClass = classMap.find((cls) => cls.classKey === selectedClassKey);
    if (!selectedClass || !selectedClass.students) return [];

    const studentsWithScores = selectedClass.students.map((student) => {
      const marks = parseInt(studentMarks[`${student.rollNo}-${selectedClassKey}`] || 0);
      const attendanceData = attendance?.[selectedClassKey]?.[student.rollNo] || {};
      const totalDays = Object.keys(attendanceData).length;
      const presentDays = Object.values(attendanceData).filter((s) => s === "P").length;
      const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      // Calculate assignments submitted
      const classAssignments = assignmentsByClass?.[selectedClassKey] || [];
      const submittedCount = classAssignments.filter(
        (assignment) => studentAssignments[`${student.rollNo}-${assignment.id}`]
      ).length;

      return {
        ...student,
        marks,
        attendancePercent,
        submittedAssignments: submittedCount,
        totalAssignments: classAssignments.length,
      };
    });

    // Sort by marks (descending)
    return studentsWithScores.sort((a, b) => b.marks - a.marks);
  }, [selectedClassKey, classMap, studentMarks, attendance, assignmentsByClass, studentAssignments]);

  if (!classMap || classMap.length === 0) {
    return (
      <div className={`p-8 rounded-lg text-center ${isDark ? "bg-gray-700" : "bg-white"}`}>
        <p className={isDark ? "text-gray-300" : "text-gray-500"}>No classes available.</p>
      </div>
    );
  }

  const selectedClass = classMap.find((cls) => cls.classKey === selectedClassKey);
  const classAssignments = assignmentsByClass?.[selectedClassKey] || [];

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      {/* Class Selector */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Select Class</label>
        <select
          value={selectedClassKey || ""}
          onChange={(e) => setSelectedClassKey(e.target.value)}
          className={`w-full md:w-1/2 px-4 py-2 rounded-lg border ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {classMap.map((cls) => (
            <option key={cls.classKey} value={cls.classKey}>
              {cls.className} - {cls.subject}
            </option>
          ))}
        </select>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveView("leaderboard")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeView === "leaderboard"
              ? "bg-blue-600 text-white"
              : isDark
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <TrophyIcon className="h-5 w-5 inline mr-2" />
          Leaderboard
        </button>
        <button
          onClick={() => setActiveView("details")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeView === "details"
              ? "bg-blue-600 text-white"
              : isDark
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Details & Assignments
        </button>
      </div>

      {/* Content */}
      {activeView === "leaderboard" ? (
        // LEADERBOARD VIEW
        <div className={`rounded-lg shadow-md p-6 ${isDark ? "bg-gray-700" : "bg-white border border-gray-200"}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrophyIcon className="h-6 w-6 text-yellow-500" />
            Class Leaderboard
          </h2>

          {leaderboardData.length === 0 ? (
            <p className="text-center py-8 opacity-70">No students in this class.</p>
          ) : (
            <div className="space-y-3">
              {leaderboardData.map((student, index) => (
                <div
                  key={student.rollNo}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"
                      : index === 1
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                      : index === 2
                      ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white"
                      : isDark
                      ? "bg-gray-600"
                      : "bg-gray-100"
                  }`}
                >
                  {/* Rank & Name */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        index < 3 ? "bg-white text-gray-900" : isDark ? "bg-gray-700" : "bg-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold">{student.name}</p>
                      <p className="text-xs opacity-80">{student.rollNo}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-lg">{student.marks}</p>
                      <p className="text-xs opacity-80">Marks</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{student.attendancePercent}%</p>
                      <p className="text-xs opacity-80">Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">
                        {student.submittedAssignments}/{student.totalAssignments}
                      </p>
                      <p className="text-xs opacity-80">Assignments</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // DETAILS & ASSIGNMENTS VIEW
        <div className={`rounded-lg shadow-md overflow-hidden ${isDark ? "bg-gray-700" : "bg-white border border-gray-200"}`}>
          <div className="p-4 overflow-x-auto">
            {selectedClass?.students?.length === 0 ? (
              <p className="text-center py-8 opacity-70">No students in this class.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                    <th className="text-left px-3 py-3">Roll No</th>
                    <th className="text-left px-3 py-3">Name</th>
                    <th className="text-center px-3 py-3">Marks</th>
                    <th className="text-center px-3 py-3">Attendance %</th>
                    <th className="text-center px-3 py-3">Assignments</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClass?.students?.map((student) => {
                    const marks = studentMarks[`${student.rollNo}-${selectedClassKey}`] || "";
                    const attendanceData = attendance?.[selectedClassKey]?.[student.rollNo] || {};
                    const totalDays = Object.keys(attendanceData).length;
                    const presentDays = Object.values(attendanceData).filter((s) => s === "P").length;
                    const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

                    return (
                      <tr
                        key={student.rollNo}
                        className={`border-b ${
                          isDark ? "border-gray-600 hover:bg-gray-600" : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-3 py-3 font-mono">{student.rollNo}</td>
                        <td className="px-3 py-3">{student.name}</td>
                        <td className="px-3 py-3 text-center">
                          <input
                            type="number"
                            value={marks}
                            onChange={(e) =>
                              setStudentMarks((prev) => ({
                                ...prev,
                                [`${student.rollNo}-${selectedClassKey}`]: e.target.value,
                              }))
                            }
                            placeholder="0"
                            min="0"
                            max="100"
                            className={`w-20 px-2 py-1 border rounded text-center ${
                              isDark
                                ? "bg-gray-500 text-white border-gray-400"
                                : "bg-white text-gray-900 border-gray-300"
                            }`}
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              attendancePercent >= 75
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {attendancePercent}%
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex justify-center gap-1">
                            {classAssignments.slice(0, 5).map((assignment) => {
                              const isSubmitted = studentAssignments[`${student.rollNo}-${assignment.id}`];
                              return (
                                <button
                                  key={assignment.id}
                                  onClick={() =>
                                    setStudentAssignments((prev) => ({
                                      ...prev,
                                      [`${student.rollNo}-${assignment.id}`]: !prev[`${student.rollNo}-${assignment.id}`],
                                    }))
                                  }
                                  title={assignment.name}
                                  className={`p-1 rounded transition ${
                                    isSubmitted
                                      ? "bg-green-500 text-white"
                                      : isDark
                                      ? "bg-gray-500 text-gray-300"
                                      : "bg-gray-300 text-gray-700"
                                  }`}
                                >
                                  {isSubmitted ? (
                                    <CheckCircleIcon className="h-4 w-4" />
                                  ) : (
                                    <XCircleIcon className="h-4 w-4" />
                                  )}
                                </button>
                              );
                            })}
                            {classAssignments.length === 0 && (
                              <span className="text-xs opacity-50">No assignments</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

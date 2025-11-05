import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function AttendancePanel({
  isDark, classMap, attendance, setAttendance, selectedClassKey, setSelectedClassKey,
  noClassDates, setNoClassDates, attendanceDates
}) {
  const found = classMap.find(cls => cls.classKey === selectedClassKey);
  if (!found) return null;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className={`font-bold text-lg flex items-center gap-2 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          <ClipboardDocumentCheckIcon className="h-7 w-7 text-cyan-400" />
          Attendance Marksheet
        </div>
        <select
          value={selectedClassKey}
          onChange={(e) => setSelectedClassKey(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
        >
          {classMap.map((cls) => (
            <option key={cls.classKey} value={cls.classKey}>
              {cls.className} - {cls.subject}
            </option>
          ))}
        </select>
      </div>
      <div className={`overflow-auto border rounded-xl shadow ${isDark ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
        <table className="min-w-max w-full text-sm">
          <thead>
            <tr className={isDark ? "bg-gray-700" : "bg-cyan-50"}>
              <th className={`p-2 border font-bold ${isDark ? "text-gray-100 border-gray-700" : "text-gray-900"}`}>Roll No</th>
              <th className={`p-2 border font-bold ${isDark ? "text-gray-100 border-gray-700" : "text-gray-900"}`}>Name</th>
              {attendanceDates.map((date) => (
                <th key={date} className={`p-2 border font-bold text-xs min-w-[70px] whitespace-nowrap ${isDark ? "text-gray-100 border-gray-700" : "text-gray-900"}`}>
                  <div className="flex flex-col items-center">
                    <span>
                      {new Date(date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <button
                      className={`w-6 h-6 text-xs rounded ${
                        noClassDates[selectedClassKey]?.[date]
                          ? "bg-gray-400 text-white"
                          : isDark ? "bg-cyan-900 text-cyan-200" : "bg-cyan-100 text-cyan-700"
                      }`}
                      title="Toggle No Class for this day"
                      onClick={() => {
                        setNoClassDates((prev) => {
                          let newDates = { ...(prev[selectedClassKey] || {}) };
                          if (newDates[date]) {
                            delete newDates[date];
                          } else {
                            newDates[date] = true;
                          }
                          return { ...prev, [selectedClassKey]: newDates };
                        });
                      }}
                    >
                      {noClassDates[selectedClassKey]?.[date] ? "NC" : "✖"}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {found.students.map((student) => (
              <tr key={student.rollNo} className={isDark ? "even:bg-gray-700 hover:bg-gray-600" : "even:bg-gray-50 hover:bg-cyan-50"}>
                <td className={`border p-2 font-semibold ${isDark ? "text-gray-100 border-gray-700" : "text-gray-900"}`}>{student.rollNo}</td>
                <td className={`border p-2 ${isDark ? "text-gray-100 border-gray-700" : "text-gray-900"}`}>{student.name}</td>
                {attendanceDates.map((date) => {
                  if (noClassDates[selectedClassKey]?.[date]) {
                    return (
                      <td key={date} className={`border p-1 text-center cursor-not-allowed ${isDark ? "bg-gray-600 text-gray-400 border-gray-700" : "bg-gray-200 text-gray-400"}`}>
                        NC
                      </td>
                    );
                  }
                  const isPresent = (attendance[selectedClassKey]?.[student.rollNo]?.[date] || "A") === "P";
                  return (
                    <td key={date} className={`border p-1 text-center ${isDark ? "border-gray-700" : ""}`}>
                      <button
                        onClick={() => {
                          setAttendance((prev) => {
                            const prevClass = { ...(prev[selectedClassKey] || {}) };
                            const prevStud = { ...(prevClass[student.rollNo] || {}) };
                            const newMark = prevStud[date] === "P" ? "A" : "P";
                            prevStud[date] = newMark;
                            prevClass[student.rollNo] = prevStud;
                            return { ...prev, [selectedClassKey]: prevClass };
                          });
                        }}
                        className={`w-8 h-8 rounded text-white font-bold transition ${
                          isPresent ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {isPresent ? "P" : "A"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        <strong>Tip:</strong> Click to toggle <span className="font-bold text-green-600">P</span> (Present) / <span className="font-bold text-red-600">A</span> (Absent). Mark a day as <span className="font-bold text-gray-700">NC</span> (No Class).
      </div>
    </div>
  );
}

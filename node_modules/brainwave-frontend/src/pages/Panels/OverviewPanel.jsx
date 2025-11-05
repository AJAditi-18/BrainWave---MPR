import React from "react";
import { UserGroupIcon, CalendarIcon, DocumentTextIcon, BookOpenIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function OverviewPanel({ isDark, teacherProfile, timetable, totalAssignments, totalNotes, totalStudents, onEditTimetable }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
          <DocumentTextIcon className="h-8 w-8 text-cyan-500 mb-2" />
          <div className={`text-2xl font-bold ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
            {totalAssignments}
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>Active Assignments</div>
        </div>
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
          <BookOpenIcon className="h-8 w-8 text-emerald-500 mb-2" />
          <div className={`text-2xl font-bold ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
            {totalNotes}
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>Notes Uploaded</div>
        </div>
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
          <UserGroupIcon className="h-8 w-8 text-pink-500 mb-2" />
          <div className={`text-2xl font-bold ${isDark ? "text-pink-400" : "text-pink-700"}`}>
            {totalStudents}
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>Total Students</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Profile */}
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
          <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
            <UserGroupIcon className="h-6 w-6" />
            My Profile
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-16 h-16 ${isDark ? "bg-cyan-900" : "bg-cyan-100"} rounded-full flex items-center justify-center font-bold text-cyan-700 text-2xl`}>
                {teacherProfile.name[0]}
              </div>
              <div>
                <div className={`font-bold ${isDark ? "text-cyan-300" : "text-cyan-900"}`}>
                  {teacherProfile.name}
                </div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                  {teacherProfile.department}
                </div>
              </div>
            </div>
            <div className={`border-t ${isDark ? "border-gray-700" : ""} pt-3 space-y-2`}>
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-gray-400" : "text-gray-700"}>Employee ID:</span>
                <span className={isDark ? "text-gray-200" : "text-gray-900"}>{teacherProfile.employeeId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-gray-400" : "text-gray-700"}>Email:</span>
                <span className="font-semibold text-cyan-600">{teacherProfile.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-gray-400" : "text-gray-700"}>Phone:</span>
                <span className={isDark ? "text-gray-200" : "text-gray-900"}>{teacherProfile.phone}</span>
              </div>
            </div>
            <div className={`border-t ${isDark ? "border-gray-700" : ""} pt-3`}>
              <div className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-700"}`}>
                Subjects Teaching:
              </div>
              <div className="flex flex-wrap gap-2">
                {teacherProfile.subjects.map((subject, idx) => (
                  <span key={idx} className={`${isDark ? "bg-cyan-900 text-cyan-200" : "bg-cyan-100 text-cyan-800"} px-3 py-1 rounded-full text-xs font-semibold`}>
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timetable */}
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold text-lg flex items-center gap-2 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
              <CalendarIcon className="h-6 w-6" />
              Weekly Timetable
            </h3>
            <button
              onClick={onEditTimetable}
              className={`flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded transition ${
                isDark ? "bg-cyan-900 text-cyan-200 hover:bg-cyan-800" : "bg-cyan-600 text-white hover:bg-cyan-700"
              }`}
            >
              <PencilIcon className="h-4 w-4" /> Edit
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {timetable.map((day, idx) => (
              <div key={idx} className={`border-l-4 border-cyan-400 pl-3 py-2 ${isDark ? "border-cyan-600" : ""}`}>
                <div className={`font-bold mb-1 ${isDark ? "text-cyan-400" : "text-cyan-800"}`}>
                  {day.day}
                </div>
                <div className="space-y-1">
                  {day.slots.map((slot, i) => (
                    <div key={i} className={`text-sm ${isDark ? "bg-gray-700" : "bg-gray-50"} p-2 rounded`}>
                      <div className="flex justify-between">
                        <span className={`font-semibold ${isDark ? "text-cyan-300" : "text-gray-900"}`}>
                          {slot.subject}
                        </span>
                        <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                          {slot.class}
                        </span>
                      </div>
                      <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        {slot.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

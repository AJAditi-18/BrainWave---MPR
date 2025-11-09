import React, { useState } from "react";
import { DocumentTextIcon, ClipboardDocumentCheckIcon, PaperClipIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function CourseworkPanel({ isDark }) {
  const [expandedCourse, setExpandedCourse] = useState(null);

  const coursework = [
    {
      id: 1,
      course: "Software Engineering",
      notes: [
        { id: 1, title: "Design Patterns Lecture", uploadedBy: "Prof. Singh", date: "2025-11-08" },
        { id: 2, title: "SOLID Principles", uploadedBy: "Prof. Singh", date: "2025-11-06" },
      ],
      assignments: [
        { id: 1, name: "Chapter 3 Problems", due: "2025-11-15", status: "pending", attachment: "SE_Assignment_3.pdf" },
        { id: 2, name: "Case Study", due: "2025-11-20", status: "submitted", marks: 18 },
      ],
    },
    {
      id: 2,
      course: "Database Management",
      notes: [
        { id: 1, title: "SQL Optimization", uploadedBy: "Prof. Sharma", date: "2025-11-07" },
      ],
      assignments: [
        { id: 1, name: "Query Optimization", due: "2025-11-18", status: "pending" },
      ],
    },
  ];

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Coursework & Resources</h1>

      <div className="space-y-4">
        {coursework.map((course) => (
          <div key={course.id} className={`rounded-lg shadow-md overflow-hidden ${isDark ? "bg-gray-700" : "bg-white"}`}>
            {/* Course Header */}
            <button
              onClick={() => toggleCourse(course.id)}
              className={`w-full p-4 flex justify-between items-center ${isDark ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-100 hover:bg-gray-50"}`}
            >
              <h3 className="font-bold text-lg">{course.course}</h3>
              {expandedCourse === course.id ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>

            {/* Course Content */}
            {expandedCourse === course.id && (
              <div className="p-4 space-y-4">
                {/* Notes Section */}
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    Notes & Lectures
                  </h4>
                  <div className="space-y-2 ml-7">
                    {course.notes.map((note) => (
                      <div key={note.id} className={`p-3 rounded ${isDark ? "bg-gray-600" : "bg-gray-100"}`}>
                        <p className="font-semibold text-sm">{note.title}</p>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          by {note.uploadedBy} • {note.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignments Section */}
                <div>
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-600" />
                    Assignments
                  </h4>
                  <div className="space-y-2 ml-7">
                    {course.assignments.map((assignment) => (
                      <div key={assignment.id} className={`p-3 rounded flex justify-between items-center ${isDark ? "bg-gray-600" : "bg-gray-100"}`}>
                        <div>
                          <p className="font-semibold text-sm">{assignment.name}</p>
                          <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Due: {assignment.due}
                          </p>
                          {assignment.attachment && (
                            <p className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                              <PaperClipIcon className="h-3 w-3" />
                              {assignment.attachment}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          assignment.status === "submitted"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}>
                          {assignment.status === "submitted" ? `✓ ${assignment.marks}/${20}` : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

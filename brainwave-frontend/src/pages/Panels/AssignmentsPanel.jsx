import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function AssignmentsPanel({
  isDark, classSubjectOptions, assignmentsByClass, setAssignmentsByClass,
  assignmentFormClass, setAssignmentFormClass, newAssignment, setNewAssignment
}) {
  const addAssignment = (e) => {
    e.preventDefault();
    if (!newAssignment.name || !newAssignment.due) return;

    setAssignmentsByClass((prev) => ({
      ...prev,
      [assignmentFormClass]: [
        ...(prev[assignmentFormClass] || []),
        {
          id: Date.now(),
          name: newAssignment.name,
          due: newAssignment.due,
          submissions: Math.floor(Math.random() * 15),
        },
      ],
    }));
    setNewAssignment({ name: "", due: "" });
  };

  const deleteAssignment = (classKey, assignmentId) => {
    setAssignmentsByClass((prev) => ({
      ...prev,
      [classKey]: prev[classKey].filter((a) => a.id !== assignmentId),
    }));
  };

  return (
    <div className="space-y-6">
      <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
        <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          Create New Assignment
        </h3>
        <form onSubmit={addAssignment} className="space-y-4">
          <select
            value={assignmentFormClass}
            onChange={(e) => setAssignmentFormClass(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
          >
            {classSubjectOptions.map((opt) => (
              <option key={opt.classKey} value={opt.classKey}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Assignment Name"
            value={newAssignment.name}
            onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"}`}
            required
          />
          <input
            type="date"
            value={newAssignment.due}
            onChange={(e) => setNewAssignment({ ...newAssignment, due: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
            required
          />
          <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-600">
            Create Assignment
          </button>
        </form>
      </div>

      {classSubjectOptions.map((opt) => (
        <div key={opt.classKey} className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
            {opt.label}
          </h3>
          {assignmentsByClass[opt.classKey] && assignmentsByClass[opt.classKey].length > 0 ? (
            <div className="space-y-3">
              {assignmentsByClass[opt.classKey].map((assignment) => (
                <div
                  key={assignment.id}
                  className={`p-4 border rounded-lg flex justify-between items-start ${isDark ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-gray-300 hover:bg-gray-100"}`}
                >
                  <div className="flex-1">
                    <div className={`font-bold ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
                      {assignment.name}
                    </div>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Due: {assignment.due}
                    </div>
                    <div className={`text-sm mt-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      <span className="font-semibold">{assignment.submissions}</span> students submitted
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAssignment(opt.classKey, assignment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
              No assignments yet
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

import React, { useState } from "react";
import { TrashIcon, PaperClipIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AssignmentsPanel({
  isDark,
  classSubjectOptions,
  assignmentsByClass,
  setAssignmentsByClass,
  assignmentFormClass,
  setAssignmentFormClass,
  newAssignment,
  setNewAssignment,
}) {
  const [attachedFile, setAttachedFile] = useState(null);

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
          attachment: attachedFile ? { name: attachedFile.name, size: attachedFile.size } : null,
        },
      ],
    }));

    setNewAssignment({ name: "", due: "" });
    setAttachedFile(null);
  };

  const deleteAssignment = (classKey, assignmentId) => {
    setAssignmentsByClass((prev) => ({
      ...prev,
      [classKey]: prev[classKey].filter((a) => a.id !== assignmentId),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  return (
    <div className={`w-full ${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Assignment Form - Left Sidebar */}
        <div className="lg:col-span-1">
          <form
            onSubmit={addAssignment}
            className={`p-6 rounded-lg shadow-md sticky top-8 ${
              isDark ? "bg-gray-700" : "bg-white border border-gray-200"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Create Assignment</h2>

            {/* Class Selection */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-sm">Class</label>
              <select
                value={assignmentFormClass}
                onChange={(e) => setAssignmentFormClass(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? "bg-gray-600 border-gray-500 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                {classSubjectOptions.map((opt) => (
                  <option key={opt.classKey} value={opt.classKey}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Name */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-sm">Name</label>
              <input
                type="text"
                placeholder="e.g., Chapter 3"
                value={newAssignment.name}
                onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
            </div>

            {/* Due Date */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-sm">Due Date</label>
              <input
                type="date"
                value={newAssignment.due}
                onChange={(e) => setNewAssignment({ ...newAssignment, due: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? "bg-gray-600 border-gray-500 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>

            {/* File Attachment */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-sm">Document (Optional)</label>
              <label
                htmlFor="file-upload"
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition text-sm ${
                  isDark
                    ? "bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                    : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                }`}
              >
                <PaperClipIcon className="h-4 w-4" />
                <span>Choose File</span>
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.zip"
              />

              {/* Display Selected File */}
              {attachedFile && (
                <div className={`mt-2 flex items-center justify-between p-2 rounded-lg text-sm ${
                  isDark ? "bg-gray-600" : "bg-gray-100"
                }`}>
                  <div className="flex items-center gap-2 truncate">
                    <PaperClipIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{attachedFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
            >
              Create
            </button>
          </form>
        </div>

        {/* Display Assignments - Right Content */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">All Assignments</h2>
          {Object.keys(assignmentsByClass).length === 0 ? (
            <div className={`p-6 rounded-lg text-center ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
              <p className="text-gray-500">No assignments created yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(assignmentsByClass).map(([classKey, assignments]) => {
                const classInfo = classSubjectOptions.find((opt) => opt.classKey === classKey);
                return (
                  <div key={classKey}>
                    <h3 className="font-semibold mb-2 text-sm opacity-70">{classInfo?.label}</h3>
                    <div className="space-y-2">
                      {assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className={`p-4 rounded-lg shadow flex justify-between items-start ${
                            isDark ? "bg-gray-700" : "bg-white border border-gray-200"
                          }`}
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{assignment.name}</p>
                            <p className="text-xs opacity-70 mt-1">Due: {assignment.due}</p>
                            <p className="text-xs opacity-70">Submissions: {assignment.submissions}</p>

                            {assignment.attachment && (
                              <div className="flex items-center gap-2 mt-2 text-xs text-blue-500">
                                <PaperClipIcon className="h-3 w-3" />
                                <span className="truncate">{assignment.attachment.name}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => deleteAssignment(classKey, assignment.id)}
                            className="text-red-500 hover:text-red-700 transition ml-4"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

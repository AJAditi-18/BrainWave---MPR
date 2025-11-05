import React, { useMemo } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function StudentsPanel({
  isDark, classMap, assignmentsByClass, studentAssignments, setStudentAssignments,
  studentMarks, setStudentMarks, attendance, attendanceDates
}) {
  // Group students by class
  const studentsByClass = useMemo(() => {
    const grouped = {};
    classMap.forEach((cls) => {
      grouped[cls.classKey] = {
        className: cls.className,
        subject: cls.subject,
        students: cls.students,
      };
    });
    return grouped;
  }, [classMap]);

  // Calculate attendance percentage for a student
  const getAttendancePercentage = (rollNo, classKey) => {
    const studentAtt = attendance[classKey]?.[rollNo] || {};
    const total = Object.keys(studentAtt).length;
    const present = Object.values(studentAtt).filter(s => s === "P").length;
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  // Toggle assignment submission
  const toggleAssignmentSubmission = (studentId, assignmentId) => {
    setStudentAssignments((prev) => ({
      ...prev,
      [`${studentId}-${assignmentId}`]: !prev[`${studentId}-${assignmentId}`],
    }));
  };

  // Update marks
  const updateMarks = (studentId, classKey, marks) => {
    setStudentMarks((prev) => ({
      ...prev,
      [`${studentId}-${classKey}`]: marks,
    }));
  };

  return (
    <div className="space-y-8">
      {Object.entries(studentsByClass).map(([classKey, classData]) => {
        const classAssignments = assignmentsByClass[classKey] || [];

        return (
          <div key={classKey} className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
            <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
              {classData.className} - {classData.subject}
            </h3>

            {classData.students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className={isDark ? "bg-gray-700" : "bg-cyan-50"}>
                      <th className={`p-2 border font-bold text-left ${isDark ? "text-gray-100 border-gray-600" : "text-gray-900"}`}>Roll No</th>
                      <th className={`p-2 border font-bold text-left ${isDark ? "text-gray-100 border-gray-600" : "text-gray-900"}`}>Name</th>
                      <th className={`p-2 border font-bold text-center ${isDark ? "text-gray-100 border-gray-600" : "text-gray-900"}`}>Attendance %</th>
                      <th className={`p-2 border font-bold text-center ${isDark ? "text-gray-100 border-gray-600" : "text-gray-900"}`}>Exam Marks</th>
                      {classAssignments.length > 0 && (
                        <th className={`p-2 border font-bold text-center ${isDark ? "text-gray-100 border-gray-600" : "text-gray-900"}`}>Assignments</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {classData.students.map((student) => {
                      const attendancePercentage = getAttendancePercentage(student.rollNo, classKey);
                      const marks = studentMarks[`${student.rollNo}-${classKey}`] || "";

                      return (
                        <tr key={student.rollNo} className={isDark ? "even:bg-gray-700 hover:bg-gray-600" : "even:bg-gray-50 hover:bg-cyan-50"}>
                          <td className={`p-2 border font-semibold ${isDark ? "text-gray-100 border-gray-600" : "text-gray-900"}`}>
                            {student.rollNo}
                          </td>
                          <td className={`p-2 border ${isDark ? "text-gray-100 border-gray-600" : "text-gray-900"}`}>
                            {student.name}
                          </td>
                          <td className={`p-2 border text-center ${isDark ? "text-cyan-400 border-gray-600 font-bold" : "text-cyan-700 font-bold"}`}>
                            {attendancePercentage}%
                          </td>
                          <td className={`p-2 border ${isDark ? "border-gray-600" : ""}`}>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={marks}
                              onChange={(e) => updateMarks(student.rollNo, classKey, e.target.value)}
                              placeholder="0"
                              className={`w-full px-2 py-1 border rounded text-center ${isDark ? "bg-gray-600 text-gray-100 border-gray-500" : "bg-white text-gray-900 border-gray-300"}`}
                            />
                          </td>
                          {classAssignments.length > 0 && (
                            <td className={`p-2 border ${isDark ? "border-gray-600" : ""}`}>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {classAssignments.map((assignment) => {
                                  const isSubmitted = studentAssignments[`${student.rollNo}-${assignment.id}`];
                                  return (
                                    <button
                                      key={assignment.id}
                                      onClick={() => toggleAssignmentSubmission(student.rollNo, assignment.id)}
                                      title={assignment.name}
                                      className={`w-6 h-6 rounded text-white font-bold transition ${
                                        isSubmitted
                                          ? "bg-green-500 hover:bg-green-600"
                                          : "bg-gray-400 hover:bg-gray-500"
                                      }`}
                                    >
                                      {isSubmitted ? "✓" : "✗"}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                No students in this class
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

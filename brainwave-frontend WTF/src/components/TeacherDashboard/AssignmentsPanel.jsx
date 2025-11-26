import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AssignmentsPanel = ({ token, teacherId }) => {
  const [selectedClass, setSelectedClass] = useState('Web Security BCA 5B');
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [isAddingAssignment, setIsAddingAssignment] = useState(false);
  const [viewingSubmissions, setViewingSubmissions] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: '',
    file: null,
    fileName: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(false);

  const classes = ['Web Security BCA 5B', 'Web Security Lab BCA 5B'];

  useEffect(() => {
    loadAssignments();
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const loadAssignments = async () => {
    try {
      setLoading(true);
      // ✅ Fetch from backend
      const response = await axios.get(`${API_URL}/api/teacher/assignments/${selectedClass}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data || []);
    } catch (error) {
      console.error('Error loading assignments:', error);
      // Fallback to localStorage
      const savedKey = `assignments_${selectedClass}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        try {
          setAssignments(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading from localStorage:', e);
          setAssignments([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, DOCX, and Excel files are allowed');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAssignment(prev => ({
          ...prev,
          file: reader.result,
          fileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAssignment = async () => {
    if (!newAssignment.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!newAssignment.dueDate) {
      alert('Please select a due date');
      return;
    }

    try {
      setLoading(true);
      setSaveError('');

      // ✅ Send to backend
      await axios.post(
        `${API_URL}/api/teacher/assignments`,
        {
          teacherId,
          classId: selectedClass,
          title: newAssignment.title,
          description: newAssignment.description,
          dueDate: newAssignment.dueDate,
          fileUrl: newAssignment.file,
          fileName: newAssignment.fileName
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reload assignments
      await loadAssignments();

      setNewAssignment({
        title: '',
        description: '',
        dueDate: '',
        totalMarks: '',
        file: null,
        fileName: ''
      });
      setIsAddingAssignment(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating assignment:', error);
      setSaveError(error.response?.data?.message || 'Failed to create assignment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        setLoading(true);
        // Note: Backend doesn't have delete endpoint yet, so using localStorage
        const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
        setAssignments(updatedAssignments);

        const savedKey = `assignments_${selectedClass}`;
        localStorage.setItem(savedKey, JSON.stringify(updatedAssignments));
      } catch (error) {
        console.error('Error deleting assignment:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownload = (assignment) => {
    if (assignment.file) {
      const link = document.createElement('a');
      link.href = assignment.file;
      link.download = assignment.fileName || 'assignment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return '📕';
    if (ext === 'docx' || ext === 'doc') return '📘';
    if (ext === 'xlsx' || ext === 'xls') return '📗';
    return '📄';
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Assignments</h2>

      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded-lg">
          ✓ Assignment created successfully on backend!
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-lg">
          ✗ {saveError}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 mr-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {!isAddingAssignment ? (
          <button
            onClick={() => setIsAddingAssignment(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold mt-6"
          >
            + Create Assignment
          </button>
        ) : null}
      </div>

      {isAddingAssignment && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Create New Assignment</h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Assignment Title"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <textarea
              placeholder="Description"
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-20"
            />

            <input
              type="date"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload File</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.xlsx,.xls"
                className="w-full"
              />
              {newAssignment.fileName && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">📎 {newAssignment.fileName}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddAssignment}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
              <button
                onClick={() => {
                  setIsAddingAssignment(false);
                  setNewAssignment({ title: '', description: '', dueDate: '', totalMarks: '', file: null, fileName: '' });
                }}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && assignments.length === 0 ? (
          <div className="col-span-2 text-center py-8">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
            No assignments created yet
          </div>
        ) : (
          assignments.map(assignment => (
            <div key={assignment.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{assignment.title}</h3>
                <button
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="text-red-600 hover:text-red-700 text-xl"
                >
                  ✕
                </button>
              </div>

              {assignment.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{assignment.description}</p>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-semibold ${isOverdue(assignment.dueDate) ? 'text-red-600' : 'text-green-600'}`}>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
                {assignment.fileName && (
                  <button
                    onClick={() => handleDownload(assignment)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                  >
                    {getFileIcon(assignment.fileName)} Download
                  </button>
                )}
              </div>

              <button
                onClick={() => setViewingSubmissions(assignment)}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                View Submissions
              </button>
            </div>
          ))
        )}
      </div>

      {viewingSubmissions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Submissions for {viewingSubmissions.title}</h3>
              <button
                onClick={() => setViewingSubmissions(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {viewingSubmissions.submissions && viewingSubmissions.submissions.length > 0 ? (
              <div className="space-y-3">
                {viewingSubmissions.submissions.map((sub, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{sub.studentName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Roll No: {sub.rollNo}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Submitted: {new Date(sub.submittedDate).toLocaleString()}</p>
                    {sub.marks && (
                      <p className="text-sm text-green-600 dark:text-green-400">Marks: {sub.marks}/{viewingSubmissions.totalMarks || 100}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No submissions yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPanel;

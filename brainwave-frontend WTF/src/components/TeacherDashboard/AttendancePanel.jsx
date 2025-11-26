import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AttendancePanel = ({ token, teacherId }) => {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('Web Security BCA 5B');
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const classes = ['Web Security BCA 5B', 'Web Security Lab BCA 5B'];

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    loadSavedAttendance();
  }, [selectedDate, selectedClass, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Students loaded:', response.data);
      setStudents(response.data || []);
    } catch (error) {
      console.error('❌ Error:', error.response || error);
      alert(`Error loading students: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedAttendance = () => {
    const savedKey = `attendance_${selectedClass}_${selectedDate}`;
    const saved = localStorage.getItem(savedKey);
    if (saved) {
      try {
        setAttendanceData(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved attendance:', e);
        initializeAttendanceData();
      }
    } else {
      initializeAttendanceData();
    }
  };

  const initializeAttendanceData = () => {
    const initialAttendance = {};
    students.forEach(student => {
      initialAttendance[student.roll_no] = '';
    });
    setAttendanceData(initialAttendance);
  };

  const handleAttendanceChange = (rollNo, status) => {
    setAttendanceData(prev => ({ ...prev, [rollNo]: status }));
  };

  const handleNoClass = () => {
    const noClassData = {};
    students.forEach(student => {
      noClassData[student.roll_no] = 'no_class';
    });
    setAttendanceData(noClassData);
  };

  const handleMarkAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.roll_no] = 'present';
    });
    setAttendanceData(allPresent);
  };

  const handleSaveAttendance = async () => {
    try {
      setLoading(true);
      setSaveError('');

      const records = Object.entries(attendanceData)
        .filter(([_, status]) => status !== '')
        .map(([rollNo, status]) => ({ rollNo, status }));

      if (records.length === 0) {
        alert('Please mark attendance for at least one student');
        return;
      }

      // ✅ Save to backend using POST /api/teacher/attendance/mark
      await axios.post(
        `${API_URL}/api/teacher/attendance/mark`,
        {
          teacherId,
          classId: selectedClass,
          date: selectedDate,
          records
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Also save to localStorage for offline access
      const savedKey = `attendance_${selectedClass}_${selectedDate}`;
      localStorage.setItem(savedKey, JSON.stringify(attendanceData));

      const metadataKey = `attendance_metadata`;
      const existingMetadata = JSON.parse(localStorage.getItem(metadataKey) || '[]');
      const newEntry = {
        class: selectedClass,
        date: selectedDate,
        timestamp: new Date().toISOString(),
        studentCount: students.length,
        markedCount: records.length
      };

      const filtered = existingMetadata.filter(
        item => !(item.class === selectedClass && item.date === selectedDate)
      );
      filtered.push(newEntry);
      localStorage.setItem(metadataKey, JSON.stringify(filtered));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveError(error.response?.data?.message || 'Failed to save attendance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Attendance Management</h2>

      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded-lg">
          ✓ Attendance saved successfully to backend!
        </div>
      )}

      {saveError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-lg">
          ✗ {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
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

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            Mark All Present
          </button>
          <button
            onClick={handleNoClass}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            No Class
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 overflow-x-auto">
        {loading && students.length === 0 ? (
          <div className="text-center py-8">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">No students found in database.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-gray-100">Roll No</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-gray-100">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-gray-100">College ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-gray-100">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{student.roll_no}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{student.name}</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{student.college_id}</td>
                  <td className="px-4 py-3">
                    <select
                      value={attendanceData[student.roll_no] || ''}
                      onChange={(e) => handleAttendanceChange(student.roll_no, e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    >
                      <option value="">Select</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Total Students: {students.length} • Marked: {Object.values(attendanceData).filter(v => v !== '').length}
        </p>
        <button
          onClick={handleSaveAttendance}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>
    </div>
  );
};

export default AttendancePanel;

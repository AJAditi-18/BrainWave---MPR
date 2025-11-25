import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LeaderboardPanel = ({ token }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const CLASS_ID = 'BCA-5B';

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      // Using the exact leaderboard route from your backend
      const response = await axios.get(`${API_URL}/api/teacher/leaderboard/${CLASS_ID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Leaderboard data:', response.data);
      setLeaderboard(response.data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter(student =>
    student.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.Roll_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Class Leaderboard - BCA 5B
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-md text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Roll No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Avg Marks</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Attendance</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Assignments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLeaderboard.length > 0 ? (
                  filteredLeaderboard.map((student, index) => {
                    const isTopThree = index < 3;
                    const attendancePercent = student.total_lectures > 0 
                      ? Math.round((student.presents / student.total_lectures) * 100) 
                      : 0;
                    
                    return (
                      <tr
                        key={student.Roll_no}
                        className={`transition-colors ${
                          isTopThree
                            ? 'bg-yellow-50 dark:bg-yellow-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                            {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                            {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.Roll_no}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{student.Name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {student.avg_marks ? Math.round(student.avg_marks) : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {attendancePercent}% ({student.presents}/{student.total_lectures})
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {student.assignments_done || 0}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No results found' : 'No leaderboard data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      {filteredLeaderboard.length > 0 && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredLeaderboard.length}</span> students
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPanel;

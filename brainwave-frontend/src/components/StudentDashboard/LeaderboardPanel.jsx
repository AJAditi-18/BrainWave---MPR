import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaderboardPanel = ({ data }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Scrape directly from ipuranklist.com
      const response = await axios.get('https://www.ipuranklist.com/ranklist/bca');
      const htmlContent = response.data;
      
      // Parse HTML using DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const rows = doc.querySelectorAll('table tbody tr');
      
      const students = [];
      rows.forEach((row) => {
        const cols = row.querySelectorAll('td');
        if (cols.length >= 4) {
          students.push({
            rank: parseInt(cols[0].textContent.trim()) || 0,
            name: cols[1].textContent.trim(),
            college: cols[2].textContent.trim(),
            gpa: parseFloat(cols[3].textContent.trim()) || 0,
          });
        }
      });
      
      setLeaderboard(students);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard. This may be due to CORS restrictions. Using sample data instead.');
      
      // Fallback to sample data if scraping fails due to CORS
      setLeaderboard(generateSampleData());
    } finally {
      setLoading(false);
    }
  };

  // Sample data generator for demo purposes
  const generateSampleData = () => {
    const sampleColleges = [
      'MSIT', 'VIPS', 'JIMS', 'MAIT', 'BPIT', 'BVCOE', 'GTBIT', 'NSIT', 'DTU', 'IIIT Delhi'
    ];
    
    const sampleNames = [
      'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Neha Gupta', 'Vikram Patel',
      'Anjali Verma', 'Rohan Mehta', 'Sneha Reddy', 'Arjun Kapoor', 'Kavya Iyer',
      data.name // Include current user
    ];

    return sampleNames.slice(0, 20).map((name, index) => ({
      rank: index + 1,
      name: name,
      college: sampleColleges[Math.floor(Math.random() * sampleColleges.length)],
      gpa: parseFloat((9.5 - (index * 0.1) + Math.random() * 0.2).toFixed(2)),
    })).sort((a, b) => b.gpa - a.gpa).map((student, index) => ({
      ...student,
      rank: index + 1
    }));
  };

  // Filter by search term
  const filteredLeaderboard = leaderboard.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find current user's rank
  const userRank = leaderboard.find(s => 
    s.name.toLowerCase() === data.name.toLowerCase()
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">IPU BCA Leaderboard</h2>
        <button
          onClick={fetchLeaderboard}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-400 rounded-lg">
          <p className="font-semibold">⚠️ Note</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* User's Rank Card */}
      {userRank && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Your Rank</p>
              <p className="text-4xl font-bold">#{userRank.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">GPA</p>
              <p className="text-3xl font-bold">{userRank.gpa.toFixed(2)}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or college..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  College
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  GPA
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLeaderboard.length > 0 ? (
                filteredLeaderboard.map((student, index) => {
                  const isCurrentUser = student.name.toLowerCase() === data.name.toLowerCase();
                  const isTopThree = student.rank <= 3;
                  
                  return (
                    <tr
                      key={index}
                      className={`transition-colors ${
                        isCurrentUser 
                          ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold' 
                          : isTopThree
                          ? 'bg-yellow-50 dark:bg-yellow-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {student.rank === 1 && (
                            <span className="text-2xl mr-2">🥇</span>
                          )}
                          {student.rank === 2 && (
                            <span className="text-2xl mr-2">🥈</span>
                          )}
                          {student.rank === 3 && (
                            <span className="text-2xl mr-2">🥉</span>
                          )}
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            #{student.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {student.name}
                          {isCurrentUser && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {student.college}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {student.gpa.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No results found' : 'No leaderboard data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

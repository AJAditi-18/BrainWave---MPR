import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Dummy marks data
const marksList = [
  { name: "Ananya Singh", marks: 95 },
  { name: "Rahul Kumar", marks: 91 },
  { name: "Priya Patel", marks: 88 },
  { name: "Sunil Joshi", marks: 85 },
  { name: "Amit Kumar", marks: 81 },
  { name: "Nisha Verma", marks: 79 },
  { name: "Rohan Mishra", marks: 74 }
];

// Sorted for leaderboard
const rankList = [...marksList].sort((a, b) => b.marks - a.marks);
const topThree = rankList.slice(0, 3);

const MarksLeaderboard = () => (
  <div className="min-h-screen flex items-center justify-center bg-brainwave-bg px-2 py-8">
    <div className="bg-brainwave-primary-glass rounded-2xl shadow-brainwave max-w-3xl w-full p-10 flex flex-col items-center">

      {/* Leaderboard Top 3 */}
      <h2 className="text-2xl font-extrabold text-brainwave-secondary mb-4 text-center">
        Leaderboard - Top 3
      </h2>
      <div className="flex flex-wrap gap-6 justify-center mb-8">
        {topThree.map((student, idx) => (
          <div key={student.name} className="bg-white rounded-xl px-5 py-4 text-center shadow font-semibold w-40">
            <div className={`text-xl font-bold ${idx === 0 ? "text-yellow-400" : idx === 1 ? "text-gray-400" : "text-orange-400"}`}>
              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
            </div>
            <div className="font-bold text-brainwave-primary text-lg">{student.name}</div>
            <div className="text-brainwave-secondary text-xl font-bold mt-2">{student.marks} Marks</div>
            <div className="font-bold text-xs text-brainwave-primary mt-2">Rank {idx + 1}</div>
          </div>
        ))}
      </div>

      {/* Full Rank List Table */}
      <h3 className="text-brainwave-secondary text-xl font-bold mb-3 mt-5">Rank List</h3>
      <table className="w-full bg-white rounded-lg overflow-hidden mb-8">
        <thead>
          <tr>
            <th className="p-3 text-left text-brainwave-primary">Rank</th>
            <th className="p-3 text-left text-brainwave-primary">Name</th>
            <th className="p-3 text-left text-brainwave-primary">Marks</th>
          </tr>
        </thead>
        <tbody>
          {rankList.map((student, i) => (
            <tr key={student.name} className="border-t border-brainwave-primary/10">
              <td className="p-3 text-brainwave-primary font-bold">{i + 1}</td>
              <td className="p-3 text-brainwave-secondary">{student.name}</td>
              <td className="p-3 font-bold text-brainwave-accent">{student.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Graph (Bar Chart of Marks) */}
      <h3 className="text-brainwave-secondary text-xl font-bold mb-4">Marks Distribution</h3>
      <div className="w-full h-64 bg-white rounded-xl px-5 py-4 mb-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={rankList}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="marks" fill="#67e8f9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default MarksLeaderboard;

import React from 'react';
import Card from '../common/card';

const Leaderboard = ({ ranks }) => (
  <Card className="mt-4">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Leaderboard</h3>
    <ul>
      {ranks.map((student, idx) => (
        <li key={student.id} className="flex justify-between items-center py-2 border-b last:border-none">
          <span className="font-bold text-gray-700">{idx + 1}.</span>
          <span>{student.name}</span>
          <span className="text-brainwave-primary">{student.score}</span>
        </li>
      ))}
    </ul>
  </Card>
);

export default Leaderboard;

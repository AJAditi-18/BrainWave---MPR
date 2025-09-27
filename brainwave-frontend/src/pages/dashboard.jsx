import React from 'react';
import Navbar from "../components/Layout/navbar";
import ExamCountdown from '../components/Dashboard/ExamCountdown';
import Leaderboard from '../components/Dashboard/leaderboard';

const sampleExams = [
  { id: 1, title: "Computer Graphics Assignment", subject: "CG", date: "2025-10-15T14:00:00", location: "Online" },
  { id: 2, title: "Operating Systems Exam", subject: "OS", date: "2025-10-17T09:00:00", location: "Room 309" }
];

const sampleLeaderboard = [
  { id: 1, name: "Luna", score: 98 },
  { id: 2, name: "Annabeth", score: 92 },
  { id: 3, name: "Percy", score: 89 }
];

const Dashboard = () => (
  <>
    <Navbar />
    <div className="max-w-4xl mx-auto mt-8">
      <ExamCountdown exams={sampleExams} />
      <Leaderboard ranks={sampleLeaderboard} />
    </div>
  </>
);

export default Dashboard;

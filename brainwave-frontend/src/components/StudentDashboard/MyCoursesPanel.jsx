import React from 'react';

const MyCoursesPanel = ({ data }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="text-gray-600">
          Course: <span className="font-bold text-gray-800">{data.course}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Section: <span className="font-bold text-gray-800">{data.section}</span>
        </p>
        <p className="text-gray-500 mt-4 text-sm">
          Note: Assignments, marks, and detailed course info will be available once your teacher uploads them.
        </p>
      </div>
    </div>
  );
};

export default MyCoursesPanel;

import React from 'react';

const LibraryPanel = ({ data }) => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Library</h2>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md dark:shadow-gray-900/50">
        <p className="text-gray-600 dark:text-gray-300">
          This section will display notes, books, and study materials shared by your teachers.
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
          Coming soon: Access to course materials, e-books, and lecture notes.
        </p>
      </div>
    </div>
  );
};

export default LibraryPanel;

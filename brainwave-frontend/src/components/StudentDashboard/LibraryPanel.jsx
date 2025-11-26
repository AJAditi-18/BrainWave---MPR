// LibraryPanel.jsx
import React, { useState, useRef } from 'react';

const LibraryPanel = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Web Security - OWASP Top 10',
      subject: 'Web Security',
      uploadedDate: new Date('2025-11-20'),
      size: '2.4 MB',
      fileData: 'sample_web_security_notes'
    },
    {
      id: 2,
      title: 'Linux - Shell Scripting',
      subject: 'OS and Linux',
      uploadedDate: new Date('2025-11-18'),
      size: '1.8 MB',
      fileData: 'sample_linux_notes'
    },
    {
      id: 3,
      title: 'Computer Graphics - 3D Rendering',
      subject: 'Computer Graphics',
      uploadedDate: new Date('2025-11-15'),
      size: '3.2 MB',
      fileData: 'sample_graphics_notes'
    }
  ]);

  const subjects = ['Web Security', 'OS and Linux', 'Computer Graphics', 'Cloud Computing', 'Machine Learning'];
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');
  const [selectedUploadSubject, setSelectedUploadSubject] = useState(subjects[0]);
  const fileInputRef = useRef(null);

  const filteredNotes = selectedSubjectFilter === 'All'
    ? notes
    : notes.filter(note => note.subject === selectedSubjectFilter);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newNote = {
        id: notes.length + 1,
        title: file.name.replace(/\.[^/.]+$/, ''),
        subject: selectedUploadSubject,
        uploadedDate: new Date(),
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        fileData: file.name
      };
      setNotes([newNote, ...notes]);
      alert('✅ File uploaded successfully to ' + selectedUploadSubject + '!');
    }
  };

  const handleDownload = (note) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`${note.title}\n\nSubject: ${note.subject}\nUploaded: ${note.uploadedDate.toLocaleDateString()}`));
    element.setAttribute('download', `${note.title}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
      alert('✅ Note deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📚 Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload your notes and manage digital resources
          </p>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: NOTES SECTION */}
          <div className="lg:col-span-2">
            {/* NOTES HEADER */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📝 Study Notes
                </h2>
                <div className="flex gap-2 items-center flex-wrap">
                  <select
                    value={selectedUploadSubject}
                    onChange={(e) => setSelectedUploadSubject(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map(subj => (
                      <option value={subj} key={subj}>{subj}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleUploadClick}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                  >
                    📤 Upload
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.txt,.xlsx"
                  />
                </div>
              </div>

              {/* SUBJECT FILTER */}
              <div className="mb-6 flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedSubjectFilter('All')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedSubjectFilter === 'All'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                {subjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubjectFilter(subject)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedSubjectFilter === subject
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>

              {/* NOTES LIST */}
              {filteredNotes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">📭 No notes found for this subject</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotes.map(note => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{note.title}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <span>📚 {note.subject}</span>
                          <span>📦 {note.size}</span>
                          <span>📅 {note.uploadedDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleDownload(note)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all"
                          title="Download"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: PHYSICAL LIBRARY BOOKS STATUS */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📖 Physical Books Status</h2>
            
            <div className="space-y-6">
              {/* BOOKS ISSUED */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">📚</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Books Issued</h3>
                    <p className="text-green-600 dark:text-green-400 text-2xl font-bold">3</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    ✅ All books are in good condition
                  </p>
                </div>
              </div>

              {/* OVERDUE BOOKS */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">⚠️</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Overdue Books</h3>
                    <p className="text-red-600 dark:text-red-400 text-2xl font-bold">1</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2">
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                    ⚠️ "Cloud Computing Essentials" - 7 days overdue. Please return immediately!
                  </p>
                </div>
              </div>

              {/* SOON TO BE RETURNED */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">⏰</span>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Soon to Return</h3>
                    <p className="text-yellow-600 dark:text-yellow-400 text-2xl font-bold">1</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-3 py-2">
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    ⏰ "Machine Learning Fundamentals" - 3 days left to return
                  </p>
                </div>
              </div>

              {/* SUMMARY CARD */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">📊 Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-gray-700 rounded">
                    <span className="text-gray-600 dark:text-gray-300">Total Issued</span>
                    <span className="font-bold text-gray-900 dark:text-white">3</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-gray-700 rounded">
                    <span className="text-gray-600 dark:text-gray-300">On Time</span>
                    <span className="font-bold text-gray-900 dark:text-white">2</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-gray-700 rounded">
                    <span className="text-gray-600 dark:text-gray-300">Fine Pending</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹70</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-gray-700 rounded">
                    <span className="text-gray-600 dark:text-gray-300">Notes Uploaded</span>
                    <span className="font-bold text-gray-900 dark:text-white">{notes.length}</span>
                  </div>
                </div>
              </div>

              {/* INFO CARD */}
              <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ℹ️ <span className="font-semibold">Library Info:</span> You can issue up to 5 books at a time. Books can be retained for 14 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPanel;

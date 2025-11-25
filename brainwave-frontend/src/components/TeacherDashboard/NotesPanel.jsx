import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NotesPanel = ({ token, teacherId }) => {
  const [selectedClass, setSelectedClass] = useState('Web Security BCA 5B');
  const [notes, setNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    subject: '',
    file: null,
    fileName: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(false);

  const classes = ['Web Security BCA 5B', 'Web Security Lab BCA 5B'];

  useEffect(() => {
    loadNotes();
  }, [selectedClass]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      // ✅ Fetch from backend
      const response = await axios.get(`${API_URL}/api/teacher/notes/${selectedClass}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
      // Fallback to localStorage
      const savedKey = `notes_${selectedClass}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        try {
          setNotes(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading from localStorage:', e);
          setNotes([]);
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
        setNewNote(prev => ({
          ...prev,
          file: reader.result,
          fileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim()) {
      alert('Please enter a title');
      return;
    }

    try {
      setLoading(true);
      setSaveError('');

      // ✅ Send to backend
      await axios.post(
        `${API_URL}/api/teacher/notes`,
        {
          teacherId,
          classId: selectedClass,
          title: newNote.title,
          description: newNote.description,
          fileUrl: newNote.file,
          fileName: newNote.fileName,
          isBook: false
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Reload notes
      await loadNotes();

      setNewNote({
        title: '',
        description: '',
        subject: '',
        file: null,
        fileName: ''
      });
      setIsAddingNote(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating note:', error);
      setSaveError(error.response?.data?.message || 'Failed to upload note.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        // Note: Backend doesn't have delete endpoint yet, so using localStorage
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);

        const savedKey = `notes_${selectedClass}`;
        localStorage.setItem(savedKey, JSON.stringify(updatedNotes));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleDownload = (note) => {
    if (note.file) {
      const link = document.createElement('a');
      link.href = note.file;
      link.download = note.fileName || 'note';
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

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Notes Library</h2>

      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded-lg">
          ✓ Note uploaded successfully to backend!
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

        {!isAddingNote ? (
          <button
            onClick={() => setIsAddingNote(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold mt-6"
          >
            + Upload Note
          </button>
        ) : null}
      </div>

      {isAddingNote && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Upload New Note</h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <textarea
              placeholder="Description"
              value={newNote.description}
              onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-20"
            />

            <input
              type="text"
              placeholder="Subject (e.g., Chapter 1, Basics)"
              value={newNote.subject}
              onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
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
              {newNote.fileName && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">📎 {newNote.fileName}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddNote}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload Note'}
              </button>
              <button
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote({ title: '', description: '', subject: '', file: null, fileName: '' });
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
        {loading && notes.length === 0 ? (
          <div className="col-span-2 text-center py-8">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
            No notes uploaded yet
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{note.title}</h3>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-600 hover:text-red-700 text-xl"
                >
                  ✕
                </button>
              </div>

              {note.subject && (
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">📚 {note.subject}</p>
              )}

              {note.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{note.description}</p>
              )}

              {note.fileName && (
                <button
                  onClick={() => handleDownload(note)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                >
                  {getFileIcon(note.fileName)} Download
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesPanel;

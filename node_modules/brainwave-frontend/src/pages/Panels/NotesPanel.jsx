import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function NotesPanel({
  isDark, classSubjectOptions, notesByClass, setNotesByClass,
  notesFormClass, setNotesFormClass, newNote, setNewNote
}) {
  const addNote = (e) => {
    e.preventDefault();
    if (!newNote.title) return;

    setNotesByClass((prev) => ({
      ...prev,
      [notesFormClass]: [
        ...(prev[notesFormClass] || []),
        {
          id: Date.now(),
          title: newNote.title,
          date: new Date().toISOString().split("T")[0],
        },
      ],
    }));
    setNewNote({ title: "" });
  };

  const deleteNote = (classKey, noteId) => {
    setNotesByClass((prev) => ({
      ...prev,
      [classKey]: prev[classKey].filter((n) => n.id !== noteId),
    }));
  };

  return (
    <div className="space-y-6">
      <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
        <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          Upload New Note
        </h3>
        <form onSubmit={addNote} className="space-y-4">
          <select
            value={notesFormClass}
            onChange={(e) => setNotesFormClass(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
          >
            {classSubjectOptions.map((opt) => (
              <option key={opt.classKey} value={opt.classKey}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Note Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"}`}
            required
          />
          <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-600">
            Upload Note
          </button>
        </form>
      </div>

      {classSubjectOptions.map((opt) => (
        <div key={opt.classKey} className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
          <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
            {opt.label}
          </h3>
          {notesByClass[opt.classKey] && notesByClass[opt.classKey].length > 0 ? (
            <div className="space-y-3">
              {notesByClass[opt.classKey].map((note) => (
                <div
                  key={note.id}
                  className={`p-4 border rounded-lg flex justify-between items-center ${isDark ? "bg-gray-700 border-gray-600 hover:bg-gray-600" : "bg-gray-50 border-gray-300 hover:bg-gray-100"}`}
                >
                  <div className="flex-1">
                    <div className={`font-bold ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>{note.title}</div>
                    <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Uploaded: {note.date}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNote(opt.classKey, note.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
              No notes yet
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

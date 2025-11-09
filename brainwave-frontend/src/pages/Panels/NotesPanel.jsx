import React, { useState } from "react";
import { 
  TrashIcon, 
  PaperClipIcon, 
  XMarkIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";

export default function NotesPanel({
  isDark,
  classSubjectOptions,
  notesByClass,
  setNotesByClass,
  notesFormClass,
  setNotesFormClass,
  newNote,
  setNewNote,
  digitalLibrary,
  setDigitalLibrary,
}) {
  const [attachments, setAttachments] = useState([]);
  const [publishAsBook, setPublishAsBook] = useState(false);

  const addNote = (e) => {
    e.preventDefault();
    if (!newNote.title) return;

    const noteData = {
      id: Date.now(),
      title: newNote.title,
      date: new Date().toISOString().split("T")[0],
      attachments: attachments,
      isPublished: publishAsBook,
      publishedDate: publishAsBook ? new Date().toISOString().split("T")[0] : null,
    };

    // Add to notes
    setNotesByClass((prev) => ({
      ...prev,
      [notesFormClass]: [...(prev[notesFormClass] || []), noteData],
    }));

    // Add to digital library if published as book
    if (publishAsBook) {
      const classLabel = classSubjectOptions.find(
        (opt) => opt.classKey === notesFormClass
      )?.label || "Unknown Class";

      setDigitalLibrary((prev) => [
        ...prev,
        {
          id: noteData.id,
          title: newNote.title,
          author: "Teacher",
          subject: classLabel,
          type: "Digital Book",
          status: "available",
          addedDate: new Date().toISOString().split("T")[0],
          attachments: attachments,
          pages: Math.ceil(attachments.length * 10 + 50), // Estimate pages
        },
      ]);
    }

    // Reset form
    setNewNote({ title: "" });
    setAttachments([]);
    setPublishAsBook(false);
  };

  const deleteNote = (classKey, noteId) => {
    setNotesByClass((prev) => ({
      ...prev,
      [classKey]: prev[classKey].filter((n) => n.id !== noteId),
    }));

    // Also remove from digital library if published
    setDigitalLibrary((prev) =>
      prev.filter((book) => book.id !== noteId)
    );
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileSize = (file.size / 1024 / 1024).toFixed(2);

      const newAttachment = {
        id: Date.now() + i,
        name: file.name,
        size: fileSize,
        type: file.type,
        icon: getFileIcon(file.name),
      };

      setAttachments((prev) => [...prev, newAttachment]);
    }

    e.target.value = "";
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return "📄";
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "🖼️";
    if (["mp4", "avi", "mov"].includes(ext)) return "🎬";
    if (["mp3", "wav", "m4a"].includes(ext)) return "🎵";
    if (["zip", "rar", "7z"].includes(ext)) return "📦";
    return "📎";
  };

  const formatFileSize = (sizeMB) => {
    if (sizeMB < 1) return (sizeMB * 1024).toFixed(2) + " KB";
    return sizeMB + " MB";
  };

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">📝 Notes</h1>

      {/* Add Note Form */}
      <div className={`p-6 rounded-lg shadow-md mb-6 ${isDark ? "bg-gray-700" : "bg-white"}`}>
        <h2 className="text-xl font-bold mb-4">Add New Note</h2>

        <form onSubmit={addNote} className="space-y-4">
          {/* Class/Subject Selection */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Select Class/Subject
            </label>
            <select
              value={notesFormClass}
              onChange={(e) => setNotesFormClass(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDark
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {classSubjectOptions.map((option) => (
                <option key={option.classKey} value={option.classKey}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Note Title */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Note Title
            </label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({ title: e.target.value })}
              placeholder="Enter note title..."
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDark
                  ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* File Attachment Input */}
          <div>
            <label
              className={`block text-sm font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              📎 Attachments (Optional)
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                isDark
                  ? "border-gray-600 hover:border-blue-500 hover:bg-gray-600"
                  : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <PaperClipIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-semibold">Click to upload or drag and drop</p>
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  PDF, DOC, Images, Videos, Audio - Max 50MB per file
                </p>
              </label>
            </div>
          </div>

          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className={`p-4 rounded-lg ${isDark ? "bg-gray-600" : "bg-gray-100"}`}>
              <h3 className="font-semibold mb-3">📦 Attached Files ({attachments.length})</h3>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={`flex items-center justify-between p-3 rounded ${
                      isDark ? "bg-gray-700" : "bg-white"
                    } border`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{attachment.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{attachment.name}</p>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publish as Book Checkbox */}
          <div
            className={`p-4 rounded-lg border-2 cursor-pointer transition ${
              publishAsBook
                ? isDark
                  ? "border-green-500 bg-green-900 bg-opacity-20"
                  : "border-green-500 bg-green-50"
                : isDark
                ? "border-gray-600"
                : "border-gray-300"
            }`}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={publishAsBook}
                onChange={(e) => setPublishAsBook(e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <div className="flex-1">
                <p className="font-semibold flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5" />
                  📚 Publish as Digital Book
                </p>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Make this available in the Digital Library for students to access
                </p>
              </div>
              {publishAsBook && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!newNote.title}
            className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition ${
              newNote.title
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            {publishAsBook ? "✅ Add Note & Publish as Book" : "✅ Add Note"}
          </button>
        </form>
      </div>

      {/* Published Books Info */}
      {digitalLibrary && digitalLibrary.length > 0 && (
        <div
          className={`p-4 rounded-lg shadow-md mb-6 border-l-4 border-green-600 ${
            isDark ? "bg-green-900 bg-opacity-20" : "bg-green-50"
          }`}
        >
          <p className="font-semibold text-green-700 flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5" />
            📚 {digitalLibrary.length} Digital Book(s) Published
          </p>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            These notes are now available in the Digital Library section for students
          </p>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {classSubjectOptions.map((option) => {
          const notes = notesByClass[option.classKey] || [];
          if (notes.length === 0) return null;

          return (
            <div
              key={option.classKey}
              className={`p-4 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}
            >
              <h3 className="font-bold text-lg mb-3">{option.label}</h3>
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      note.isPublished
                        ? isDark
                          ? "border-green-600 bg-green-900 bg-opacity-10"
                          : "border-green-600 bg-green-50"
                        : isDark
                        ? "border-blue-600 bg-blue-900 bg-opacity-10"
                        : "border-blue-600 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg">{note.title}</p>
                          {note.isPublished && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded font-semibold flex items-center gap-1">
                              <BookOpenIcon className="h-3 w-3" />
                              Published
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          📅 {new Date(note.date).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteNote(option.classKey, note.id)}
                        className={`ml-2 p-2 rounded transition ${
                          isDark
                            ? "text-red-400 hover:bg-gray-600"
                            : "text-red-500 hover:bg-red-50"
                        }`}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Attachments Display */}
                    {note.attachments && note.attachments.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold mb-2">
                          📎 Attachments ({note.attachments.length})
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {note.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className={`p-2 rounded flex items-center gap-2 text-sm ${
                                isDark ? "bg-gray-600" : "bg-white border"
                              }`}
                            >
                              <span className="text-lg">{attachment.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="truncate font-semibold text-xs">{attachment.name}</p>
                                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                  {formatFileSize(attachment.size)}
                                </p>
                              </div>
                              <a
                                href="#"
                                className="text-blue-500 hover:text-blue-700 font-semibold"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(`Download: ${attachment.name}`);
                                }}
                              >
                                ↓
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Object.keys(notesByClass).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No notes added yet!</p>
          </div>
        )}
      </div>
    </div>
  );
}

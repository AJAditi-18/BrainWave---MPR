import React from "react";
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function RemindersPanel({
  isDark, reminders, setReminders, newReminder, setNewReminder,
  editingReminder, setEditingReminder, editDraft, setEditDraft
}) {
  const addReminder = (e) => {
    e.preventDefault();
    if (!newReminder.title || !newReminder.date) return;
    setReminders([...reminders, { id: Date.now(), title: newReminder.title, date: newReminder.date }]);
    setNewReminder({ title: "", date: "" });
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const startEditReminder = (reminder) => {
    setEditingReminder(reminder.id);
    setEditDraft({ ...reminder });
  };

  const saveEditReminder = () => {
    setReminders(reminders.map((r) => (r.id === editingReminder ? editDraft : r)));
    setEditingReminder(null);
  };

  return (
    <div className="space-y-6">
      <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
        <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          Add New Reminder
        </h3>
        <form onSubmit={addReminder} className="space-y-4">
          <input
            type="text"
            placeholder="Reminder Title"
            value={newReminder.title}
            onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"}`}
            required
          />
          <input
            type="date"
            value={newReminder.date}
            onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg ${isDark ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
            required
          />
          <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-cyan-600">
            Add Reminder
          </button>
        </form>
      </div>

      <div className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-xl shadow`}>
        <h3 className={`font-bold text-lg mb-4 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          My Reminders
        </h3>
        {reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className={`p-4 border rounded-lg ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}>
                {editingReminder === reminder.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editDraft.title}
                      onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                      className={`w-full px-3 py-1 border rounded ${isDark ? "bg-gray-600 text-gray-100 border-gray-500" : "bg-white text-gray-900 border-gray-300"}`}
                    />
                    <input
                      type="date"
                      value={editDraft.date}
                      onChange={(e) => setEditDraft({ ...editDraft, date: e.target.value })}
                      className={`w-full px-3 py-1 border rounded ${isDark ? "bg-gray-600 text-gray-100 border-gray-500" : "bg-white text-gray-900 border-gray-300"}`}
                    />
                    <div className="flex gap-2">
                      <button onClick={saveEditReminder} className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        <CheckIcon className="h-4 w-4" /> Save
                      </button>
                      <button onClick={() => setEditingReminder(null)} className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                        <XMarkIcon className="h-4 w-4" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className={`font-bold ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
                        {reminder.title}
                      </div>
                      <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {reminder.date}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditReminder(reminder)} className="text-blue-500 hover:text-blue-700">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => deleteReminder(reminder.id)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-400"}`}>
            No reminders yet
          </div>
        )}
      </div>
    </div>
  );
}

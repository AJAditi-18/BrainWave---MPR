import React, { useState, useEffect } from 'react';

const RemindersPanel = ({ teacherId }) => {
  const [reminders, setReminders] = useState([]);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    priority: 'medium',
    addToCalendar: false
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = () => {
    const saved = localStorage.getItem(`reminders_${teacherId}`);
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading reminders:', e);
        setReminders([]);
      }
    }
  };

  const handleAddReminder = () => {
    if (!newReminder.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!newReminder.date) {
      alert('Please select a date');
      return;
    }

    const reminder = {
      id: Date.now(),
      ...newReminder,
      createdAt: new Date().toISOString()
    };

    const updatedReminders = [reminder, ...reminders];
    setReminders(updatedReminders);
    localStorage.setItem(`reminders_${teacherId}`, JSON.stringify(updatedReminders));

    // ✅ Add to calendar if checked
    if (newReminder.addToCalendar) {
      const calendarEvents = JSON.parse(localStorage.getItem('calendar_events') || '[]');
      const calendarEvent = {
        id: `reminder_${reminder.id}`,
        title: reminder.title,
        description: reminder.description,
        date: reminder.date,
        time: reminder.time,
        type: 'reminder',
        color: getPriorityColor(reminder.priority)
      };
      calendarEvents.push(calendarEvent);
      localStorage.setItem('calendar_events', JSON.stringify(calendarEvents));
    }

    setNewReminder({
      title: '',
      description: '',
      date: '',
      time: '',
      priority: 'medium',
      addToCalendar: false
    });
    setIsAddingReminder(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteReminder = (reminderId) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      const updatedReminders = reminders.filter(r => r.id !== reminderId);
      setReminders(updatedReminders);
      localStorage.setItem(`reminders_${teacherId}`, JSON.stringify(updatedReminders));

      // Remove from calendar if it was added
      const calendarEvents = JSON.parse(localStorage.getItem('calendar_events') || '[]');
      const filtered = calendarEvents.filter(e => e.id !== `reminder_${reminderId}`);
      localStorage.setItem('calendar_events', JSON.stringify(filtered));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[priority] || colors.medium;
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time || '00:00'}`);
    const dateB = new Date(`${b.date} ${b.time || '00:00'}`);
    return dateA - dateB;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Reminders</h2>
        <button
          onClick={() => setIsAddingReminder(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Reminder
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded-lg">
          ✓ Reminder added successfully{newReminder.addToCalendar && ' and added to calendar'}!
        </div>
      )}

      {/* Add Reminder Form */}
      {isAddingReminder && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Add New Reminder</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Grade Assignment 3"
                className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={newReminder.priority}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newReminder.description}
                onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details..."
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* ✅ Add to Calendar Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="addToCalendar"
                checked={newReminder.addToCalendar}
                onChange={(e) => setNewReminder(prev => ({ ...prev, addToCalendar: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="addToCalendar" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                Add to Calendar
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={handleAddReminder}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold"
            >
              Add Reminder
            </button>
            <button
              onClick={() => {
                setIsAddingReminder(false);
                setNewReminder({ title: '', description: '', date: '', time: '', priority: 'medium', addToCalendar: false });
              }}
              className="px-6 py-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-lg transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {sortedReminders.length > 0 ? (
          sortedReminders.map((reminder) => (
            <div key={reminder.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{reminder.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(reminder.priority)}`}>
                      {reminder.priority.toUpperCase()}
                    </span>
                    {reminder.addToCalendar && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                        📅 On Calendar
                      </span>
                    )}
                  </div>
                  
                  {reminder.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{reminder.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                    <span>📅 {new Date(reminder.date).toLocaleDateString()}</span>
                    {reminder.time && <span>🕐 {reminder.time}</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteReminder(reminder.id)}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-md text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No reminders yet</p>
            <p className="text-gray-500 dark:text-gray-500">Click "Add Reminder" to create one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersPanel;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const OverviewPanel = ({ data, token, teacherId, fetchOverview }) => {
  const teacher = data.teacher || {};
  const [isEditingTimetable, setIsEditingTimetable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [todayEvents, setTodayEvents] = useState([]);
  const [nextEvent, setNextEvent] = useState(null);
  const [todayClassCount, setTodayClassCount] = useState(0);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM'
  ];

  const createTimetableGrid = () => {
    const grid = {};
    days.forEach(day => {
      grid[day] = {};
      timeSlots.forEach(slot => {
        grid[day][slot] = { subject: '', class_name: '' };
      });
    });

    const savedTimetable = localStorage.getItem(`timetable_${teacherId}`);
    if (savedTimetable) {
      try {
        const parsed = JSON.parse(savedTimetable);
        parsed.forEach(entry => {
          if (grid[entry.day] && grid[entry.day][entry.time_slot]) {
            grid[entry.day][entry.time_slot] = {
              subject: entry.subject,
              class_name: entry.class_name
            };
          }
        });
        return grid;
      } catch (e) {
        console.error('Error loading saved timetable:', e);
      }
    }

    (data.timetable || []).forEach(entry => {
      if (grid[entry.day] && grid[entry.day][entry.time_slot]) {
        grid[entry.day][entry.time_slot] = {
          subject: entry.subject,
          class_name: entry.class_name
        };
      }
    });

    return grid;
  };

  const [timetableGrid, setTimetableGrid] = useState(createTimetableGrid());

  useEffect(() => {
    setTimetableGrid(createTimetableGrid());
  }, [data.timetable]);

  useEffect(() => {
    fetchStudentCount();
    loadTodayEvents();
    loadNextEvent();
    calculateTodayClasses();
  }, []);

  const fetchStudentCount = async () => {
    try {
      setLoadingStudents(true);
      const response = await axios.get(`${API_URL}/api/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentCount(response.data?.length || 0);
    } catch (error) {
      console.error('Error fetching student count:', error);
      setStudentCount(0);
    } finally {
      setLoadingStudents(false);
    }
  };

  const loadTodayEvents = () => {
    const today = new Date().toISOString().split('T')[0];
    const calendarEvents = JSON.parse(localStorage.getItem('calendar_events') || '[]');
    const eventsToday = calendarEvents.filter(event => event.date === today);
    setTodayEvents(eventsToday);
  };

  const loadNextEvent = () => {
    const now = new Date();

    // Get calendar events
    const calendarEvents = JSON.parse(localStorage.getItem('calendar_events') || '[]');
    const upcomingCalendarEvents = calendarEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now;
      })
      .map(event => ({
        ...event,
        source: 'calendar',
        dateTime: new Date(`${event.date} ${event.time || '00:00'}`)
      }));

    // Get reminders
    const reminders = JSON.parse(localStorage.getItem(`reminders_${teacherId}`) || '[]');
    const upcomingReminders = reminders
      .filter(reminder => {
        const reminderDate = new Date(`${reminder.date} ${reminder.time || '00:00'}`);
        return reminderDate >= now;
      })
      .map(reminder => ({
        title: reminder.title,
        date: reminder.date,
        time: reminder.time,
        type: 'reminder',
        source: 'reminder',
        priority: reminder.priority,
        dateTime: new Date(`${reminder.date} ${reminder.time || '00:00'}`)
      }));

    // Combine and sort
    const allUpcoming = [...upcomingCalendarEvents, ...upcomingReminders]
      .sort((a, b) => a.dateTime - b.dateTime);

    setNextEvent(allUpcoming[0] || null);
  };

  const calculateTodayClasses = () => {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today.getDay()];

    const savedTimetable = localStorage.getItem(`timetable_${teacherId}`);
    let count = 0;

    if (savedTimetable) {
      try {
        const parsed = JSON.parse(savedTimetable);
        count = parsed.filter(entry => entry.day === todayName && entry.subject).length;
      } catch (e) {
        console.error('Error calculating classes:', e);
      }
    }

    setTodayClassCount(count);
  };

  const handleCellChange = (day, timeSlot, field, value) => {
    setTimetableGrid(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: {
          ...prev[day][timeSlot],
          [field]: value
        }
      }
    }));
  };

  const handleSaveTimetable = async () => {
    try {
      setSaving(true);
      
      const timetableArray = [];
      days.forEach(day => {
        timeSlots.forEach(timeSlot => {
          const entry = timetableGrid[day][timeSlot];
          if (entry.subject && entry.subject.trim()) {
            timetableArray.push({
              day,
              time_slot: timeSlot,
              subject: entry.subject,
              class_name: entry.class_name || ''
            });
          }
        });
      });

      localStorage.setItem(`timetable_${teacherId}`, JSON.stringify(timetableArray));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsEditingTimetable(false);
      calculateTodayClasses();
    } catch (error) {
      console.error('Error saving timetable:', error);
      alert('Failed to save timetable. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTimetableGrid(createTimetableGrid());
    setIsEditingTimetable(false);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'class': return '📚';
      case 'assignment': return '📝';
      case 'exam': return '📊';
      case 'meeting': return '👥';
      case 'reminder': return '⏰';
      default: return '📅';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        Welcome, {teacher.Name}!
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-2xl shadow-md">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {todayClassCount}
          </div>
          <div className="text-gray-700 dark:text-gray-300 mt-2">Classes Today</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-2xl shadow-md">
          <div className="text-4xl font-bold text-green-600 dark:text-green-400">
            {loadingStudents ? (
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            ) : (
              studentCount
            )}
          </div>
          <div className="text-gray-700 dark:text-gray-300 mt-2">Total Students</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-2xl shadow-md">
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
            {todayEvents.length}
          </div>
          <div className="text-gray-700 dark:text-gray-300 mt-2">Events Today</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6 rounded-2xl shadow-md">
          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {nextEvent ? (
              <>
                <div className="text-2xl mb-1">{getEventIcon(nextEvent.type)}</div>
                <div className="text-sm">{nextEvent.title.substring(0, 20)}{nextEvent.title.length > 20 && '...'}</div>
                <div className="text-xs text-orange-500 dark:text-orange-300 mt-1">
                  {new Date(nextEvent.date).toLocaleDateString()}
                </div>
              </>
            ) : (
              <div className="text-sm">No upcoming events</div>
            )}
          </div>
          <div className="text-gray-700 dark:text-gray-300 mt-2">Next Event</div>
        </div>
      </div>

      {/* Compact Today's Events Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">Today's Events</h3>
        {todayEvents.length > 0 ? (
          <div className="space-y-2">
            {todayEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-xl">{getEventIcon(event.type)}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{event.title}</p>
                  {event.time && <p className="text-xs text-gray-600 dark:text-gray-400">🕐 {event.time}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No events scheduled for today</p>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md mb-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Teacher ID</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{teacher.Teacher_id}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{teacher.Email}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Department</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{teacher.Department}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{teacher.Phone || 'Not Provided'}</p>
          </div>
        </div>
      </div>

      {/* Weekly Timetable */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Weekly Timetable</h3>
          <div className="flex gap-2">
            {!isEditingTimetable ? (
              <button
                onClick={() => setIsEditingTimetable(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Timetable
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTimetable}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 rounded-lg">
            Timetable saved successfully!
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold text-gray-800 dark:text-gray-100 w-32">
                  Time / Day
                </th>
                {days.map(day => (
                  <th key={day} className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-semibold text-gray-800 dark:text-gray-100 min-w-36">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(timeSlot => (
                <tr key={timeSlot} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                    {timeSlot}
                  </td>
                  {days.map(day => {
                    const cell = timetableGrid[day][timeSlot];
                    return (
                      <td key={`${day}-${timeSlot}`} className="border border-gray-300 dark:border-gray-600 px-2 py-2">
                        {isEditingTimetable ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              placeholder="Subject"
                              value={cell.subject}
                              onChange={(e) => handleCellChange(day, timeSlot, 'subject', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <input
                              type="text"
                              placeholder="Class"
                              value={cell.class_name}
                              onChange={(e) => handleCellChange(day, timeSlot, 'class_name', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            {cell.subject ? (
                              <>
                                <div className="font-semibold text-gray-900 dark:text-gray-100">{cell.subject}</div>
                                {cell.class_name && (
                                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{cell.class_name}</div>
                                )}
                              </>
                            ) : (
                              <div className="text-gray-400 dark:text-gray-500 text-xs">-</div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;

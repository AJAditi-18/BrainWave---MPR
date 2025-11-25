import React, { useState, useEffect } from 'react';

const DashboardPanel = ({ data }) => {
  const [timetable, setTimetable] = useState({});
  const [isEditingTimetable, setIsEditingTimetable] = useState(false);
  const [events, setEvents] = useState([]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '8:00-9:00',
    '9:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:30-1:30',
    '1:30-2:30'
  ];

  useEffect(() => {
    loadTimetable();
    loadEvents();
  }, []);

  const loadTimetable = () => {
    const saved = localStorage.getItem('student_timetable');
    if (saved) {
      try {
        setTimetable(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading timetable:', e);
        initializeTimetable();
      }
    } else {
      initializeTimetable();
    }
  };

  const initializeTimetable = () => {
    const initialTimetable = {};
    days.forEach(day => {
      initialTimetable[day] = {};
      timeSlots.forEach(slot => {
        initialTimetable[day][slot] = { subject: '', teacher: '', room: '' };
      });
    });
    setTimetable(initialTimetable);
  };

  const loadEvents = () => {
    const saved = localStorage.getItem('student_calendar_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading events:', e);
        setEvents([]);
      }
    }
  };

  const handleTimetableChange = (day, slot, field, value) => {
    setTimetable(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: {
          ...prev[day][slot],
          [field]: value
        }
      }
    }));
  };

  const saveTimetable = () => {
    localStorage.setItem('student_timetable', JSON.stringify(timetable));
    setIsEditingTimetable(false);
    alert('✅ Timetable saved successfully!');
  };

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    if (!timetable[today]) return [];
    
    const todayClasses = [];
    timeSlots.forEach(slot => {
      const classInfo = timetable[today][slot];
      if (classInfo && classInfo.subject && classInfo.subject.trim() !== '') {
        todayClasses.push({ slot, ...classInfo });
      }
    });
    return todayClasses;
  };

  const getNextHoliday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const holidays = events.filter(event => 
      event.type === 'holiday' && new Date(event.date) >= today
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return holidays[0] || null;
  };

  const todayClasses = getTodayClasses();
  const nextHoliday = getNextHoliday();

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Student Dashboard</h2>

      {/* Student Info Cards - 3 Cards Evenly Spaced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Roll Number</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{data.roll_no}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">{data.email}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Shift</p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{data.shift}</p>
        </div>
      </div>

      {/* Classes Today & Next Holiday */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Classes Today */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
              📚 Classes Today
            </h3>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{todayClasses.length}</span>
          </div>
          
          {todayClasses.length === 0 ? (
            <p className="text-blue-600 dark:text-blue-400 text-sm">No classes scheduled for today! 🎉</p>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
              {todayClasses.map((cls, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{cls.subject}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{cls.teacher} • Room {cls.room}</p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 ml-2 whitespace-nowrap">{cls.slot}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Holiday */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 rounded-xl shadow-md p-5">
          <h3 className="text-lg font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
            🎊 Next Holiday
          </h3>
          
          {nextHoliday ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <p className="text-xl font-bold text-green-600 dark:text-green-400 mb-1.5 line-clamp-1">{nextHoliday.title}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-1.5 text-sm">
                📅 {new Date(nextHoliday.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              {nextHoliday.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{nextHoliday.description}</p>
              )}
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                {Math.ceil((new Date(nextHoliday.date) - new Date()) / (1000 * 60 * 60 * 24))} days to go! 🎉
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <p className="text-gray-600 dark:text-gray-400 text-sm">No upcoming holidays scheduled. Check the calendar for updates!</p>
            </div>
          )}
        </div>
      </div>

      {/* Timetable Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            📅 Weekly Timetable
          </h3>
          <button
            onClick={() => isEditingTimetable ? saveTimetable() : setIsEditingTimetable(true)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isEditingTimetable
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isEditingTimetable ? '💾 Save Timetable' : '✏️ Edit Timetable'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Time
                </th>
                {days.map(day => (
                  <th key={day} className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(slot => (
                <tr key={slot} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-semibold text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {slot}
                  </td>
                  {days.map(day => {
                    const classInfo = timetable[day]?.[slot] || { subject: '', teacher: '', room: '' };
                    return (
                      <td key={`${day}-${slot}`} className="border border-gray-300 dark:border-gray-600 px-2 py-2">
                        {isEditingTimetable ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              placeholder="Subject"
                              value={classInfo.subject}
                              onChange={(e) => handleTimetableChange(day, slot, 'subject', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <input
                              type="text"
                              placeholder="Teacher"
                              value={classInfo.teacher}
                              onChange={(e) => handleTimetableChange(day, slot, 'teacher', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <input
                              type="text"
                              placeholder="Room"
                              value={classInfo.room}
                              onChange={(e) => handleTimetableChange(day, slot, 'room', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        ) : classInfo.subject ? (
                          <div className="text-xs">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{classInfo.subject}</p>
                            <p className="text-gray-600 dark:text-gray-400">{classInfo.teacher}</p>
                            <p className="text-gray-500 dark:text-gray-500">Room {classInfo.room}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">-</p>
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

export default DashboardPanel;

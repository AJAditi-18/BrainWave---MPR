import React, { useState, useEffect } from 'react';

const CalendarPanel = ({ data, onEventAdded }) => {
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'exam',
    description: ''
  });
  const [filterType, setFilterType] = useState('all');

  const eventTypes = [
    { value: 'exam', label: '📝 Exam', color: 'red' },
    { value: 'assignment', label: '📋 Assignment', color: 'orange' },
    { value: 'holiday', label: '🎊 Holiday', color: 'green' },
    { value: 'event', label: '🎉 Event', color: 'blue' },
    { value: 'other', label: '📌 Other', color: 'gray' }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

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

  const handleDateClick = (day) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    setSelectedDate(dateStr);
    setIsAddingEvent(true);
    setNewEvent({ title: '', type: 'exam', description: '' });
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      alert('❌ Please enter event title');
      return;
    }

    const eventWithId = {
      ...newEvent,
      id: Date.now(),
      date: selectedDate,
      createdAt: new Date().toISOString()
    };

    const updatedEvents = [...events, eventWithId].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setEvents(updatedEvents);
    localStorage.setItem('student_calendar_events', JSON.stringify(updatedEvents));
    setNewEvent({ title: '', type: 'exam', description: '' });
    setSelectedDate(null);
    setIsAddingEvent(false);
    alert('✅ Event added!');

    if (onEventAdded) onEventAdded();
  };

  const handleDeleteEvent = (eventId) => {
    if (!confirm('Are you sure?')) return;

    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('student_calendar_events', JSON.stringify(updatedEvents));
    alert('✅ Event deleted!');

    if (onEventAdded) onEventAdded();
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getEventsForDate = (day) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const getEventTypeInfo = (type) => eventTypes.find(et => et.value === type) || eventTypes[4];

  const filteredEvents = filterType === 'all' ? events : events.filter(e => e.type === filterType);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">📅 Calendar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: CALENDAR VIEW */}
          <div className="lg:col-span-2">
            {/* CALENDAR GRID */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() =>
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                  }
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
                >
                  ← Prev
                </button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={() =>
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                  }
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Next →
                </button>
              </div>

              {/* DAY HEADERS */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div
                    key={day}
                    className="text-center font-bold text-gray-900 dark:text-white py-2 bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* CALENDAR DATES */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  const dayEvents = day ? getEventsForDate(day) : [];
                  const dateStr = day
                    ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                        .toISOString()
                        .split('T')[0]
                    : null;
                  const isToday =
                    day &&
                    new Date().getDate() === day &&
                    new Date().getMonth() === currentMonth.getMonth() &&
                    new Date().getFullYear() === currentMonth.getFullYear();
                  const isSelected = dateStr === selectedDate;

                  return (
                    <button
                      key={idx}
                      onClick={() => day && handleDateClick(day)}
                      disabled={!day}
                      className={`min-h-28 p-2 rounded-lg border transition-all ${
                        !day
                          ? 'bg-gray-50 dark:bg-gray-800 cursor-default'
                          : isSelected
                          ? 'bg-green-100 dark:bg-green-900 border-green-500 border-2 cursor-pointer'
                          : isToday
                          ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 border-2 cursor-pointer hover:border-blue-600'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-pointer hover:border-blue-500'
                      }`}
                    >
                      {day && (
                        <>
                          <p className={`font-bold text-left ${isToday ? 'text-blue-600 dark:text-blue-300' : isSelected ? 'text-green-600 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}>
                            {day}
                          </p>
                          <div className="space-y-1 mt-1">
                            {dayEvents.slice(0, 2).map(event => {
                              const typeInfo = getEventTypeInfo(event.type);
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs p-1 rounded truncate ${
                                    typeInfo.color === 'red'
                                      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                      : typeInfo.color === 'orange'
                                      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                                      : typeInfo.color === 'green'
                                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                      : typeInfo.color === 'blue'
                                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                      : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                                  }`}
                                >
                                  {event.title}
                                </div>
                              );
                            })}
                            {dayEvents.length > 2 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">+{dayEvents.length - 2}</p>
                            )}
                          </div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ADD EVENT FORM - APPEARS WHEN DATE SELECTED */}
              {isAddingEvent && selectedDate && (
                <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-lg border-2 border-green-500">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Add Event - {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h3>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />

                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {eventTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>

                    <textarea
                      placeholder="Description (optional)"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="2"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsAddingEvent(false);
                          setSelectedDate(null);
                          setNewEvent({ title: '', type: 'exam', description: '' });
                        }}
                        className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddEvent}
                        className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                      >
                        Save Event
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: EVENTS LIST */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">All Events</h2>

              {/* FILTER */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Events</option>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {/* EVENTS LIST */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredEvents.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center py-4">
                    {filterType === 'all' ? 'No events scheduled' : `No ${getEventTypeInfo(filterType).label.split(' ')[1].toLowerCase()}s`}
                  </p>
                ) : (
                  filteredEvents.map(event => {
                    const typeInfo = getEventTypeInfo(event.type);
                    return (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          typeInfo.color === 'red'
                            ? 'bg-red-50 dark:bg-red-900 border-red-500'
                            : typeInfo.color === 'orange'
                            ? 'bg-orange-50 dark:bg-orange-900 border-orange-500'
                            : typeInfo.color === 'green'
                            ? 'bg-green-50 dark:bg-green-900 border-green-500'
                            : typeInfo.color === 'blue'
                            ? 'bg-blue-50 dark:bg-blue-900 border-blue-500'
                            : 'bg-gray-50 dark:bg-gray-900 border-gray-500'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white">{typeInfo.label.split(' ')[0]} {event.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              📅 {new Date(event.date).toLocaleDateString()}
                            </p>
                            {event.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPanel;

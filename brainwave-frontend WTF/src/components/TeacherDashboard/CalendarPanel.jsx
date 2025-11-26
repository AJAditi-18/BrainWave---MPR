import React, { useState, useEffect } from 'react';

const CalendarPanel = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    type: 'class',
    color: 'blue'
  });

  const eventTypes = [
    { value: 'class', label: 'Class', color: 'blue' },
    { value: 'assignment', label: 'Assignment Due', color: 'red' },
    { value: 'exam', label: 'Exam', color: 'purple' },
    { value: 'meeting', label: 'Meeting', color: 'green' },
    { value: 'reminder', label: 'Reminder', color: 'yellow' },
    { value: 'other', label: 'Other', color: 'gray' }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const saved = localStorage.getItem('calendar_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading events:', e);
        setEvents([]);
      }
    }
  };

  const saveEvents = (updatedEvents) => {
    setEvents(updatedEvents);
    localStorage.setItem('calendar_events', JSON.stringify(updatedEvents));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setIsAddingEvent(false);
    setEditingEvent(null);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !selectedDate) {
      alert('Please enter a title');
      return;
    }

    const event = {
      id: Date.now(),
      ...newEvent,
      date: selectedDate.toISOString().split('T')[0]
    };

    const updatedEvents = [...events, event];
    saveEvents(updatedEvents);

    setNewEvent({ title: '', description: '', time: '', type: 'class', color: 'blue' });
    setIsAddingEvent(false);
  };

  const handleUpdateEvent = () => {
    if (!newEvent.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const updatedEvents = events.map(e => 
      e.id === editingEvent.id ? { ...e, ...newEvent } : e
    );
    saveEvents(updatedEvents);

    setNewEvent({ title: '', description: '', time: '', type: 'class', color: 'blue' });
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(e => e.id !== eventId);
      saveEvents(updatedEvents);
    }
  };

  const startEditing = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description || '',
      time: event.time || '',
      type: event.type,
      color: event.color
    });
    setIsAddingEvent(false);
  };

  const getEventColor = (type) => {
    const eventType = eventTypes.find(t => t.value === type);
    return eventType ? eventType.color : 'gray';
  };

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Calendar</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {monthNames[month]} {year}
              </h3>
              
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square"></div>;
                }

                const date = new Date(year, month, day);
                const dateEvents = getEventsForDate(date);
                const isSelected = selectedDate && 
                  selectedDate.getDate() === day && 
                  selectedDate.getMonth() === month && 
                  selectedDate.getFullYear() === year;
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square p-2 rounded-lg transition relative ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : isToday
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span className="text-sm">{day}</span>
                    {dateEvents.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {dateEvents.slice(0, 3).map((event, idx) => (
                          <div key={idx} className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-white' : `bg-${getEventColor(event.type)}-500`
                          }`}></div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Event Details / Add Event */}
        <div className="lg:col-span-1">
          {selectedDate ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                {!isAddingEvent && !editingEvent && (
                  <button
                    onClick={() => setIsAddingEvent(true)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Add/Edit Event Form */}
              {(isAddingEvent || editingEvent) && (
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Event title"
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />

                  <select
                    value={newEvent.type}
                    onChange={(e) => {
                      const selected = eventTypes.find(t => t.value === e.target.value);
                      setNewEvent(prev => ({ 
                        ...prev, 
                        type: e.target.value,
                        color: selected.color
                      }));
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {eventTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>

                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description (optional)"
                    rows={2}
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                    >
                      {editingEvent ? 'Update' : 'Add'}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingEvent(false);
                        setEditingEvent(null);
                        setNewEvent({ title: '', description: '', time: '', type: 'class', color: 'blue' });
                      }}
                      className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-lg transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Events List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className={`p-3 rounded-lg ${colorClasses[event.color]}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{event.title}</p>
                          {event.time && <p className="text-sm mt-1">🕐 {event.time}</p>}
                          {event.description && <p className="text-sm mt-1">{event.description}</p>}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditing(event)}
                            className="p-1 hover:bg-white/30 dark:hover:bg-black/20 rounded transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-1 hover:bg-white/30 dark:hover:bg-black/20 rounded transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                    No events for this day
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">
                Select a date to view or add events
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPanel;

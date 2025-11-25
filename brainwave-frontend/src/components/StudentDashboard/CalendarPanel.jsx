import React, { useState, useEffect } from 'react';

const CalendarPanel = ({ data }) => {
  const [events, setEvents] = useState([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'exam',
    description: ''
  });
  const [filterType, setFilterType] = useState('all');

  const eventTypes = [
    { value: 'exam', label: 'Exam', color: 'red', icon: '📝' },
    { value: 'assignment', label: 'Assignment', color: 'orange', icon: '📋' },
    { value: 'holiday', label: 'Holiday', color: 'green', icon: '🎊' },
    { value: 'event', label: 'College Event', color: 'blue', icon: '🎉' },
    { value: 'other', label: 'Other', color: 'gray', icon: '📌' }
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

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) {
      alert('Please enter title and date');
      return;
    }

    const eventWithId = {
      ...newEvent,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    const updatedEvents = [...events, eventWithId].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    setEvents(updatedEvents);
    localStorage.setItem('student_calendar_events', JSON.stringify(updatedEvents));

    setNewEvent({ title: '', date: '', type: 'exam', description: '' });
    setIsAddingEvent(false);
    alert('✅ Event added successfully!');
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem('student_calendar_events', JSON.stringify(updatedEvents));
    }
  };

  const getFilteredEvents = () => {
    if (filterType === 'all') return events;
    return events.filter(event => event.type === filterType);
  };

  const getEventTypeInfo = (type) => {
    return eventTypes.find(et => et.value === type) || eventTypes[eventTypes.length - 1];
  };

  const isEventPast = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(eventDate) < today;
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Academic Calendar</h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filterType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Events
        </button>
        {eventTypes.map(type => (
          <button
            key={type.value}
            onClick={() => setFilterType(type.value)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterType === type.value
                ? `bg-${type.color}-600 text-white`
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Add Event Button */}
      {!isAddingEvent && (
        <button
          onClick={() => setIsAddingEvent(true)}
          className="mb-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          + Add Event
        </button>
      )}

      {/* Add Event Form */}
      {isAddingEvent && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Add New Event</h3>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <select
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description (optional)"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-20"
            />

            <div className="flex gap-2">
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                Add Event
              </button>
              <button
                onClick={() => {
                  setIsAddingEvent(false);
                  setNewEvent({ title: '', date: '', type: 'exam', description: '' });
                }}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {filterType === 'all' ? 'No events scheduled' : `No ${getEventTypeInfo(filterType).label.toLowerCase()}s scheduled`}
            </p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const typeInfo = getEventTypeInfo(event.type);
            const isPast = isEventPast(event.date);

            return (
              <div
                key={event.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${
                  isPast ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{typeInfo.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-${typeInfo.color}-100 dark:bg-${typeInfo.color}-900/30 text-${typeInfo.color}-700 dark:text-${typeInfo.color}-300`}>
                            {typeInfo.label}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            📅 {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          {isPast && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                              Past Event
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-3 ml-11">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-600 hover:text-red-700 text-xl ml-4"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CalendarPanel;

import React, { useState } from "react";

// You can replace with a calendar library for big project, but this demo just maps days.
function getMonthDays(year, month) {
  const result = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    result.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return result;
}

// Sample user and events
const currentUser = { name: "Student Name", role: "Student" };
const initialEvents = [
  {
    id: 1,
    title: "Freshers' Night",
    type: "Cultural",
    date: "2025-10-18",
    description: "Welcome party for new students.",
    rsvps: ["Student Name"],
    postedBy: "Cultural Club"
  },
  {
    id: 2,
    title: "AI Seminar",
    type: "Academic",
    date: "2025-10-20",
    description: "Talk by Google AI team.",
    rsvps: [],
    postedBy: "Prof. S. Sharma"
  },
  {
    id: 3,
    title: "Dance Fest",
    type: "Cultural",
    date: "2025-10-25",
    description: "Annual inter-college dance competition.",
    rsvps: [],
    postedBy: "Cultural Club"
  },
  {
    id: 4,
    title: "Blood Donation Camp",
    type: "Social",
    date: "2025-10-22",
    description: "Open to all. Join and help save lives.",
    rsvps: [],
    postedBy: "NSS"
  }
];

// Social feed (announcements/chat)
const initialFeed = [
  { name: "Prof. S. Sharma", message: "Don't miss the AI Seminar this Monday!", time: "1h ago" },
  { name: "Cultural Club", message: "Freshers are welcome to join tonight's party!", time: "3h ago" },
];

const typeColors = {
  Academic: "text-blue-600",
  Cultural: "text-pink-600",
  Social: "text-green-700"
};

const EventsCalendar = () => {
  const [events, setEvents] = useState(initialEvents);
  const [feed, setFeed] = useState(initialFeed);
  const [feedMsg, setFeedMsg] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'Academic', date: '', description: '' });

  // Calendar dates (October 2025 by default)
  const today = new Date();
  const monthDays = getMonthDays(today.getFullYear(), today.getMonth());

  // RSVP handler
  const handleRsvp = id => {
    setEvents(events.map(e =>
      e.id === id && !e.rsvps.includes(currentUser.name)
        ? { ...e, rsvps: [...e.rsvps, currentUser.name] }
        : e
    ));
  };

  // Add event (admin/teacher in real app)
  const addEvent = e => {
    e.preventDefault();
    if (newEvent.title && newEvent.date && newEvent.type && newEvent.description) {
      setEvents([
        ...events,
        {
          ...newEvent,
          id: Date.now(),
          rsvps: [],
          postedBy: currentUser.role !== "Student" ? currentUser.name : "Admin/Teacher"
        }
      ]);
      setNewEvent({ title: '', type: 'Academic', date: '', description: '' });
      setShowAdd(false);
    }
  };

  // Social feed posting
  const postFeed = e => {
    e.preventDefault();
    if (feedMsg) {
      setFeed([
        { name: currentUser.name, message: feedMsg, time: "Just now" },
        ...feed
      ]);
      setFeedMsg("");
    }
  };

  return (
    <div className="min-h-screen bg-brainwave-bg px-2 py-8 flex flex-col items-center">
      <div className="bg-brainwave-primary-glass rounded-2xl shadow-brainwave w-full max-w-4xl p-8 mb-8">
        <h2 className="text-2xl font-extrabold text-brainwave-secondary mb-3 text-center">
          Events & Social Calendar
        </h2>

        {/* Calendar - just a simple grid with events marked */}
        <div className="mb-8">
          <div className="mb-2 font-bold text-brainwave-primary">October 2025</div>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs text-brainwave-secondary mb-1 font-semibold">{d}</div>
            ))}
            {monthDays.map(day => {
              const evs = events.filter(e => e.date === day.toISOString().slice(0,10));
              const isToday = day.toDateString() === today.toDateString();
              return (
                <div key={day.toISOString()} className={`h-14 w-10 rounded-xl flex flex-col items-center justify-center border border-brainwave-primary/10 relative ${isToday ? "bg-brainwave-secondary/30" : "bg-white"}`}>
                  <div className={`${isToday ? "font-bold text-brainwave-primary" : "text-brainwave-primary"} text-sm`}>
                    {day.getDate()}
                  </div>
                  {evs.map(e => (
                    <span
                      key={e.id}
                      className={`rounded-full h-2.5 w-2.5 my-0.5 block ${e.type === 'Academic' ? "bg-blue-400" : e.type === "Cultural" ? "bg-pink-400" : "bg-green-400"}`}
                      title={e.title}
                    ></span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add event, visible to admin/teacher */}
        {(currentUser.role === "Admin" || currentUser.role === "Teacher") && (
          <div className="mb-6">
            <button className="bg-brainwave-secondary text-brainwave-primary font-bold px-3 py-1 rounded" onClick={() => setShowAdd(a => !a)}>
              {showAdd ? "Cancel" : "Add Event"}
            </button>
            {showAdd && (
              <form onSubmit={addEvent} className="flex flex-col md:flex-row gap-2 mt-2">
                <input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="px-2 py-1 rounded border" placeholder="Title" />
                <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} className="px-2 py-1 rounded border">
                  <option value="Academic">Academic</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Social">Social</option>
                </select>
                <input required type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="px-2 py-1 rounded border" />
                <input required value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="px-2 py-1 rounded border flex-1" placeholder="Description" />
                <button type="submit" className="bg-brainwave-accent px-3 py-1 text-brainwave-bg font-bold rounded">Save</button>
              </form>
            )}
          </div>
        )}

        {/* Event List */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-brainwave-secondary mb-2">Upcoming Events</h3>
          <div className="space-y-3">
            {events.length === 0 && <div>No upcoming events.</div>}
            {events
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(ev => (
              <div key={ev.id} className="bg-white rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2 shadow">
                <div>
                  <div className="font-bold text-brainwave-primary text-lg">{ev.title}</div>
                  <div className="text-sm italic text-brainwave-accent mb-1">{ev.type}</div>
                  <div className="text-sm text-brainwave-secondary">{ev.description}</div>
                  <div className="text-xs mt-1 text-brainwave-primary">Posted by: {ev.postedBy}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm text-brainwave-secondary">{ev.date}</div>
                  {currentUser.role === "Student" && (
                    <button
                      disabled={ev.rsvps.includes(currentUser.name)}
                      className={`mt-1 bg-brainwave-secondary text-brainwave-primary px-2 py-1 rounded ${ev.rsvps.includes(currentUser.name) && "opacity-50 cursor-not-allowed"}`}
                      onClick={() => handleRsvp(ev.id)}
                    >
                      {ev.rsvps.includes(currentUser.name) ? "Joined" : "Join / RSVP"}
                    </button>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {ev.rsvps.length > 0 && `Attending: ${ev.rsvps.length}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social feed/announcements */}
        <h3 className="text-lg font-bold text-brainwave-secondary mb-2">Social Feed / Announcements</h3>
        <form onSubmit={postFeed} className="flex gap-2 mb-4">
          <input value={feedMsg} onChange={e => setFeedMsg(e.target.value)} className="flex-1 rounded px-3 py-1 border" placeholder="Share an announcement..." />
          <button className="bg-brainwave-accent px-3 rounded text-brainwave-bg font-bold" type="submit">Post</button>
        </form>
        <div className="max-h-32 overflow-y-auto flex flex-col gap-2">
          {feed.map((f, i) => (
            <div key={i} className="bg-white p-2 rounded-lg text-sm flex items-center gap-2">
              <span className="font-bold text-brainwave-accent">{f.name}:</span>
              <span>{f.message}</span>
              <span className="ml-auto text-gray-400 text-xs">{f.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;

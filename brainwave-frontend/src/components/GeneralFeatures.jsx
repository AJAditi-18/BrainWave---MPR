import React, { useState } from "react";

// Dummy user data
const roles = ["Student", "Teacher", "Admin"];
const userData = {
  name: "Student Name",
  avatar: "/avatar.png",
  email: "student@example.com",
  role: "Student",
};

const notifications = [
  "Assignment Due: AI Project (tomorrow)",
  "Library Book Due in 3 days",
  "Placement Interview Scheduled for Oct 15",
];

const GeneralFeatures = () => {
  const [theme, setTheme] = useState("dark");
  const [role, setRole] = useState(userData.role);
  const [profileEdit, setProfileEdit] = useState(false);
  const [user, setUser] = useState(userData);

  // Theme toggle
  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  // Profile update (simulated)
  const saveProfile = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name: e.target.name.value,
      email: e.target.email.value,
    });
    setProfileEdit(false);
  };

  return (
    <div className={`${theme === "dark" ? "bg-brainwave-bg" : "bg-white"} min-h-screen px-4 py-8 transition`}>
      <div className={`rounded-2xl shadow-brainwave p-6 mx-auto max-w-2xl ${theme === "dark" ? "bg-brainwave-primary-glass" : "bg-gray-100"}`}>
        {/* Theme toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-extrabold ${theme === "dark" ? "text-brainwave-secondary" : "text-brainwave-primary"}`}>
            General Features Panel
          </h2>
          <button
            onClick={toggleTheme}
            className={`px-3 py-1 rounded-xl font-bold transition ${theme === "dark" ? "bg-white text-brainwave-primary" : "bg-brainwave-bg text-brainwave-secondary"}`}
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Role switcher */}
        <div className="flex items-center gap-4 mb-4">
          <span className={`font-semibold ${theme === "dark" ? "text-brainwave-secondary" : "text-brainwave-primary"}`}>Role:</span>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="px-4 py-1 rounded-lg border border-brainwave-secondary bg-white text-brainwave-primary"
          >
            {roles.map(r => (<option key={r} value={r}>{r}</option>))}
          </select>
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-4 mb-4">
          <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full border-2 border-brainwave-secondary bg-white object-cover" />
          <div>
            <div className={`${theme === "dark" ? "text-brainwave-secondary" : "text-brainwave-primary"} text-xl font-bold`}>{user.name}</div>
            <div className="text-sm text-brainwave-primary">{user.email}</div>
            <button
              className="mt-1 text-brainwave-accent underline font-semibold"
              onClick={() => setProfileEdit(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
        {/* Profile Edit Modal */}
        {profileEdit && (
          <form
            onSubmit={saveProfile}
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/70 z-10"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[300px]">
              <h3 className="text-lg font-bold mb-4 text-brainwave-primary">Edit Profile</h3>
              <input className="block w-full mb-2 px-3 py-2 border rounded-lg" name="name" defaultValue={user.name} />
              <input className="block w-full mb-4 px-3 py-2 border rounded-lg" name="email" type="email" defaultValue={user.email} />
              <button className="bg-brainwave-secondary text-brainwave-primary px-4 py-2 font-semibold rounded-lg mr-2" type="submit">Save</button>
              <button className="bg-brainwave-primary text-white px-4 py-2 font-semibold rounded-lg" type="button" onClick={() => setProfileEdit(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Notifications Panel */}
        <div className="mt-6">
          <h3 className={`${theme === "dark" ? "text-brainwave-secondary" : "text-brainwave-primary"} text-lg font-bold mb-3`}>Notifications</h3>
          <ul className="space-y-2">
            {notifications.map((note, idx) => (
              <li key={idx} className={`rounded-lg px-4 py-2 ${theme === "dark" ? "bg-white text-brainwave-primary" : "bg-brainwave-primary text-brainwave-secondary"}`}>
                {note}
              </li>
            ))}
            {notifications.length === 0 && (
              <li className="opacity-60 text-center">No notifications.</li>
            )}
          </ul>
        </div>

        {/* Responsive test */}
        <div className="mt-8 text-center opacity-70">
          <span className="block">Resize window to check responsive design!</span>
          <span className="block text-xs">This panel works well on mobile, tablet, desktop!</span>
        </div>
      </div>
    </div>
  );
};

export default GeneralFeatures;

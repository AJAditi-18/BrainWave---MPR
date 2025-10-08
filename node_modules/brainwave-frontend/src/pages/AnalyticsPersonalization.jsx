import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Demo data for analytics
const attendanceData = [
  { month: "Jan", percentage: 92 },
  { month: "Feb", percentage: 88 },
  { month: "Mar", percentage: 95 },
  { month: "Apr", percentage: 90 },
];

const gradesData = [
  { subject: "AI", marks: 92 },
  { subject: "Math", marks: 85 },
  { subject: "Physics", marks: 78 },
  { subject: "Chemistry", marks: 88 },
];

const activityData = [
  { day: "Mon", assignments: 3, library: 2, events: 1 },
  { day: "Tue", assignments: 2, library: 1, events: 0 },
  { day: "Wed", assignments: 4, library: 3, events: 2 },
  { day: "Thu", assignments: 1, library: 2, events: 1 },
  { day: "Fri", assignments: 2, library: 1, events: 3 },
];

const studyHabitsData = [
  { subject: "AI", hours: 12 },
  { subject: "Math", hours: 8 },
  { subject: "Physics", hours: 6 },
  { subject: "Chemistry", hours: 10 },
];

// Available widgets for dashboard customization
const availableWidgets = [
  { id: "attendance", title: "Attendance Chart", component: "AttendanceChart" },
  { id: "grades", title: "Grades Overview", component: "GradesChart" },
  { id: "activity", title: "Weekly Activity", component: "ActivityChart" },
  { id: "todos", title: "To-Do List", component: "TodoList" },
  { id: "quicklinks", title: "Quick Links", component: "QuickLinks" },
  { id: "goals", title: "Goals Progress", component: "GoalsProgress" },
];

const currentUser = { name: "Student Name", preferences: { theme: "brainwave", dashboardLayout: ["attendance", "grades", "todos"] } };

const AnalyticsPersonalization = () => {
  const [activeWidgets, setActiveWidgets] = useState(currentUser.preferences.dashboardLayout);
  const [theme, setTheme] = useState(currentUser.preferences.theme);
  const [todos, setTodos] = useState([
    { id: 1, task: "Complete AI Assignment", priority: "High", completed: false, suggested: false },
    { id: 2, task: "Study for Math exam", priority: "Medium", completed: false, suggested: true },
    { id: 3, task: "Library book return", priority: "Low", completed: false, suggested: true },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [goals, setGoals] = useState([
    { id: 1, goal: "Maintain 90% attendance", current: 88, target: 90 },
    { id: 2, goal: "Score 85+ in all subjects", current: 82, target: 85 },
  ]);
  const [quickLinks, setQuickLinks] = useState([
    { name: "Gmail", url: "https://gmail.com", visits: 45 },
    { name: "Library Portal", url: "#library", visits: 23 },
    { name: "LMS", url: "#lms", visits: 67 },
  ]);

  // Widget management
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(activeWidgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setActiveWidgets(items);
  };

  const addWidget = (widgetId) => {
    if (!activeWidgets.includes(widgetId)) {
      setActiveWidgets([...activeWidgets, widgetId]);
    }
  };

  const removeWidget = (widgetId) => {
    setActiveWidgets(activeWidgets.filter(w => w !== widgetId));
  };

  // Todo management
  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo) {
      setTodos([...todos, { id: Date.now(), task: newTodo, priority: "Medium", completed: false, suggested: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Smart suggestions based on user data
  const getSmartSuggestions = () => {
    const suggestions = [];
    if (attendanceData[attendanceData.length - 1].percentage < 90) {
      suggestions.push("Attend more classes to improve attendance");
    }
    if (gradesData.some(g => g.marks < 80)) {
      suggestions.push("Focus on subjects with lower grades");
    }
    return suggestions;
  };

  // Widget components
  const renderWidget = (widgetId) => {
    switch (widgetId) {
      case "attendance":
        return (
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-brainwave-primary mb-2">Attendance Trend</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="percentage" stroke="#67e8f9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case "grades":
        return (
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-brainwave-primary mb-2">Subject Performance</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={gradesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="marks" fill="#67e8f9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "activity":
        return (
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-brainwave-primary mb-2">Weekly Activity</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="assignments" fill="#67e8f9" />
                <Bar dataKey="library" fill="#0a0c10" />
                <Bar dataKey="events" fill="#2dd4bf" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "todos":
        return (
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-brainwave-primary mb-2">Smart To-Do List</h4>
            <form onSubmit={addTodo} className="flex gap-2 mb-3">
              <input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1 px-2 py-1 border rounded"
                placeholder="Add new task..."
              />
              <button className="bg-brainwave-secondary text-brainwave-primary px-3 py-1 rounded font-bold" type="submit">
                Add
              </button>
            </form>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todos.map(todo => (
                <div key={todo.id} className={`flex items-center gap-2 p-2 rounded ${todo.suggested ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="rounded"
                  />
                  <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.task}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    todo.priority === 'High' ? 'bg-red-100 text-red-700' :
                    todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {todo.priority}
                  </span>
                  {todo.suggested && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">AI Suggested</span>}
                </div>
              ))}
            </div>
          </div>
        );

      case "quicklinks":
        return (
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-brainwave-primary mb-2">Quick Access</h4>
            <div className="space-y-2">
              {quickLinks.sort((a, b) => b.visits - a.visits).map((link, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <a href={link.url} className="text-brainwave-accent font-semibold hover:underline">
                    {link.name}
                  </a>
                  <span className="text-xs text-gray-500">{link.visits} visits</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "goals":
        return (
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-bold text-brainwave-primary mb-2">Goals Progress</h4>
            <div className="space-y-3">
              {goals.map(goal => (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{goal.goal}</span>
                    <span>{goal.current}/{goal.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${goal.current >= goal.target ? 'bg-green-500' : 'bg-brainwave-accent'}`}
                      style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="bg-white p-4 rounded-lg">Widget not found</div>;
    }
  };

  return (
    <div className={`min-h-screen px-2 py-8 ${theme === 'brainwave' ? 'bg-brainwave-bg' : 'bg-gray-100'}`}>
      <div className={`rounded-2xl shadow-brainwave w-full max-w-6xl mx-auto p-8 ${theme === 'brainwave' ? 'bg-brainwave-primary-glass' : 'bg-white'}`}>
        
        <h2 className={`text-2xl font-extrabold mb-6 text-center ${theme === 'brainwave' ? 'text-brainwave-secondary' : 'text-gray-800'}`}>
          Analytics & Personalization Dashboard
        </h2>

        {/* Theme & Customization Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <label className={`font-semibold ${theme === 'brainwave' ? 'text-brainwave-secondary' : 'text-gray-700'}`}>Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-3 py-1 border rounded-lg"
            >
              <option value="brainwave">Brainwave</option>
              <option value="light">Light</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme === 'brainwave' ? 'text-brainwave-secondary' : 'text-gray-600'}`}>Add Widget:</span>
            {availableWidgets.filter(w => !activeWidgets.includes(w.id)).map(widget => (
              <button
                key={widget.id}
                onClick={() => addWidget(widget.id)}
                className="bg-brainwave-accent text-brainwave-bg px-2 py-1 rounded text-xs font-bold"
              >
                +{widget.title}
              </button>
            ))}
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="mb-6">
          <h3 className={`text-lg font-bold mb-2 ${theme === 'brainwave' ? 'text-brainwave-primary' : 'text-gray-700'}`}>
            Smart Suggestions
          </h3>
          <div className="space-y-2">
            {getSmartSuggestions().map((suggestion, idx) => (
              <div key={idx} className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm">
                💡 {suggestion}
              </div>
            ))}
          </div>
        </div>

        {/* Draggable Dashboard Widgets */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeWidgets.map((widgetId, index) => (
                  <Draggable key={widgetId} draggableId={widgetId} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative"
                      >
                        <div {...provided.dragHandleProps} className="absolute top-2 right-2 cursor-move z-10">
                          <span className="text-gray-400">⋮⋮</span>
                        </div>
                        <button
                          onClick={() => removeWidget(widgetId)}
                          className="absolute top-2 right-8 text-red-500 font-bold z-10"
                        >
                          ×
                        </button>
                        {renderWidget(widgetId)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Study Habits Analytics */}
        <div className="mt-8 bg-white p-6 rounded-lg">
          <h3 className="text-lg font-bold text-brainwave-primary mb-4">Study Time Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={studyHabitsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subject, hours }) => `${subject}: ${hours}h`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="hours"
              >
                {studyHabitsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#67e8f9', '#2dd4bf', '#0a0c10', '#22d3ee'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPersonalization;

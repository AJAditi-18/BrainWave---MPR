import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function CalendarPanel({ isDark }) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 9));

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const events = [
    { date: 15, title: "SE Assignment Due", color: "bg-red-500" },
    { date: 20, title: "DB Exam", color: "bg-blue-500" },
    { date: 25, title: "Project Submission", color: "bg-green-500" },
  ];

  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = [];

  for (let i = 0; i < firstDayOfMonth(currentDate); i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth(currentDate); i++) {
    days.push(i);
  }

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>

      <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold">{monthYear}</h2>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayLabels.map((day) => (
            <div key={day} className="text-center font-bold text-sm">{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const event = day ? events.find((e) => e.date === day) : null;
            return (
              <div
                key={idx}
                className={`p-2 rounded-lg text-center ${
                  day
                    ? isDark
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-100 hover:bg-gray-200"
                    : ""
                }`}
              >
                {day && (
                  <div>
                    <p className="font-bold">{day}</p>
                    {event && <p className={`text-xs ${event.color} text-white px-1 rounded mt-1`}>{event.title}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

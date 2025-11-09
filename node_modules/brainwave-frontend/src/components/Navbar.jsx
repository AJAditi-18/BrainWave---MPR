import React, { useState } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = ({ isDark }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Assignment", message: "Assignment uploaded in SE class", time: "2 hours ago", read: false },
    { id: 2, title: "Grade Posted", message: "Your exam result is available", time: "1 day ago", read: false },
    { id: 3, title: "Library Update", message: "New books added to the library", time: "3 days ago", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <nav className={`${isDark ? "bg-gray-800" : "bg-white"} shadow-md border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <img src="/Logo.jpg" alt="Brainwave Logo" className="h-10 w-10 rounded" />
          <h1 className="text-xl font-bold text-blue-600">Brainwave</h1>
        </div>

        {/* Right - Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl z-50 ${
                isDark ? "bg-gray-700" : "bg-white"
              }`}
            >
              <div className={`p-4 border-b ${isDark ? "border-gray-600" : "border-gray-200"}`}>
                <h3 className="font-bold">Notifications</h3>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b cursor-pointer transition ${
                        !notification.read
                          ? isDark
                            ? "bg-gray-600"
                            : "bg-blue-50"
                          : ""
                      } ${isDark ? "border-gray-600 hover:bg-gray-600" : "border-gray-200 hover:bg-gray-100"}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{notification.title}</p>
                          <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                            {notification.time}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className={`p-3 border-t text-center ${isDark ? "border-gray-600" : "border-gray-200"}`}>
                <button className="text-blue-600 text-sm font-semibold hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function LibraryPanel({ isDark }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("borrowed"); // 'borrowed', 'returned', 'digital-library'

  // All books in library
  const allBooks = [
    { id: 1, title: "Clean Code", author: "Robert C. Martin", year: 2008, category: "Programming", status: "available" },
    { id: 2, title: "Design Patterns", author: "Gang of Four", year: 1994, category: "Software Design", status: "available" },
    { id: 3, title: "The Pragmatic Programmer", author: "Hunt & Thomas", year: 1999, category: "Programming", status: "available" },
    { id: 4, title: "Database Design", author: "C.J. Date", year: 2006, category: "Databases", status: "available" },
    { id: 5, title: "Web Development with React", author: "Robin Wieruch", year: 2022, category: "Web", status: "available" },
  ];

  // Student's borrowed books
  const borrowedBooks = [
    {
      id: 101,
      title: "Algorithms Unlocked",
      author: "Thomas H. Cormen",
      borrowDate: "2025-10-15",
      dueDate: "2025-11-15",
      daysLeft: -2,
      status: "overdue",
    },
    {
      id: 102,
      title: "Introduction to Artificial Intelligence",
      author: "Peter Norvig",
      borrowDate: "2025-10-20",
      dueDate: "2025-11-20",
      daysLeft: 12,
      status: "active",
    },
    {
      id: 103,
      title: "Computer Networks",
      author: "Andrew S. Tanenbaum",
      borrowDate: "2025-10-25",
      dueDate: "2025-11-25",
      daysLeft: 17,
      status: "active",
    },
  ];

  // Student's returned books
  const returnedBooks = [
    {
      id: 201,
      title: "Java: The Complete Reference",
      author: "Herbert Schildt",
      borrowDate: "2025-09-01",
      returnDate: "2025-10-05",
      daysKept: 34,
    },
    {
      id: 202,
      title: "The C Programming Language",
      author: "Brian W. Kernighan",
      borrowDate: "2025-08-15",
      returnDate: "2025-09-20",
      daysKept: 36,
    },
    {
      id: 203,
      title: "Operating System Concepts",
      author: "Abraham Silberschatz",
      borrowDate: "2025-09-10",
      returnDate: "2025-10-15",
      daysKept: 35,
    },
  ];

  // Stats
  const borrowedCount = borrowedBooks.length;
  const returnedCount = returnedBooks.length;
  const totalBorrowed = borrowedCount + returnedCount;
  const overdueCount = borrowedBooks.filter((b) => b.status === "overdue").length;

  const filteredBooks = allBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (book) => {
    alert(`✅ Downloading: ${book.title}\nAuthor: ${book.author}`);
  };

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">📚 Library</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg shadow-md ${isDark ? "bg-blue-900" : "bg-blue-100"}`}>
          <p className="text-xs font-semibold text-gray-600 uppercase">Books Borrowed</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{borrowedCount}</p>
        </div>
        <div className={`p-4 rounded-lg shadow-md ${isDark ? "bg-green-900" : "bg-green-100"}`}>
          <p className="text-xs font-semibold text-gray-600 uppercase">Books Returned</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{returnedCount}</p>
        </div>
        <div className={`p-4 rounded-lg shadow-md ${isDark ? "bg-orange-900" : "bg-orange-100"}`}>
          <p className="text-xs font-semibold text-gray-600 uppercase">Overdue Books</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">{overdueCount}</p>
        </div>
        <div className={`p-4 rounded-lg shadow-md ${isDark ? "bg-purple-900" : "bg-purple-100"}`}>
          <p className="text-xs font-semibold text-gray-600 uppercase">Total History</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">{totalBorrowed}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("borrowed")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "borrowed"
              ? "border-blue-600 text-blue-600"
              : `border-transparent ${isDark ? "text-gray-400" : "text-gray-600"} hover:text-blue-600`
          }`}
        >
          📖 Currently Borrowed ({borrowedCount})
        </button>
        <button
          onClick={() => setActiveTab("returned")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "returned"
              ? "border-green-600 text-green-600"
              : `border-transparent ${isDark ? "text-gray-400" : "text-gray-600"} hover:text-green-600`
          }`}
        >
          ✅ Returned Books ({returnedCount})
        </button>
        <button
          onClick={() => setActiveTab("digital-library")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "digital-library"
              ? "border-purple-600 text-purple-600"
              : `border-transparent ${isDark ? "text-gray-400" : "text-gray-600"} hover:text-purple-600`
          }`}
        >
          💾 Digital Library
        </button>
      </div>

      {/* Tab Content */}

      {/* Currently Borrowed */}
      {activeTab === "borrowed" && (
        <div>
          {borrowedBooks.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No books currently borrowed</p>
          ) : (
            <div className="space-y-3">
              {borrowedBooks.map((book) => (
                <div
                  key={book.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    book.status === "overdue"
                      ? isDark
                        ? "border-red-600 bg-red-900 bg-opacity-20"
                        : "border-red-600 bg-red-50"
                      : isDark
                      ? "border-green-600 bg-green-900 bg-opacity-20"
                      : "border-green-600 bg-green-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{book.title}</h3>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{book.author}</p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                          📅 Borrowed: {new Date(book.borrowDate).toLocaleDateString()}
                        </span>
                        <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                          📆 Due: {new Date(book.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded font-bold text-sm ${
                          book.status === "overdue"
                            ? "bg-red-600 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {book.status === "overdue" ? (
                          <span>⚠️ {Math.abs(book.daysLeft)} days overdue</span>
                        ) : (
                          <span>✅ {book.daysLeft} days left</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Returned Books */}
      {activeTab === "returned" && (
        <div>
          {returnedBooks.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No returned books yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                    <th className="text-left px-4 py-2 font-semibold">Book Title</th>
                    <th className="text-left px-4 py-2 font-semibold">Author</th>
                    <th className="text-center px-4 py-2 font-semibold">Borrowed</th>
                    <th className="text-center px-4 py-2 font-semibold">Returned</th>
                    <th className="text-center px-4 py-2 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedBooks.map((book) => (
                    <tr
                      key={book.id}
                      className={`border-b ${isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <td className="px-4 py-3 font-semibold">{book.title}</td>
                      <td className="px-4 py-3">{book.author}</td>
                      <td className="px-4 py-3 text-center text-xs">
                        {new Date(book.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center text-xs">
                        {new Date(book.returnDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold">{book.daysKept} days</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Digital Library - Browse Books with Download */}
      {activeTab === "digital-library" && (
        <div>
          {/* Search Bar */}
          <div className="mb-6">
            <div
              className={`flex items-center px-4 py-2 rounded-lg border ${
                isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
              }`}
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 ml-2 bg-transparent outline-none ${
                  isDark
                    ? "text-white placeholder-gray-500"
                    : "text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className={`p-4 rounded-lg shadow-md transition hover:shadow-lg ${
                  isDark ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <BookOpenIcon className="h-8 w-8 text-blue-600" />
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      book.status === "available"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {book.status === "available" ? "✅ Available" : "Unavailable"}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1">{book.title}</h3>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {book.author}
                </p>
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  {book.year} • {book.category}
                </p>
                <button
                  onClick={() => handleDownload(book)}
                  className={`mt-4 w-full px-3 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    book.status === "available"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed opacity-50"
                  }`}
                  disabled={book.status !== "available"}
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  {book.status === "available" ? "Download" : "Unavailable"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

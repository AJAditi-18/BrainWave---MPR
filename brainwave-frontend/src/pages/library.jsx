import React, { useState } from "react";

// Sample book data
const books = [
  { title: "Introduction to Algorithms", author: "Cormen", status: "Issued", issuedTo: "Student Name", dueDate: "2025-10-15" },
  { title: "Clean Code", author: "Robert C. Martin", status: "Available" },
  { title: "React Handbook", author: "Flavio Copes", status: "Issued", issuedTo: "Amit Kumar", dueDate: "2025-10-22" },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", status: "Available" },
  // Add more books as needed
];

const statuses = ["All", "Available", "Issued"];

const Library = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const booksFiltered = books.filter((book) => {
    const matchStatus = filter === "All" ? true : book.status === filter;
    const matchSearch = book.title.toLowerCase().includes(search.toLowerCase())
      || (book.author && book.author.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const totalBooks = books.length;
  const issuedBooks = books.filter(b => b.status === "Issued").length;
  const availableBooks = books.filter(b => b.status === "Available").length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-brainwave-bg px-2 py-8">
      <div className="bg-brainwave-primary-glass rounded-2xl shadow-brainwave w-full max-w-3xl p-10">
        <h2 className="text-2xl font-extrabold text-brainwave-secondary mb-4 text-center">
          Library Management
        </h2>
        {/* Quick Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white rounded-lg px-6 py-3 text-center">
            <div className="text-brainwave-primary text-xl font-bold">{totalBooks}</div>
            <div className="text-brainwave-secondary text-sm mt-1">Total Books</div>
          </div>
          <div className="bg-white rounded-lg px-6 py-3 text-center">
            <div className="text-brainwave-primary text-xl font-bold">{availableBooks}</div>
            <div className="text-brainwave-secondary text-sm mt-1">Available</div>
          </div>
          <div className="bg-white rounded-lg px-6 py-3 text-center">
            <div className="text-brainwave-primary text-xl font-bold">{issuedBooks}</div>
            <div className="text-brainwave-secondary text-sm mt-1">Issued</div>
          </div>
        </div>
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-white text-brainwave-primary border border-gray-200 focus:ring-2 focus:ring-brainwave-secondary"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-white text-brainwave-primary border border-gray-200 px-4 py-2 rounded-lg"
          >
            {statuses.map(stat => (
              <option value={stat} key={stat}>{stat}</option>
            ))}
          </select>
        </div>
        {/* Book Table */}
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="p-3 text-left text-brainwave-primary">Title</th>
              <th className="p-3 text-left text-brainwave-primary">Author</th>
              <th className="p-3 text-left text-brainwave-primary">Status</th>
              <th className="p-3 text-left text-brainwave-primary">Issued To</th>
              <th className="p-3 text-left text-brainwave-primary">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {booksFiltered.length > 0 ? booksFiltered.map((book, idx) => (
              <tr key={idx} className="border-t border-brainwave-primary/10">
                <td className="p-3 text-brainwave-secondary">{book.title}</td>
                <td className="p-3 text-brainwave-secondary">{book.author}</td>
                <td className={`p-3 font-semibold ${book.status === "Available" ? "text-brainwave-accent" : "text-brainwave-primary"}`}>
                  {book.status}
                </td>
                <td className="p-3 text-brainwave-primary">{book.status === "Issued" ? book.issuedTo : "-"}</td>
                <td className="p-3 text-brainwave-primary">{book.status === "Issued" ? book.dueDate : "-"}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-3 text-center text-brainwave-primary opacity-60">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Library;

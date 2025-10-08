import React, { useState } from "react";

// Sample books and users
const initialBooks = [
  { id: 1, title: "Introduction to Algorithms", author: "Cormen", status: "Available", reservedBy: null, issuedTo: null, issuedDate: null, dueDate: null },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", status: "Issued", reservedBy: null, issuedTo: "Student Name", issuedDate: "2025-09-26", dueDate: "2025-10-05" },
  { id: 3, title: "React Handbook", author: "Flavio Copes", status: "Reserved", reservedBy: "Student Name", issuedTo: null, issuedDate: null, dueDate: null },
  { id: 4, title: "Modern OS", author: "Tanenbaum", status: "Available", reservedBy: null, issuedTo: null, issuedDate: null, dueDate: null },
];

const currentUser = { name: "Student Name", role: "Student" }; // Switch to "Admin" for admin

const bookRecommendations = [
  { title: "Atomic Habits", author: "James Clear" },
  { title: "Deep Work", author: "Cal Newport" },
];

function daysLate(due) {
  if (!due) return 0;
  const diff = (new Date() - new Date(due)) / (1000 * 60 * 60 * 24);
  return diff > 0 ? Math.floor(diff) : 0;
}

const LibraryPanel = () => {
  const [books, setBooks] = useState(initialBooks);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminBook, setAdminBook] = useState({ title: "", author: "" });

  // History: All books this user has issued
  const myHistory = initialBooks.filter(b => b.issuedTo === currentUser.name);

  const booksFiltered = books.filter(b => {
    const matchFilter = filter === "All" ? true : b.status === filter;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase())
      || b.author.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Book issue/return/reserve
  const issueBook = (id) => {
    setBooks(books.map(b =>
      b.id === id ? {
        ...b,
        status: "Issued",
        issuedTo: currentUser.name,
        issuedDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), // 7 days
        reservedBy: null
      } : b
    ));
  };

  const returnBook = (id) => {
    setBooks(books.map(b =>
      b.id === id ? { ...b, status: "Available", issuedTo: null, issuedDate: null, dueDate: null } : b
    ));
  };

  const reserveBook = (id) => {
    setBooks(books.map(b =>
      b.id === id ? { ...b, status: "Reserved", reservedBy: currentUser.name } : b
    ));
  };

  // Admin: Add book
  const handleAdminBook = (e) => setAdminBook({ ...adminBook, [e.target.name]: e.target.value });
  const addBook = (e) => {
    e.preventDefault();
    if (!adminBook.title || !adminBook.author) return;
    setBooks([
      ...books,
      { id: Date.now(), ...adminBook, status: "Available", reservedBy: null, issuedTo: null, issuedDate: null, dueDate: null }
    ]);
    setAdminBook({ title: "", author: "" });
    setShowAdminForm(false);
  };

  return (
    <div className="min-h-screen bg-brainwave-bg px-2 py-8 flex flex-col items-center">
      <div className="bg-brainwave-primary-glass rounded-2xl shadow-brainwave w-full max-w-4xl p-8 mb-8">
        <h2 className="text-2xl font-extrabold text-brainwave-secondary mb-5 text-center">
          Library Management
        </h2>

        {/* Admin - Add New Book */}
        {currentUser.role === "Admin" && (
          <>
            <button
              className="mb-4 bg-brainwave-secondary text-brainwave-primary px-3 py-1 font-bold rounded-lg"
              onClick={() => setShowAdminForm(f => !f)}
            >
              {showAdminForm ? "Cancel" : "Add Book"}
            </button>
            {showAdminForm &&
              <form onSubmit={addBook} className="mb-6 flex flex-col gap-2">
                <input name="title" placeholder="Title" className="px-3 py-2 rounded" value={adminBook.title} onChange={handleAdminBook} required />
                <input name="author" placeholder="Author" className="px-3 py-2 rounded" value={adminBook.author} onChange={handleAdminBook} required />
                <button className="bg-brainwave-accent text-brainwave-bg px-2 py-1 rounded" type="submit">Add</button>
              </form>
            }
          </>
        )}

        {/* Top Panel: Filter & Search */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8 mb-6">
          <input
            type="text"
            placeholder="Search books"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-white text-brainwave-primary border border-brainwave-secondary"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-white text-brainwave-primary border border-brainwave-secondary px-4 py-2 rounded-lg"
          >
            {["All", "Available", "Issued", "Reserved"].map(stat =>
              <option value={stat} key={stat}>{stat}</option>)
            }
          </select>
        </div>

        {/* Book Table */}
        <table className="w-full bg-white rounded-lg overflow-hidden mb-8">
          <thead>
            <tr>
              <th className="p-3 text-left text-brainwave-primary">Title</th>
              <th className="p-3 text-left text-brainwave-primary">Author</th>
              <th className="p-3 text-left text-brainwave-primary">Status</th>
              <th className="p-3 text-left text-brainwave-primary">Due/Reserved</th>
              <th className="p-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {booksFiltered.length === 0 && (
              <tr><td colSpan={5} className="text-center p-3 text-gray-500">No books found.</td></tr>
            )}
            {booksFiltered.map((b, idx) => (
              <tr key={b.id} className="border-t border-brainwave-primary/10">
                <td className="p-3 text-brainwave-secondary">{b.title}</td>
                <td className="p-3 text-brainwave-primary">{b.author}</td>
                <td className={`p-3 font-bold capitalize ${b.status === "Available" ? "text-brainwave-accent" :
                  b.status === "Issued" ? "text-brainwave-primary" : "text-yellow-500"}`}>
                  {b.status}
                </td>
                <td className="p-3 text-xs">
                  {b.dueDate && b.status === "Issued" && (
                    <>
                      Due: <span className={daysLate(b.dueDate) > 0 ? "text-red-500 font-bold" : "text-green-600"}>
                        {b.dueDate}
                      </span>
                      {daysLate(b.dueDate) > 0 && (
                        <span> (Late: {daysLate(b.dueDate)} day{daysLate(b.dueDate) > 1 ? "s" : ""})</span>
                      )}
                    </>
                  )}
                  {b.reservedBy && b.status === "Reserved" && (<>
                    <span>Reserved by <span className="font-semibold">{b.reservedBy}</span></span>
                  </>)}
                </td>
                {/* Action Buttons */}
                <td className="p-3">
                  {currentUser.role === "Student" && (
                    <>
                      {b.status === "Available" &&
                        <button onClick={() => issueBook(b.id)} className="bg-brainwave-accent text-brainwave-bg px-2 py-1 rounded">
                          Issue
                        </button>
                      }
                      {b.status === "Issued" && b.issuedTo === currentUser.name &&
                        <button onClick={() => returnBook(b.id)} className="bg-brainwave-primary text-brainwave-secondary px-2 py-1 rounded">
                          Return
                        </button>
                      }
                      {b.status === "Available" &&
                        <button onClick={() => reserveBook(b.id)} className="ml-3 bg-yellow-300 text-yellow-900 px-2 py-1 rounded">
                          Reserve
                        </button>
                      }
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* My Issue History */}
        <h3 className="text-brainwave-secondary text-xl font-bold mb-3">My Issued Books & Fines</h3>
        <table className="w-full bg-white rounded-lg overflow-hidden mb-8">
          <thead>
            <tr>
              <th className="p-3 text-left text-brainwave-primary">Title</th>
              <th className="p-3 text-left text-brainwave-primary">Issued Date</th>
              <th className="p-3 text-left text-brainwave-primary">Due Date</th>
              <th className="p-3 text-left text-brainwave-primary">Fine</th>
            </tr>
          </thead>
          <tbody>
            {myHistory.length === 0 && <tr><td colSpan={4} className="p-3 text-gray-500 text-center">No books issued yet.</td></tr>}
            {myHistory.map(b => (
              <tr key={b.id} className="border-t border-brainwave-primary/10">
                <td className="p-3 text-brainwave-secondary">{b.title}</td>
                <td className="p-3">{b.issuedDate}</td>
                <td className="p-3">{b.dueDate}</td>
                <td className="p-3 font-bold">
                  {daysLate(b.dueDate) > 0
                    ? <span className="text-red-500">₹{daysLate(b.dueDate) * 2}</span>
                    : <span className="text-green-600">No fine</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Book Recommendations */}
        <h3 className="text-brainwave-secondary text-xl font-bold mb-3">Recommended Reads</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {bookRecommendations.map((b, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg">
              <div className="font-bold text-brainwave-primary">{b.title}</div>
              <div className="text-brainwave-secondary">{b.author}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryPanel;

import React, { useState } from "react";

// Example user roles
const currentUser = { name: "Student Name", role: "Student" }; // "Teacher" or "Admin" for admin view

// FAQs/help topics
const faqs = [
  { q: "How to reset password?", a: "Go to profile settings, click 'Change Password'." },
  { q: "Who do I contact for exam queries?", a: "Reach out to your subject teacher via email or support ticket." },
  { q: "Can I update submitted assignments?", a: "Contact your course teacher, or resubmit before the deadline." }
];

// Demo ticket/issue data
const initialTickets = [
  { id: 1, user: "Student Name", topic: "Login Issue", message: "Can't log in with my email.", status: "Open", reply: "" },
  { id: 2, user: "Amit Kumar", topic: "Feedback on Course", message: "The video lessons are great!", status: "Resolved", reply: "Thank you for your feedback!" },
];

// Feedback areas
const feedbackAreas = ["Course", "Teacher", "System", "Library", "Other"];

const FeedbackSupportPanel = () => {
  const [feedback, setFeedback] = useState({ area: "Course", rating: 5, comment: "" });
  const [tickets, setTickets] = useState(initialTickets);
  const [ticket, setTicket] = useState({ topic: "", message: "" });
  const [showFaq, setShowFaq] = useState(false);
  const [adminReply, setAdminReply] = useState({}); // { [ticketId]: replyMsg }

  // Submit feedback
  const submitFeedback = e => {
    e.preventDefault();
    alert("Thank you for your feedback!");
    setFeedback({ area: "Course", rating: 5, comment: "" });
  };

  // Submit new support ticket
  const submitTicket = e => {
    e.preventDefault();
    if (!ticket.topic || !ticket.message) return;
    setTickets([
      ...tickets,
      {
        id: Date.now(),
        user: currentUser.name,
        topic: ticket.topic,
        message: ticket.message,
        status: "Open",
        reply: ""
      }
    ]);
    setTicket({ topic: "", message: "" });
  };

  // Admin/teacher reply to ticket
  const handleReplyChange = (id, val) => setAdminReply({ ...adminReply, [id]: val });
  const sendAdminReply = id => {
    setTickets(tickets.map(t =>
      t.id === id
        ? { ...t, reply: adminReply[id], status: "Resolved" }
        : t
    ));
    setAdminReply({ ...adminReply, [id]: "" });
  };

  return (
    <div className="min-h-screen bg-brainwave-bg px-2 py-8 flex flex-col items-center">
      <div className="bg-brainwave-primary-glass rounded-2xl shadow-brainwave w-full max-w-3xl p-8 mb-8">

        <h2 className="text-2xl font-extrabold text-brainwave-secondary mb-6 text-center">
          Feedback & Support
        </h2>

        {/* Feedback Form */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-brainwave-primary mb-3">Send Feedback</h3>
          <form onSubmit={submitFeedback} className="flex flex-col gap-2">
            <select
              value={feedback.area}
              onChange={e => setFeedback({ ...feedback, area: e.target.value })}
              className="px-4 py-2 rounded-lg border border-brainwave-accent bg-white text-brainwave-primary">
              {feedbackAreas.map(area =>
                <option key={area} value={area}>{area}</option>
              )}
            </select>
            <div className="flex items-center gap-3">
              <label className="text-brainwave-secondary font-semibold">Rating:</label>
              {[1,2,3,4,5].map(num =>
                <span
                  key={num}
                  className={`cursor-pointer text-2xl ${num <= feedback.rating ? "text-brainwave-accent" : "text-brainwave-primary/30"}`}
                  onClick={() => setFeedback({ ...feedback, rating: num })}
                >
                  ★
                </span>
              )}
            </div>
            <textarea
              value={feedback.comment}
              onChange={e => setFeedback({ ...feedback, comment: e.target.value })}
              className="px-3 py-2 border rounded-lg"
              placeholder="Your feedback..."
            />
            <button className="bg-brainwave-secondary text-brainwave-primary px-4 py-2 font-bold rounded-lg mt-2" type="submit">Submit</button>
          </form>
        </div>

        {/* Support Ticket Form */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-brainwave-primary mb-3">Contact Support / Raise Issue</h3>
          <form onSubmit={submitTicket} className="flex flex-col gap-2 mb-4">
            <input
              value={ticket.topic}
              onChange={e => setTicket({ ...ticket, topic: e.target.value })}
              placeholder="Issue Topic"
              className="px-3 py-2 border rounded-lg"
              required
            />
            <textarea
              value={ticket.message}
              onChange={e => setTicket({ ...ticket, message: e.target.value })}
              placeholder="Describe your issue"
              className="px-3 py-2 border rounded-lg"
              required
            />
            <button className="bg-brainwave-primary text-brainwave-secondary px-4 py-2 font-bold rounded-lg" type="submit">
              Submit
            </button>
          </form>
          {/* Tickets list */}
          <table className="w-full bg-white rounded-lg overflow-hidden mt-2">
            <thead>
              <tr>
                <th className="p-2 text-brainwave-primary text-left">Topic</th>
                <th className="p-2 text-brainwave-primary text-left">Message</th>
                <th className="p-2 text-brainwave-primary text-left">Status</th>
                <th className="p-2 text-brainwave-primary text-left">Reply</th>
              </tr>
            </thead>
            <tbody>
              {tickets
                .filter(t =>
                  currentUser.role === "Student"
                    ? t.user === currentUser.name
                    : true
                )
                .map(t => (
                  <tr key={t.id} className="border-t border-brainwave-primary/10">
                    <td className="p-2 font-bold text-brainwave-secondary">{t.topic}</td>
                    <td className="p-2 text-brainwave-primary">{t.message}</td>
                    <td className={`p-2 font-bold ${t.status === "Resolved" ? "text-green-600" : "text-brainwave-accent"}`}>{t.status}</td>
                    <td className="p-2 text-xs">
                      {t.reply
                        ? <span className="text-green-700 font-bold">{t.reply}</span>
                        : (currentUser.role !== "Student" &&
                          <>
                            <input
                              type="text"
                              value={adminReply[t.id] || ""}
                              onChange={e => handleReplyChange(t.id, e.target.value)}
                              className="border rounded px-2 py-1 w-24"
                            />
                            <button
                              className="bg-brainwave-accent px-2 py-1 font-bold rounded ml-1"
                              onClick={() => sendAdminReply(t.id)}
                            >
                              Reply
                            </button>
                          </>
                        )
                      }
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        {/* FAQ / Help Section */}
        <div className="mb-10">
          <button
            onClick={() => setShowFaq(f => !f)}
            className="bg-brainwave-secondary text-brainwave-primary font-bold px-2 py-1 rounded mb-2"
          >
            {showFaq ? "Hide FAQ/Help" : "Show FAQ/Help"}
          </button>
          {showFaq && (
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-lg font-bold text-brainwave-primary mb-2">FAQ / Help</h3>
              <ul className="list-disc list-inside space-y-2">
                {faqs.map((faq, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-brainwave-secondary">{faq.q}</span>
                    <br/>
                    <span className="text-brainwave-accent">{faq.a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSupportPanel;

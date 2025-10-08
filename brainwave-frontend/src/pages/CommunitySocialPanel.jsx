import React, { useState } from "react";

// Demo users (for message form and blog)
const currentUser = { name: "Student Name", role: "Student" };

// DEMO: Discussion board
const initialThreads = [
  {
    id: 1,
    topic: "Best strategies for AI exam?",
    author: "Priya Patel",
    replies: [
      { author: "Ananya Singh", content: "Practice last year papers!" },
      { author: "Rahul Kumar", content: "Focus on neural nets & Bayesian concepts." }
    ]
  },
  {
    id: 2,
    topic: "Cultural Fest - Team Forming",
    author: "Cultural Club",
    replies: [
      { author: "Sunil Joshi", content: "Can I join the dance team?" }
    ]
  }
];

// DEMO: Direct messaging
const demoStudents = [
  { name: "Ananya Singh" },
  { name: "Rahul Kumar" },
  { name: "Priya Patel" }
];

// DEMO: Blog/news feed
const initialBlog = [
  { user: "Prof. Mehrotra", title: "New Research Grant!", content: "Congrats to AI students for securing the project grant.", likes: 3, comments: [{ user: "Amit Kumar", text: "Congrats!" }] },
  { user: "Cultural Club", title: "Flashmob this Friday", content: "Be there 4 pm, in central quad! All welcome.", likes: 5, comments: [] }
];

// DEMO: Clubs/Groups
const allClubs = [
  { name: "AI Club", desc: "Projects, talks, hackathons.", joined: false },
  { name: "Dance Society", desc: "All dance, all forms!", joined: true },
  { name: "Literary Circle", desc: "Poetry, debate, writing.", joined: false }
];

const CommunitySocialPanel = () => {
  const [threads, setThreads] = useState(initialThreads);
  const [newThread, setNewThread] = useState("");
  const [newReply, setNewReply] = useState({});
  const [messages, setMessages] = useState([]);
  const [selectedMsgUser, setSelectedMsgUser] = useState("");
  const [msgText, setMsgText] = useState("");
  const [clubList, setClubList] = useState(allClubs);
  const [blog, setBlog] = useState(initialBlog);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [commentDraft, setCommentDraft] = useState({});

  // Discussion: Create thread
  const postThread = e => {
    e.preventDefault();
    if (newThread)
      setThreads([{ id: Date.now(), topic: newThread, author: currentUser.name, replies: [] }, ...threads]);
    setNewThread("");
  };

  // Discussion: Add reply
  const postReply = (id) => {
    if (!newReply[id]) return;
    setThreads(threads.map(t =>
      t.id === id ? { ...t, replies: [...t.replies, { author: currentUser.name, content: newReply[id] }] } : t
    ));
    setNewReply({ ...newReply, [id]: "" });
  };

  // Direct messaging (simple, demo)
  const sendMessage = e => {
    e.preventDefault();
    if (!selectedMsgUser || !msgText) return;
    setMessages([
      ...messages,
      { to: selectedMsgUser, from: currentUser.name, text: msgText, time: "Now" }
    ]);
    setMsgText("");
  };

  // Club join/leave
  const handleClub = idx => {
    setClubList(clubList.map((c, i) =>
      i === idx ? { ...c, joined: !c.joined } : c
    ));
  };

  // Blog: Add post
  const postBlog = e => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;
    setBlog([{ user: currentUser.name, title: blogTitle, content: blogContent, likes: 0, comments: [] }, ...blog]);
    setBlogTitle(""); setBlogContent("");
  };

  // Blog: Like
  const likeBlog = idx => {
    setBlog(blog.map((b, i) => i === idx ? { ...b, likes: b.likes + 1 } : b));
  };

  // Blog: Add comment
  const addComment = (idx) => {
    if (!commentDraft[idx]) return;
    setBlog(blog.map((b, i) =>
      i === idx
        ? { ...b, comments: [...b.comments, { user: currentUser.name, text: commentDraft[idx] }] }
        : b
    ));
    setCommentDraft({ ...commentDraft, [idx]: "" });
  };

  return (
    <div className="min-h-screen bg-brainwave-bg px-2 py-8 flex flex-col items-center">
      <div className="bg-brainwave-primary-glass rounded-2xl shadow-brainwave w-full max-w-5xl p-8 mb-8">

        <h2 className="text-2xl font-extrabold text-brainwave-secondary mb-6 text-center">
          Community & Social
        </h2>

        {/* Forums / Discussion Board */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-brainwave-primary mb-3">Discussion Board / Forum</h3>
          <form onSubmit={postThread} className="flex gap-2 mb-2">
            <input value={newThread} onChange={e => setNewThread(e.target.value)} className="flex-1 px-2 py-1 border rounded" placeholder="Ask a question or start discussion..." />
            <button className="bg-brainwave-secondary text-brainwave-primary font-bold px-2 py-1 rounded" type="submit">Post</button>
          </form>
          {threads.map(th => (
            <div key={th.id} className="bg-white rounded-lg mb-3 p-3">
              <div className="font-bold text-brainwave-primary">{th.topic}</div>
              <div className="text-xs text-brainwave-accent mb-2">By {th.author}</div>
              <div className="ml-2 border-l-2 pl-3 border-brainwave-accent space-y-1">
                {th.replies.map((r, i) =>
                  <div key={i} className="text-brainwave-secondary text-sm">{r.author}: {r.content}</div>
                )}
                <form
                  onSubmit={e => { e.preventDefault(); postReply(th.id); }}
                  className="mt-2 flex gap-1"
                >
                  <input value={newReply[th.id] || ""} onChange={e => setNewReply({ ...newReply, [th.id]: e.target.value })} className="flex-1 rounded px-2 py-1 border" placeholder="Reply..." />
                  <button className="bg-brainwave-accent px-2 rounded" type="submit">Reply</button>
                </form>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Messaging */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-brainwave-primary mb-3">Direct Messaging</h3>
          <form onSubmit={sendMessage} className="flex gap-2 mb-2">
            <select value={selectedMsgUser} onChange={e => setSelectedMsgUser(e.target.value)} className="rounded px-2 py-1 border">
              <option value="">Select User</option>
              {demoStudents.filter(u => u.name !== currentUser.name).map((u, i) =>
                <option key={i}>{u.name}</option>
              )}
            </select>
            <input value={msgText} onChange={e => setMsgText(e.target.value)} className="flex-1 rounded px-2 py-1 border" placeholder="Type a message..." />
            <button className="bg-brainwave-primary text-brainwave-secondary font-bold px-2 rounded" type="submit">Send</button>
          </form>
          <div className="max-h-24 overflow-y-auto bg-white rounded-lg p-2 text-sm space-y-1">
            {messages.length === 0 && <div className="opacity-50">No messages yet.</div>}
            {messages.filter(m => m.to === currentUser.name || m.from === currentUser.name).map((m, i) =>
              <div key={i} className={`flex gap-2 ${m.from === currentUser.name ? "justify-end" : "justify-start"}`}>
                <span className={`rounded px-2 py-1 ${m.from === currentUser.name ? "bg-brainwave-accent text-brainwave-bg" : "bg-brainwave-primary text-brainwave-secondary"}`}>
                  <b>{m.from === currentUser.name ? "Me" : m.from}</b>: {m.text}
                </span>
                <span className="text-xs text-gray-400">{m.time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Class Blog / News Feed */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-brainwave-primary mb-3">Class Blog & News Feed</h3>
          <form onSubmit={postBlog} className="flex flex-col md:flex-row gap-2 mb-2">
            <input value={blogTitle} onChange={e => setBlogTitle(e.target.value)} className="rounded px-2 py-1 border flex-1" placeholder="Blog Title" />
            <input value={blogContent} onChange={e => setBlogContent(e.target.value)} className="rounded px-2 py-1 border flex-1" placeholder="What's up?" />
            <button className="bg-brainwave-primary text-brainwave-secondary font-bold px-2 py-1 rounded" type="submit">Post</button>
          </form>
          <div className="space-y-3">
            {blog.map((b, idx) =>
              <div key={idx} className="bg-white rounded-lg p-3">
                <div className="font-bold text-brainwave-primary">{b.title} <span className="text-xs text-brainwave-accent">by {b.user}</span></div>
                <div className="text-brainwave-secondary mb-1">{b.content}</div>
                <button className="text-brainwave-accent mr-2 font-bold" onClick={() => likeBlog(idx)}>♥ {b.likes}</button>
                <div className="mt-2 ml-2 border-l-2 pl-3 border-brainwave-accent">
                  {b.comments.map((c, i) =>
                    <div key={i} className="text-xs text-brainwave-primary"><b>{c.user}:</b> {c.text}</div>
                  )}
                  <form
                    className="flex gap-1 items-center mt-2"
                    onSubmit={e => { e.preventDefault(); addComment(idx); }}
                  >
                    <input value={commentDraft[idx] || ""} onChange={e => setCommentDraft({ ...commentDraft, [idx]: e.target.value })} className="rounded px-1 py-0.5 border text-xs" placeholder="Comment..." />
                    <button className="bg-brainwave-accent px-1 rounded text-xs font-bold" type="submit">Add</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Club/Group List */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-brainwave-primary mb-3">Clubs & Groups</h3>
          <div className="space-y-2">
            {clubList.map((club, idx) =>
              <div key={idx} className="bg-white rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-brainwave-primary">{club.name}</div>
                  <div className="text-xs text-brainwave-secondary">{club.desc}</div>
                </div>
                <button
                  className={`rounded px-3 py-1 font-bold ${club.joined ? "bg-brainwave-primary text-brainwave-secondary" : "bg-brainwave-accent text-brainwave-bg"}`}
                  onClick={() => handleClub(idx)}
                >
                  {club.joined ? "Leave" : "Join"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySocialPanel;

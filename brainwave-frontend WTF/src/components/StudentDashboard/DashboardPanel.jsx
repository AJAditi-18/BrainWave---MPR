import React, { useState, useEffect } from 'react';

const DashboardPanel = () => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/student';
  const [studentInfo, setStudentInfo] = useState(null);
  const [marks, setMarks] = useState([]);
  const [cgpa, setCgpa] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [library, setLibrary] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [notes, setNotes] = useState([]);
  const [nextExam, setNextExam] = useState(null);
  const [isEditingTimetable, setIsEditingTimetable] = useState(false);

  const studentId = localStorage.getItem('studentId') || '1';
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const SLOTS = ['8:00-9:00', '9:00-10:00', '10:00-11:00', '11:00-12:00', '12:30-1:30', '1:30-2:30'];
  const LOGO_URL = 'https://agi-prod-file-upload-public-main-use1.s3.amazonaws.com/5c8f4b9f-ba7c-4fb9-9f91-30e234455dbd';

  // Fetch Student Info
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const res = await fetch(`${API_BASE}/overview/${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setStudentInfo(data.profile);
        }
      } catch (err) {
        console.error('Error fetching student info:', err);
      }
    };
    fetchStudentInfo();
  }, [studentId]);

  // Fetch Marks
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await fetch(`${API_BASE}/marks/${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setMarks(data.marks || []);
        }
      } catch (err) {
        console.error('Error fetching marks:', err);
      }
    };
    fetchMarks();
  }, [studentId]);

  // Fetch CGPA & Leaderboard
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const infoRes = await fetch(`${API_BASE}/overview/${studentId}`);
        if (!infoRes.ok) return;

        const info = await infoRes.json();
        setCgpa(info.cgpa);

        const classId = info.profile.classid || 1;
        const lbRes = await fetch(`${API_BASE}/leaderboard/${classId}`);
        if (lbRes.ok) {
          const lb = await lbRes.json();
          setLeaderboard(lb);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };
    fetchLeaderboardData();
  }, [studentId]);

  // Fetch Alumni
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await fetch(`${API_BASE}/alumni`);
        if (res.ok) {
          const data = await res.json();
          setAlumni(data);
        }
      } catch (err) {
        console.error('Error fetching alumni:', err);
      }
    };
    fetchAlumni();
  }, []);

  // Fetch Library
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch(`${API_BASE}/library-history/${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setLibrary(data);
        }
      } catch (err) {
        console.error('Error fetching library:', err);
      }
    };
    fetchLibrary();
  }, [studentId]);

  // Fetch Notes & Digital Books
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${API_BASE}/coursework/${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setNotes(data.notes || []);
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };
    fetchNotes();
  }, [studentId]);

  // Fetch Timetable
  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const res = await fetch(`${API_BASE}/timetable/${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setTimetable(data);
        } else {
          const saved = localStorage.getItem('student_timetable');
          if (saved) setTimetable(JSON.parse(saved));
        }
      } catch (err) {
        const saved = localStorage.getItem('student_timetable');
        if (saved) setTimetable(JSON.parse(saved));
      }
    };
    fetchTimetableData();
  }, [studentId]);

  // Fetch Calendar Events (for Next Exam)
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch(`${API_BASE}/calendar/${studentId}`);
        if (res.ok) {
          const events = await res.json();
          const today = new Date();
          const exams = events.filter(e => e.type === 'exam' && new Date(e.date) >= today);
          if (exams.length) {
            exams.sort((a, b) => new Date(a.date) - new Date(b.date));
            setNextExam(exams[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching calendar:', err);
      }
    };
    fetchCalendar();
  }, [studentId]);

  // Save Timetable
  const saveTimetable = async () => {
    try {
      const res = await fetch(`${API_BASE}/timetable/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timetable),
      });
      if (res.ok) {
        alert('✅ Timetable saved to backend!');
      } else {
        localStorage.setItem('student_timetable', JSON.stringify(timetable));
        alert('✅ Timetable saved locally!');
      }
    } catch (err) {
      localStorage.setItem('student_timetable', JSON.stringify(timetable));
      alert('✅ Timetable saved locally!');
    }
    setIsEditingTimetable(false);
  };

  const handleTimetableChange = (day, slot, value) => {
    setTimetable(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: value
      }
    }));
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header with Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <img 
          src={LOGO_URL} 
          alt="Brainwave Logo" 
          style={{ width: '56px', height: '56px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          draggable="false"
        />
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#123e60', margin: '0' }}>Brainwave Student Dashboard</h1>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 2px 5px rgba(20,50,80,0.06)' }}>
          <p style={{ fontSize: '0.95rem', color: '#657080', margin: '0 0 0.3rem 0' }}>Roll Number</p>
          <p style={{ fontSize: '1.35rem', fontWeight: '600', color: '#313d4b', margin: '0' }}>{studentInfo?.rollno || '-'}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 2px 5px rgba(20,50,80,0.06)' }}>
          <p style={{ fontSize: '0.95rem', color: '#657080', margin: '0 0 0.3rem 0' }}>Email</p>
          <p style={{ fontSize: '1.35rem', fontWeight: '600', color: '#313d4b', margin: '0' }}>{studentInfo?.email || '-'}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.2rem', boxShadow: '0 2px 5px rgba(20,50,80,0.06)' }}>
          <p style={{ fontSize: '0.95rem', color: '#657080', margin: '0 0 0.3rem 0' }}>Shift</p>
          <p style={{ fontSize: '1.35rem', fontWeight: '600', color: '#313d4b', margin: '0' }}>{studentInfo?.shift || '-'}</p>
        </div>
      </div>

      {/* Next Exam & Marks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Next Exam */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.65rem', boxShadow: '0 2px 6px rgba(20,50,80,0.04)' }}>
          <h3 style={{ fontSize: '1.22rem', fontWeight: '600', color: '#123e60', marginTop: '0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⏰ Next Exam
          </h3>
          {nextExam ? (
            <div>
              <p style={{ fontSize: '1.02rem', color: '#313d4b', margin: '0.3rem 0' }}><strong>{nextExam.title}</strong></p>
              <p style={{ fontSize: '0.97rem', color: '#657080', margin: '0.3rem 0' }}>📅 {new Date(nextExam.date).toLocaleDateString()}</p>
              <p style={{ fontSize: '0.97rem', color: '#657080', margin: '0.3rem 0' }}>{nextExam.description}</p>
            </div>
          ) : (
            <p style={{ fontSize: '0.97rem', color: '#657080' }}>No upcoming exams scheduled.</p>
          )}
        </div>

        {/* Marks */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.65rem', boxShadow: '0 2px 6px rgba(20,50,80,0.04)' }}>
          <h3 style={{ fontSize: '1.22rem', fontWeight: '600', color: '#123e60', marginTop: '0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📊 Marks
          </h3>
          {marks.length ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.99rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#d8e6ee' }}>
                  <th style={{ padding: '0.4rem 0.8rem', textAlign: 'left', fontWeight: '600', color: '#123e60' }}>Subject</th>
                  <th style={{ padding: '0.4rem 0.8rem', textAlign: 'left', fontWeight: '600', color: '#123e60' }}>Marks</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.4rem 0.8rem', color: '#313d4b' }}>{m.subject}</td>
                    <td style={{ padding: '0.4rem 0.8rem', color: '#313d4b' }}>{m.scored || m.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontSize: '0.97rem', color: '#657080' }}>No marks records available.</p>
          )}
        </div>
      </div>

      {/* CGPA & Leaderboard */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.65rem', marginBottom: '2rem', boxShadow: '0 2px 6px rgba(20,50,80,0.04)' }}>
        <h3 style={{ fontSize: '1.22rem', fontWeight: '600', color: '#123e60', marginTop: '0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⭐ CGPA & Leaderboard
        </h3>
        <p style={{ fontSize: '1.02rem', color: '#313d4b', marginBottom: '1rem' }}>Your CGPA: <strong>{cgpa || 'N/A'}</strong></p>
        {leaderboard.length ? (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.99rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '0.4rem 0.8rem', textAlign: 'left', fontWeight: '600', color: '#657080' }}>Rank</th>
                  <th style={{ padding: '0.4rem 0.8rem', textAlign: 'left', fontWeight: '600', color: '#657080' }}>Name</th>
                  <th style={{ padding: '0.4rem 0.8rem', textAlign: 'left', fontWeight: '600', color: '#657080' }}>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: idx === 0 ? '#d8e6ee' : 'transparent' }}>
                    <td style={{ padding: '0.4rem 0.8rem', color: '#313d4b', fontWeight: idx === 0 ? '600' : '400' }}>{idx + 1}</td>
                    <td style={{ padding: '0.4rem 0.8rem', color: '#313d4b', fontWeight: idx === 0 ? '600' : '400' }}>{s.name || '-'}</td>
                    <td style={{ padding: '0.4rem 0.8rem', color: '#313d4b', fontWeight: idx === 0 ? '600' : '400' }}>{s.avgmarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '0.97rem', color: '#657080' }}>No leaderboard data available.</p>
        )}
      </div>

      {/* Library & Alumni */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.65rem', marginBottom: '2rem', boxShadow: '0 2px 6px rgba(20,50,80,0.04)' }}>
        <h3 style={{ fontSize: '1.22rem', fontWeight: '600', color: '#123e60', marginTop: '0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📚 Library & Alumni Connect
        </h3>
        <p style={{ fontSize: '0.97rem', color: '#e79c38', fontWeight: '500', marginBottom: '1rem' }}>
          Books borrowed: <b>{library.length}</b>
        </p>
        <h4 style={{ color: '#123e60', fontWeight: '600', marginTop: '1rem', marginBottom: '0.5rem' }}>👥 Alumni Connect</h4>
        <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {alumni.map((a, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#313d4b' }}>
              👤
              <span>{a.name} ({a.year || a.batch})</span>
              {a.linkedin && <a href={a.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#1a4e6a', textDecoration: 'none', fontSize: '0.97rem', marginLeft: '0.3rem' }}>LinkedIn</a>}
            </li>
          ))}
        </ul>
      </div>

      {/* Timetable */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.65rem', marginBottom: '2rem', boxShadow: '0 2px 6px rgba(20,50,80,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.22rem', fontWeight: '600', color: '#123e60', margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📅 Timetable
          </h3>
          <button
            onClick={() => isEditingTimetable ? saveTimetable() : setIsEditingTimetable(true)}
            style={{
              padding: '0.45rem 1.2rem',
              background: isEditingTimetable ? '#389e82' : '#123e60',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            {isEditingTimetable ? '💾 Save' : '✏️ Edit'}
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #1a4e6a' }}>
                <th style={{ padding: '0.6rem', textAlign: 'left', fontWeight: '600', color: '#123e60' }}>Time</th>
                {DAYS.map(day => (
                  <th key={day} style={{ padding: '0.6rem', textAlign: 'center', fontWeight: '600', color: '#123e60' }}>{day.slice(0, 3)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map(slot => (
                <tr key={slot} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.6rem', fontWeight: '600', color: '#313d4b' }}>{slot}</td>
                  {DAYS.map(day => (
                    <td key={`${day}-${slot}`} style={{ padding: '0.6rem', textAlign: 'center' }}>
                      {isEditingTimetable ? (
                        <input
                          type="text"
                          value={timetable[day]?.[slot] || ''}
                          onChange={(e) => handleTimetableChange(day, slot, e.target.value)}
                          placeholder="Subject"
                          style={{
                            width: '90%',
                            padding: '0.3rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.4rem',
                            fontSize: '0.9rem'
                          }}
                        />
                      ) : (
                        <span style={{ color: '#313d4b', fontSize: '0.95rem' }}>{timetable[day]?.[slot] || '-'}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.91rem', color: '#657080', marginTop: '0.8rem' }}>(Timetable saves locally if no backend support)</p>
      </div>

      {/* Digital Books & Notes */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1.65rem', boxShadow: '0 2px 6px rgba(20,50,80,0.04)' }}>
        <h3 style={{ fontSize: '1.22rem', fontWeight: '600', color: '#123e60', marginTop: '0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📖 Digital Books & Notes
        </h3>
        {notes.length ? (
          <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '200px', overflowY: 'auto' }}>
            {notes.map((n, idx) => (
              <li key={idx} style={{ padding: '0.6rem', background: '#fafbfc', borderRadius: '0.5rem', borderLeft: '3px solid #1a4e6a' }}>
                <a href={n.fileurl} target="_blank" rel="noopener noreferrer" style={{ color: '#1a4e6a', textDecoration: 'none', fontWeight: '600' }}>
                  📄 {n.title || 'Document'}
                </a>
                <p style={{ fontSize: '0.92rem', color: '#657080', margin: '0.3rem 0 0 0' }}>{n.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '0.97rem', color: '#657080' }}>No notes or digital books available.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPanel;

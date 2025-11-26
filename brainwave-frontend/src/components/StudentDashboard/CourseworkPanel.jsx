// CourseworkPanel.jsx
import React, { useState, useRef, useEffect } from 'react';

// URLs to example PDF attachments. Replace with real URLs or static/public folder in production.
const ATTACHMENT_LINKS = {
  'OWASP_Top10_Questions.pdf': 'https://owasp.org/www-project-web-security-testing-guide/assets/archive/OWASP_Testing_Guide_v4.pdf',
  'ShellScript_Assignment.pdf': 'https://dot.gov.in/sites/default/files/Operating%20System%20Draft%20for%20Comments%20ITSAR.pdf',
  'OpenGL_CubeTask.pdf': 'https://math.hws.edu/eck/cs424/downloads/graphicsbook-linked.pdf',
  'ML_Regression_Requirements.pdf': 'https://www.dgp.toronto.edu/~hertzman/mlcg2003/hertzmann-mlcg2003.pdf'
};

const SUBJECTS = [
  "Web Security",
  "OS and Linux",
  "Computer Graphics",
  "Cloud Computing",
  "Machine Learning"
];

const DEFAULT_ASSIGNMENTS = [
  {
    id: 1,
    subject: 'Web Security',
    title: 'OWASP Top 10 Research',
    description: 'Research and document each OWASP Top 10 vulnerability with real-world examples.',
    dueDate: '2025-12-01',
    attachment: 'OWASP_Top10_Questions.pdf',
    attachmentSize: '2.4 MB'
  },
  {
    id: 2,
    subject: 'OS and Linux',
    title: 'Shell Script Practice',
    description: 'Submit a shell script that backs up user files and explains the code.',
    dueDate: '2025-12-02',
    attachment: 'ShellScript_Assignment.pdf',
    attachmentSize: '1.1 MB'
  },
  {
    id: 3,
    subject: 'Computer Graphics',
    title: '3D Cube in OpenGL',
    description: 'Code a wireframe rotating 3D cube using OpenGL and submit output screenshot.',
    dueDate: '2025-12-05',
    attachment: 'OpenGL_CubeTask.pdf',
    attachmentSize: '3.5 MB'
  },
  {
    id: 4,
    subject: 'Cloud Computing',
    title: 'Cloud Providers Comparison',
    description: 'Create a table comparing AWS, Azure, GCP on 5 parameters.',
    dueDate: '2025-12-06',
    attachment: null,
    attachmentSize: null
  },
  {
    id: 5,
    subject: 'Machine Learning',
    title: 'Linear Regression Mini-Project',
    description: 'Implement linear regression from scratch and upload Jupyter notebook.',
    dueDate: '2025-12-10',
    attachment: 'ML_Regression_Requirements.pdf',
    attachmentSize: '1.8 MB'
  }
];

const TEACHER_NOTES = [
  { text: 'MPR Meet to be held on Tuesday. Please check your calendar.', subject: 'Web Security' },
  { text: '2 Units done for Web Security, 1 more left.', subject: 'Web Security' },
  { text: 'Mid-sem progress for ML will be updated soon.', subject: 'Machine Learning' },
  { text: 'Lab evaluation for Computer Graphics on Monday.', subject: 'Computer Graphics' },
  { text: 'Unit test for OS and Linux next week.', subject: 'OS and Linux' }
];

const getStorageKey = () => `student_assignment_submissions`;

const CourseworkPanel = () => {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [assignments] = useState(DEFAULT_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem(getStorageKey());
    if (raw) {
      setSubmissions(JSON.parse(raw));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(submissions));
  }, [submissions]);

  const handleSubjectChange = (e) => setSelectedSubject(e.target.value);

  const filteredAssignments = assignments.filter(a => a.subject === selectedSubject);

  const handleFileSelect = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(prev => ({
        ...prev,
        [id]: {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
        }
      }));
    }
  };

  const handleSubmit = (id) => {
    if (!selectedFile[id]) {
      alert('⚠️ Please select a file to submit!');
      return;
    }
    setSubmissions(prev => ({
      ...prev,
      [id]: {
        fileName: selectedFile[id].name,
        fileSize: selectedFile[id].size,
        submissionTime: new Date().toLocaleString(),
        status: 'Submitted'
      }
    }));
    setSelectedFile(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    alert('Assignment submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
            Coursework & Assignments
          </h1>
          <div className="mb-1">
            <label htmlFor="subject" className="text-gray-700 dark:text-gray-300 mr-3 font-semibold">Subject:</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-semibold focus:outline-none"
            >
              {SUBJECTS.map(subject => (
                <option value={subject} key={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TEACHER NOTES */}
        <div className="mb-6">
          <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-500">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-2">🔔 Teacher Notes</h2>
            <ul className="list-disc pl-6">
              {TEACHER_NOTES.filter(n => n.subject === selectedSubject).map((note, idx) => (
                <li className="text-gray-700 dark:text-gray-100 mb-1" key={idx}>{note.text}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* ASSIGNMENT CARDS */}
        <div>
          {filteredAssignments.length === 0 ? (
            <div className="text-center p-6 text-gray-500">No assignments for this subject.</div>
          ) : (
            filteredAssignments.map(a => (
              <div
                key={a.id}
                className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500"
              >
                {/* ASSIGNMENT TITLE & DUE DATE */}
                <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{a.title}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                    Due: {a.dueDate}
                  </span>
                </div>
                <p className="mb-4 text-gray-700 dark:text-gray-200">{a.description}</p>

                {/* ATTACHMENT SECTION */}
                {a.attachment && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-700 rounded border border-blue-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📎</span>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {a.attachment}
                            {' '}
                            <a
                              href={ATTACHMENT_LINKS[a.attachment]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block ml-2 underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                              download
                            >
                              (Download)
                            </a>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {a.attachmentSize}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* FILE UPLOAD SECTION */}
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-900 dark:text-gray-200">
                    Upload Your Answer:
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={e => handleFileSelect(a.id, e)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    {selectedFile[a.id] && (
                      <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        ✅ {selectedFile[a.id].name}
                      </span>
                    )}
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={() => handleSubmit(a.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all"
                  >
                    Submit Assignment
                  </button>
                </div>
                {/* SUBMISSION STATUS */}
                {submissions[a.id] && (
                  <div className="p-4 bg-green-50 dark:bg-gray-700 rounded border-l-4 border-green-500">
                    <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">
                      ✅ Submitted Successfully
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-green-700 dark:text-green-200">
                        📄 <span className="font-semibold">{submissions[a.id].fileName}</span>
                      </p>
                      <p className="text-green-600 dark:text-green-300">
                        📦 {submissions[a.id].fileSize}
                      </p>
                      <p className="text-green-600 dark:text-green-300">
                        ⏰ Submitted: {submissions[a.id].submissionTime}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseworkPanel;

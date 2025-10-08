import React, { useState } from "react";

// Sample alumni data
const alumniList = [
  {
    name: "Ananya Singh",
    company: "Google",
    year: 2022,
    position: "Software Engineer",
    testimonial: "Brainwave Institute guided me to my dream job at Google!",
    linkedin: "https://linkedin.com/in/ananya-singh",
    email: "ananya@gmail.com",
    avatar: "/avatar1.png",
  },
  {
    name: "Rahul Kumar",
    company: "Microsoft",
    year: 2021,
    position: "Data Scientist",
    testimonial: "The mentorship and placements team really made a difference.",
    linkedin: "https://linkedin.com/in/rahul-kumar",
    email: "rahul@gmail.com",
    avatar: "/avatar2.png",
  },
  {
    name: "Priya Patel",
    company: "Amazon",
    year: 2023,
    position: "Cloud Engineer",
    testimonial: "The alumni network opened so many doors for me!",
    linkedin: "https://linkedin.com/in/priya-patel",
    email: "priya@gmail.com",
    avatar: "/avatar3.png",
  },
  // Add more...
];

// Company placement stats
const companyStats = [
  { company: "Google", year: 2022, count: 8 },
  { company: "Amazon", year: 2023, count: 6 },
  { company: "Microsoft", year: 2021, count: 4 },
  { company: "TCS", year: 2023, count: 12 },
];

// Unique company/year options for filtering
const years = [...new Set(companyStats.map(s => s.year))];
const companies = [...new Set(companyStats.map(s => s.company))];

const Alumni = () => {
  const [searchCompany, setSearchCompany] = useState("");
  const [filterYear, setFilterYear] = useState("All");

  const filteredStats = companyStats.filter(cs =>
    (searchCompany === "" || cs.company.toLowerCase().includes(searchCompany.toLowerCase())) &&
    (filterYear === "All" || cs.year === Number(filterYear))
  );

  return (
    <div className="min-h-screen bg-brainwave-bg px-2 py-8 flex flex-col items-center">
      <div className="bg-brainwave-primary-glass rounded-2xl shadow-brainwave max-w-3xl w-full p-10 mb-8">
        <h2 className="text-2xl font-extrabold text-brainwave-secondary mb-4 text-center">
          Alumni Showcase & Success Stories
        </h2>
        {/* Alumni Profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {alumniList.map((al, i) => (
            <div key={i} className="bg-white rounded-lg p-5 shadow flex items-center gap-4">
              <img src={al.avatar} alt={al.name} className="w-16 h-16 rounded-full object-cover border-2 border-brainwave-secondary" />
              <div>
                <div className="text-brainwave-primary font-bold">{al.name}</div>
                <div className="text-sm text-brainwave-secondary">{al.position}, {al.company} ({al.year})</div>
                <div className="italic text-brainwave-accent mb-2">{al.testimonial}</div>
                <div className="flex gap-2 text-xs">
                  <a href={al.linkedin} target="_blank" rel="noopener noreferrer" className="text-brainwave-accent font-semibold underline">LinkedIn</a>
                  <a href={`mailto:${al.email}`} className="text-brainwave-primary font-semibold underline">Email</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Company Placement Table & Filter */}
        <h3 className="text-xl font-bold text-brainwave-secondary mb-3">Company Placement Stats</h3>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Company Search"
            value={searchCompany}
            onChange={e => setSearchCompany(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white text-brainwave-primary"
          />
          <select
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white text-brainwave-primary"
          >
            <option value="All">All Years</option>
            {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
          </select>
        </div>
        <table className="w-full bg-white rounded-lg overflow-hidden mb-6">
          <thead>
            <tr>
              <th className="p-3 text-left text-brainwave-primary">Company</th>
              <th className="p-3 text-left text-brainwave-primary">Year</th>
              <th className="p-3 text-left text-brainwave-primary">Placed Students</th>
            </tr>
          </thead>
          <tbody>
            {filteredStats.length > 0 ? filteredStats.map((stat, idx) => (
              <tr key={idx} className="border-t border-brainwave-primary/10">
                <td className="p-3 text-brainwave-secondary">{stat.company}</td>
                <td className="p-3 text-brainwave-primary">{stat.year}</td>
                <td className="p-3 text-brainwave-accent font-bold">{stat.count}</td>
              </tr>
            )) : (
              <tr>
                <td className="p-3 text-center text-brainwave-primary" colSpan={3}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alumni;

import React from "react";
import { UsersIcon, LinkIcon } from "@heroicons/react/24/outline";

export default function AlumniPanel({ isDark }) {
  const alumni = [
    { id: 1, name: "Rajesh Kumar", year: 2020, role: "Senior Developer", company: "Google", linkedin: "#" },
    { id: 2, name: "Priya Sharma", year: 2019, role: "Product Manager", company: "Microsoft", linkedin: "#" },
    { id: 3, name: "Arjun Patel", year: 2021, role: "Data Scientist", company: "Amazon", linkedin: "#" },
    { id: 4, name: "Neha Gupta", year: 2018, role: "Startup Founder", company: "TechStart", linkedin: "#" },
  ];

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Alumni Connect</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alumni.map((person) => (
          <div key={person.id} className={`p-4 rounded-lg shadow-md text-center ${isDark ? "bg-gray-700" : "bg-white"}`}>
            <div className="mb-3 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <UsersIcon className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1">{person.name}</h3>
            <p className="text-sm text-blue-600 font-semibold">{person.role}</p>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{person.company}</p>
            <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Graduated {person.year}</p>
            <button className="mt-3 w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

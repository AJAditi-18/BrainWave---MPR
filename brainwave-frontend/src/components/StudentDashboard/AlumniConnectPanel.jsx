import React from 'react';

// Sample data for alumni and their social links
const alumniList = [
  {
    name: 'Priyanka Gaba',
    designation: 'Software Engineer at Google',
    year: 'BCA 2022',
    company: 'Google',
    links: {
      linkedin: 'https://www.linkedin.com/in/priyanka-gaba?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      github: 'https://github.com/aditi-sharma-sample',
      twitter: 'https://twitter.com/aditi_sharma_sample'
    }
  },
  {
    name: 'Rahul Verma',
    designation: 'Data Analyst at Amazon',
    year: 'BCA 2021',
    company: 'Amazon',
    links: {
      linkedin: 'https://www.linkedin.com/in/rahul-verma-sample',
      github: 'https://github.com/rahul-verma-sample',
      twitter: 'https://twitter.com/rahul_verma_sample'
    }
  },
  {
    name: 'Simran Gupta',
    designation: 'Frontend Developer at Flipkart',
    year: 'BCA 2020',
    company: 'Flipkart',
    links: {
      linkedin: 'https://www.linkedin.com/in/simran-gupta-sample',
      github: 'https://github.com/simran-gupta-sample',
      twitter: 'https://twitter.com/simran_gupta_sample'
    }
  },
  {
    name: 'S. Vishishtha Iyer',
    designation: 'Digital Marketing Head at Microsoft',
    year: 'BBA 2025',
    company: 'Microsoft',
    links: {
      linkedin: 'https://www.linkedin.com/in/s-vishishtha-iyer/',
      github: 'https://github.com/arjun-mehta-sample',
      twitter: 'https://twitter.com/arjun_mehta_sample'
    }
  },
  {
    name: 'Bhawika Arora',
    designation: 'UI/UX Designer at Adobe',
    year: 'BCA 2025',
    company: 'Adobe',
    links: {
      linkedin: 'https://www.linkedin.com/in/bhawika-arora-7795992b2?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      github: 'https://github.com/priya-kapoor-sample',
      twitter: 'https://twitter.com/priya_kapoor_sample'
    }
  },
  {
    name: 'Shruti Aggarwal',
    designation: 'DevOps Engineer at Netflix',
    year: 'BCA 2018',
    company: 'Netflix',
    links: {
      linkedin: 'https://www.linkedin.com/in/shruti-aggarwal-70577429b?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      github: 'https://github.com/karan-singh-sample',
      twitter: 'https://twitter.com/karan_singh_sample'
    }
  }
];

const AlumniConnectPanel = () => (
  <div className="p-8">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
        🎓 Alumni Connect
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Connect with our successful alumni and explore their professional journey. Click the icons to visit their profiles!
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {alumniList.map((alumni, idx) => (
        <div
          key={idx}
          className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:scale-105"
        >
          {/* Decorative gradient accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>

          {/* Avatar placeholder */}
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-4 text-white text-2xl font-bold shadow-md">
            {alumni.name.split(' ').map(n => n[0]).join('')}
          </div>

          {/* Alumni details */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {alumni.name}
            </h3>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {alumni.designation}
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                {alumni.year}
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                {alumni.company}
              </span>
            </div>
          </div>

          {/* Social links */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href={alumni.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-110 shadow-md"
              title="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a
              href={alumni.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-all duration-200 hover:scale-110 shadow-md"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href={alumni.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-200 hover:scale-110 shadow-md"
              title="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AlumniConnectPanel;

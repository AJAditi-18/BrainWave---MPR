export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brainwave-bg': '#0a0c10',          // Black
        'brainwave-primary': '#0B2224',      //Teal
        'brainwave-secondary': '#BDF9FF',   // Cyan (labels, main text)
        'brainwave-accent': '#C0FAF7'     // Lighter accent cyan
      },
      boxShadow: {
        'brainwave': '0 4px 28px 0 rgba(34, 211, 238, 0.15)', // Soft cyan shadow
      },
    },
  },
  plugins: [],
};

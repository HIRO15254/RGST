module.exports = {
  content: [
    "./src/**/*.{jsx,js,ts,tsx,html}",
  ],
  safelist: [
    {
      pattern: /^(w|bg|text|border)-/,
      variants: ["hover", "dark", "dark:hover"]
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
}

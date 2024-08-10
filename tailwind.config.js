/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      spacing: {
        "1/5": "20.0%",
        "1/6": "16.7%",
        "1/8": "12.5%",
        "1/24": "4.17%",
        "5/200": "2.5%",
      },
      fontFamily: {
        jetbrains: ["Jetbrains Mono"],
      },
    },
  },
  plugins: [],
};

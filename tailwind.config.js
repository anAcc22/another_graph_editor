/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "0px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",
    },
    extend: {
      spacing: {
        "1/5": "20.0%",
        "1/6": "16.7%",
        "1/8": "12.5%",
        "7/8": "87.5%",
        "1/10": "10.0%",
        "1/16": "6.25%",
        "1/24": "4.17%",
        "5/200": "2.5%",
        100: "25rem",
        200: "50rem",
      },
      fontFamily: {
        jetbrains: ["Jetbrains Mono"],
      },
    },
  },
  plugins: [
    require("tailwindcss-themer")({
      themes: [
        {
          name: "light",
          extend: {
            colors: {
              ovr: "hsl(0, 0%, 98%)",
              text: "hsl(0, 0%, 18%)",
              placeholder: "hsl(0, 0%, 58%)",
              slider: "hsl(0, 0%, 68%)",
              block: "hsl(0, 0%, 96%)",
              border: "hsl(0, 0%, 90%)",
              "current-nodes": "hsl(50, 15%, 65%)",
              "slider-thumb": "hsl(30, 30%, 50%)",
              "border-active": "hsl(50, 40%, 60%)",
              "border-hover": "hsl(50, 5%, 80%)",
              "toggle-circle": "hsl(0, 0%, 98%)",
              "toggle-uncheck": "hsl(50, 10%, 65%)",
              "toggle-hover": "hsl(50, 10%, 55%)",
              "toggle-check": "hsl(50, 10%, 35%)",
              selected: "hsl(30, 65%, 40%)",
              "format-ok": "hsl(150, 35%, 60%)",
              "format-bad": "hsl(10, 35%, 60%)",
              "clear-normal": "hsl(40, 35%, 60%)",
              "clear-hover": "hsl(40, 35%, 65%)",
              "clear-active": "hsl(40, 35%, 75%)",
              shadow: "hsl(0, 0%, 96%)",
            },
          },
        },
        {
          name: "dark",
          extend: {
            colors: {
              ovr: "hsl(0, 0%, 14%)",
              text: "hsl(0, 0%, 88%)",
              placeholder: "hsl(0, 0%, 48%)",
              slider: "hsl(0, 0%, 38%)",
              block: "hsl(0, 0%, 16%)",
              border: "hsl(0, 0%, 30%)",
              "current-nodes": "hsl(50, 15%, 45%)",
              "slider-thumb": "hsl(30, 30%, 50%)",
              "border-active": "hsl(50, 40%, 30%)",
              "border-hover": "hsl(50, 5%, 40%)",
              "toggle-circle": "hsl(0, 0%, 25%)",
              "toggle-uncheck": "hsl(50, 10%, 45%)",
              "toggle-hover": "hsl(50, 10%, 65%)",
              "toggle-check": "hsl(50, 10%, 75%)",
              selected: "hsl(30, 55%, 70%)",
              "format-ok": "hsl(150, 35%, 30%)",
              "format-bad": "hsl(10, 35%, 30%)",
              "clear-normal": "hsl(40, 35%, 30%)",
              "clear-hover": "hsl(40, 35%, 35%)",
              "clear-active": "hsl(40, 35%, 45%)",
              shadow: "hsl(0, 0%, 16%)",
            },
          },
        },
      ],
    }),
  ],
};

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
        "5/8": "62.5%",
        "7/8": "87.5%",
        "1/10": "10.0%",
        "1/16": "6.25%",
        "1/24": "4.17%",
        "29/40": "72.5%",
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
              "format-ok": "hsl(150, 35%, 70%)",
              "format-ok-border": "hsl(150, 35%, 60%)",
              "format-ok-hover": "hsl(150, 35%, 80%)",
              "format-ok-active": "hsl(150, 35%, 95%)",
              "format-bad": "hsl(10, 35%, 60%)",
              "format-bad-border": "hsl(10, 35%, 40%)",
              "format-bad-active": "hsl(10, 35%, 20%)",
              "clear-normal": "hsl(40, 35%, 65%)",
              "clear-hover": "hsl(40, 35%, 75%)",
              "clear-active": "hsl(40, 35%, 85%)",
              shadow: "hsl(0, 0%, 96%)",
              "tab-hover": "hsl(40, 0%, 95%)",
              "tab-active": "hsl(40, 0%, 90%)",
              "palette-base": "#eeeeee",
              "palette-yellow": "#eece7e",
              "palette-yellow-dull": "#e2b55e",
              "palette-lemon": "#dede7e",
              "palette-lemon-dull": "#c2ce62",
              "palette-lime": "#bede7e",
              "palette-lime-dull": "#adcd63",
              "palette-green": "#8ede7e",
              "palette-green-dull": "#7dcd63",
              "palette-wood": "#8ece9e",
              "palette-wood-dull": "#7bbe93",
              "palette-teal": "#8ecece",
              "palette-teal-dull": "#7eb8b8",
              "palette-azure": "#8ebede",
              "palette-azure-dull": "#7eaece",
              "palette-sea": "#8eaede",
              "palette-sea-dull": "#7e98cd",
              "palette-blue": "#6e93de",
              "palette-blue-dull": "#657ece",
              "palette-flower": "#7e90e5",
              "palette-flower-dull": "#6e80d2",
              "palette-purple": "#8589e5",
              "palette-purple-dull": "#7579d5",
              "palette-violet": "#9480e5",
              "palette-violet-dull": "#8070d2",
              "palette-grape": "#a47de5",
              "palette-grape-dull": "#946ad0",
              "palette-pink": "#b47dd5",
              "palette-pink-dull": "#a46ac0",
              "palette-sakura": "#c47dc5",
              "palette-sakura-dull": "#b46ab0",
              "palette-flesh": "#c47da5",
              "palette-flesh-dull": "#b46a90",
              "palette-raw": "#c48d95",
              "palette-raw-dull": "#b47a80",
              "palette-orange": "#d48d75",
              "palette-orange-dull": "#c47a60",
              "palette-moon": "#e4ad72",
              "palette-moon-dull": "#d49a70",
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
              "format-ok-border": "hsl(150, 35%, 35%)",
              "format-ok-hover": "hsl(150, 35%, 40%)",
              "format-ok-active": "hsl(150, 35%, 55%)",
              "format-bad": "hsl(10, 35%, 30%)",
              "format-bad-border": "hsl(10, 35%, 50%)",
              "format-bad-active": "hsl(10, 35%, 70%)",
              "clear-normal": "hsl(40, 35%, 30%)",
              "clear-hover": "hsl(40, 35%, 35%)",
              "clear-active": "hsl(40, 35%, 45%)",
              shadow: "hsl(0, 0%, 16%)",
              "tab-hover": "hsl(40, 0%, 15%)",
              "tab-active": "hsl(40, 0%, 20%)",
              "palette-base": "#333333",
              "palette-yellow": "#947d12",
              "palette-yellow-dull": "#846a00",
              "palette-lemon": "#727220",
              "palette-lemon-dull": "#525e02",
              "palette-lime": "#5e7e1e",
              "palette-lime-dull": "#3e5e0e",
              "palette-green": "#3e731e",
              "palette-green-dull": "#1e530e",
              "palette-wood": "#4e705e",
              "palette-wood-dull": "#335344",
              "palette-teal": "#4e6c6c",
              "palette-teal-dull": "#305555",
              "palette-azure": "#3e5e7c",
              "palette-azure-dull": "#2e4a60",
              "palette-sea": "#2e4e70",
              "palette-sea-dull": "#1f3f60",
              "palette-blue": "#0e3070",
              "palette-blue-dull": "#00206e",
              "palette-flower": "#2e4095",
              "palette-flower-dull": "#1e3085",
              "palette-purple": "#454995",
              "palette-purple-dull": "#353985",
              "palette-violet": "#544095",
              "palette-violet-dull": "#403082",
              "palette-grape": "#643d95",
              "palette-grape-dull": "#542a80",
              "palette-pink": "#743d85",
              "palette-pink-dull": "#602d70",
              "palette-sakura": "#843d75",
              "palette-sakura-dull": "#702d60",
              "palette-flesh": "#843d55",
              "palette-flesh-dull": "#702d40",
              "palette-raw": "#844d45",
              "palette-raw-dull": "#703d30",
              "palette-orange": "#944d25",
              "palette-orange-dull": "#803d10",
              "palette-moon": "#a46d22",
              "palette-moon-dull": "#945a10",
            },
          },
        },
      ],
    }),
  ],
};

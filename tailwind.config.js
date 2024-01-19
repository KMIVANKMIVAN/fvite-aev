/* export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
} */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  /* theme: {
    extend: {},
  }, */
  theme: {
    extend: {
      colors: {
        "mi-color-primario": "#11435b",
        "mi-color-secundario": "#004f81",
        "mi-color-terceario": "#0058a9",
        "mi-color-cuartario": "#005ccd",
        "mi-color-quintario": "#4c5aea",
        "mi-color-sextario": "#44a4a6",
        c1p: "#FF5F5D",
        c2p: "#3F7C85",
        c3p: "#00CCBF",
        c4p: "#72F2EB",
        c5p: "#747E7E",
        c1p2: "#003840",
        c2p2: "#005A5B",
        c3p2: "#007369",
        c4p2: "#008C72",
        c5p2: "#02A676",
        rojo1: "#fd1d1d",
        rojo2: "#fcb045",
        c50: "#f0faff",
        c100: "#e0f5fe",
        c200: "#bae8fd",
        c300: "#7dd5fc",
        c400: "#38bcf8",
        c500: "#0ea5e9",
        c600: "#028ac7",
        c700: "#0370a1",
        c800: "#075e85",
        c900: "#0c506e",
        c950: "#083549",
      },
      zIndex: {
        500: "500",
      },
    },
  },
  plugins: [],
};

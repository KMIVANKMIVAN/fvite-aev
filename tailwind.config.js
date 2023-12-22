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
      },
      zIndex: {
        500: "500",
      },
    },
  },
  plugins: [],
};

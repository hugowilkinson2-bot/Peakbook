import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17221c",
        forest: "#173f2c",
        moss: "#66856b",
        lime: "#d7f06e",
        canvas: "#f3f1e9",
        stone: "#deddd3",
      },
      boxShadow: {
        card: "0 16px 45px rgba(28, 45, 34, 0.09)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

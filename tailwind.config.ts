import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171a18",
        forest: "#153c2c",
        moss: "#66766d",
        lime: "#d9f27b",
        canvas: "#f3f5f1",
        stone: "#dfe3dd",
      },
      boxShadow: {
        card: "0 18px 55px rgba(20, 37, 29, 0.08)",
        float: "0 10px 30px rgba(17, 28, 22, 0.14)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

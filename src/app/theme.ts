import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-geist-sans)" },
        body: { value: "var(--font-geist-sans)" },
        mono: { value: "var(--font-geist-mono)" },
      },
      colors: {
        accent: { value: "{colors.teal.500}" },
        accentHover: { value: "{colors.teal.600}" },
        favorite: { value: "{colors.red.500}" },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          default: { value: "{colors.white}" },
          muted: { value: "{colors.gray.50}" },
        },
        text: {
          default: { value: "{colors.gray.900}" },
          muted: { value: "{colors.gray.600}" },
        },
      },
      shadows: {
        card: { value: "0 2px 8px rgba(0,0,0,0.1)" },
      },
      radii: {
        button: { value: "md" },
      },
    },
  },
  globalCss: {
    "*, *::before, *::after": {
      boxSizing: "border-box",
    },
    "html, body": {
      minHeight: "100%",
    },
  },
});

export const system = createSystem(defaultConfig, config);

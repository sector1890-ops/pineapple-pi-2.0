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
          default: {
            value: {
              base: "{colors.white}",
              _dark: "{colors.gray.900}",
            },
          },
          muted: {
            value: {
              base: "{colors.gray.50}",
              _dark: "{colors.gray.800}",
            },
          },
          surface: {
            value: {
              base: "{colors.white}",
              _dark: "{colors.gray.800}",
            },
          },
          panel: {
            value: {
              base: "{colors.white}",
              _dark: "{colors.gray.900}",
            },
          },
        },
        text: {
          default: {
            value: {
              base: "{colors.gray.900}",
              _dark: "{colors.white}",
            },
          },
          muted: {
            value: {
              base: "{colors.gray.600}",
              _dark: "{colors.gray.400}",
            },
          },
        },
        border: {
          default: {
            value: {
              base: "{colors.gray.200}",
              _dark: "{colors.gray.700}",
            },
          },
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

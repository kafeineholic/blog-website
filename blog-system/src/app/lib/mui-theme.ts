import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    colors: {
      orange700: string;
      orange500: string;
      sand200: string;
      snow50: string;
      olive800: string;
      ink950: string;
      primary: string;
      primaryStrong: string;
      accent: string;
      surface: string;
      muted: string;
      text: string;
      background: string;
      foreground: string;
    };
  }

  interface ThemeOptions {
    colors?: Partial<Theme["colors"]>;
  }
}

export const appTheme = createTheme({
  colors: {
    orange700: "var(--color-orange-700)",
    orange500: "var(--color-orange-500)",
    sand200: "var(--color-sand-200)",
    snow50: "var(--color-snow-50)",
    olive800: "var(--color-olive-800)",
    ink950: "var(--color-ink-950)",
    primary: "var(--color-primary)",
    primaryStrong: "var(--color-primary-strong)",
    accent: "var(--color-accent)",
    surface: "var(--color-surface)",
    muted: "var(--color-muted)",
    text: "var(--color-text)",
    background: "var(--background)",
    foreground: "var(--foreground)",
  },
});

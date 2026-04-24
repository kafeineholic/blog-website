export const theme = {
  colors: {
    "orange-700": "var(--color-orange-700)",
    "orange-500": "var(--color-orange-500)",
    "sand-200": "var(--color-sand-200)",
    "snow-50": "var(--color-snow-50)",
    "olive-800": "var(--color-olive-800)",
    "ink-950": "var(--color-ink-950)",
    primary: "var(--color-primary)",
    "primary-strong": "var(--color-primary-strong)",
    accent: "var(--color-accent)",
    surface: "var(--color-surface)",
    muted: "var(--color-muted)",
    text: "var(--color-text)",
    background: "var(--background)",
    foreground: "var(--foreground)",
  },
} as const;

export type ThemeColorKey = keyof typeof theme.colors;

export function getThemeColor(name: ThemeColorKey): string {
  return theme.colors[name];
}

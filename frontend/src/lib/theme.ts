export const THEMES = [
  { id: "studio", label: "Studio" },
  { id: "oscuro", label: "Oscuro" },
  { id: "vino", label: "Vino" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

export function applyTheme(id: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = id;
}

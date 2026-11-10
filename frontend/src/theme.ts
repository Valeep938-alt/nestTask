export const THEMES = [
  { id: 'studio', label: 'Studio' },
  { id: 'oscuro', label: 'Oscuro' },
  { id: 'vino', label: 'Vino' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const KEY = 'theme';

export function getSavedTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(KEY);
    if (THEMES.some((t) => t.id === saved)) return saved as ThemeId;
  } catch {
    /* sin acceso a localStorage */
  }
  return 'studio';
}

export function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* sin acceso a localStorage */
  }
}

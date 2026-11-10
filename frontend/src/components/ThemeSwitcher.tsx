import { useState } from 'react';
import { applyTheme, getSavedTheme, ThemeId, THEMES } from '../theme';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>(getSavedTheme);

  const change = (id: ThemeId) => {
    setTheme(id);
    applyTheme(id);
  };

  return (
    <select
      className="theme-select"
      value={theme}
      onChange={(e) => change(e.target.value as ThemeId)}
      aria-label="Tema de color"
    >
      {THEMES.map((t) => (
        <option key={t.id} value={t.id}>
          {t.label}
        </option>
      ))}
    </select>
  );
}

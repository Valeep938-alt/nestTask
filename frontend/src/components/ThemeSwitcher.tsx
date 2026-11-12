"use client";

import { THEMES, type ThemeId } from "@/lib/theme";

interface ThemeSwitcherProps {
  value: ThemeId;
  onChange: (id: ThemeId) => void;
}

export function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps) {
  return (
    <select
      className="theme-select"
      value={value}
      onChange={(e) => onChange(e.target.value as ThemeId)}
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

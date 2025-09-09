import { atom } from 'jotai';

export type Theme = 'dark' | 'light' | 'system';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';

  const stored = localStorage.getItem('theme') as Theme;
  if (stored && ['dark', 'light', 'system'].includes(stored)) {
    return stored;
  }
  return 'system';
};

const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

export const themeAtom = atom<Theme>(getInitialTheme());

export const setThemeAtom = atom(null, (get, set, newTheme: Theme) => {
  set(themeAtom, newTheme);
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }
});

// Initialize theme on first load
if (typeof window !== 'undefined') {
  applyTheme(getInitialTheme());

  // Listen for system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const currentTheme = localStorage.getItem('theme') as Theme;
      if (currentTheme === 'system' || !currentTheme) {
        applyTheme('system');
      }
    });
}

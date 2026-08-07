import type { SettingsTheme } from '../types/settings';

const THEME_STORAGE_KEY = 'pebble_theme';

interface ApplyThemeOptions {
  persist?: boolean;
}

export function applyTheme(
  theme: SettingsTheme,
  options: ApplyThemeOptions = {},
) {
  if (typeof document === 'undefined') return;

  const { persist = true } = options;
  const normalizedTheme = theme.toLowerCase();

  document.documentElement.dataset.theme = normalizedTheme;
  document.documentElement.classList.toggle(
    'dark',
    theme === 'DARK',
  );
  document.documentElement.style.colorScheme =
    normalizedTheme;

  if (persist && typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}

export function getStoredTheme(): SettingsTheme {
  if (typeof window === 'undefined') {
    return 'LIGHT';
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) ===
    'DARK'
    ? 'DARK'
    : 'LIGHT';
}

export function initializeTheme(isAuthenticated: boolean) {
  if (!isAuthenticated) {
    applyTheme('LIGHT', {
      persist: false,
    });
    return;
  }

  applyTheme(getStoredTheme(), {
    persist: false,
  });
}
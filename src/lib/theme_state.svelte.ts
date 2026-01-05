const THEME_KEY = 'theme';
export type Theme = 'terminal' | 'dark' | 'light';

const VALID_THEMES: Theme[] = ['terminal', 'dark', 'light'];

function loadTheme(): Theme {
	if (typeof window === 'undefined') return 'terminal';
	const stored = localStorage.getItem(THEME_KEY);
	if (stored && VALID_THEMES.includes(stored as Theme)) {
		return stored as Theme;
	}
	return 'terminal';
}

let theme = $state<Theme>(loadTheme());

export const themeStore = {
	get theme(): Theme {
		return theme;
	},
	get isTerminal(): boolean {
		return theme === 'terminal';
	},
	get isDark(): boolean {
		return theme === 'dark';
	},
	get isLight(): boolean {
		return theme === 'light';
	},
	setTheme(newTheme: Theme): void {
		theme = newTheme;
		if (typeof window !== 'undefined') {
			localStorage.setItem(THEME_KEY, theme);
		}
	},
	get themes(): Theme[] {
		return VALID_THEMES;
	}
};

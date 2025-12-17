import { ref, watch, onMounted } from 'vue';

const isDark = ref(false);

export function useDarkMode() {
	const toggleDarkMode = () => {
		isDark.value = !isDark.value;
		updateTheme();
	};

	const setDarkMode = value => {
		isDark.value = value;
		updateTheme();
	};

	const updateTheme = () => {
		if (isDark.value) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};

	const initTheme = () => {
		// Check localStorage first
		const saved = localStorage.getItem('theme');
		if (saved) {
			isDark.value = saved === 'dark';
		} else {
			// Check system preference
			isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		updateTheme();
	};

	onMounted(() => {
		initTheme();

		// Listen for system theme changes
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
			if (!localStorage.getItem('theme')) {
				isDark.value = e.matches;
				updateTheme();
			}
		});
	});

	return {
		isDark,
		toggleDarkMode,
		setDarkMode,
	};
}

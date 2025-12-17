<template>
	<button class="dark-mode-toggle" @click="toggleDarkMode" :aria-label="isDark ? 'מצב בהיר' : 'מצב כהה'">
		<span class="toggle-track" :class="{ dark: isDark }">
			<span class="toggle-icon sun">☀️</span>
			<span class="toggle-icon moon">🌙</span>
			<span class="toggle-thumb" :class="{ dark: isDark }"></span>
		</span>
	</button>
</template>

<script setup>
import { useDarkMode } from '../../composables/useDarkMode';

const { isDark, toggleDarkMode } = useDarkMode();
</script>

<style scoped>
.dark-mode-toggle {
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.25rem;
	display: flex;
	align-items: center;
}

.toggle-track {
	position: relative;
	width: 60px;
	height: 30px;
	background: linear-gradient(135deg, #ffd6e7, #fff5f8);
	border-radius: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 6px;
	transition: all 0.3s ease;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-track.dark {
	background: linear-gradient(135deg, #1a1a2e, #16213e);
}

.toggle-icon {
	font-size: 14px;
	z-index: 1;
	transition: opacity 0.3s ease;
}

.toggle-track.dark .sun {
	opacity: 0.4;
}

.toggle-track:not(.dark) .moon {
	opacity: 0.4;
}

.toggle-thumb {
	position: absolute;
	top: 3px;
	right: 3px;
	width: 24px;
	height: 24px;
	background: white;
	border-radius: 50%;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	transition: all 0.3s ease;
}

.toggle-thumb.dark {
	right: calc(100% - 27px);
	background: #2d3748;
}
</style>

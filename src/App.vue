<template>
	<div class="app" :class="{ 'menu-open': isMobileMenuOpen, dark: isDark }">
		<header class="header">
			<nav class="container nav-container">
				<router-link to="/" class="logo-link" @click="closeMobileMenu">
					<img :src="logo" alt="מרגליתות לוגו" class="logo-img" />
					<span class="logo-text">מרגליתות <span aria-hidden="true">🍓</span></span>
				</router-link>

				<!-- Desktop Navigation -->
				<div class="nav-links" :class="{ open: isMobileMenuOpen }">
					<router-link class="nav-link" to="/menu" @click="closeMobileMenu">תפריט</router-link>
					<router-link class="nav-link" to="/gallery" @click="closeMobileMenu">גלריה</router-link>
					<router-link class="nav-link" to="/about" @click="closeMobileMenu">אודות</router-link>
					<router-link class="nav-link" to="/my-orders" @click="closeMobileMenu">ההזמנות שלי</router-link>
					<router-link class="nav-link nav-link-primary" to="/quote" @click="closeMobileMenu"> הצעת מחיר </router-link>
					<DarkModeToggle class="dark-toggle-mobile" />
				</div>

				<!-- Right Side Actions -->
				<div class="nav-actions">
					<DarkModeToggle class="dark-toggle-desktop" />
					<CartButton />

					<!-- Mobile Menu Button -->
					<button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="תפריט">
						<span class="hamburger" :class="{ active: isMobileMenuOpen }">
							<span></span>
							<span></span>
							<span></span>
						</span>
					</button>
				</div>
			</nav>
		</header>

		<main class="main container">
			<router-view v-slot="{ Component, route }">
				<Transition :name="transitionName" mode="out-in">
					<component :is="Component" :key="route.path" />
				</Transition>
			</router-view>
		</main>

		<AppFooter />

		<!-- Global Components -->
		<CartDrawer />
		<NotificationToast />
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUIStore } from './stores/uiStore';
import { useDarkMode } from './composables/useDarkMode';
import NotificationToast from './components/ui/NotificationToast.vue';
import DarkModeToggle from './components/ui/DarkModeToggle.vue';
import AppFooter from './components/layout/AppFooter.vue';
import { CartDrawer, CartButton } from './components/cart';
import logo from './assets/logo.png';

const route = useRoute();
const uiStore = useUIStore();
const { isDark } = useDarkMode();

const isMobileMenuOpen = computed(() => uiStore.isMobileMenuOpen);
const previousPath = ref('');
const transitionName = ref('fade');

const toggleMobileMenu = () => uiStore.toggleMobileMenu();
const closeMobileMenu = () => uiStore.closeMobileMenu();

// Determine transition direction based on route order
const routeOrder = ['/', '/menu', '/gallery', '/about', '/quote', '/checkout'];

watch(
	() => route.path,
	(newPath, oldPath) => {
		const newIndex = routeOrder.indexOf(newPath);
		const oldIndex = routeOrder.indexOf(oldPath || '/');

		if (newIndex > oldIndex) {
			transitionName.value = 'slide-left';
		} else if (newIndex < oldIndex) {
			transitionName.value = 'slide-right';
		} else {
			transitionName.value = 'fade';
		}

		previousPath.value = oldPath;

		// Close mobile menu on navigation
		closeMobileMenu();
	},
);
</script>

<style>
/* Global Styles */
* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

:root {
	/* Light Theme */
	--bg-primary: #fff;
	--bg-secondary: #f8f9fa;
	--bg-gradient: linear-gradient(135deg, #fff5f8 0%, #fff 50%, #f8f9fa 100%);
	--text-primary: #333;
	--text-secondary: #666;
	--text-muted: #999;
	--border-color: #f0f0f0;
	--border-pink: #ffd6e7;
	--pink-primary: #ff6b9d;
	--pink-secondary: #ff8fab;
	--pink-light: #fff5f8;
	--card-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
	--header-bg: rgba(255, 255, 255, 0.95);
}

.dark {
	/* Dark Theme */
	--bg-primary: #1a1a2e;
	--bg-secondary: #16213e;
	--bg-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%);
	--text-primary: #f0f0f0;
	--text-secondary: #b0b0b0;
	--text-muted: #707070;
	--border-color: #2d2d44;
	--border-pink: #4a3040;
	--pink-primary: #ff6b9d;
	--pink-secondary: #ff8fab;
	--pink-light: #2d2035;
	--card-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	--header-bg: rgba(26, 26, 46, 0.95);
}

body {
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	background: var(--bg-gradient);
	min-height: 100vh;
	direction: rtl;
	color: var(--text-primary);
	transition: background 0.3s ease, color 0.3s ease;
}

.container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem;
}

a {
	color: inherit;
	text-decoration: none;
}

/* Button Base Styles */
.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.6rem 1.2rem;
	border-radius: 10px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	border: none;
}

.btn-primary {
	background: linear-gradient(135deg, var(--pink-primary) 0%, var(--pink-secondary) 100%);
	color: white;
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.btn-primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.btn-outline {
	background: var(--bg-primary);
	border: 2px solid var(--border-pink);
	color: var(--pink-primary);
}

.btn-outline:hover {
	background: var(--pink-light);
	border-color: var(--pink-primary);
}

/* Card Base Style */
.card {
	background: var(--bg-primary);
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: var(--card-shadow);
	transition: background 0.3s ease, box-shadow 0.3s ease;
}

/* Grid Layouts */
.grid {
	display: grid;
	gap: 1.5rem;
}

.grid-2 {
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.grid-3 {
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
</style>

<style scoped>
/* Header */
.header {
	position: sticky;
	top: 0;
	background: var(--header-bg);
	backdrop-filter: blur(10px);
	box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
	z-index: 100;
	transition: background 0.3s ease;
}

.nav-container {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem 1rem;
}

.logo-link {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.logo-img {
	height: 48px;
	width: auto;
}

.logo-text {
	font-size: 1.4rem;
	font-weight: 800;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

/* Navigation Links */
.nav-links {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-inline-start: auto;
}

.nav-link {
	padding: 0.5rem 1rem;
	border-radius: 10px;
	font-weight: 600;
	color: var(--text-secondary);
	transition: all 0.3s ease;
}

.nav-link:hover {
	color: var(--pink-primary);
	background: var(--pink-light);
}

.nav-link.router-link-active {
	color: var(--pink-primary);
	background: var(--pink-light);
}

.nav-link-primary {
	background: linear-gradient(135deg, var(--pink-primary) 0%, var(--pink-secondary) 100%);
	color: white !important;
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.nav-link-primary:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
	background: linear-gradient(135deg, var(--pink-primary) 0%, var(--pink-secondary) 100%);
}

/* Nav Actions */
.nav-actions {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

/* Dark Mode Toggle */
.dark-toggle-desktop {
	display: block;
}

.dark-toggle-mobile {
	display: none;
	margin-top: 1rem;
}

/* Mobile Menu Button */
.mobile-menu-btn {
	display: none;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
}

.hamburger {
	display: flex;
	flex-direction: column;
	gap: 5px;
	width: 24px;
}

.hamburger span {
	display: block;
	height: 3px;
	background: var(--pink-primary);
	border-radius: 3px;
	transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
	transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.active span:nth-child(2) {
	opacity: 0;
}

.hamburger.active span:nth-child(3) {
	transform: rotate(-45deg) translate(6px, -6px);
}

/* Main Content */
.main {
	padding: 1.5rem 1rem 3rem;
	min-height: calc(100vh - 200px);
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
	transition: all 0.4s ease;
}

.slide-left-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}

.slide-left-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

.slide-right-enter-from {
	opacity: 0;
	transform: translateX(30px);
}

.slide-right-leave-to {
	opacity: 0;
	transform: translateX(-30px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
	.mobile-menu-btn {
		display: block;
	}

	.dark-toggle-desktop {
		display: none;
	}

	.dark-toggle-mobile {
		display: flex;
		justify-content: center;
	}

	.nav-links {
		position: fixed;
		top: 70px;
		right: 0;
		left: 0;
		bottom: 0;
		background: var(--bg-primary);
		flex-direction: column;
		padding: 2rem;
		gap: 1rem;
		transform: translateX(100%);
		transition: transform 0.3s ease, background 0.3s ease;
		z-index: 99;
		margin-inline-start: 0;
	}

	.nav-links.open {
		transform: translateX(0);
	}

	.nav-link {
		width: 100%;
		text-align: center;
		padding: 1rem;
		font-size: 1.1rem;
	}

	.nav-link-primary {
		margin-top: 1rem;
	}

	.app.menu-open {
		overflow: hidden;
	}

	.nav-actions {
		margin-inline-start: auto;
	}
}
</style>

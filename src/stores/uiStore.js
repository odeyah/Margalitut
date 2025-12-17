import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
	// ===== STATE =====

	// Mobile Menu
	const isMobileMenuOpen = ref(false);

	// Cart Drawer
	const isCartDrawerOpen = ref(false);

	// Modal
	const isModalOpen = ref(false);
	const modalContent = ref(null);

	// Notifications
	const notifications = ref([]);

	// Theme
	const isDarkMode = ref(false);

	// Loading
	const isGlobalLoading = ref(false);

	// ===== MOBILE MENU ACTIONS =====
	function toggleMobileMenu() {
		isMobileMenuOpen.value = !isMobileMenuOpen.value;
		// Close cart drawer when opening menu
		if (isMobileMenuOpen.value) {
			isCartDrawerOpen.value = false;
		}
	}

	function openMobileMenu() {
		isMobileMenuOpen.value = true;
		isCartDrawerOpen.value = false;
	}

	function closeMobileMenu() {
		isMobileMenuOpen.value = false;
	}

	// ===== CART DRAWER ACTIONS =====
	function toggleCartDrawer() {
		isCartDrawerOpen.value = !isCartDrawerOpen.value;
		// Close mobile menu when opening cart
		if (isCartDrawerOpen.value) {
			isMobileMenuOpen.value = false;
		}
	}

	function openCartDrawer() {
		isCartDrawerOpen.value = true;
		isMobileMenuOpen.value = false;
	}

	function closeCartDrawer() {
		isCartDrawerOpen.value = false;
	}

	// ===== MODAL ACTIONS =====
	function openModal(content) {
		modalContent.value = content;
		isModalOpen.value = true;
	}

	function closeModal() {
		isModalOpen.value = false;
		modalContent.value = null;
	}

	// ===== NOTIFICATION ACTIONS =====
	function addNotification(notification) {
		const id = Date.now();
		const newNotification = {
			id,
			type: notification.type || 'info',
			message: notification.message,
			duration: notification.duration || 4000,
		};

		notifications.value.push(newNotification);

		// Auto remove after duration
		if (newNotification.duration > 0) {
			setTimeout(() => {
				removeNotification(id);
			}, newNotification.duration);
		}

		return id;
	}

	function removeNotification(id) {
		const index = notifications.value.findIndex(n => n.id === id);
		if (index > -1) {
			notifications.value.splice(index, 1);
		}
	}

	function clearAllNotifications() {
		notifications.value = [];
	}

	// Shorthand notification methods
	function showSuccess(message, duration = 4000) {
		return addNotification({ type: 'success', message, duration });
	}

	function showError(message, duration = 5000) {
		return addNotification({ type: 'error', message, duration });
	}

	function showWarning(message, duration = 4000) {
		return addNotification({ type: 'warning', message, duration });
	}

	function showInfo(message, duration = 4000) {
		return addNotification({ type: 'info', message, duration });
	}

	// ===== THEME ACTIONS =====
	function toggleDarkMode() {
		isDarkMode.value = !isDarkMode.value;
	}

	function setDarkMode(value) {
		isDarkMode.value = value;
	}

	// ===== LOADING ACTIONS =====
	function setGlobalLoading(value) {
		isGlobalLoading.value = value;
	}

	// ===== CLOSE ALL =====
	function closeAll() {
		isMobileMenuOpen.value = false;
		isCartDrawerOpen.value = false;
		isModalOpen.value = false;
	}

	return {
		// State
		isMobileMenuOpen,
		isCartDrawerOpen,
		isModalOpen,
		modalContent,
		notifications,
		isDarkMode,
		isGlobalLoading,
		// Mobile Menu Actions
		toggleMobileMenu,
		openMobileMenu,
		closeMobileMenu,
		// Cart Drawer Actions
		toggleCartDrawer,
		openCartDrawer,
		closeCartDrawer,
		// Modal Actions
		openModal,
		closeModal,
		// Notification Actions
		addNotification,
		removeNotification,
		clearAllNotifications,
		showSuccess,
		showError,
		showWarning,
		showInfo,
		// Theme Actions
		toggleDarkMode,
		setDarkMode,
		// Loading Actions
		setGlobalLoading,
		// General
		closeAll,
	};
});

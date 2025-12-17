<template>
	<div class="admin-page">
		<!-- Login Screen -->
		<div v-if="!isLoggedIn" class="login-screen">
			<div class="login-card">
				<h1 class="login-title">🔐 כניסת מנהל</h1>
				<p class="login-subtitle">הכניסו את פרטי ההתחברות</p>

				<div class="form-group">
					<label class="form-label">אימייל</label>
					<input
						type="email"
						v-model="email"
						class="form-input"
						placeholder="admin@margalitot.co.il"
						dir="ltr"
						@keyup.enter="login"
					/>
				</div>

				<div class="form-group">
					<label class="form-label">סיסמה</label>
					<input
						type="password"
						v-model="password"
						class="form-input"
						placeholder="••••••••"
						dir="ltr"
						@keyup.enter="login"
					/>
				</div>

				<button class="login-btn" @click="login" :disabled="!email || !password || isLoggingIn">
					<span v-if="isLoggingIn" class="loading-spinner small"></span>
					<span v-else>כניסה</span>
				</button>

				<p v-if="loginError" class="login-error">{{ loginError }}</p>
			</div>
		</div>

		<!-- Admin Dashboard -->
		<div v-else class="admin-dashboard">
			<!-- Header -->
			<header class="admin-header">
				<div class="header-right">
					<h1 class="admin-title">📋 ניהול הזמנות</h1>
					<span class="orders-count">{{ orders.length }} הזמנות</span>
				</div>
				<div class="header-left">
					<span class="user-email">{{ userEmail }}</span>
					<button class="refresh-btn" @click="loadOrders" :disabled="isLoading">
						<span :class="{ spinning: isLoading }">🔄</span>
						רענן
					</button>
					<button class="logout-btn" @click="logout">יציאה</button>
				</div>
			</header>

			<!-- Stats Cards -->
			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-icon">📦</span>
					<div class="stat-content">
						<span class="stat-value">{{ pendingOrders.length }}</span>
						<span class="stat-label">ממתינות</span>
					</div>
				</div>
				<div class="stat-card">
					<span class="stat-icon">👨‍🍳</span>
					<div class="stat-content">
						<span class="stat-value">{{ preparingOrders.length }}</span>
						<span class="stat-label">בהכנה</span>
					</div>
				</div>
				<div class="stat-card">
					<span class="stat-icon">✅</span>
					<div class="stat-content">
						<span class="stat-value">{{ completedToday.length }}</span>
						<span class="stat-label">הושלמו היום</span>
					</div>
				</div>
				<div class="stat-card">
					<span class="stat-icon">💰</span>
					<div class="stat-content">
						<span class="stat-value">₪{{ todayRevenue }}</span>
						<span class="stat-label">הכנסות היום</span>
					</div>
				</div>
			</div>

			<!-- Filters -->
			<div class="filters-bar">
				<div class="filter-tabs">
					<button
						v-for="filter in statusFilters"
						:key="filter.value"
						class="filter-tab"
						:class="{ active: currentFilter === filter.value }"
						@click="currentFilter = filter.value"
					>
						<span class="filter-icon">{{ filter.icon }}</span>
						<span class="filter-label">{{ filter.label }}</span>
						<span class="filter-count">{{ getFilterCount(filter.value) }}</span>
					</button>
				</div>

				<div class="search-box">
					<input type="text" v-model="searchQuery" placeholder="חיפוש לפי שם או טלפון..." class="search-input" />
					<span class="search-icon">🔍</span>
				</div>
			</div>

			<!-- Orders List -->
			<div class="orders-list">
				<div v-if="isLoading" class="loading-state">
					<span class="loading-spinner"></span>
					<p>טוען הזמנות...</p>
				</div>

				<div v-else-if="filteredOrders.length === 0" class="empty-state">
					<span class="empty-icon">📭</span>
					<h3>אין הזמנות</h3>
					<p>לא נמצאו הזמנות בקטגוריה זו</p>
				</div>

				<TransitionGroup v-else name="order-list" tag="div" class="orders-container">
					<div v-for="order in filteredOrders" :key="order.id" class="order-card" :class="[`status-${order.status}`]">
						<!-- Order Header -->
						<div class="order-header">
							<div class="order-id">
								<span class="id-label">הזמנה</span>
								<span class="id-value">#{{ order.orderId || order.id.slice(-6) }}</span>
							</div>
							<div class="order-time">
								{{ formatDate(order.createdAt) }}
							</div>
							<div class="order-status" :class="order.status">
								{{ getStatusLabel(order.status) }}
							</div>
						</div>

						<!-- Customer Info -->
						<div class="order-customer">
							<div class="customer-name">
								<span class="icon">👤</span>
								{{ order.customer?.name }}
							</div>
							<a :href="`tel:${order.customer?.phone}`" class="customer-phone">
								<span class="icon">📱</span>
								{{ order.customer?.phone }}
							</a>
							<a
								:href="`https://wa.me/972${order.customer?.phone?.replace(/^0/, '')}`"
								target="_blank"
								class="whatsapp-link"
							>
								💬 וואטסאפ
							</a>
						</div>

						<!-- Delivery Info -->
						<div class="order-delivery">
							<span v-if="order.delivery?.option === 'pickup'" class="delivery-badge pickup"> 🏠 איסוף עצמי </span>
							<span v-else class="delivery-badge delivery">
								🚗 משלוח - {{ order.delivery?.location?.name }}
								<span v-if="order.delivery?.price">(₪{{ order.delivery?.price }})</span>
								<span v-else-if="order.delivery?.requiresCall">(לתאם מחיר)</span>
							</span>
							<span v-if="order.customer?.address" class="delivery-address"> 📍 {{ order.customer?.address }} </span>
						</div>

						<!-- Order Items -->
						<div class="order-items">
							<div v-for="item in order.items" :key="item.id" class="order-item">
								<span class="item-emoji">{{ item.image }}</span>
								<span class="item-name">{{ item.name }}</span>
								<span class="item-qty">x{{ item.quantity }}</span>
								<span class="item-price">₪{{ item.price * item.quantity }}</span>
							</div>
						</div>

						<!-- Special Requests -->
						<div v-if="order.specialRequests" class="order-notes">
							<span class="notes-icon">📝</span>
							<span class="notes-text">{{ order.specialRequests }}</span>
						</div>

						<!-- Date & Time -->
						<div v-if="order.date || order.time" class="order-datetime">
							<span v-if="order.date" class="datetime-item"> 📅 {{ order.date }} </span>
							<span v-if="order.time" class="datetime-item"> 🕐 {{ order.time }} </span>
						</div>

						<!-- Order Footer -->
						<div class="order-footer">
							<div class="order-total">
								<span class="total-label">סה"כ:</span>
								<span class="total-value">₪{{ order.total }}</span>
							</div>

							<div class="payment-info">
								<span class="payment-method">{{ getPaymentLabel(order.payment?.method) }}</span>
								<span class="payment-status" :class="order.paymentStatus">
									{{ getPaymentStatusLabel(order.paymentStatus) }}
								</span>
							</div>

							<!-- Status Actions -->
							<div class="status-actions">
								<select :value="order.status" @change="changeStatus(order.id, $event.target.value)" class="status-select">
									<option value="pending">ממתין</option>
									<option value="confirmed">אושר</option>
									<option value="preparing">בהכנה</option>
									<option value="ready">מוכן</option>
									<option value="delivered">נמסר</option>
									<option value="cancelled">בוטל</option>
								</select>

								<select
									:value="order.paymentStatus"
									@change="changePaymentStatus(order.id, $event.target.value)"
									class="payment-select"
								>
									<option value="pending">לא שולם</option>
									<option value="awaiting">ממתין לתשלום</option>
									<option value="paid">שולם</option>
								</select>
							</div>
						</div>
					</div>
				</TransitionGroup>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from '../services/ordersService';

// Auth State
const isLoggedIn = ref(false);
const isLoggingIn = ref(false);
const email = ref('');
const password = ref('');
const loginError = ref('');
const userEmail = ref('');

// Data
const orders = ref([]);
const isLoading = ref(false);
const currentFilter = ref('all');
const searchQuery = ref('');

// Auth listener
let unsubscribeAuth = null;

// Status filters
const statusFilters = [
	{ value: 'all', label: 'הכל', icon: '📋' },
	{ value: 'pending', label: 'ממתינות', icon: '⏳' },
	{ value: 'confirmed', label: 'אושרו', icon: '✅' },
	{ value: 'preparing', label: 'בהכנה', icon: '👨‍🍳' },
	{ value: 'ready', label: 'מוכנות', icon: '📦' },
	{ value: 'delivered', label: 'נמסרו', icon: '🚗' },
	{ value: 'cancelled', label: 'בוטלו', icon: '❌' },
];

// Computed
const filteredOrders = computed(() => {
	let result = orders.value;

	if (currentFilter.value !== 'all') {
		result = result.filter(order => order.status === currentFilter.value);
	}

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter(
			order =>
				order.customer?.name?.toLowerCase().includes(query) ||
				order.customer?.phone?.includes(query) ||
				order.orderId?.toLowerCase().includes(query),
		);
	}

	return result;
});

const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'));

const preparingOrders = computed(() => orders.value.filter(o => o.status === 'preparing'));

const completedToday = computed(() => {
	const today = new Date().toDateString();
	return orders.value.filter(o => {
		const orderDate = o.createdAt?.toDate?.()?.toDateString() || '';
		return orderDate === today && o.status === 'delivered';
	});
});

const todayRevenue = computed(() => {
	const today = new Date().toDateString();
	return orders.value
		.filter(o => {
			const orderDate = o.createdAt?.toDate?.()?.toDateString() || '';
			return orderDate === today && o.paymentStatus === 'paid';
		})
		.reduce((sum, o) => sum + (o.total || 0), 0);
});

// Auth Methods
async function login() {
	if (!email.value || !password.value) return;

	isLoggingIn.value = true;
	loginError.value = '';

	try {
		await signInWithEmailAndPassword(auth, email.value, password.value);
		// onAuthStateChanged יטפל בהמשך
	} catch (error) {
		console.error('Login error:', error);
		switch (error.code) {
			case 'auth/invalid-email':
				loginError.value = 'כתובת אימייל לא תקינה';
				break;
			case 'auth/user-not-found':
				loginError.value = 'משתמש לא נמצא';
				break;
			case 'auth/wrong-password':
				loginError.value = 'סיסמה שגויה';
				break;
			case 'auth/invalid-credential':
				loginError.value = 'פרטי התחברות שגויים';
				break;
			default:
				loginError.value = 'שגיאה בהתחברות. נסו שוב.';
		}
	} finally {
		isLoggingIn.value = false;
	}
}

async function logout() {
	try {
		await signOut(auth);
		isLoggedIn.value = false;
		userEmail.value = '';
		orders.value = [];
		email.value = '';
		password.value = '';
	} catch (error) {
		console.error('Logout error:', error);
	}
}

// Orders Methods
async function loadOrders() {
	isLoading.value = true;
	try {
		orders.value = await getAllOrders();
	} catch (error) {
		console.error('Failed to load orders:', error);
	} finally {
		isLoading.value = false;
	}
}

async function changeStatus(orderId, status) {
	try {
		await updateOrderStatus(orderId, status);
		const order = orders.value.find(o => o.id === orderId);
		if (order) order.status = status;
	} catch (error) {
		console.error('Failed to update status:', error);
	}
}

async function changePaymentStatus(orderId, status) {
	try {
		await updatePaymentStatus(orderId, status);
		const order = orders.value.find(o => o.id === orderId);
		if (order) order.paymentStatus = status;
	} catch (error) {
		console.error('Failed to update payment status:', error);
	}
}

// Helper Methods
function getFilterCount(filter) {
	if (filter === 'all') return orders.value.length;
	return orders.value.filter(o => o.status === filter).length;
}

function getStatusLabel(status) {
	const labels = {
		pending: 'ממתין',
		confirmed: 'אושר',
		preparing: 'בהכנה',
		ready: 'מוכן',
		delivered: 'נמסר',
		cancelled: 'בוטל',
	};
	return labels[status] || status;
}

function getPaymentLabel(method) {
	const labels = {
		bit: '💙 Bit',
		paybox: '📦 PayBox',
		cash: '💵 מזומן',
	};
	return labels[method] || method;
}

function getPaymentStatusLabel(status) {
	const labels = {
		pending: 'לא שולם',
		awaiting: 'ממתין',
		paid: 'שולם ✓',
	};
	return labels[status] || status;
}

function formatDate(timestamp) {
	if (!timestamp) return '';
	const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
	return new Intl.DateTimeFormat('he-IL', {
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}

// Lifecycle
onMounted(() => {
	unsubscribeAuth = onAuthStateChanged(auth, user => {
		if (user) {
			isLoggedIn.value = true;
			userEmail.value = user.email;
			loadOrders();
		} else {
			isLoggedIn.value = false;
			userEmail.value = '';
		}
	});
});

onUnmounted(() => {
	if (unsubscribeAuth) {
		unsubscribeAuth();
	}
});
</script>

<style scoped>
.admin-page {
	min-height: 100vh;
	background: var(--bg-gradient);
}

/* Login Screen */
.login-screen {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2rem;
}

.login-card {
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 2.5rem;
	box-shadow: var(--card-shadow);
	width: 100%;
	max-width: 400px;
}

.login-title {
	font-size: 1.75rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
	text-align: center;
}

.login-subtitle {
	color: var(--text-secondary);
	margin: 0 0 2rem 0;
	text-align: center;
}

.form-group {
	margin-bottom: 1.25rem;
}

.form-label {
	display: block;
	font-weight: 600;
	font-size: 0.9rem;
	color: var(--text-primary);
	margin-bottom: 0.5rem;
}

.form-input {
	width: 100%;
	padding: 0.875rem 1rem;
	background: var(--bg-secondary);
	border: 2px solid transparent;
	border-radius: 12px;
	font-size: 1rem;
	color: var(--text-primary);
	transition: all 0.3s ease;
}

.form-input:focus {
	outline: none;
	border-color: var(--pink-primary);
	background: var(--bg-primary);
}

.login-btn {
	width: 100%;
	padding: 1rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 12px;
	font-size: 1.1rem;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	margin-top: 1.5rem;
}

.login-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.login-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.login-error {
	color: #e74c3c;
	margin-top: 1rem;
	font-weight: 600;
	text-align: center;
}

.loading-spinner {
	display: inline-block;
	width: 40px;
	height: 40px;
	border: 3px solid var(--border-color);
	border-top-color: var(--pink-primary);
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.loading-spinner.small {
	width: 20px;
	height: 20px;
	border-width: 2px;
	border-color: white;
	border-top-color: transparent;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* Admin Dashboard */
.admin-dashboard {
	padding: 1.5rem;
	max-width: 1400px;
	margin: 0 auto;
}

/* Header */
.admin-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	flex-wrap: wrap;
	gap: 1rem;
}

.header-right {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.admin-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0;
}

.orders-count {
	background: var(--pink-light);
	color: var(--pink-primary);
	padding: 0.4rem 0.8rem;
	border-radius: 20px;
	font-size: 0.85rem;
	font-weight: 600;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.user-email {
	font-size: 0.85rem;
	color: var(--text-secondary);
	padding: 0.4rem 0.8rem;
	background: var(--bg-secondary);
	border-radius: 20px;
}

.refresh-btn,
.logout-btn {
	padding: 0.6rem 1.2rem;
	border-radius: 10px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.refresh-btn {
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	color: var(--text-primary);
}

.refresh-btn:hover {
	border-color: var(--pink-primary);
}

.logout-btn {
	background: var(--bg-secondary);
	border: none;
	color: var(--text-secondary);
}

.logout-btn:hover {
	background: #fee;
	color: #e74c3c;
}

.spinning {
	display: inline-block;
	animation: spin 1s linear infinite;
}

/* Stats Grid */
.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	margin-bottom: 2rem;
}

.stat-card {
	background: var(--bg-primary);
	border-radius: 16px;
	padding: 1.25rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	box-shadow: var(--card-shadow);
}

.stat-icon {
	font-size: 2rem;
}

.stat-content {
	display: flex;
	flex-direction: column;
}

.stat-value {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
}

.stat-label {
	font-size: 0.85rem;
	color: var(--text-secondary);
}

/* Filters Bar */
.filters-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
}

.filter-tabs {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.filter-tab {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.5rem 1rem;
	background: var(--bg-primary);
	border: 2px solid transparent;
	border-radius: 25px;
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.filter-tab:hover {
	background: var(--pink-light);
}

.filter-tab.active {
	background: var(--pink-light);
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

.filter-count {
	background: var(--bg-secondary);
	padding: 0.15rem 0.5rem;
	border-radius: 10px;
	font-size: 0.75rem;
}

.filter-tab.active .filter-count {
	background: var(--pink-primary);
	color: white;
}

.search-box {
	position: relative;
}

.search-input {
	padding: 0.6rem 1rem 0.6rem 2.5rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	border-radius: 25px;
	font-size: 0.9rem;
	color: var(--text-primary);
	width: 250px;
	transition: all 0.3s ease;
}

.search-input:focus {
	outline: none;
	border-color: var(--pink-primary);
}

.search-icon {
	position: absolute;
	right: 1rem;
	top: 50%;
	transform: translateY(-50%);
}

/* Orders List */
.orders-list {
	min-height: 400px;
}

.loading-state,
.empty-state {
	text-align: center;
	padding: 4rem 2rem;
}

.empty-icon {
	font-size: 4rem;
	display: block;
	margin-bottom: 1rem;
	opacity: 0.5;
}

.empty-state h3 {
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.empty-state p {
	color: var(--text-secondary);
	margin: 0;
}

/* Order Card */
.orders-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.order-card {
	background: var(--bg-primary);
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: var(--card-shadow);
	border-right: 4px solid var(--border-color);
	transition: all 0.3s ease;
}

.order-card:hover {
	transform: translateX(-4px);
	box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.order-card.status-pending {
	border-right-color: #f39c12;
}

.order-card.status-confirmed {
	border-right-color: #3498db;
}

.order-card.status-preparing {
	border-right-color: #9b59b6;
}

.order-card.status-ready {
	border-right-color: #27ae60;
}

.order-card.status-delivered {
	border-right-color: #2ecc71;
}

.order-card.status-cancelled {
	border-right-color: #e74c3c;
	opacity: 0.7;
}

/* Order Header */
.order-header {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1rem;
	flex-wrap: wrap;
}

.order-id {
	display: flex;
	flex-direction: column;
}

.id-label {
	font-size: 0.75rem;
	color: var(--text-muted);
}

.id-value {
	font-weight: 700;
	color: var(--text-primary);
}

.order-time {
	font-size: 0.85rem;
	color: var(--text-secondary);
}

.order-status {
	margin-inline-start: auto;
	padding: 0.4rem 0.8rem;
	border-radius: 20px;
	font-size: 0.8rem;
	font-weight: 600;
}

.order-status.pending {
	background: #fff3cd;
	color: #856404;
}

.order-status.confirmed {
	background: #d1ecf1;
	color: #0c5460;
}

.order-status.preparing {
	background: #e2d5f1;
	color: #5e3d8e;
}

.order-status.ready {
	background: #d4edda;
	color: #155724;
}

.order-status.delivered {
	background: #c3e6cb;
	color: #155724;
}

.order-status.cancelled {
	background: #f8d7da;
	color: #721c24;
}

/* Customer Info */
.order-customer {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	margin-bottom: 1rem;
	flex-wrap: wrap;
}

.customer-name,
.customer-phone {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	color: var(--text-primary);
	text-decoration: none;
}

.customer-phone:hover {
	color: var(--pink-primary);
}

.whatsapp-link {
	padding: 0.3rem 0.6rem;
	background: #25d366;
	color: white;
	border-radius: 15px;
	font-size: 0.8rem;
	text-decoration: none;
	transition: all 0.3s ease;
}

.whatsapp-link:hover {
	background: #128c7e;
}

/* Delivery Info */
.order-delivery {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1rem;
	flex-wrap: wrap;
}

.delivery-badge {
	padding: 0.4rem 0.8rem;
	border-radius: 20px;
	font-size: 0.85rem;
	font-weight: 600;
}

.delivery-badge.pickup {
	background: var(--pink-light);
	color: var(--pink-primary);
}

.delivery-badge.delivery {
	background: #e8f4fd;
	color: #1976d2;
}

.delivery-address {
	font-size: 0.85rem;
	color: var(--text-secondary);
}

/* Order Items */
.order-items {
	background: var(--bg-secondary);
	border-radius: 12px;
	padding: 1rem;
	margin-bottom: 1rem;
}

.order-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.5rem 0;
	border-bottom: 1px dashed var(--border-color);
}

.order-item:last-child {
	border-bottom: none;
}

.item-emoji {
	font-size: 1.25rem;
}

.item-name {
	flex: 1;
	font-weight: 500;
	color: var(--text-primary);
}

.item-qty {
	color: var(--text-secondary);
	font-size: 0.9rem;
}

.item-price {
	font-weight: 600;
	color: var(--text-primary);
}

/* Order Notes */
.order-notes {
	display: flex;
	align-items: flex-start;
	gap: 0.5rem;
	padding: 0.75rem;
	background: #fff9e6;
	border-radius: 10px;
	margin-bottom: 1rem;
}

.dark .order-notes {
	background: #3d3520;
}

.notes-text {
	font-size: 0.9rem;
	color: var(--text-primary);
}

/* Date Time */
.order-datetime {
	display: flex;
	gap: 1rem;
	margin-bottom: 1rem;
}

.datetime-item {
	font-size: 0.9rem;
	color: var(--text-secondary);
}

/* Order Footer */
.order-footer {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	padding-top: 1rem;
	border-top: 1px solid var(--border-color);
	flex-wrap: wrap;
}

.order-total {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.total-label {
	color: var(--text-secondary);
}

.total-value {
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--pink-primary);
}

.payment-info {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.payment-method {
	font-size: 0.9rem;
	color: var(--text-primary);
}

.payment-status {
	padding: 0.3rem 0.6rem;
	border-radius: 15px;
	font-size: 0.75rem;
	font-weight: 600;
}

.payment-status.pending {
	background: #f8d7da;
	color: #721c24;
}

.payment-status.awaiting {
	background: #fff3cd;
	color: #856404;
}

.payment-status.paid {
	background: #d4edda;
	color: #155724;
}

/* Status Actions */
.status-actions {
	display: flex;
	gap: 0.5rem;
	margin-inline-start: auto;
}

.status-select,
.payment-select {
	padding: 0.5rem 0.75rem;
	background: var(--bg-secondary);
	border: 1px solid var(--border-color);
	border-radius: 8px;
	font-size: 0.85rem;
	color: var(--text-primary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.status-select:focus,
.payment-select:focus {
	outline: none;
	border-color: var(--pink-primary);
}

/* Transitions */
.order-list-enter-active,
.order-list-leave-active {
	transition: all 0.3s ease;
}

.order-list-enter-from {
	opacity: 0;
	transform: translateY(-20px);
}

.order-list-leave-to {
	opacity: 0;
	transform: translateX(20px);
}

.order-list-move {
	transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
	.admin-dashboard {
		padding: 1rem;
	}

	.filter-tabs {
		width: 100%;
		overflow-x: auto;
		flex-wrap: nowrap;
		padding-bottom: 0.5rem;
	}

	.filter-tab {
		flex-shrink: 0;
	}

	.search-box {
		width: 100%;
	}

	.search-input {
		width: 100%;
	}

	.order-footer {
		flex-direction: column;
		align-items: flex-start;
	}

	.status-actions {
		width: 100%;
		margin-inline-start: 0;
	}

	.status-select,
	.payment-select {
		flex: 1;
	}

	.header-left {
		flex-wrap: wrap;
	}

	.user-email {
		width: 100%;
		text-align: center;
	}
}
</style>

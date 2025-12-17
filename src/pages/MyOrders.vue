<template>
	<div class="my-orders-page">
		<header class="page-header">
			<h1 class="page-title">📜 ההזמנות שלי</h1>
			<p class="page-subtitle">צפייה בהיסטוריית ההזמנות</p>
		</header>

		<!-- Phone Input -->
		<div v-if="!isSearched" class="phone-search">
			<div class="search-card">
				<h2>הכניסו את מספר הטלפון</h2>
				<p>נמצא את ההזמנות שלכם</p>

				<div class="form-group">
					<input
						type="tel"
						v-model="phoneNumber"
						class="form-input"
						placeholder="050-0000000"
						dir="ltr"
						@keyup.enter="searchOrders"
					/>
				</div>

				<button class="search-btn" @click="searchOrders" :disabled="!isValidPhone || isLoading">
					<span v-if="isLoading" class="loading-spinner small"></span>
					<span v-else>
						חיפוש הזמנות
						<span class="btn-icon">🔍</span>
					</span>
				</button>
			</div>
		</div>

		<!-- Orders List -->
		<div v-else class="orders-section">
			<div class="section-header">
				<div class="header-info">
					<span class="phone-display">📱 {{ phoneNumber }}</span>
					<span class="orders-count">{{ orders.length }} הזמנות</span>
				</div>
				<button class="change-phone-btn" @click="resetSearch">שינוי מספר</button>
			</div>

			<!-- Loading -->
			<div v-if="isLoading" class="loading-state">
				<span class="loading-spinner"></span>
				<p>טוען הזמנות...</p>
			</div>

			<!-- Empty State -->
			<div v-else-if="orders.length === 0" class="empty-state">
				<span class="empty-icon">📭</span>
				<h3>לא נמצאו הזמנות</h3>
				<p>לא מצאנו הזמנות עבור מספר זה</p>
				<router-link to="/menu" class="order-btn"> להזמנה ראשונה 🍓 </router-link>
			</div>

			<!-- Orders -->
			<div v-else class="orders-list">
				<div v-for="order in orders" :key="order.id" class="order-card" :class="[`status-${order.status}`]">
					<!-- Order Header -->
					<div class="order-header">
						<div class="order-id">
							<span class="id-label">הזמנה</span>
							<span class="id-value">#{{ order.orderId || order.id?.slice(-6) }}</span>
						</div>
						<div class="order-status" :class="order.status">
							<span class="status-icon">{{ getStatusIcon(order.status) }}</span>
							{{ getStatusLabel(order.status) }}
						</div>
					</div>

					<!-- Order Date -->
					<div class="order-date">📅 {{ formatDate(order.createdAt) }}</div>

					<!-- Order Items -->
					<div class="order-items">
						<div v-for="item in order.items" :key="item.id" class="order-item">
							<span class="item-emoji">{{ item.image }}</span>
							<span class="item-name">{{ item.name }}</span>
							<span class="item-qty">x{{ item.quantity }}</span>
							<span class="item-price">₪{{ item.price * item.quantity }}</span>
						</div>
					</div>

					<!-- Delivery Info -->
					<div class="order-delivery">
						<span v-if="order.delivery?.option === 'pickup'" class="delivery-badge pickup"> 🏠 איסוף עצמי </span>
						<span v-else class="delivery-badge delivery"> 🚗 משלוח - {{ order.delivery?.location?.name }} </span>
					</div>

					<!-- Requested Date -->
					<div v-if="order.date || order.time" class="requested-date">
						<span v-if="order.date">📆 {{ order.date }}</span>
						<span v-if="order.time">🕐 {{ order.time }}</span>
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
					</div>

					<!-- Reorder Button -->
					<button class="reorder-btn" @click="reorder(order)">🔄 הזמנה חוזרת</button>
				</div>
			</div>

			<!-- New Order CTA -->
			<div class="new-order-cta">
				<router-link to="/menu" class="new-order-btn"> להזמנה חדשה 🍓 </router-link>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '../stores/orderStore';
import { getOrdersByPhone } from '../services/ordersService';

const router = useRouter();
const orderStore = useOrderStore();

const phoneNumber = ref('');
const orders = ref([]);
const isLoading = ref(false);
const isSearched = ref(false);

const isValidPhone = computed(() => {
	const cleaned = phoneNumber.value.replace(/\D/g, '');
	return cleaned.length >= 9 && cleaned.length <= 10;
});

async function searchOrders() {
	if (!isValidPhone.value) return;

	isLoading.value = true;
	isSearched.value = true;

	try {
		// נקה את המספר
		const cleaned = phoneNumber.value.replace(/\D/g, '');
		const formattedPhone = cleaned.startsWith('0') ? cleaned : `0${cleaned}`;

		// חפש ב-Firebase
		orders.value = await getOrdersByPhone(formattedPhone);
	} catch (error) {
		console.error('Failed to fetch orders:', error);
		orders.value = [];
	} finally {
		isLoading.value = false;
	}
}

function resetSearch() {
	isSearched.value = false;
	orders.value = [];
}

function reorder(order) {
	// נקה את העגלה הנוכחית
	orderStore.clearCart();

	// הוסף את הפריטים מההזמנה הקודמת
	order.items.forEach(item => {
		orderStore.addToCart(item, item.quantity);
	});

	// עבור לדף התפריט או ישירות ל-checkout
	router.push('/checkout');
}

function getStatusIcon(status) {
	const icons = {
		pending: '⏳',
		confirmed: '✅',
		preparing: '👨‍🍳',
		ready: '📦',
		delivered: '🚗',
		cancelled: '❌',
	};
	return icons[status] || '📋';
}

function getStatusLabel(status) {
	const labels = {
		pending: 'ממתין לאישור',
		confirmed: 'אושר',
		preparing: 'בהכנה',
		ready: 'מוכן לאיסוף/משלוח',
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
		awaiting: 'ממתין לתשלום',
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
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(date);
}
</script>

<style scoped>
.my-orders-page {
	max-width: 800px;
	margin: 0 auto;
	padding-bottom: 3rem;
}

/* Page Header */
.page-header {
	text-align: center;
	margin-bottom: 2rem;
}

.page-title {
	font-size: 2rem;
	font-weight: 800;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.page-subtitle {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0;
}

/* Phone Search */
.phone-search {
	display: flex;
	justify-content: center;
	padding: 2rem 0;
}

.search-card {
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 2.5rem;
	box-shadow: var(--card-shadow);
	width: 100%;
	max-width: 400px;
	text-align: center;
}

.search-card h2 {
	font-size: 1.25rem;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.search-card p {
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.form-group {
	margin-bottom: 1.5rem;
}

.form-input {
	width: 100%;
	padding: 1rem;
	background: var(--bg-secondary);
	border: 2px solid transparent;
	border-radius: 12px;
	font-size: 1.25rem;
	color: var(--text-primary);
	text-align: center;
	transition: all 0.3s ease;
}

.form-input:focus {
	outline: none;
	border-color: var(--pink-primary);
	background: var(--bg-primary);
}

.search-btn {
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
}

.search-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.search-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

/* Orders Section */
.orders-section {
	padding: 0;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
	gap: 1rem;
}

.header-info {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.phone-display {
	font-size: 1.1rem;
	font-weight: 600;
	color: var(--text-primary);
}

.orders-count {
	background: var(--pink-light);
	color: var(--pink-primary);
	padding: 0.4rem 0.8rem;
	border-radius: 20px;
	font-size: 0.85rem;
	font-weight: 600;
}

.change-phone-btn {
	padding: 0.5rem 1rem;
	background: var(--bg-secondary);
	border: none;
	border-radius: 20px;
	font-size: 0.9rem;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.change-phone-btn:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

/* Loading & Empty State */
.loading-state,
.empty-state {
	text-align: center;
	padding: 4rem 2rem;
	background: var(--bg-primary);
	border-radius: 20px;
	box-shadow: var(--card-shadow);
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
	margin: 0 0 1.5rem 0;
}

.order-btn {
	display: inline-flex;
	align-items: center;
	padding: 0.75rem 1.5rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border-radius: 25px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
}

.order-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

/* Orders List */
.orders-list {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

/* Order Card */
.order-card {
	background: var(--bg-primary);
	border-radius: 20px;
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
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;
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
	font-size: 1.1rem;
	color: var(--text-primary);
}

.order-status {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.5rem 1rem;
	border-radius: 20px;
	font-size: 0.85rem;
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

/* Order Date */
.order-date {
	font-size: 0.9rem;
	color: var(--text-secondary);
	margin-bottom: 1rem;
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

/* Delivery Info */
.order-delivery {
	margin-bottom: 1rem;
}

.delivery-badge {
	display: inline-block;
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

/* Requested Date */
.requested-date {
	display: flex;
	gap: 1rem;
	margin-bottom: 1rem;
	font-size: 0.9rem;
	color: var(--text-secondary);
}

/* Order Footer */
.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 1rem;
	border-top: 1px solid var(--border-color);
	margin-bottom: 1rem;
	flex-wrap: wrap;
	gap: 1rem;
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

/* Reorder Button */
.reorder-btn {
	width: 100%;
	padding: 0.75rem;
	background: var(--bg-secondary);
	border: 2px solid var(--border-pink);
	border-radius: 12px;
	font-weight: 600;
	color: var(--pink-primary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.reorder-btn:hover {
	background: var(--pink-light);
	border-color: var(--pink-primary);
}

/* New Order CTA */
.new-order-cta {
	text-align: center;
	margin-top: 2rem;
}

.new-order-btn {
	display: inline-flex;
	align-items: center;
	padding: 1rem 2rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border-radius: 30px;
	font-weight: 700;
	font-size: 1.1rem;
	text-decoration: none;
	transition: all 0.3s ease;
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.new-order-btn:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
}

/* Responsive */
@media (max-width: 600px) {
	.section-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.order-footer {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>

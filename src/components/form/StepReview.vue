<template>
	<div class="review-step">
		<h3 class="step-title">סיכום הזמנה</h3>
		<p class="step-description">בדקו את ההזמנה לפני שליחה</p>

		<div class="review-sections">
			<!-- Customer Info -->
			<div class="review-section">
				<div class="section-header">
					<span class="section-icon">👤</span>
					<h4>פרטי לקוח</h4>
					<button class="edit-btn" @click="$emit('edit-step', 2)">ערוך</button>
				</div>
				<div class="section-content">
					<div class="info-row">
						<span class="info-label">שם:</span>
						<span class="info-value">{{ customerInfo.name }}</span>
					</div>
					<div class="info-row">
						<span class="info-label">טלפון:</span>
						<span class="info-value">{{ customerInfo.phone }}</span>
					</div>
					<div class="info-row">
						<span class="info-label">אימייל:</span>
						<span class="info-value">{{ customerInfo.email }}</span>
					</div>
					<div class="info-row" v-if="customerInfo.address">
						<span class="info-label">כתובת:</span>
						<span class="info-value">{{ customerInfo.address }}</span>
					</div>
				</div>
			</div>

			<!-- Cart Items -->
			<div class="review-section">
				<div class="section-header">
					<span class="section-icon">🛒</span>
					<h4>מוצרים ({{ cartItemCount }})</h4>
					<button class="edit-btn" @click="$emit('edit-step', 1)">ערוך</button>
				</div>
				<div class="section-content">
					<TransitionGroup name="cart-item" tag="div" class="cart-items">
						<div v-for="item in cart" :key="item.id" class="cart-item">
							<span class="item-emoji">{{ item.image }}</span>
							<div class="item-details">
								<div class="item-name">{{ item.name }}</div>
								<div class="item-meta">
									<span class="item-qty">{{ item.quantity }} יח'</span>
									<span class="item-price">₪{{ item.price * item.quantity }}</span>
								</div>
							</div>
						</div>
					</TransitionGroup>
				</div>
			</div>

			<!-- Date & Notes -->
			<div class="review-section">
				<div class="section-header">
					<span class="section-icon">📝</span>
					<h4>פרטים נוספים</h4>
				</div>
				<div class="section-content">
					<div class="form-field">
						<label>תאריך מבוקש (אופציונלי)</label>
						<input type="date" v-model="orderDate" class="date-input" />
					</div>
					<div class="form-field">
						<label>הערות מיוחדות</label>
						<textarea
							v-model="specialRequests"
							rows="3"
							placeholder="אלרגיות, העדפות, כמויות מיוחדות..."
							class="notes-input"
						></textarea>
					</div>
				</div>
			</div>

			<!-- Total -->
			<div class="total-section">
				<div class="total-row">
					<span>סה"כ מוצרים:</span>
					<span>₪{{ cartTotal }}</span>
				</div>
				<div class="total-row total-final">
					<span>סה"כ לתשלום (משוער):</span>
					<span class="total-price">₪{{ cartTotal }}</span>
				</div>
				<p class="total-note">* המחיר הסופי יאושר בהצעת המחיר</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useOrderStore } from '../../stores/orderStore';

defineEmits(['edit-step']);

const orderStore = useOrderStore();

const customerInfo = computed(() => orderStore.customerInfo);
const cart = computed(() => orderStore.cart);
const cartItemCount = computed(() => orderStore.cartItemCount);
const cartTotal = computed(() => orderStore.cartTotal);

const orderDate = computed({
	get: () => orderStore.orderDate,
	set: value => (orderStore.orderDate = value),
});

const specialRequests = computed({
	get: () => orderStore.specialRequests,
	set: value => (orderStore.specialRequests = value),
});
</script>

<style scoped>
.review-step {
	padding: 1rem 0;
}

.step-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: #333;
	margin: 0 0 0.5rem 0;
}

.step-description {
	color: #666;
	margin: 0 0 2rem 0;
}

.review-sections {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.review-section {
	background: white;
	border: 1px solid #f0f0f0;
	border-radius: 16px;
	overflow: hidden;
}

.section-header {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem 1.25rem;
	background: #f8f9fa;
	border-bottom: 1px solid #f0f0f0;
}

.section-icon {
	font-size: 1.25rem;
}

.section-header h4 {
	margin: 0;
	flex: 1;
	font-size: 1rem;
	font-weight: 600;
}

.edit-btn {
	background: none;
	border: none;
	color: #ff6b9d;
	font-weight: 600;
	cursor: pointer;
	padding: 0.25rem 0.5rem;
	border-radius: 6px;
	transition: background 0.2s ease;
}

.edit-btn:hover {
	background: #fff5f8;
}

.section-content {
	padding: 1.25rem;
}

.info-row {
	display: flex;
	gap: 1rem;
	padding: 0.5rem 0;
	border-bottom: 1px dashed #f0f0f0;
}

.info-row:last-child {
	border-bottom: none;
}

.info-label {
	color: #666;
	min-width: 70px;
}

.info-value {
	font-weight: 500;
}

.cart-items {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.cart-item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem;
	background: #f8f9fa;
	border-radius: 12px;
}

.item-emoji {
	font-size: 1.5rem;
}

.item-details {
	flex: 1;
}

.item-name {
	font-weight: 600;
	margin-bottom: 0.25rem;
}

.item-meta {
	display: flex;
	gap: 1rem;
	font-size: 0.9rem;
	color: #666;
}

.item-price {
	color: #ff6b9d;
	font-weight: 600;
}

.form-field {
	margin-bottom: 1rem;
}

.form-field:last-child {
	margin-bottom: 0;
}

.form-field label {
	display: block;
	font-weight: 600;
	margin-bottom: 0.5rem;
	font-size: 0.9rem;
}

.date-input,
.notes-input {
	width: 100%;
	padding: 0.75rem 1rem;
	border: 2px solid #f0f0f0;
	border-radius: 12px;
	font-family: inherit;
	font-size: 1rem;
	transition: border-color 0.3s ease;
}

.date-input:focus,
.notes-input:focus {
	outline: none;
	border-color: #ff6b9d;
}

.notes-input {
	resize: vertical;
	min-height: 80px;
}

.total-section {
	background: linear-gradient(135deg, #fff5f8 0%, #fff 100%);
	padding: 1.5rem;
	border-radius: 16px;
	border: 2px solid #ffd6e7;
}

.total-row {
	display: flex;
	justify-content: space-between;
	padding: 0.5rem 0;
	color: #666;
}

.total-final {
	border-top: 2px solid #ffd6e7;
	margin-top: 0.75rem;
	padding-top: 1rem;
	font-weight: 700;
	font-size: 1.1rem;
	color: #333;
}

.total-price {
	color: #ff6b9d;
	font-size: 1.5rem;
}

.total-note {
	margin: 1rem 0 0 0;
	font-size: 0.8rem;
	color: #999;
}

/* Transitions */
.cart-item-enter-active,
.cart-item-leave-active {
	transition: all 0.3s ease;
}

.cart-item-enter-from,
.cart-item-leave-to {
	opacity: 0;
	transform: translateX(20px);
}
</style>

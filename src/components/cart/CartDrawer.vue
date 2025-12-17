<template>
	<Teleport to="body">
		<!-- Overlay -->
		<Transition name="fade">
			<div v-if="isOpen" class="cart-overlay" @click="closeCart"></div>
		</Transition>

		<!-- Drawer -->
		<Transition name="slide">
			<div v-if="isOpen" class="cart-drawer">
				<!-- Header -->
				<div class="cart-header">
					<h2 class="cart-title">
						<span class="cart-icon">🛒</span>
						העגלה שלי
						<span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
					</h2>
					<button class="close-btn" @click="closeCart">✕</button>
				</div>

				<!-- Empty State -->
				<div v-if="isCartEmpty" class="cart-empty">
					<span class="empty-icon">🛒</span>
					<h3>העגלה ריקה</h3>
					<p>הוסיפו מוצרים מהתפריט</p>
					<router-link to="/menu" class="browse-btn" @click="closeCart"> לתפריט </router-link>
				</div>

				<!-- Cart Items -->
				<div v-else class="cart-content">
					<div class="cart-items">
						<TransitionGroup name="cart-item">
							<div v-for="item in cart" :key="item.id" class="cart-item">
								<span class="item-emoji">{{ item.image }}</span>
								<div class="item-details">
									<h4 class="item-name">{{ item.name }}</h4>
									<span class="item-price">₪{{ item.price }} ליחידה</span>
								</div>
								<div class="item-actions">
									<div class="quantity-controls">
										<button class="qty-btn minus" @click="decrementQuantity(item.id)">−</button>
										<span class="qty-value">{{ item.quantity }}</span>
										<button class="qty-btn plus" @click="incrementQuantity(item.id)">+</button>
									</div>
									<span class="item-total">₪{{ item.price * item.quantity }}</span>
								</div>
								<button class="remove-btn" @click="removeFromCart(item.id)" title="הסר מהעגלה">🗑️</button>
							</div>
						</TransitionGroup>
					</div>

					<!-- Cart Summary -->
					<div class="cart-summary">
						<div class="summary-row">
							<span>סה"כ מוצרים ({{ cartItemCount }})</span>
							<span class="summary-value">₪{{ cartTotal }}</span>
						</div>
						<div class="summary-row delivery-note">
							<span>🚗 משלוח</span>
							<span class="summary-value">ייקבע בהמשך</span>
						</div>
						<div class="summary-row total">
							<span>סה"כ לתשלום</span>
							<span class="summary-value">₪{{ cartTotal }}+</span>
						</div>
					</div>

					<!-- Actions -->
					<div class="cart-actions">
						<router-link to="/checkout" class="checkout-btn" @click="closeCart">
							<span>מעבר לתשלום</span>
							<span class="btn-arrow">←</span>
						</router-link>
						<button class="continue-btn" @click="closeCart">המשך בקניות</button>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useOrderStore } from '../../stores/orderStore';
import { useUIStore } from '../../stores/uiStore';

const orderStore = useOrderStore();
const uiStore = useUIStore();

const isOpen = computed(() => uiStore.isCartDrawerOpen);
const cart = computed(() => orderStore.cart);
const cartTotal = computed(() => orderStore.cartTotal);
const cartItemCount = computed(() => orderStore.cartItemCount);
const isCartEmpty = computed(() => orderStore.isCartEmpty);

const closeCart = () => {
	uiStore.closeCartDrawer();
};

const incrementQuantity = productId => {
	const item = orderStore.cart.find(item => item.id === productId);
	if (item) {
		orderStore.updateQuantity(productId, item.quantity + 1);
	}
};

const decrementQuantity = productId => {
	const item = orderStore.cart.find(item => item.id === productId);
	if (item && item.quantity > 1) {
		orderStore.updateQuantity(productId, item.quantity - 1);
	} else {
		orderStore.removeFromCart(productId);
	}
};

const removeFromCart = productId => {
	orderStore.removeFromCart(productId);
	if (orderStore.isCartEmpty) {
		// Optional: show message
	}
};
</script>

<style scoped>
/* Overlay */
.cart-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4px);
	z-index: 1000;
}

/* Drawer */
.cart-drawer {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	max-width: 420px;
	background: var(--bg-primary);
	box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15);
	z-index: 1001;
	display: flex;
	flex-direction: column;
}

/* Header */
.cart-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1.25rem 1.5rem;
	border-bottom: 1px solid var(--border-color);
}

.cart-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0;
}

.cart-icon {
	font-size: 1.5rem;
}

.cart-badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 24px;
	height: 24px;
	padding: 0 0.5rem;
	background: var(--pink-primary);
	color: white;
	border-radius: 12px;
	font-size: 0.85rem;
	font-weight: 700;
}

.close-btn {
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-secondary);
	border: none;
	border-radius: 50%;
	font-size: 1.1rem;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.close-btn:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

/* Empty State */
.cart-empty {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	text-align: center;
}

.empty-icon {
	font-size: 4rem;
	margin-bottom: 1rem;
	opacity: 0.5;
}

.cart-empty h3 {
	font-size: 1.25rem;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.cart-empty p {
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.browse-btn {
	display: inline-flex;
	align-items: center;
	padding: 0.75rem 1.5rem;
	background: var(--pink-primary);
	color: white;
	border-radius: 25px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
}

.browse-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

/* Cart Content */
.cart-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

/* Cart Items */
.cart-items {
	flex: 1;
	overflow-y: auto;
	padding: 1rem 1.5rem;
}

.cart-item {
	display: grid;
	grid-template-columns: auto 1fr auto auto;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background: var(--bg-secondary);
	border-radius: 12px;
	margin-bottom: 0.75rem;
}

.item-emoji {
	font-size: 2rem;
}

.item-details {
	min-width: 0;
}

.item-name {
	font-size: 0.95rem;
	font-weight: 600;
	color: var(--text-primary);
	margin: 0 0 0.25rem 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.item-price {
	font-size: 0.8rem;
	color: var(--text-secondary);
}

.item-actions {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.5rem;
}

.quantity-controls {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 0.2rem;
}

.qty-btn {
	width: 26px;
	height: 26px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--pink-light);
	border: none;
	border-radius: 50%;
	color: var(--pink-primary);
	font-size: 1rem;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.2s ease;
}

.qty-btn:hover {
	background: var(--pink-primary);
	color: white;
}

.qty-btn.minus:hover {
	background: #e74c3c;
}

.qty-value {
	min-width: 20px;
	text-align: center;
	font-weight: 600;
	font-size: 0.9rem;
}

.item-total {
	font-weight: 700;
	color: var(--pink-primary);
	font-size: 0.95rem;
}

.remove-btn {
	background: none;
	border: none;
	font-size: 1.1rem;
	cursor: pointer;
	opacity: 0.5;
	transition: all 0.2s ease;
	padding: 0.25rem;
}

.remove-btn:hover {
	opacity: 1;
	transform: scale(1.1);
}

/* Cart Summary */
.cart-summary {
	padding: 1.25rem 1.5rem;
	background: var(--bg-secondary);
	border-top: 1px solid var(--border-color);
}

.summary-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem 0;
	font-size: 0.95rem;
	color: var(--text-secondary);
}

.summary-value {
	font-weight: 600;
	color: var(--text-primary);
}

.delivery-note {
	font-size: 0.85rem;
}

.summary-row.total {
	border-top: 2px dashed var(--border-color);
	margin-top: 0.5rem;
	padding-top: 1rem;
	font-size: 1.1rem;
	font-weight: 700;
	color: var(--text-primary);
}

.summary-row.total .summary-value {
	font-size: 1.25rem;
	color: var(--pink-primary);
}

/* Cart Actions */
.cart-actions {
	padding: 1.25rem 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.checkout-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 1rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 12px;
	font-weight: 700;
	font-size: 1.05rem;
	text-decoration: none;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.checkout-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.checkout-btn:hover .btn-arrow {
	transform: translateX(-4px);
}

.btn-arrow {
	transition: transform 0.3s ease;
}

.continue-btn {
	padding: 0.875rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	border-radius: 12px;
	font-weight: 600;
	font-size: 0.95rem;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.continue-btn:hover {
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
	transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
	transform: translateX(100%);
}

/* Cart Item Transitions */
.cart-item-enter-active,
.cart-item-leave-active {
	transition: all 0.3s ease;
}

.cart-item-enter-from {
	opacity: 0;
	transform: translateX(20px);
}

.cart-item-leave-to {
	opacity: 0;
	transform: translateX(-20px);
}

.cart-item-move {
	transition: transform 0.3s ease;
}

/* Mobile */
@media (max-width: 480px) {
	.cart-drawer {
		max-width: 100%;
	}

	.cart-item {
		grid-template-columns: auto 1fr auto;
		gap: 0.75rem;
	}

	.remove-btn {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
	}

	.cart-item {
		position: relative;
	}
}
</style>

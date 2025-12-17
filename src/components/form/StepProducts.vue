<template>
	<div class="products-step">
		<h3 class="step-title">בחירת מוצרים</h3>
		<p class="step-description">בחרו את המוצרים שתרצו להזמין</p>

		<div class="category-tabs">
			<button
				v-for="category in categories"
				:key="category"
				class="category-tab"
				:class="{ active: activeCategory === category }"
				@click="activeCategory = category"
			>
				{{ category }}
			</button>
		</div>

		<TransitionGroup name="products" tag="div" class="products-grid">
			<div
				v-for="product in filteredProducts"
				:key="product.id"
				class="product-card"
				:class="{ selected: isSelected(product.id) }"
				@click="toggleProduct(product)"
			>
				<div class="product-emoji">{{ product.image }}</div>
				<div class="product-info">
					<div class="product-name">{{ product.name }}</div>
					<div class="product-price">₪{{ product.price }}</div>
				</div>
				<div class="product-quantity" v-if="isSelected(product.id)" @click.stop>
					<button class="qty-btn" @click="decrementQuantity(product.id)">-</button>
					<span class="qty-value">{{ getQuantity(product.id) }}</span>
					<button class="qty-btn" @click="incrementQuantity(product.id)">+</button>
				</div>
				<div class="product-check">
					<span v-if="isSelected(product.id)">✓</span>
				</div>
				<span v-if="product.popular" class="popular-badge">פופולרי</span>
			</div>
		</TransitionGroup>

		<div class="cart-summary" v-if="cartItemCount > 0">
			<div class="summary-content">
				<span class="summary-count">{{ cartItemCount }} פריטים</span>
				<span class="summary-total">סה"כ: ₪{{ cartTotal }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useOrderStore } from '../../stores/orderStore';

const orderStore = useOrderStore();

const categories = ['הכל', 'עוגות', 'עוגיות', 'מאפים', 'סלטים'];
const activeCategory = ref('הכל');

const filteredProducts = computed(() => {
	if (activeCategory.value === 'הכל') {
		return orderStore.products;
	}
	return orderStore.products.filter(p => p.category === activeCategory.value);
});

const cartItemCount = computed(() => orderStore.cartItemCount);
const cartTotal = computed(() => orderStore.cartTotal);

const isSelected = productId => {
	return orderStore.cart.some(item => item.id === productId);
};

const getQuantity = productId => {
	const item = orderStore.cart.find(item => item.id === productId);
	return item?.quantity || 0;
};

const toggleProduct = product => {
	if (isSelected(product.id)) {
		orderStore.removeFromCart(product.id);
	} else {
		orderStore.addToCart(product, 1);
	}
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
</script>

<style scoped>
.products-step {
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
	margin: 0 0 1.5rem 0;
}

.category-tabs {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
}

.category-tab {
	padding: 0.5rem 1rem;
	border: 2px solid #ffd6e7;
	border-radius: 20px;
	background: white;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.category-tab:hover {
	background: #fff5f8;
}

.category-tab.active {
	background: linear-gradient(135deg, #ff6b9d, #ff8fab);
	color: white;
	border-color: transparent;
}

.products-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	gap: 1rem;
}

.product-card {
	position: relative;
	padding: 1.25rem;
	border: 2px solid #f0f0f0;
	border-radius: 16px;
	background: white;
	cursor: pointer;
	transition: all 0.3s ease;
	text-align: center;
}

.product-card:hover {
	border-color: #ffd6e7;
	transform: translateY(-2px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.product-card.selected {
	border-color: #ff6b9d;
	background: #fff5f8;
}

.product-emoji {
	font-size: 3rem;
	margin-bottom: 0.75rem;
}

.product-name {
	font-weight: 600;
	font-size: 0.95rem;
	margin-bottom: 0.25rem;
}

.product-price {
	color: #ff6b9d;
	font-weight: 700;
	font-size: 1.1rem;
}

.product-quantity {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	margin-top: 0.75rem;
}

.qty-btn {
	width: 28px;
	height: 28px;
	border: 2px solid #ff6b9d;
	border-radius: 8px;
	background: white;
	color: #ff6b9d;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s ease;
}

.qty-btn:hover {
	background: #ff6b9d;
	color: white;
}

.qty-value {
	font-weight: 700;
	min-width: 24px;
}

.product-check {
	position: absolute;
	top: 0.75rem;
	left: 0.75rem;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background: #ff6b9d;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.8rem;
	opacity: 0;
	transform: scale(0);
	transition: all 0.3s ease;
}

.product-card.selected .product-check {
	opacity: 1;
	transform: scale(1);
}

.popular-badge {
	position: absolute;
	top: 0.75rem;
	right: 0.75rem;
	background: linear-gradient(135deg, #ffd700, #ffb347);
	color: #333;
	font-size: 0.7rem;
	font-weight: 700;
	padding: 0.25rem 0.5rem;
	border-radius: 8px;
}

.cart-summary {
	position: sticky;
	bottom: 0;
	margin-top: 1.5rem;
	padding: 1rem;
	background: linear-gradient(135deg, #ff6b9d, #ff8fab);
	border-radius: 16px;
	color: white;
}

.summary-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.summary-count {
	font-weight: 600;
}

.summary-total {
	font-weight: 700;
	font-size: 1.25rem;
}

/* Transitions */
.products-enter-active,
.products-leave-active {
	transition: all 0.4s ease;
}

.products-enter-from {
	opacity: 0;
	transform: scale(0.9);
}

.products-leave-to {
	opacity: 0;
	transform: scale(0.9);
}

.products-move {
	transition: transform 0.4s ease;
}
</style>

<template>
	<button class="cart-button" :class="{ 'has-items': cartItemCount > 0, 'is-animating': isAnimating }" @click="openCart">
		<span class="cart-icon">🛒</span>
		<Transition name="bounce">
			<span v-if="cartItemCount > 0" class="cart-count">
				{{ cartItemCount > 99 ? '99+' : cartItemCount }}
			</span>
		</Transition>
		<Transition name="fade">
			<span v-if="cartItemCount > 0" class="cart-total"> ₪{{ cartTotal }} </span>
		</Transition>
	</button>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useOrderStore } from '../../stores/orderStore';
import { useUIStore } from '../../stores/uiStore';

const orderStore = useOrderStore();
const uiStore = useUIStore();

const isAnimating = ref(false);

const cartItemCount = computed(() => orderStore.cartItemCount);
const cartTotal = computed(() => orderStore.cartTotal);

const openCart = () => {
	uiStore.openCartDrawer();
};

// Animate when items are added
watch(cartItemCount, (newVal, oldVal) => {
	if (newVal > oldVal) {
		isAnimating.value = true;
		setTimeout(() => {
			isAnimating.value = false;
		}, 500);
	}
});
</script>

<style scoped>
.cart-button {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-pink);
	border-radius: 25px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.cart-button:hover {
	background: var(--pink-light);
	border-color: var(--pink-primary);
}

.cart-button.has-items {
	background: var(--pink-light);
	border-color: var(--pink-primary);
}

.cart-button.is-animating {
	animation: cartPop 0.5s ease;
}

@keyframes cartPop {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
}

.cart-icon {
	font-size: 1.25rem;
	transition: transform 0.3s ease;
}

.cart-button:hover .cart-icon {
	transform: scale(1.1);
}

.cart-button.is-animating .cart-icon {
	animation: iconWiggle 0.5s ease;
}

@keyframes iconWiggle {
	0%,
	100% {
		transform: rotate(0deg);
	}
	25% {
		transform: rotate(-10deg);
	}
	75% {
		transform: rotate(10deg);
	}
}

.cart-count {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 22px;
	height: 22px;
	padding: 0 0.4rem;
	background: var(--pink-primary);
	color: white;
	border-radius: 11px;
	font-size: 0.8rem;
	font-weight: 700;
}

.cart-total {
	font-weight: 700;
	font-size: 0.95rem;
	color: var(--pink-primary);
}

/* Bounce Transition */
.bounce-enter-active {
	animation: bounceIn 0.4s ease;
}

.bounce-leave-active {
	animation: bounceOut 0.3s ease;
}

@keyframes bounceIn {
	0% {
		opacity: 0;
		transform: scale(0);
	}
	50% {
		transform: scale(1.2);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

@keyframes bounceOut {
	0% {
		opacity: 1;
		transform: scale(1);
	}
	100% {
		opacity: 0;
		transform: scale(0);
	}
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Mobile */
@media (max-width: 480px) {
	.cart-total {
		display: none;
	}

	.cart-button {
		padding: 0.5rem 0.75rem;
	}
}
</style>

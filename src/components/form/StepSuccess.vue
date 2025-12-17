<template>
	<div class="success-step">
		<div class="success-animation">
			<div class="checkmark-circle">
				<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
					<circle class="checkmark-bg" cx="26" cy="26" r="25" fill="none" />
					<path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
				</svg>
			</div>
			<div class="confetti">
				<span v-for="n in 20" :key="n" class="confetti-piece" :style="getConfettiStyle(n)"></span>
			</div>
		</div>

		<h2 class="success-title">ההזמנה נשלחה בהצלחה! 🎉</h2>
		<p class="success-message">
			תודה רבה על ההזמנה!<br />
			נחזור אליך תוך 24 שעות עם הצעת מחיר.
		</p>

		<div class="order-reference">
			<span class="ref-label">מספר הזמנה:</span>
			<span class="ref-number">#{{ orderId }}</span>
		</div>

		<div class="success-actions">
			<AnimatedButton variant="primary" @click="$emit('new-order')"> הזמנה חדשה </AnimatedButton>
			<AnimatedButton variant="outline" @click="goHome"> חזרה לדף הבית </AnimatedButton>
		</div>

		<div class="contact-info">
			<p>שאלות? צרו קשר:</p>
			<a href="tel:0528460331" class="contact-link">📱 052-846-0331</a>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '../../stores/orderStore';
import AnimatedButton from '../ui/AnimatedButton.vue';

defineEmits(['new-order']);

const router = useRouter();
const orderStore = useOrderStore();

const orderId = computed(() => {
	const lastOrder = orderStore.orderHistory[0];
	return lastOrder?.id || Date.now();
});

const goHome = () => {
	router.push('/');
};

const getConfettiStyle = n => {
	const colors = ['#ff6b9d', '#ffd700', '#ff8fab', '#667eea', '#27ae60'];
	return {
		'--delay': `${Math.random() * 0.5}s`,
		'--rotation': `${Math.random() * 360}deg`,
		'--x-end': `${(Math.random() - 0.5) * 200}px`,
		'--y-end': `${Math.random() * 150 + 50}px`,
		backgroundColor: colors[n % colors.length],
	};
};
</script>

<style scoped>
.success-step {
	text-align: center;
	padding: 2rem 1rem;
}

.success-animation {
	position: relative;
	width: 120px;
	height: 120px;
	margin: 0 auto 2rem;
}

.checkmark-circle {
	width: 120px;
	height: 120px;
	animation: scale-in 0.5s ease forwards;
}

.checkmark {
	width: 100%;
	height: 100%;
	stroke-width: 2;
}

.checkmark-bg {
	stroke: #27ae60;
	stroke-width: 4;
	stroke-dasharray: 157;
	stroke-dashoffset: 157;
	animation: circle-draw 0.6s ease forwards 0.3s;
}

.checkmark-check {
	stroke: #27ae60;
	stroke-width: 4;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-dasharray: 48;
	stroke-dashoffset: 48;
	animation: check-draw 0.4s ease forwards 0.8s;
}

@keyframes scale-in {
	0% {
		transform: scale(0);
	}
	50% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
}

@keyframes circle-draw {
	to {
		stroke-dashoffset: 0;
	}
}

@keyframes check-draw {
	to {
		stroke-dashoffset: 0;
	}
}

/* Confetti */
.confetti {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.confetti-piece {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 10px;
	height: 10px;
	border-radius: 2px;
	animation: confetti-fall 1s ease forwards;
	animation-delay: var(--delay);
	opacity: 0;
}

@keyframes confetti-fall {
	0% {
		opacity: 1;
		transform: translate(-50%, -50%) rotate(0deg) scale(0);
	}
	50% {
		opacity: 1;
		transform: translate(calc(-50% + var(--x-end)), calc(-50% - var(--y-end))) rotate(var(--rotation)) scale(1);
	}
	100% {
		opacity: 0;
		transform: translate(calc(-50% + var(--x-end)), calc(-50% + 50px)) rotate(var(--rotation)) scale(0.5);
	}
}

.success-title {
	font-size: 1.75rem;
	font-weight: 700;
	color: #333;
	margin: 0 0 1rem 0;
}

.success-message {
	color: #666;
	font-size: 1.1rem;
	line-height: 1.6;
	margin: 0 0 2rem 0;
}

.order-reference {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	background: #f8f9fa;
	border-radius: 12px;
	margin-bottom: 2rem;
}

.ref-label {
	color: #666;
}

.ref-number {
	font-weight: 700;
	font-family: monospace;
	font-size: 1.1rem;
}

.success-actions {
	display: flex;
	gap: 1rem;
	justify-content: center;
	flex-wrap: wrap;
	margin-bottom: 2rem;
}

.contact-info {
	padding-top: 2rem;
	border-top: 1px solid #f0f0f0;
}

.contact-info p {
	color: #999;
	margin: 0 0 0.5rem 0;
}

.contact-link {
	color: #ff6b9d;
	text-decoration: none;
	font-weight: 600;
	font-size: 1.1rem;
}

.contact-link:hover {
	text-decoration: underline;
}
</style>

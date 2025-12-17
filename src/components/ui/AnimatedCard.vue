<template>
	<div
		ref="cardRef"
		class="animated-card"
		:class="[`card-${variant}`, { 'is-visible': isVisible, 'is-hoverable': hoverable, 'is-clickable': clickable }]"
		:style="animationStyle"
		@click="handleClick"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
	>
		<div class="card-glow" :style="glowStyle"></div>
		<div class="card-content">
			<slot></slot>
		</div>
		<div v-if="showShimmer" class="card-shimmer"></div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
	variant: {
		type: String,
		default: 'default',
		validator: v => ['default', 'elevated', 'outlined', 'gradient'].includes(v),
	},
	hoverable: { type: Boolean, default: true },
	clickable: Boolean,
	delay: { type: Number, default: 0 },
	showShimmer: Boolean,
	glowOnHover: { type: Boolean, default: true },
});

const emit = defineEmits(['click']);

const cardRef = ref(null);
const isVisible = ref(false);
const isHovered = ref(false);
const mouseX = ref(50);
const mouseY = ref(50);

let observer = null;

const animationStyle = computed(() => ({
	'--animation-delay': `${props.delay}ms`,
	'--mouse-x': `${mouseX.value}%`,
	'--mouse-y': `${mouseY.value}%`,
}));

const glowStyle = computed(() => {
	if (!props.glowOnHover || !isHovered.value) return { opacity: 0 };
	return {
		opacity: 1,
		background: `radial-gradient(circle at ${mouseX.value}% ${mouseY.value}%, rgba(255, 107, 157, 0.15), transparent 50%)`,
	};
});

const handleClick = e => {
	if (props.clickable) {
		emit('click', e);
	}
};

const handleMouseEnter = () => {
	isHovered.value = true;
};

const handleMouseLeave = () => {
	isHovered.value = false;
	mouseX.value = 50;
	mouseY.value = 50;
};

const handleMouseMove = e => {
	if (!cardRef.value) return;
	const rect = cardRef.value.getBoundingClientRect();
	mouseX.value = ((e.clientX - rect.left) / rect.width) * 100;
	mouseY.value = ((e.clientY - rect.top) / rect.height) * 100;
};

onMounted(() => {
	if (cardRef.value) {
		cardRef.value.addEventListener('mousemove', handleMouseMove);

		observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						isVisible.value = true;
					}, props.delay);
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.1 },
		);
		observer.observe(cardRef.value);
	}
});

onUnmounted(() => {
	if (cardRef.value) {
		cardRef.value.removeEventListener('mousemove', handleMouseMove);
	}
	if (observer) {
		observer.disconnect();
	}
});
</script>

<style scoped>
.animated-card {
	position: relative;
	padding: 1.5rem;
	border-radius: 20px;
	overflow: hidden;
	opacity: 0;
	transform: translateY(30px);
	transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
	transition-delay: var(--animation-delay, 0ms);
}

.animated-card.is-visible {
	opacity: 1;
	transform: translateY(0);
}

/* Variants */
.card-default {
	background: #fff;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.card-elevated {
	background: #fff;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.card-outlined {
	background: transparent;
	border: 2px solid #ffd6e7;
}

.card-gradient {
	background: linear-gradient(135deg, #fff5f8 0%, #fff 100%);
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.1);
}

/* Hoverable */
.is-hoverable:hover {
	transform: translateY(-4px);
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.is-clickable {
	cursor: pointer;
}

/* Content */
.card-content {
	position: relative;
	z-index: 1;
}

/* Glow effect */
.card-glow {
	position: absolute;
	inset: 0;
	opacity: 0;
	transition: opacity 0.3s ease;
	pointer-events: none;
	z-index: 0;
}

/* Shimmer effect */
.card-shimmer {
	position: absolute;
	top: 0;
	left: -100%;
	width: 50%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
	animation: shimmer 2s infinite;
	z-index: 2;
	pointer-events: none;
}

@keyframes shimmer {
	0% {
		left: -100%;
	}
	100% {
		left: 200%;
	}
}
</style>

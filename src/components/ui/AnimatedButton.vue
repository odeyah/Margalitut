<template>
	<button
		:class="['animated-btn', `btn-${variant}`, `btn-${size}`, { 'btn-loading': loading, 'btn-disabled': disabled }]"
		:disabled="disabled || loading"
		@click="handleClick"
	>
		<span class="btn-bg"></span>
		<span class="btn-content">
			<span v-if="loading" class="spinner"></span>
			<span v-if="icon && !loading" class="btn-icon">{{ icon }}</span>
			<slot></slot>
		</span>
		<span class="btn-shine"></span>
	</button>
</template>

<script setup>
//import { defineProps, defineEmits } from 'vue';

const props = defineProps({
	variant: {
		type: String,
		default: 'primary',
		validator: v => ['primary', 'secondary', 'outline', 'ghost'].includes(v),
	},
	size: {
		type: String,
		default: 'md',
		validator: v => ['sm', 'md', 'lg'].includes(v),
	},
	loading: Boolean,
	disabled: Boolean,
	icon: String,
});

const emit = defineEmits(['click']);

const handleClick = e => {
	if (!props.loading && !props.disabled) {
		emit('click', e);
	}
};
</script>

<style scoped>
.animated-btn {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	border: none;
	border-radius: 12px;
	font-weight: 600;
	cursor: pointer;
	overflow: hidden;
	transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.animated-btn:hover:not(.btn-disabled) {
	transform: translateY(-2px);
}

.animated-btn:active:not(.btn-disabled) {
	transform: translateY(0) scale(0.98);
}

/* Sizes */
.btn-sm {
	padding: 0.5rem 1rem;
	font-size: 0.875rem;
}
.btn-md {
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
}
.btn-lg {
	padding: 1rem 2rem;
	font-size: 1.125rem;
}

/* Variants */
.btn-primary {
	background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
	color: white;
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.btn-primary:hover:not(.btn-disabled) {
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.btn-secondary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-outline {
	background: transparent;
	border: 2px solid #ff6b9d;
	color: #ff6b9d;
}

.btn-outline:hover:not(.btn-disabled) {
	background: rgba(255, 107, 157, 0.1);
}

.btn-ghost {
	background: transparent;
	color: #333;
}

.btn-ghost:hover:not(.btn-disabled) {
	background: rgba(0, 0, 0, 0.05);
}

/* Background animation layer */
.btn-bg {
	position: absolute;
	inset: 0;
	background: inherit;
	z-index: 0;
}

/* Content */
.btn-content {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

/* Shine effect */
.btn-shine {
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
	z-index: 2;
	transition: left 0.5s ease;
}

.animated-btn:hover:not(.btn-disabled) .btn-shine {
	left: 100%;
}

/* Loading state */
.btn-loading {
	cursor: wait;
}

.spinner {
	width: 1em;
	height: 1em;
	border: 2px solid transparent;
	border-top-color: currentColor;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* Disabled state */
.btn-disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

/* Icon */
.btn-icon {
	font-size: 1.2em;
}
</style>

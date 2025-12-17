<template>
	<Teleport to="body">
		<TransitionGroup name="toast" tag="div" class="toast-container">
			<div
				v-for="notification in notifications"
				:key="notification.id"
				class="toast"
				:class="`toast-${notification.type}`"
				@click="removeNotification(notification.id)"
			>
				<span class="toast-icon">
					{{ icons[notification.type] }}
				</span>
				<span class="toast-message">{{ notification.message }}</span>
				<button class="toast-close" @click.stop="removeNotification(notification.id)">×</button>
				<div class="toast-progress" :style="{ animationDuration: `${notification.duration}ms` }"></div>
			</div>
		</TransitionGroup>
	</Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useUIStore } from '../../stores/uiStore';

const uiStore = useUIStore();

const notifications = computed(() => uiStore.notifications);
const removeNotification = id => uiStore.removeNotification(id);

const icons = {
	success: '✓',
	error: '✕',
	warning: '⚠',
	info: 'ℹ',
};
</script>

<style scoped>
.toast-container {
	position: fixed;
	top: 1rem;
	left: 50%;
	transform: translateX(-50%);
	z-index: 9999;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	max-width: 90vw;
	width: 400px;
}

.toast {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem 1.25rem;
	border-radius: 12px;
	background: white;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	overflow: hidden;
}

.toast-success {
	border-right: 4px solid #27ae60;
}

.toast-error {
	border-right: 4px solid #e74c3c;
}

.toast-warning {
	border-right: 4px solid #f39c12;
}

.toast-info {
	border-right: 4px solid #3498db;
}

.toast-icon {
	width: 2rem;
	height: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	font-weight: bold;
	flex-shrink: 0;
}

.toast-success .toast-icon {
	background: #d4edda;
	color: #27ae60;
}
.toast-error .toast-icon {
	background: #f8d7da;
	color: #e74c3c;
}
.toast-warning .toast-icon {
	background: #fff3cd;
	color: #f39c12;
}
.toast-info .toast-icon {
	background: #d1ecf1;
	color: #3498db;
}

.toast-message {
	flex: 1;
	font-size: 0.95rem;
	color: #333;
}

.toast-close {
	background: none;
	border: none;
	font-size: 1.25rem;
	color: #999;
	cursor: pointer;
	padding: 0.25rem;
	line-height: 1;
}

.toast-close:hover {
	color: #333;
}

.toast-progress {
	position: absolute;
	bottom: 0;
	right: 0;
	height: 3px;
	width: 100%;
	background: currentColor;
	opacity: 0.3;
	animation: progress linear forwards;
}

@keyframes progress {
	from {
		width: 100%;
	}
	to {
		width: 0%;
	}
}

/* Transitions */
.toast-enter-active {
	animation: toast-in 0.4s ease;
}

.toast-leave-active {
	animation: toast-out 0.3s ease forwards;
}

.toast-move {
	transition: transform 0.3s ease;
}

@keyframes toast-in {
	0% {
		opacity: 0;
		transform: translateY(-20px) scale(0.9);
	}
	100% {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

@keyframes toast-out {
	0% {
		opacity: 1;
		transform: translateX(0) scale(1);
	}
	100% {
		opacity: 0;
		transform: translateX(100%) scale(0.9);
	}
}
</style>

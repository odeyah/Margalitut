<template>
	<div class="progress-steps">
		<div class="progress-track">
			<div class="progress-fill" :style="{ width: progressWidth }"></div>
		</div>

		<div class="steps-container">
			<div
				v-for="(step, index) in steps"
				:key="index"
				class="step"
				:class="{
					'step-completed': index + 1 < currentStep,
					'step-active': index + 1 === currentStep,
					'step-pending': index + 1 > currentStep,
				}"
				@click="handleStepClick(index + 1)"
			>
				<div class="step-indicator">
					<span v-if="index + 1 < currentStep" class="step-check">✓</span>
					<span v-else class="step-number">{{ index + 1 }}</span>
					<div class="step-pulse"></div>
				</div>
				<div class="step-content">
					<div class="step-title">{{ step.title }}</div>
					<div v-if="step.subtitle" class="step-subtitle">{{ step.subtitle }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	steps: {
		type: Array,
		required: true,
	},
	currentStep: {
		type: Number,
		default: 1,
	},
	clickable: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['step-click']);

const progressWidth = computed(() => {
	const totalSteps = props.steps.length;
	const progress = ((props.currentStep - 1) / (totalSteps - 1)) * 100;
	return `${Math.min(100, Math.max(0, progress))}%`;
});

const handleStepClick = stepNumber => {
	if (props.clickable && stepNumber < props.currentStep) {
		emit('step-click', stepNumber);
	}
};
</script>

<style scoped>
.progress-steps {
	position: relative;
	padding: 1.5rem 0;
}

.progress-track {
	position: absolute;
	top: 2.5rem;
	right: 3rem;
	left: 3rem;
	height: 4px;
	background: #e9ecef;
	border-radius: 2px;
	z-index: 0;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #ff6b9d, #ff8fab);
	border-radius: 2px;
	transition: width 0.5s ease;
}

.steps-container {
	position: relative;
	display: flex;
	justify-content: space-between;
	z-index: 1;
}

.step {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	cursor: default;
}

.step.step-completed {
	cursor: pointer;
}

.step-indicator {
	position: relative;
	width: 3rem;
	height: 3rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	background: #e9ecef;
	font-weight: 700;
	font-size: 1rem;
	color: #999;
	transition: all 0.4s ease;
	z-index: 1;
}

.step-completed .step-indicator {
	background: linear-gradient(135deg, #ff6b9d, #ff8fab);
	color: white;
	transform: scale(1);
}

.step-active .step-indicator {
	background: white;
	border: 3px solid #ff6b9d;
	color: #ff6b9d;
	transform: scale(1.1);
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

.step-pending .step-indicator {
	background: #f8f9fa;
	color: #ccc;
}

.step-check {
	font-size: 1.1rem;
}

.step-pulse {
	position: absolute;
	inset: -4px;
	border-radius: 50%;
	border: 2px solid #ff6b9d;
	opacity: 0;
	animation: none;
}

.step-active .step-pulse {
	animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
	0%,
	100% {
		opacity: 0;
		transform: scale(1);
	}
	50% {
		opacity: 0.5;
		transform: scale(1.2);
	}
}

.step-content {
	margin-top: 0.75rem;
	text-align: center;
}

.step-title {
	font-weight: 600;
	font-size: 0.9rem;
	color: #333;
	transition: color 0.3s ease;
}

.step-active .step-title {
	color: #ff6b9d;
}

.step-pending .step-title {
	color: #999;
}

.step-subtitle {
	font-size: 0.75rem;
	color: #999;
	margin-top: 0.25rem;
}

/* Responsive */
@media (max-width: 600px) {
	.step-content {
		display: none;
	}

	.progress-track {
		right: 1.5rem;
		left: 1.5rem;
	}

	.step-indicator {
		width: 2.5rem;
		height: 2.5rem;
		font-size: 0.875rem;
	}
}
</style>

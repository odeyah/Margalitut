<template>
	<div class="multi-step-form">
		<!-- Progress Steps -->
		<ProgressSteps
			v-if="currentStep < 4"
			:steps="steps"
			:current-step="currentStep"
			:clickable="true"
			@step-click="goToStep"
		/>

		<!-- Form Steps Container -->
		<div class="form-container">
			<Transition :name="transitionName" mode="out-in">
				<StepProducts v-if="currentStep === 1" key="step1" />
				<StepDetails v-else-if="currentStep === 2" key="step2" ref="stepDetailsRef" />
				<StepReview v-else-if="currentStep === 3" key="step3" @edit-step="goToStep" />
				<StepSuccess v-else-if="currentStep === 4" key="step4" @new-order="handleNewOrder" />
			</Transition>
		</div>

		<!-- Navigation Buttons -->
		<div v-if="currentStep < 4" class="form-navigation">
			<AnimatedButton v-if="currentStep > 1" variant="outline" @click="prevStep"> חזרה </AnimatedButton>

			<div class="nav-spacer"></div>

			<AnimatedButton v-if="currentStep < 3" variant="primary" :disabled="!canProceed" @click="nextStep">
				המשך
			</AnimatedButton>

			<AnimatedButton
				v-if="currentStep === 3"
				variant="primary"
				:loading="isLoading"
				:disabled="!canProceed"
				@click="submitOrder"
			>
				{{ isLoading ? 'שולח...' : 'שליחת הזמנה' }}
			</AnimatedButton>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useOrderStore } from '../../stores/orderStore';
import { useUIStore } from '../../stores/uiStore';
import ProgressSteps from '../ui/ProgressSteps.vue';
import AnimatedButton from '../ui/AnimatedButton.vue';
import StepProducts from './StepProducts.vue';
import StepDetails from './StepDetails.vue';
import StepReview from './StepReview.vue';
import StepSuccess from './StepSuccess.vue';

const orderStore = useOrderStore();
const uiStore = useUIStore();

const stepDetailsRef = ref(null);
const transitionDirection = ref('forward');

const steps = [
	{ title: 'בחירת מוצרים', subtitle: 'מה תרצו להזמין?' },
	{ title: 'פרטי לקוח', subtitle: 'ליצירת קשר' },
	{ title: 'סיכום', subtitle: 'אישור הזמנה' },
];

const currentStep = computed(() => orderStore.currentStep);
const isLoading = computed(() => orderStore.isLoading);

const transitionName = computed(() => {
	return transitionDirection.value === 'forward' ? 'slide-left' : 'slide-right';
});

const canProceed = computed(() => {
	if (currentStep.value === 1) {
		return orderStore.cartItemCount > 0;
	}
	if (currentStep.value === 2) {
		const info = orderStore.customerInfo;
		return info.name && info.phone && info.email;
	}
	if (currentStep.value === 3) {
		return orderStore.canProceedToCheckout;
	}
	return true;
});

const goToStep = step => {
	if (step < currentStep.value) {
		transitionDirection.value = 'backward';
		orderStore.setStep(step);
	}
};

const nextStep = async () => {
	// Validate current step
	if (currentStep.value === 2 && stepDetailsRef.value?.validate) {
		const isValid = stepDetailsRef.value.validate();
		if (!isValid) {
			uiStore.showError('אנא מלאו את כל השדות הנדרשים');
			return;
		}
	}

	transitionDirection.value = 'forward';
	orderStore.nextStep();
};

const prevStep = () => {
	transitionDirection.value = 'backward';
	orderStore.prevStep();
};

const submitOrder = async () => {
	try {
		await orderStore.submitOrder();
		uiStore.showSuccess('ההזמנה נשלחה בהצלחה!');
	} catch (error) {
		uiStore.showError('שגיאה בשליחת ההזמנה. נסו שוב.');
	}
};

const handleNewOrder = () => {
	orderStore.resetOrder();
};
</script>

<style scoped>
.multi-step-form {
	max-width: 900px;
	margin: 0 auto;
}

.form-container {
	min-height: 400px;
	padding: 1.5rem 0;
}

.form-navigation {
	display: flex;
	gap: 1rem;
	padding: 1.5rem 0;
	border-top: 1px solid #f0f0f0;
}

.nav-spacer {
	flex: 1;
}

/* Slide Left (forward) */
.slide-left-enter-active,
.slide-left-leave-active {
	transition: all 0.4s ease;
}

.slide-left-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}

.slide-left-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

/* Slide Right (backward) */
.slide-right-enter-active,
.slide-right-leave-active {
	transition: all 0.4s ease;
}

.slide-right-enter-from {
	opacity: 0;
	transform: translateX(30px);
}

.slide-right-leave-to {
	opacity: 0;
	transform: translateX(-30px);
}
</style>

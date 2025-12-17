<template>
	<div class="details-step">
		<h3 class="step-title">פרטי הלקוח</h3>
		<p class="step-description">מלאו את הפרטים ליצירת קשר</p>

		<form @submit.prevent class="details-form">
			<div class="form-row">
				<AnimatedInput
					v-model="form.name"
					label="שם מלא"
					placeholder="שם פרטי ומשפחה"
					icon="👤"
					required
					:error="validation.getFieldError('name')"
					:is-valid="validation.isFieldValid('name')"
					@blur="validation.handleBlur('name', form.name)"
				/>
			</div>

			<div class="form-grid">
				<AnimatedInput
					v-model="form.phone"
					label="טלפון"
					placeholder="050-0000000"
					type="tel"
					icon="📱"
					required
					:error="validation.getFieldError('phone')"
					:is-valid="validation.isFieldValid('phone')"
					@blur="validation.handleBlur('phone', form.phone)"
				/>

				<AnimatedInput
					v-model="form.email"
					label="אימייל"
					placeholder="you@example.com"
					type="email"
					icon="✉️"
					required
					:error="validation.getFieldError('email')"
					:is-valid="validation.isFieldValid('email')"
					@blur="validation.handleBlur('email', form.email)"
				/>
			</div>

			<div class="form-row">
				<AnimatedInput v-model="form.address" label="כתובת למשלוח (אופציונלי)" placeholder="עיר, רחוב ומספר" icon="📍" />
			</div>
		</form>

		<div class="form-tips">
			<div class="tip">
				<span class="tip-icon">💡</span>
				<span class="tip-text">נחזור אליכם תוך 24 שעות עם הצעת מחיר</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue';
import { useOrderStore } from '../../stores/orderStore';
import { useFormValidation, validationSchemas } from '../../composables/useFormValidation';
import AnimatedInput from '../ui/AnimatedInput.vue';

const orderStore = useOrderStore();
const validation = useFormValidation(validationSchemas.customerInfo);

const form = reactive({
	name: '',
	phone: '',
	email: '',
	address: '',
});

// Initialize from store
onMounted(() => {
	if (orderStore.customerInfo.name) form.name = orderStore.customerInfo.name;
	if (orderStore.customerInfo.phone) form.phone = orderStore.customerInfo.phone;
	if (orderStore.customerInfo.email) form.email = orderStore.customerInfo.email;
	if (orderStore.customerInfo.address) form.address = orderStore.customerInfo.address;
});

// Sync to store
watch(
	form,
	newForm => {
		orderStore.setCustomerInfo(newForm);
	},
	{ deep: true },
);

// Expose validation for parent
defineExpose({
	validate: () => validation.validateAll(form),
});
</script>

<style scoped>
.details-step {
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

.details-form {
	max-width: 600px;
}

.form-row {
	margin-bottom: 0.5rem;
}

.form-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	gap: 1rem;
}

.form-tips {
	margin-top: 2rem;
	padding: 1rem;
	background: #f8f9fa;
	border-radius: 12px;
}

.tip {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.tip-icon {
	font-size: 1.25rem;
}

.tip-text {
	color: #666;
	font-size: 0.9rem;
}
</style>

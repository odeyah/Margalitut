<template>
	<div class="input-wrapper" :class="{ focused, 'has-value': hasValue, 'has-error': error, 'is-valid': isValid }">
		<label v-if="label" :for="inputId" class="input-label">
			{{ label }}
			<span v-if="required" class="required-mark">*</span>
		</label>

		<div class="input-container">
			<span v-if="icon" class="input-icon">{{ icon }}</span>

			<input
				v-if="type !== 'textarea'"
				:id="inputId"
				ref="inputRef"
				:type="type"
				:value="modelValue"
				:placeholder="placeholder"
				:required="required"
				:disabled="disabled"
				class="input-field"
				@input="handleInput"
				@focus="handleFocus"
				@blur="handleBlur"
			/>

			<textarea
				v-else
				:id="inputId"
				ref="inputRef"
				:value="modelValue"
				:placeholder="placeholder"
				:required="required"
				:disabled="disabled"
				:rows="rows"
				class="input-field textarea"
				@input="handleInput"
				@focus="handleFocus"
				@blur="handleBlur"
			></textarea>

			<span v-if="isValid && showValidation" class="validation-icon valid">✓</span>
			<span v-if="error && showValidation" class="validation-icon invalid">!</span>
		</div>

		<Transition name="slide-fade">
			<span v-if="error" class="error-message">{{ error }}</span>
		</Transition>

		<div class="focus-line"></div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
	modelValue: [String, Number],
	label: String,
	placeholder: String,
	type: { type: String, default: 'text' },
	icon: String,
	required: Boolean,
	disabled: Boolean,
	error: String,
	isValid: Boolean,
	showValidation: { type: Boolean, default: true },
	rows: { type: Number, default: 4 },
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

const inputRef = ref(null);
const focused = ref(false);
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

const hasValue = computed(() => {
	return props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined;
});

const handleInput = e => {
	emit('update:modelValue', e.target.value);
};

const handleFocus = e => {
	focused.value = true;
	emit('focus', e);
};

const handleBlur = e => {
	focused.value = false;
	emit('blur', e);
};
</script>

<style scoped>
.input-wrapper {
	position: relative;
	margin-bottom: 1.25rem;
}

.input-label {
	display: block;
	margin-bottom: 0.5rem;
	font-weight: 600;
	font-size: 0.9rem;
	color: #444;
	transition: color 0.3s ease;
}

.input-wrapper.focused .input-label {
	color: #ff6b9d;
}

.required-mark {
	color: #ff6b9d;
	margin-inline-start: 0.25rem;
}

.input-container {
	position: relative;
	display: flex;
	align-items: center;
}

.input-icon {
	position: absolute;
	inset-inline-start: 1rem;
	font-size: 1.1rem;
	opacity: 0.6;
	transition: opacity 0.3s ease;
}

.input-wrapper.focused .input-icon {
	opacity: 1;
}

.input-field {
	width: 100%;
	padding: 0.875rem 1rem;
	padding-inline-start: 1rem;
	border: 2px solid #ffd6e7;
	border-radius: 12px;
	background: #fff;
	font-size: 1rem;
	font-family: inherit;
	transition: all 0.3s ease;
	outline: none;
}

.input-container:has(.input-icon) .input-field {
	padding-inline-start: 2.75rem;
}

.input-field::placeholder {
	color: #aaa;
	transition: opacity 0.3s ease;
}

.input-wrapper.focused .input-field::placeholder {
	opacity: 0.5;
}

.input-field:focus {
	border-color: #ff6b9d;
	box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.1);
}

.input-wrapper.has-error .input-field {
	border-color: #e74c3c;
	box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
}

.input-wrapper.is-valid .input-field {
	border-color: #27ae60;
}

.textarea {
	resize: vertical;
	min-height: 100px;
}

.validation-icon {
	position: absolute;
	inset-inline-end: 1rem;
	width: 1.5rem;
	height: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	font-size: 0.75rem;
	font-weight: bold;
}

.validation-icon.valid {
	background: #27ae60;
	color: white;
}

.validation-icon.invalid {
	background: #e74c3c;
	color: white;
}

.error-message {
	display: block;
	margin-top: 0.5rem;
	font-size: 0.85rem;
	color: #e74c3c;
}

.focus-line {
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 2px;
	background: linear-gradient(90deg, #ff6b9d, #ff8fab);
	transition: all 0.3s ease;
	transform: translateX(-50%);
	border-radius: 1px;
}

.input-wrapper.focused .focus-line {
	width: 100%;
}

/* Slide fade transition */
.slide-fade-enter-active {
	transition: all 0.3s ease;
}
.slide-fade-leave-active {
	transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>

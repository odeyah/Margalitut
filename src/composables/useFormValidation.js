import { ref, computed, reactive } from 'vue';

/**
 * Validation rules
 */
const validators = {
	required: value => {
		if (Array.isArray(value)) return value.length > 0;
		if (typeof value === 'string') return value.trim().length > 0;
		return value !== null && value !== undefined;
	},

	email: value => {
		if (!value) return true;
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return pattern.test(value);
	},

	phone: value => {
		if (!value) return true;
		const pattern = /^[\d\-\+\s\(\)]{9,15}$/;
		return pattern.test(value.replace(/\s/g, ''));
	},

	minLength: min => value => {
		if (!value) return true;
		return value.length >= min;
	},

	maxLength: max => value => {
		if (!value) return true;
		return value.length <= max;
	},

	min: minVal => value => {
		if (value === '' || value === null) return true;
		return Number(value) >= minVal;
	},

	max: maxVal => value => {
		if (value === '' || value === null) return true;
		return Number(value) <= maxVal;
	},

	pattern: regex => value => {
		if (!value) return true;
		return regex.test(value);
	},
};

/**
 * Error messages (Hebrew)
 */
const errorMessages = {
	required: 'שדה חובה',
	email: 'כתובת אימייל לא תקינה',
	phone: 'מספר טלפון לא תקין',
	minLength: min => `מינימום ${min} תווים`,
	maxLength: max => `מקסימום ${max} תווים`,
	min: min => `ערך מינימלי: ${min}`,
	max: max => `ערך מקסימלי: ${max}`,
	pattern: 'פורמט לא תקין',
};

/**
 * Main form validation composable
 */
export function useFormValidation(schema) {
	const errors = reactive({});
	const touched = reactive({});
	const isSubmitting = ref(false);
	const submitCount = ref(0);

	// Initialize errors object
	Object.keys(schema).forEach(field => {
		errors[field] = [];
		touched[field] = false;
	});

	const validateField = (fieldName, value) => {
		const rules = schema[fieldName];
		if (!rules) return [];

		const fieldErrors = [];

		for (const rule of rules) {
			let isValid = true;
			let message = '';

			if (typeof rule === 'string') {
				// Simple rule like 'required', 'email'
				isValid = validators[rule]?.(value) ?? true;
				message = errorMessages[rule];
			} else if (typeof rule === 'object') {
				// Rule with params like { minLength: 3 }
				const [ruleName, param] = Object.entries(rule)[0];
				const validator = validators[ruleName];

				if (typeof validator === 'function') {
					const validatorFn = validator(param);
					isValid = typeof validatorFn === 'function' ? validatorFn(value) : validatorFn;
					message = typeof errorMessages[ruleName] === 'function' ? errorMessages[ruleName](param) : errorMessages[ruleName];
				}
			} else if (typeof rule === 'function') {
				// Custom validation function
				const result = rule(value);
				if (typeof result === 'string') {
					isValid = false;
					message = result;
				} else {
					isValid = result;
					message = 'ערך לא תקין';
				}
			}

			if (!isValid) {
				fieldErrors.push(message);
			}
		}

		errors[fieldName] = fieldErrors;
		return fieldErrors;
	};

	const validateAll = formData => {
		let isValid = true;

		for (const fieldName of Object.keys(schema)) {
			const value = formData[fieldName];
			touched[fieldName] = true;
			const fieldErrors = validateField(fieldName, value);
			if (fieldErrors.length > 0) {
				isValid = false;
			}
		}

		return isValid;
	};

	const handleBlur = (fieldName, value) => {
		touched[fieldName] = true;
		validateField(fieldName, value);
	};

	const handleChange = (fieldName, value) => {
		if (touched[fieldName]) {
			validateField(fieldName, value);
		}
	};

	const resetValidation = () => {
		Object.keys(schema).forEach(field => {
			errors[field] = [];
			touched[field] = false;
		});
		submitCount.value = 0;
	};

	const isValid = computed(() => {
		return Object.values(errors).every(fieldErrors => fieldErrors.length === 0);
	});

	const hasErrors = computed(() => {
		return Object.values(errors).some(fieldErrors => fieldErrors.length > 0);
	});

	const getFieldError = fieldName => {
		return touched[fieldName] && errors[fieldName]?.[0];
	};

	const isFieldValid = fieldName => {
		return touched[fieldName] && errors[fieldName]?.length === 0;
	};

	return {
		errors,
		touched,
		isSubmitting,
		submitCount,
		isValid,
		hasErrors,
		validateField,
		validateAll,
		handleBlur,
		handleChange,
		resetValidation,
		getFieldError,
		isFieldValid,
	};
}

/**
 * Pre-built validation schemas
 */
export const validationSchemas = {
	customerInfo: {
		name: ['required', { minLength: 2 }],
		phone: ['required', 'phone'],
		email: ['required', 'email'],
		address: [],
	},

	quoteRequest: {
		name: ['required', { minLength: 2 }],
		phone: ['required', 'phone'],
		email: ['required', 'email'],
		items: ['required'],
		message: [{ maxLength: 500 }],
	},
};

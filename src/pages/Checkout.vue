<template>
	<div class="checkout-page">
		<!-- Empty Cart -->
		<div v-if="isCartEmpty" class="empty-cart">
			<span class="empty-icon">🛒</span>
			<h2>העגלה ריקה</h2>
			<p>הוסיפו מוצרים מהתפריט כדי להמשיך</p>
			<router-link to="/menu" class="browse-btn">
				לתפריט
				<span class="btn-arrow">←</span>
			</router-link>
		</div>

		<!-- Checkout Content -->
		<div v-else class="checkout-content">
			<!-- Page Header -->
			<header class="page-header">
				<h1 class="page-title">השלמת הזמנה</h1>
				<p class="page-subtitle">מלאו את הפרטים ובחרו אופן תשלום</p>
			</header>

			<!-- Progress Steps -->
			<div class="progress-bar">
				<div
					v-for="(step, index) in steps"
					:key="step.id"
					class="progress-step"
					:class="{
						active: currentStep === index + 1,
						completed: currentStep > index + 1,
					}"
					@click="goToStep(index + 1)"
				>
					<span class="step-number">
						<span v-if="currentStep > index + 1">✓</span>
						<span v-else>{{ index + 1 }}</span>
					</span>
					<span class="step-title">{{ step.title }}</span>
				</div>
			</div>

			<!-- Main Content Grid -->
			<div class="checkout-grid">
				<!-- Left Side - Form Steps -->
				<div class="checkout-form">
					<!-- Step 1: Customer Info -->
					<div v-show="currentStep === 1" class="form-step">
						<h2 class="step-heading">
							<span class="heading-icon">👤</span>
							פרטי לקוח
						</h2>

						<div class="form-group">
							<label class="form-label">שם מלא *</label>
							<input type="text" v-model="customerInfo.name" class="form-input" placeholder="הכניסו את שמכם" required />
						</div>

						<div class="form-group">
							<label class="form-label">טלפון *</label>
							<input
								type="tel"
								v-model="customerInfo.phone"
								class="form-input"
								placeholder="050-0000000"
								dir="ltr"
								required
							/>
						</div>

						<div class="form-group">
							<label class="form-label">אימייל</label>
							<input type="email" v-model="customerInfo.email" class="form-input" placeholder="your@email.com" dir="ltr" />
						</div>

						<button class="next-btn" @click="nextStep" :disabled="!canProceedStep1">
							המשך לבחירת משלוח
							<span class="btn-arrow">←</span>
						</button>
					</div>

					<!-- Step 2: Delivery -->
					<div v-show="currentStep === 2" class="form-step">
						<h2 class="step-heading">
							<span class="heading-icon">🚗</span>
							אופן קבלה
						</h2>

						<!-- Delivery Options -->
						<div class="delivery-options">
							<label class="delivery-option" :class="{ selected: deliveryOption === 'pickup' }">
								<input
									type="radio"
									v-model="deliveryOption"
									value="pickup"
									@change="orderStore.setDeliveryOption('pickup')"
								/>
								<span class="option-icon">🏠</span>
								<div class="option-content">
									<span class="option-title">איסוף עצמי</span>
									<span class="option-desc">איסוף משכונת המשקפיים, בית שמש</span>
									<span class="option-price free">חינם</span>
								</div>
								<span class="option-check">✓</span>
							</label>

							<label class="delivery-option" :class="{ selected: deliveryOption === 'delivery' }">
								<input
									type="radio"
									v-model="deliveryOption"
									value="delivery"
									@change="orderStore.setDeliveryOption('delivery')"
								/>
								<span class="option-icon">🚗</span>
								<div class="option-content">
									<span class="option-title">משלוח עד הבית</span>
									<span class="option-desc">משלוח לכתובת שתבחרו</span>
									<span class="option-price">החל מ-₪20</span>
								</div>
								<span class="option-check">✓</span>
							</label>
						</div>

						<!-- Location Selection (shown only if delivery selected) -->
						<Transition name="slide-down">
							<div v-if="deliveryOption === 'delivery'" class="location-selection">
								<h3 class="section-subtitle">בחרו את הישוב/שכונה:</h3>

								<!-- Zone 1 -->
								<div class="zone-group">
									<div class="zone-header zone-1">
										<span class="zone-icon">🏠</span>
										<span class="zone-title">בית שמש - ₪20</span>
									</div>
									<div class="locations-grid">
										<label
											v-for="location in zone1Locations"
											:key="location.id"
											class="location-option"
											:class="{ selected: selectedLocation === location.id }"
										>
											<input
												type="radio"
												v-model="selectedLocation"
												:value="location.id"
												@change="orderStore.setSelectedLocation(location.id)"
											/>
											<span class="location-name">{{ location.name }}</span>
											<span class="location-check">✓</span>
										</label>
									</div>
								</div>

								<!-- Zone 2 -->
								<div class="zone-group">
									<div class="zone-header zone-2">
										<span class="zone-icon">🚗</span>
										<span class="zone-title">סביבה קרובה - ₪40</span>
									</div>
									<div class="locations-grid">
										<label
											v-for="location in zone2Locations"
											:key="location.id"
											class="location-option"
											:class="{ selected: selectedLocation === location.id }"
										>
											<input
												type="radio"
												v-model="selectedLocation"
												:value="location.id"
												@change="orderStore.setSelectedLocation(location.id)"
											/>
											<span class="location-name">{{ location.name }}</span>
											<span class="location-check">✓</span>
										</label>
									</div>
								</div>

								<!-- Zone 3 -->
								<div class="zone-group">
									<div class="zone-header zone-3">
										<span class="zone-icon">📞</span>
										<span class="zone-title">אזורים נוספים - מחיר ייקבע בטלפון</span>
									</div>
									<div class="locations-grid">
										<label
											v-for="location in zone3Locations"
											:key="location.id"
											class="location-option"
											:class="{ selected: selectedLocation === location.id }"
										>
											<input
												type="radio"
												v-model="selectedLocation"
												:value="location.id"
												@change="orderStore.setSelectedLocation(location.id)"
											/>
											<span class="location-name">{{ location.name }}</span>
											<span class="location-check">✓</span>
										</label>
									</div>
								</div>

								<!-- Address Field -->
								<div class="address-section">
									<div class="form-group">
										<label class="form-label">כתובת מלאה (רחוב ומספר) *</label>
										<input
											type="text"
											v-model="customerInfo.address"
											class="form-input"
											placeholder="לדוגמה: רחוב הזית 15, דירה 3"
										/>
									</div>
								</div>

								<!-- Call Notice for Zone 3 -->
								<Transition name="fade">
									<div v-if="deliveryRequiresCall" class="call-notice">
										<span class="notice-icon">📞</span>
										<div class="notice-content">
											<strong>שימו לב!</strong>
											<p>מחיר המשלוח לאזור זה ייקבע בשיחה טלפונית לאחר ביצוע ההזמנה.</p>
										</div>
									</div>
								</Transition>
							</div>
						</Transition>

						<!-- Date & Time -->
						<div class="datetime-section">
							<h3 class="section-subtitle">מתי תרצו לקבל?</h3>
							<div class="datetime-grid">
								<div class="form-group">
									<label class="form-label">תאריך</label>
									<input type="date" v-model="orderDate" class="form-input" :min="minDate" />
								</div>
								<div class="form-group">
									<label class="form-label">שעה מועדפת</label>
									<select v-model="orderTime" class="form-input">
										<option value="">בחרו שעה</option>
										<option value="09:00-11:00">09:00-11:00</option>
										<option value="11:00-13:00">11:00-13:00</option>
										<option value="13:00-15:00">13:00-15:00</option>
										<option value="15:00-17:00">15:00-17:00</option>
										<option value="17:00-19:00">17:00-19:00</option>
										<option value="19:00-21:00">19:00-21:00</option>
									</select>
								</div>
							</div>
						</div>

						<!-- Special Requests -->
						<div class="form-group">
							<label class="form-label">הערות להזמנה</label>
							<textarea
								v-model="specialRequests"
								class="form-input form-textarea"
								placeholder="בקשות מיוחדות, אלרגיות, הנחיות למשלוח..."
								rows="3"
							></textarea>
						</div>

						<div class="step-actions">
							<button class="back-btn" @click="prevStep">
								<span class="btn-arrow">→</span>
								חזרה
							</button>
							<button class="next-btn" @click="nextStep" :disabled="!canProceedStep2">
								המשך לתשלום
								<span class="btn-arrow">←</span>
							</button>
						</div>
					</div>

					<!-- Step 3: Payment -->
					<div v-show="currentStep === 3" class="form-step">
						<h2 class="step-heading">
							<span class="heading-icon">💳</span>
							בחירת אמצעי תשלום
						</h2>

						<div class="payment-options">
							<label
								v-for="method in paymentMethods"
								:key="method.id"
								class="payment-option"
								:class="{ selected: paymentMethod === method.id }"
							>
								<input
									type="radio"
									v-model="paymentMethod"
									:value="method.id"
									@change="orderStore.setPaymentMethod(method.id)"
								/>
								<span class="payment-icon">{{ method.icon }}</span>
								<div class="payment-content">
									<span class="payment-name">{{ method.name }}</span>
									<span class="payment-desc">{{ method.description }}</span>
								</div>
								<span class="payment-check">✓</span>
							</label>
						</div>

						<!-- Payment Instructions -->
						<Transition name="fade">
							<div v-if="selectedPaymentMethod" class="payment-instructions">
								<div class="instructions-card" :class="paymentMethod">
									<h4>
										<span>{{ selectedPaymentMethod.icon }}</span>
										הוראות תשלום - {{ selectedPaymentMethod.name }}
									</h4>
									<p>{{ selectedPaymentMethod.instructions }}</p>

									<!-- Bit / PayBox Link -->
									<template v-if="selectedPaymentMethod.link">
										<div class="payment-amount">
											סכום לתשלום: <strong>₪{{ orderTotal }}{{ deliveryRequiresCall ? ' + משלוח' : '' }}</strong>
										</div>
										<a :href="selectedPaymentMethod.link" target="_blank" class="payment-link-btn">
											<span>לחצו כאן לתשלום ב-{{ selectedPaymentMethod.name }}</span>
											<span class="btn-arrow">←</span>
										</a>
										<p class="payment-phone">
											או שלחו תשלום למספר:
											<strong dir="ltr">{{ selectedPaymentMethod.phone }}</strong>
										</p>
									</template>

									<!-- Cash -->
									<template v-if="paymentMethod === 'cash'">
										<div class="cash-note">
											<span class="note-icon">ℹ️</span>
											<span>התשלום יתבצע במזומן בעת קבלת ההזמנה</span>
										</div>
									</template>
								</div>
							</div>
						</Transition>

						<div class="step-actions">
							<button class="back-btn" @click="prevStep">
								<span class="btn-arrow">→</span>
								חזרה
							</button>
							<button class="submit-btn" @click="submitOrder" :disabled="!canCompleteOrder || isLoading">
								<span v-if="isLoading" class="loading-spinner"></span>
								<span v-else>
									שליחת הזמנה בוואטסאפ
									<span class="btn-icon">📱</span>
								</span>
							</button>
						</div>
					</div>

					<!-- Step 4: Success -->
					<div v-show="currentStep === 4" class="form-step success-step">
						<div class="success-animation">
							<div class="success-circle">
								<span class="success-check">✓</span>
							</div>
							<div class="confetti">
								<span v-for="n in 20" :key="n" class="confetti-piece" :style="getConfettiStyle(n)"></span>
							</div>
						</div>

						<h2 class="success-title">ההזמנה נשלחה בהצלחה! 🎉</h2>
						<p class="success-message">
							תודה רבה על ההזמנה!<br />
							נחזור אליכם בהקדם לאישור.
						</p>

						<div class="order-summary-card">
							<div class="summary-row">
								<span>מספר הזמנה:</span>
								<strong>{{ lastOrderId }}</strong>
							</div>
							<div class="summary-row">
								<span>סה"כ לתשלום:</span>
								<strong>₪{{ orderTotal }}{{ deliveryRequiresCall ? ' + משלוח' : '' }}</strong>
							</div>
							<div class="summary-row">
								<span>אמצעי תשלום:</span>
								<strong>{{ selectedPaymentMethod?.name }}</strong>
							</div>
						</div>

						<!-- Payment Reminder for non-cash -->
						<div v-if="paymentMethod !== 'cash'" class="payment-reminder">
							<span class="reminder-icon">💡</span>
							<div class="reminder-content">
								<strong>לא לשכוח לשלם!</strong>
								<p>לחצו על הכפתור למטה לביצוע התשלום</p>
								<a :href="selectedPaymentMethod?.link" target="_blank" class="reminder-btn">
									לתשלום ב-{{ selectedPaymentMethod?.name }}
								</a>
							</div>
						</div>

						<div class="success-actions">
							<router-link to="/menu" class="new-order-btn" @click="resetOrder"> להזמנה חדשה </router-link>
							<router-link to="/" class="home-btn"> לדף הבית </router-link>
						</div>

						<div class="contact-footer">
							<p>שאלות? צרו קשר:</p>
							<a href="tel:0528460331" class="contact-link">📱 052-846-0331</a>
						</div>
					</div>
				</div>

				<!-- Right Side - Order Summary (hidden on success) -->
				<div v-if="currentStep < 4" class="order-summary">
					<div class="summary-card">
						<h3 class="summary-title">
							<span>🛒</span>
							סיכום הזמנה
						</h3>

						<!-- Cart Items -->
						<div class="summary-items">
							<div v-for="item in cart" :key="item.id" class="summary-item">
								<span class="item-emoji">{{ item.image }}</span>
								<div class="item-info">
									<span class="item-name">{{ item.name }}</span>
									<span class="item-qty">x{{ item.quantity }}</span>
								</div>
								<span class="item-price">₪{{ item.price * item.quantity }}</span>
							</div>
						</div>

						<!-- Totals -->
						<div class="summary-totals">
							<div class="total-row">
								<span>סה"כ מוצרים</span>
								<span>₪{{ cartTotal }}</span>
							</div>
							<div class="total-row">
								<span>משלוח</span>
								<span v-if="deliveryOption === 'pickup'" class="free-delivery">חינם</span>
								<span v-else-if="deliveryPrice > 0">₪{{ deliveryPrice }}</span>
								<span v-else-if="deliveryRequiresCall" class="call-note">ייקבע בטלפון</span>
								<span v-else>-</span>
							</div>
							<div v-if="selectedLocationData && deliveryOption === 'delivery'" class="total-row location-row">
								<span>אזור</span>
								<span class="location-name-small">{{ selectedLocationData.name }}</span>
							</div>
							<div class="total-row final">
								<span>סה"כ לתשלום</span>
								<span class="final-price">
									₪{{ orderTotal }}
									<span v-if="deliveryRequiresCall" class="plus-delivery">+</span>
								</span>
							</div>
						</div>

						<!-- Edit Cart Link -->
						<button class="edit-cart-btn" @click="openCartDrawer">✏️ עריכת עגלה</button>
					</div>

					<!-- Trust Badges -->
					<div class="trust-badges">
						<div class="badge">
							<span class="badge-icon">✡️</span>
							<span>כל הרכיבים בכשרות מהדרין</span>
						</div>
						<div class="badge">
							<span class="badge-icon">🔒</span>
							<span>תשלום מאובטח</span>
						</div>
						<div class="badge">
							<span class="badge-icon">💬</span>
							<span>תמיכה בוואטסאפ</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import { useUIStore } from '../stores/uiStore';
import { useHead } from '@vueuse/head';

useHead({
	title: 'תפריט | מרגליתות - מאפייה ביתית בבית שמש',
	meta: [
		{
			name: 'description',
			content:
				'תפריט מרגליתות - עוגות שמרים, עוגות בחושות, עוגיות, לחמים, מאפים ללא גלוטן, טבעוניים ועוד. משלוחים לבית שמש.',
		},
	],
});
const orderStore = useOrderStore();
const uiStore = useUIStore();

// Local state
const currentStep = ref(1);
const lastOrderId = ref('');

// Computed from store
const cart = computed(() => orderStore.cart);
const cartTotal = computed(() => orderStore.cartTotal);
const isCartEmpty = computed(() => orderStore.isCartEmpty);
const paymentMethods = computed(() => orderStore.paymentMethods);
const deliveryPrice = computed(() => orderStore.deliveryPrice);
const deliveryRequiresCall = computed(() => orderStore.deliveryRequiresCall);
const orderTotal = computed(() => orderStore.orderTotal);
const selectedPaymentMethod = computed(() => orderStore.selectedPaymentMethod);
const selectedLocationData = computed(() => orderStore.selectedLocationData);
const isLoading = computed(() => orderStore.isLoading);
const canCompleteOrder = computed(() => orderStore.canCompleteOrder);

// Location lists
const zone1Locations = computed(() => orderStore.zone1Locations);
const zone2Locations = computed(() => orderStore.zone2Locations);
const zone3Locations = computed(() => orderStore.zone3Locations);

// Form fields (two-way sync with store)
const customerInfo = computed({
	get: () => orderStore.customerInfo,
	set: val => orderStore.setCustomerInfo(val),
});

const deliveryOption = computed({
	get: () => orderStore.deliveryOption,
	set: val => orderStore.setDeliveryOption(val),
});

const selectedLocation = computed({
	get: () => orderStore.selectedLocation,
	set: val => orderStore.setSelectedLocation(val),
});

const paymentMethod = computed({
	get: () => orderStore.paymentMethod,
	set: val => orderStore.setPaymentMethod(val),
});

const orderDate = computed({
	get: () => orderStore.orderDate,
	set: val => {
		orderStore.orderDate = val;
	},
});

const orderTime = computed({
	get: () => orderStore.orderTime,
	set: val => {
		orderStore.orderTime = val;
	},
});

const specialRequests = computed({
	get: () => orderStore.specialRequests,
	set: val => {
		orderStore.specialRequests = val;
	},
});

// Steps
const steps = [
	{ id: 1, title: 'פרטים' },
	{ id: 2, title: 'משלוח' },
	{ id: 3, title: 'תשלום' },
];

// Min date for date picker (today)
const minDate = computed(() => {
	const today = new Date();
	return today.toISOString().split('T')[0];
});

// Step validations
const canProceedStep1 = computed(() => {
	return customerInfo.value.name && customerInfo.value.phone;
});

const canProceedStep2 = computed(() => {
	if (deliveryOption.value === 'pickup') return true;
	if (deliveryOption.value === 'delivery') {
		return selectedLocation.value && customerInfo.value.address;
	}
	return false;
});

// Navigation
const nextStep = () => {
	if (currentStep.value < 4) {
		currentStep.value++;
	}
};

const prevStep = () => {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
};

const goToStep = step => {
	if (step < currentStep.value) {
		currentStep.value = step;
	}
};

// Submit order
const submitOrder = async () => {
	try {
		const order = await orderStore.submitOrder();
		lastOrderId.value = order.id;
		currentStep.value = 4;

		// Open WhatsApp
		const whatsappLink = orderStore.getWhatsAppLink();
		window.open(whatsappLink, '_blank');

		uiStore.showSuccess('ההזמנה נשלחה בהצלחה!');
	} catch (error) {
		uiStore.showError('שגיאה בשליחת ההזמנה. נסו שוב.');
	}
};

// Reset order
const resetOrder = () => {
	orderStore.resetOrder();
	currentStep.value = 1;
};

// Open cart drawer
const openCartDrawer = () => {
	uiStore.openCartDrawer();
};

// Confetti styles
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

// Watch for cart changes - redirect if empty
watch(isCartEmpty, empty => {
	if (empty && currentStep.value < 4) {
		currentStep.value = 1;
	}
});
</script>

<style scoped>
.checkout-page {
	max-width: 1100px;
	margin: 0 auto;
}

/* Empty Cart */
.empty-cart {
	text-align: center;
	padding: 4rem 2rem;
}

.empty-icon {
	font-size: 5rem;
	display: block;
	margin-bottom: 1rem;
	opacity: 0.5;
}

.empty-cart h2 {
	font-size: 1.5rem;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.empty-cart p {
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.browse-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem 2rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border-radius: 30px;
	font-weight: 700;
	text-decoration: none;
	transition: all 0.3s ease;
}

.browse-btn:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
}

/* Page Header */
.page-header {
	text-align: center;
	margin-bottom: 2rem;
}

.page-title {
	font-size: 2rem;
	font-weight: 800;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.page-subtitle {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0;
}

/* Progress Bar */
.progress-bar {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-bottom: 2.5rem;
}

.progress-step {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: var(--bg-secondary);
	border-radius: 25px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.progress-step.active {
	background: var(--pink-light);
}

.progress-step.completed {
	background: var(--pink-light);
}

.step-number {
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-primary);
	border-radius: 50%;
	font-weight: 700;
	font-size: 0.85rem;
	color: var(--text-secondary);
	transition: all 0.3s ease;
}

.progress-step.active .step-number {
	background: var(--pink-primary);
	color: white;
}

.progress-step.completed .step-number {
	background: #27ae60;
	color: white;
}

.step-title {
	font-weight: 600;
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.progress-step.active .step-title {
	color: var(--pink-primary);
}

/* Checkout Grid */
.checkout-grid {
	display: grid;
	grid-template-columns: 1fr 350px;
	gap: 2rem;
	align-items: start;
}

/* Form Steps */
.checkout-form {
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 2rem;
	box-shadow: var(--card-shadow);
}

.form-step {
	animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.step-heading {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 1.5rem 0;
}

.heading-icon {
	font-size: 1.5rem;
}

/* Form Groups */
.form-group {
	margin-bottom: 1.25rem;
}

.form-label {
	display: block;
	font-weight: 600;
	font-size: 0.9rem;
	color: var(--text-primary);
	margin-bottom: 0.5rem;
}

.form-input {
	width: 100%;
	padding: 0.875rem 1rem;
	background: var(--bg-secondary);
	border: 2px solid transparent;
	border-radius: 12px;
	font-size: 1rem;
	color: var(--text-primary);
	transition: all 0.3s ease;
}

.form-input:focus {
	outline: none;
	border-color: var(--pink-primary);
	background: var(--bg-primary);
}

.form-input::placeholder {
	color: var(--text-muted);
}

.form-textarea {
	resize: vertical;
	min-height: 100px;
}

/* Delivery Options */
.delivery-options {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.delivery-option {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1.25rem;
	background: var(--bg-secondary);
	border: 2px solid transparent;
	border-radius: 16px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.delivery-option:hover {
	background: var(--pink-light);
}

.delivery-option.selected {
	border-color: var(--pink-primary);
	background: var(--pink-light);
}

.delivery-option input {
	display: none;
}

.option-icon {
	font-size: 2rem;
}

.option-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.option-title {
	font-weight: 700;
	color: var(--text-primary);
}

.option-desc {
	font-size: 0.85rem;
	color: var(--text-secondary);
}

.option-price {
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--pink-primary);
}

.option-price.free {
	color: #27ae60;
}

.option-check {
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-primary);
	border-radius: 50%;
	color: transparent;
	font-weight: 700;
	transition: all 0.3s ease;
}

.delivery-option.selected .option-check {
	background: var(--pink-primary);
	color: white;
}

/* Location Selection */
.location-selection {
	margin-bottom: 1.5rem;
	padding: 1.5rem;
	background: var(--bg-secondary);
	border-radius: 16px;
}

.section-subtitle {
	font-size: 1rem;
	font-weight: 600;
	color: var(--text-primary);
	margin: 0 0 1rem 0;
}

/* Zone Groups */
.zone-group {
	margin-bottom: 1.5rem;
}

.zone-group:last-of-type {
	margin-bottom: 1rem;
}

.zone-header {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1rem;
	border-radius: 10px;
	margin-bottom: 0.75rem;
	font-weight: 600;
	font-size: 0.95rem;
}

.zone-header.zone-1 {
	background: linear-gradient(135deg, #d4edda, #c3e6cb);
	color: #155724;
}

.zone-header.zone-2 {
	background: linear-gradient(135deg, #fff3cd, #ffeeba);
	color: #856404;
}

.zone-header.zone-3 {
	background: linear-gradient(135deg, #f8d7da, #f5c6cb);
	color: #721c24;
}

.dark .zone-header.zone-1 {
	background: linear-gradient(135deg, #1e3a1e, #2d4a2d);
	color: #8fd19e;
}

.dark .zone-header.zone-2 {
	background: linear-gradient(135deg, #3a3520, #4a4530);
	color: #ffd700;
}

.dark .zone-header.zone-3 {
	background: linear-gradient(135deg, #3a1e1e, #4a2d2d);
	color: #f5a5a5;
}

.zone-icon {
	font-size: 1.1rem;
}

.zone-title {
	flex: 1;
}

/* Locations Grid */
.locations-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 0.5rem;
}

.location-option {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1rem;
	background: var(--bg-primary);
	border: 2px solid transparent;
	border-radius: 10px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.location-option:hover {
	border-color: var(--border-pink);
}

.location-option.selected {
	border-color: var(--pink-primary);
	background: var(--pink-light);
}

.location-option input {
	display: none;
}

.location-name {
	flex: 1;
	font-size: 0.9rem;
	font-weight: 500;
	color: var(--text-primary);
}

.location-check {
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-secondary);
	border-radius: 50%;
	color: transparent;
	font-size: 0.75rem;
	font-weight: 700;
	transition: all 0.3s ease;
}

.location-option.selected .location-check {
	background: var(--pink-primary);
	color: white;
}

/* Address Section */
.address-section {
	margin-top: 1.5rem;
	padding-top: 1.5rem;
	border-top: 1px dashed var(--border-color);
}

/* Call Notice */
.call-notice {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	padding: 1rem;
	background: linear-gradient(135deg, #fff9e6, #fffdf5);
	border: 2px solid #ffd700;
	border-radius: 12px;
	margin-top: 1rem;
}

.dark .call-notice {
	background: linear-gradient(135deg, #3d3520, #2d2815);
	border-color: #b8960b;
}

.notice-icon {
	font-size: 1.5rem;
}

.notice-content {
	flex: 1;
}

.notice-content strong {
	display: block;
	color: var(--text-primary);
	margin-bottom: 0.25rem;
}

.notice-content p {
	margin: 0;
	font-size: 0.9rem;
	color: var(--text-secondary);
}

/* DateTime Section */
.datetime-section {
	margin-bottom: 1.5rem;
	margin-top: 1.5rem;
}

.datetime-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
}

/* Payment Options */
.payment-options {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-bottom: 1.5rem;
}

.payment-option {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1.25rem;
	background: var(--bg-secondary);
	border: 2px solid transparent;
	border-radius: 16px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.payment-option:hover {
	background: var(--pink-light);
}

.payment-option.selected {
	border-color: var(--pink-primary);
	background: var(--pink-light);
}

.payment-option input {
	display: none;
}

.payment-icon {
	font-size: 2rem;
}

.payment-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.payment-name {
	font-weight: 700;
	color: var(--text-primary);
}

.payment-desc {
	font-size: 0.85rem;
	color: var(--text-secondary);
}

.payment-check {
	width: 28px;
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: var(--bg-primary);
	border-radius: 50%;
	color: transparent;
	font-weight: 700;
	transition: all 0.3s ease;
}

.payment-option.selected .payment-check {
	background: var(--pink-primary);
	color: white;
}

/* Payment Instructions */
.payment-instructions {
	margin-bottom: 1.5rem;
}

.instructions-card {
	padding: 1.5rem;
	background: var(--bg-secondary);
	border-radius: 16px;
	text-align: center;
}

.instructions-card h4 {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	font-size: 1.1rem;
	margin: 0 0 1rem 0;
}

.instructions-card p {
	color: var(--text-secondary);
	margin: 0 0 1rem 0;
}

.payment-amount {
	font-size: 1.25rem;
	margin-bottom: 1rem;
}

.payment-amount strong {
	color: var(--pink-primary);
	font-size: 1.5rem;
}

.payment-link-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem 2rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border-radius: 30px;
	font-weight: 700;
	text-decoration: none;
	transition: all 0.3s ease;
	margin-bottom: 1rem;
}

.instructions-card.bit .payment-link-btn {
	background: linear-gradient(135deg, #1da1f2, #0d8bd9);
}

.instructions-card.paybox .payment-link-btn {
	background: linear-gradient(135deg, #6c5ce7, #5541d7);
}

.payment-link-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.payment-phone {
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.payment-phone strong {
	color: var(--text-primary);
}

.cash-note {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 1rem;
	background: var(--bg-primary);
	border-radius: 12px;
	color: var(--text-secondary);
}

.note-icon {
	font-size: 1.25rem;
}

/* Step Actions */
.step-actions {
	display: flex;
	gap: 1rem;
	margin-top: 2rem;
}

.back-btn {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 1.5rem;
	background: var(--bg-secondary);
	border: none;
	border-radius: 12px;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.back-btn:hover {
	background: var(--border-color);
}

.next-btn,
.submit-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 1rem 1.5rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 12px;
	font-weight: 700;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.next-btn:hover:not(:disabled),
.submit-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.next-btn:disabled,
.submit-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn-arrow {
	transition: transform 0.3s ease;
}

.next-btn:hover .btn-arrow {
	transform: translateX(-4px);
}

.back-btn:hover .btn-arrow {
	transform: translateX(4px);
}

.btn-icon {
	font-size: 1.25rem;
}

.loading-spinner {
	width: 20px;
	height: 20px;
	border: 2px solid white;
	border-top-color: transparent;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* Success Step */
.success-step {
	text-align: center;
	padding: 2rem 0;
}

.success-animation {
	position: relative;
	width: 120px;
	height: 120px;
	margin: 0 auto 2rem;
}

.success-circle {
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #27ae60, #2ecc71);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
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

.success-check {
	color: white;
	font-size: 3rem;
	animation: checkIn 0.3s ease 0.3s both;
}

@keyframes checkIn {
	from {
		opacity: 0;
		transform: scale(0);
	}
	to {
		opacity: 1;
		transform: scale(1);
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
	animation: confettiFall 1s ease forwards;
	animation-delay: var(--delay);
	opacity: 0;
}

@keyframes confettiFall {
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
	color: var(--text-primary);
	margin: 0 0 0.75rem 0;
}

.success-message {
	font-size: 1.1rem;
	color: var(--text-secondary);
	margin: 0 0 2rem 0;
	line-height: 1.6;
}

.order-summary-card {
	display: inline-block;
	padding: 1.5rem 2rem;
	background: var(--bg-secondary);
	border-radius: 16px;
	margin-bottom: 1.5rem;
}

.order-summary-card .summary-row {
	display: flex;
	justify-content: space-between;
	gap: 2rem;
	padding: 0.5rem 0;
	font-size: 0.95rem;
}

.order-summary-card .summary-row strong {
	color: var(--text-primary);
}

/* Payment Reminder */
.payment-reminder {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	padding: 1.5rem;
	background: linear-gradient(135deg, #fff9e6, #fffdf5);
	border: 2px solid #ffd700;
	border-radius: 16px;
	margin-bottom: 2rem;
	text-align: right;
}

.dark .payment-reminder {
	background: linear-gradient(135deg, #3d3520, #2d2815);
}

.reminder-icon {
	font-size: 1.5rem;
}

.reminder-content {
	flex: 1;
}

.reminder-content strong {
	display: block;
	margin-bottom: 0.25rem;
	color: var(--text-primary);
}

.reminder-content p {
	margin: 0 0 0.75rem 0;
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.reminder-btn {
	display: inline-block;
	padding: 0.5rem 1rem;
	background: var(--pink-primary);
	color: white;
	border-radius: 20px;
	font-weight: 600;
	font-size: 0.9rem;
	text-decoration: none;
}

.success-actions {
	display: flex;
	justify-content: center;
	gap: 1rem;
	margin-bottom: 2rem;
	flex-wrap: wrap;
}

.new-order-btn,
.home-btn {
	padding: 0.875rem 1.5rem;
	border-radius: 25px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
}

.new-order-btn {
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
}

.new-order-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.home-btn {
	background: var(--bg-secondary);
	color: var(--text-secondary);
}

.home-btn:hover {
	background: var(--border-color);
}

.contact-footer {
	padding-top: 1.5rem;
	border-top: 1px solid var(--border-color);
}

.contact-footer p {
	margin: 0 0 0.5rem 0;
	color: var(--text-muted);
}

.contact-link {
	color: var(--pink-primary);
	font-weight: 600;
	font-size: 1.1rem;
}

/* Order Summary Sidebar */
.order-summary {
	position: sticky;
	top: 100px;
}

.summary-card {
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 1.5rem;
	box-shadow: var(--card-shadow);
	margin-bottom: 1rem;
}

.summary-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1.1rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 1.25rem 0;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid var(--border-color);
}

.summary-items {
	margin-bottom: 1.25rem;
}

.summary-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 0;
	border-bottom: 1px dashed var(--border-color);
}

.summary-item:last-child {
	border-bottom: none;
}

.item-emoji {
	font-size: 1.5rem;
}

.item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.item-name {
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--text-primary);
}

.item-qty {
	font-size: 0.8rem;
	color: var(--text-secondary);
}

.item-price {
	font-weight: 600;
	color: var(--text-primary);
}

.summary-totals {
	padding-top: 1rem;
	border-top: 1px solid var(--border-color);
}

.total-row {
	display: flex;
	justify-content: space-between;
	padding: 0.5rem 0;
	font-size: 0.95rem;
	color: var(--text-secondary);
}

.total-row.location-row {
	font-size: 0.85rem;
}

.location-name-small {
	color: var(--text-muted);
}

.free-delivery {
	color: #27ae60;
	font-weight: 600;
}

.total-row.final {
	padding-top: 0.75rem;
	margin-top: 0.5rem;
	border-top: 2px solid var(--border-color);
	font-weight: 700;
	font-size: 1.1rem;
	color: var(--text-primary);
}

.final-price {
	color: var(--pink-primary);
	font-size: 1.25rem;
}

.plus-delivery {
	font-size: 0.9rem;
}

.call-note {
	font-size: 0.85rem;
	color: var(--text-muted);
}

.edit-cart-btn {
	width: 100%;
	padding: 0.75rem;
	background: var(--bg-secondary);
	border: none;
	border-radius: 10px;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
	margin-top: 1rem;
}

.edit-cart-btn:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

/* Trust Badges */
.trust-badges {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.trust-badges .badge {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
	background: var(--bg-primary);
	border-radius: 12px;
	font-size: 0.85rem;
	color: var(--text-secondary);
	box-shadow: var(--card-shadow);
}

.trust-badges .badge-icon {
	font-size: 1.25rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
	transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 900px) {
	.checkout-grid {
		grid-template-columns: 1fr;
	}

	.order-summary {
		order: -1;
		position: static;
	}

	.summary-card {
		margin-bottom: 2rem;
	}

	.trust-badges {
		display: none;
	}
}

@media (max-width: 600px) {
	.progress-bar {
		gap: 0.5rem;
	}

	.progress-step {
		padding: 0.4rem 0.75rem;
	}

	.step-title {
		display: none;
	}

	.checkout-form {
		padding: 1.5rem;
	}

	.datetime-grid {
		grid-template-columns: 1fr;
	}

	.locations-grid {
		grid-template-columns: 1fr;
	}

	.step-actions {
		flex-direction: column;
	}

	.back-btn {
		order: 1;
	}
}
</style>

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { createOrder } from '../services/ordersService';
import { sendOrderEmail } from '../services/emailService';

export const useOrderStore = defineStore('order', () => {
	// ===== STATE =====
	const cart = ref([]);
	const customerInfo = ref({
		name: '',
		phone: '',
		email: '',
		address: '',
		city: '',
	});
	const orderDate = ref('');
	const orderTime = ref('');
	const specialRequests = ref('');
	const orderHistory = ref([]);
	const isLoading = ref(false);
	const currentStep = ref(1);
	const lastOrder = ref(null);

	// ===== DELIVERY OPTIONS =====
	const deliveryOption = ref('pickup');
	const selectedLocation = ref('');

	const locations = ref([
		// אזור 1 - ₪20
		{ id: 'hamishkafayim', name: 'המשקפיים', zone: 1, price: 20 },
		{ id: 'ramat-a', name: "רמת בית שמש א'", zone: 1, price: 20 },
		{ id: 'ramat-b', name: "רמת בית שמש ב'", zone: 1, price: 20 },
		{ id: 'ramat-c', name: "רמת בית שמש ג'", zone: 1, price: 20 },
		{ id: 'ramat-d', name: "רמת בית שמש ד'", zone: 1, price: 20 },
		{ id: 'ramat-e', name: "רמת בית שמש ה' (נווה שמיר)", zone: 1, price: 20 },

		// אזור 2 - ₪40
		{ id: 'merkaz', name: 'מרכז העיר בית שמש', zone: 2, price: 40 },
		{ id: 'givat-saret', name: 'גבעת שרת', zone: 2, price: 40 },
		{ id: 'tzora', name: 'צרעה', zone: 2, price: 40 },
		{ id: 'zanoach', name: 'זנוח', zone: 2, price: 40 },
		{ id: 'neve-michael', name: 'נווה מיכאל', zone: 2, price: 40 },
		{ id: 'machseya', name: 'מחסיה', zone: 2, price: 40 },
		{ id: 'yishi', name: 'ישעי', zone: 2, price: 40 },
		{ id: 'zecharya', name: 'זכריה', zone: 2, price: 40 },
		{ id: 'netiv-halamed', name: 'נתיב הל"ה', zone: 2, price: 40 },

		// אזור 3 - ייקבע בטלפון
		{ id: 'tzur-hadasa', name: 'צור הדסה', zone: 3, price: null, requiresCall: true },
		{ id: 'kfar-uriya', name: 'כפר אוריה', zone: 3, price: null, requiresCall: true },
		{ id: 'beit-meir', name: 'בית מאיר', zone: 3, price: null, requiresCall: true },
		{ id: 'jerusalem', name: 'ירושלים', zone: 3, price: null, requiresCall: true },
		{ id: 'modiin', name: 'מודיעין', zone: 3, price: null, requiresCall: true },
		{ id: 'other', name: 'אחר...', zone: 3, price: null, requiresCall: true },
	]);

	const deliveryZones = ref([
		{ id: 1, name: 'אזור 1 - בית שמש', description: 'שכונות בית שמש', price: 20, icon: '🏠' },
		{ id: 2, name: 'אזור 2 - סביבה קרובה', description: 'ישובים סמוכים', price: 40, icon: '🚗' },
		{ id: 3, name: 'אזור 3 - רחוק', description: 'מחיר ייקבע בטלפון', price: null, icon: '📞', requiresCall: true },
	]);

	// ===== PAYMENT OPTIONS =====
	const paymentMethod = ref('');

	const paymentMethods = ref([
		{
			id: 'bit',
			name: 'Bit',
			description: 'תשלום מהיר ומאובטח',
			icon: '💙',
			phone: '0524441093',
			link: 'https://www.bitpay.co.il/app/me/0524441093',
			instructions: 'לחצו על הכפתור או שלחו תשלום למספר 0524441093',
		},
		{
			id: 'paybox',
			name: 'PayBox',
			description: 'תשלום דרך פייבוקס',
			icon: '📦',
			phone: '0528460331',
			link: 'https://payboxapp.page.link/iChLPfvwFW4rGqDK6',
			instructions: 'לחצו על הכפתור או שלחו תשלום למספר 0528460331',
		},
		{
			id: 'cash',
			name: 'מזומן',
			description: 'תשלום במעמד המסירה',
			icon: '💵',
			instructions: 'התשלום יתבצע בעת קבלת ההזמנה',
		},
	]);

	// ===== GETTERS =====
	const cartTotal = computed(() => {
		return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
	});

	const cartItemCount = computed(() => {
		return cart.value.reduce((sum, item) => sum + item.quantity, 0);
	});

	const selectedLocationData = computed(() => {
		return locations.value.find(loc => loc.id === selectedLocation.value);
	});

	const deliveryPrice = computed(() => {
		if (deliveryOption.value === 'pickup') return 0;
		if (!selectedLocationData.value) return 0;
		return selectedLocationData.value.price || 0;
	});

	const deliveryRequiresCall = computed(() => {
		if (deliveryOption.value === 'pickup') return false;
		if (!selectedLocationData.value) return false;
		return selectedLocationData.value.requiresCall || false;
	});

	const selectedDeliveryZone = computed(() => {
		if (!selectedLocationData.value) return null;
		return deliveryZones.value.find(z => z.id === selectedLocationData.value.zone);
	});

	const orderTotal = computed(() => {
		return cartTotal.value + deliveryPrice.value;
	});

	const selectedPaymentMethod = computed(() => {
		return paymentMethods.value.find(m => m.id === paymentMethod.value);
	});

	const isCartEmpty = computed(() => cart.value.length === 0);

	const canProceedToCheckout = computed(() => !isCartEmpty.value);

	const canProceedToPayment = computed(() => {
		const hasCustomerInfo = customerInfo.value.name && customerInfo.value.phone;
		const hasDeliveryChoice =
			deliveryOption.value === 'pickup' || (deliveryOption.value === 'delivery' && selectedLocation.value);
		const hasAddress = deliveryOption.value === 'pickup' || customerInfo.value.address;
		return hasCustomerInfo && hasDeliveryChoice && hasAddress;
	});

	const canCompleteOrder = computed(() => {
		return canProceedToPayment.value && paymentMethod.value;
	});

	const zone1Locations = computed(() => locations.value.filter(loc => loc.zone === 1));
	const zone2Locations = computed(() => locations.value.filter(loc => loc.zone === 2));
	const zone3Locations = computed(() => locations.value.filter(loc => loc.zone === 3));

	// ===== ACTIONS =====
	function addToCart(product, quantity = 1) {
		const existing = cart.value.find(item => item.id === product.id);
		if (existing) {
			existing.quantity += quantity;
		} else {
			cart.value.push({ ...product, quantity });
		}
	}

	function removeFromCart(productId) {
		const index = cart.value.findIndex(item => item.id === productId);
		if (index > -1) {
			cart.value.splice(index, 1);
		}
	}

	function updateQuantity(productId, quantity) {
		const item = cart.value.find(item => item.id === productId);
		if (item) {
			if (quantity <= 0) {
				removeFromCart(productId);
			} else {
				item.quantity = quantity;
			}
		}
	}

	function clearCart() {
		cart.value = [];
	}

	function setCustomerInfo(info) {
		customerInfo.value = { ...customerInfo.value, ...info };
	}

	function setDeliveryOption(option) {
		deliveryOption.value = option;
		if (option === 'pickup') {
			selectedLocation.value = '';
		}
	}

	function setSelectedLocation(locationId) {
		selectedLocation.value = locationId;
		const location = locations.value.find(loc => loc.id === locationId);
		if (location) {
			customerInfo.value.city = location.name;
		}
	}

	function setPaymentMethod(method) {
		paymentMethod.value = method;
	}

	function setStep(step) {
		currentStep.value = step;
	}

	function nextStep() {
		if (currentStep.value < 5) {
			currentStep.value++;
		}
	}

	function prevStep() {
		if (currentStep.value > 1) {
			currentStep.value--;
		}
	}

	function generateOrderId() {
		const timestamp = Date.now().toString(36);
		const random = Math.random().toString(36).substr(2, 4);
		return `MRG-${timestamp}-${random}`.toUpperCase();
	}

	function generateWhatsAppMessage() {
		const orderId = lastOrder.value?.orderId || generateOrderId();
		let message = `🍓 *הזמנה חדשה ממרגליתות*\n`;
		message += `📋 מספר הזמנה: ${orderId}\n\n`;

		message += `👤 *פרטי לקוח:*\n`;
		message += `שם: ${customerInfo.value.name}\n`;
		message += `טלפון: ${customerInfo.value.phone}\n`;
		if (customerInfo.value.email) {
			message += `אימייל: ${customerInfo.value.email}\n`;
		}
		message += `\n`;

		message += `📦 *אופן קבלה:*\n`;
		if (deliveryOption.value === 'pickup') {
			message += `איסוף עצמי משכונת המשקפיים, בית שמש\n`;
		} else {
			const location = selectedLocationData.value;
			message += `משלוח ל: ${customerInfo.value.address}\n`;
			message += `ישוב: ${location?.name || customerInfo.value.city}\n`;
			if (location) {
				if (location.price) {
					message += `מחיר משלוח: ₪${location.price}\n`;
				} else {
					message += `מחיר משלוח: ייקבע בטלפון\n`;
				}
			}
		}
		message += `\n`;

		if (orderDate.value || orderTime.value) {
			message += `📅 *מועד מבוקש:*\n`;
			if (orderDate.value) message += `תאריך: ${orderDate.value}\n`;
			if (orderTime.value) message += `שעה: ${orderTime.value}\n`;
			message += `\n`;
		}

		message += `🛒 *פריטים:*\n`;
		cart.value.forEach(item => {
			message += `• ${item.name} x${item.quantity} - ₪${item.price * item.quantity}\n`;
		});
		message += `\n`;

		message += `💰 *סיכום:*\n`;
		message += `סה"כ מוצרים: ₪${cartTotal.value}\n`;
		if (deliveryOption.value === 'delivery' && deliveryPrice.value > 0) {
			message += `משלוח: ₪${deliveryPrice.value}\n`;
		}
		if (deliveryRequiresCall.value) {
			message += `משלוח: ייקבע בטלפון\n`;
		}
		message += `*סה"כ לתשלום: ₪${orderTotal.value}${deliveryRequiresCall.value ? ' + משלוח' : ''}*\n\n`;

		message += `💳 *אמצעי תשלום:* ${selectedPaymentMethod.value?.name || ''}\n`;

		if (specialRequests.value) {
			message += `\n📝 *הערות:*\n${specialRequests.value}\n`;
		}

		return { message, orderId };
	}

	function getWhatsAppLink() {
		const { message } = generateWhatsAppMessage();
		const encodedMessage = encodeURIComponent(message);
		return `https://wa.me/972528460331?text=${encodedMessage}`;
	}

	async function submitOrder() {
		isLoading.value = true;
		try {
			const orderId = generateOrderId();

			const orderData = {
				orderId,
				items: [...cart.value],
				customer: { ...customerInfo.value },
				delivery: {
					option: deliveryOption.value,
					location: selectedLocationData.value ? { ...selectedLocationData.value } : null,
					price: deliveryPrice.value,
					requiresCall: deliveryRequiresCall.value,
				},
				payment: {
					method: paymentMethod.value,
				},
				date: orderDate.value,
				time: orderTime.value,
				specialRequests: specialRequests.value,
				subtotal: cartTotal.value,
				deliveryFee: deliveryPrice.value,
				total: orderTotal.value,
			};

			// שמירה ב-Firebase
			const savedOrder = await createOrder(orderData);

			// שליחת אימייל (לא מחכים לתוצאה כדי לא לעכב)
			sendOrderEmail(orderData).catch(err => {
				console.error('Email notification failed:', err);
			});

			// שמירה מקומית
			lastOrder.value = savedOrder;
			orderHistory.value.unshift(savedOrder);

			// שמירה ב-localStorage לפי טלפון
			saveOrderToLocalStorage(savedOrder);

			currentStep.value = 5;

			return savedOrder;
		} catch (error) {
			console.error('Order submission failed:', error);
			throw error;
		} finally {
			isLoading.value = false;
		}
	}

	function saveOrderToLocalStorage(order) {
		try {
			const phone = order.customer.phone;
			const storageKey = `orders_${phone}`;
			const existingOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
			existingOrders.unshift({
				id: order.id,
				orderId: order.orderId,
				total: order.total,
				status: order.status,
				createdAt: new Date().toISOString(),
			});
			// שמור רק 20 הזמנות אחרונות
			localStorage.setItem(storageKey, JSON.stringify(existingOrders.slice(0, 20)));
		} catch (error) {
			console.error('Failed to save order to localStorage:', error);
		}
	}

	function getOrdersFromLocalStorage(phone) {
		try {
			const storageKey = `orders_${phone}`;
			return JSON.parse(localStorage.getItem(storageKey) || '[]');
		} catch (error) {
			console.error('Failed to get orders from localStorage:', error);
			return [];
		}
	}

	function resetOrder() {
		clearCart();
		customerInfo.value = { name: '', phone: '', email: '', address: '', city: '' };
		deliveryOption.value = 'pickup';
		selectedLocation.value = '';
		paymentMethod.value = '';
		orderDate.value = '';
		orderTime.value = '';
		specialRequests.value = '';
		currentStep.value = 1;
		lastOrder.value = null;
	}

	return {
		// State
		cart,
		customerInfo,
		orderDate,
		orderTime,
		specialRequests,
		orderHistory,
		isLoading,
		currentStep,
		lastOrder,
		deliveryOption,
		selectedLocation,
		locations,
		deliveryZones,
		paymentMethod,
		paymentMethods,
		// Getters
		cartTotal,
		cartItemCount,
		selectedLocationData,
		deliveryPrice,
		deliveryRequiresCall,
		selectedDeliveryZone,
		orderTotal,
		selectedPaymentMethod,
		isCartEmpty,
		canProceedToCheckout,
		canProceedToPayment,
		canCompleteOrder,
		zone1Locations,
		zone2Locations,
		zone3Locations,
		// Actions
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		setCustomerInfo,
		setDeliveryOption,
		setSelectedLocation,
		setPaymentMethod,
		setStep,
		nextStep,
		prevStep,
		generateWhatsAppMessage,
		getWhatsAppLink,
		submitOrder,
		resetOrder,
		getOrdersFromLocalStorage,
	};
});

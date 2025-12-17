import emailjs from '@emailjs/browser';

// EmailJS Configuration
const SERVICE_ID = 'service_44th385';
const TEMPLATE_ID = 'template_76chmaa';
const PUBLIC_KEY = 'bGF3UY6_byYkOW7CT';

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

export async function sendOrderEmail(order) {
	try {
		// הכן את רשימת הפריטים
		const itemsList = order.items
			.map(item => `• ${item.name} x${item.quantity} - ₪${item.price * item.quantity}`)
			.join('\n');

		// הכן מידע על משלוח
		let deliveryInfo = '';
		if (order.delivery.option === 'pickup') {
			deliveryInfo = '🏠 איסוף עצמי משכונת המשקפיים, בית שמש';
		} else {
			deliveryInfo = `🚗 משלוח ל: ${order.customer.address}\n`;
			deliveryInfo += `ישוב: ${order.delivery.location?.name || ''}\n`;
			if (order.delivery.price) {
				deliveryInfo += `מחיר משלוח: ₪${order.delivery.price}`;
			} else if (order.delivery.requiresCall) {
				deliveryInfo += `מחיר משלוח: ייקבע בטלפון`;
			}
		}

		// הכן תאריך ושעה
		let dateTime = '';
		if (order.date) dateTime += `תאריך: ${order.date}\n`;
		if (order.time) dateTime += `שעה: ${order.time}`;
		if (!dateTime) dateTime = 'לא צוין';

		// הכן אמצעי תשלום
		const paymentLabels = {
			bit: '💙 Bit',
			paybox: '📦 PayBox',
			cash: '💵 מזומן',
		};

		// הכן משלוח
		let deliveryFee = 'חינם';
		if (order.delivery.option === 'delivery') {
			if (order.deliveryFee > 0) {
				deliveryFee = `₪${order.deliveryFee}`;
			} else if (order.delivery.requiresCall) {
				deliveryFee = 'ייקבע בטלפון';
			}
		}

		// שלח את האימייל
		const templateParams = {
			order_id: order.orderId,
			customer_name: order.customer.name,
			customer_phone: order.customer.phone,
			customer_email: order.customer.email || 'לא צוין',
			delivery_info: deliveryInfo,
			date_time: dateTime,
			items_list: itemsList,
			subtotal: order.subtotal,
			delivery_fee: deliveryFee,
			total: order.total,
			payment_method: paymentLabels[order.payment.method] || order.payment.method,
			special_requests: order.specialRequests || 'אין',
		};

		const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
		console.log('Email sent successfully:', response);
		return true;
	} catch (error) {
		console.error('Failed to send email:', error);
		return false;
	}
}

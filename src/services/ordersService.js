import {
	collection,
	addDoc,
	getDocs,
	getDoc,
	doc,
	updateDoc,
	query,
	where,
	orderBy,
	serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const ORDERS_COLLECTION = 'orders';

// יצירת הזמנה חדשה
export async function createOrder(orderData) {
	try {
		const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
			...orderData,
			status: 'pending', // pending, confirmed, preparing, ready, delivered, cancelled
			paymentStatus: orderData.paymentMethod === 'cash' ? 'pending' : 'awaiting',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});
		return { id: docRef.id, ...orderData };
	} catch (error) {
		console.error('Error creating order:', error);
		throw error;
	}
}

// קבלת הזמנה לפי ID
export async function getOrderById(orderId) {
	try {
		const docRef = doc(db, ORDERS_COLLECTION, orderId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return { id: docSnap.id, ...docSnap.data() };
		}
		return null;
	} catch (error) {
		console.error('Error getting order:', error);
		throw error;
	}
}

// קבלת הזמנות לפי טלפון (ללקוח)
export async function getOrdersByPhone(phone) {
	try {
		const q = query(collection(db, ORDERS_COLLECTION), where('customer.phone', '==', phone), orderBy('createdAt', 'desc'));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}));
	} catch (error) {
		console.error('Error getting orders by phone:', error);
		throw error;
	}
}

// קבלת כל ההזמנות (לאדמין)
export async function getAllOrders() {
	try {
		const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}));
	} catch (error) {
		console.error('Error getting all orders:', error);
		throw error;
	}
}

// קבלת הזמנות לפי סטטוס (לאדמין)
export async function getOrdersByStatus(status) {
	try {
		const q = query(collection(db, ORDERS_COLLECTION), where('status', '==', status), orderBy('createdAt', 'desc'));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}));
	} catch (error) {
		console.error('Error getting orders by status:', error);
		throw error;
	}
}

// עדכון סטטוס הזמנה
export async function updateOrderStatus(orderId, status) {
	try {
		const docRef = doc(db, ORDERS_COLLECTION, orderId);
		await updateDoc(docRef, {
			status,
			updatedAt: serverTimestamp(),
		});
		return true;
	} catch (error) {
		console.error('Error updating order status:', error);
		throw error;
	}
}

// עדכון סטטוס תשלום
export async function updatePaymentStatus(orderId, paymentStatus) {
	try {
		const docRef = doc(db, ORDERS_COLLECTION, orderId);
		await updateDoc(docRef, {
			paymentStatus,
			updatedAt: serverTimestamp(),
		});
		return true;
	} catch (error) {
		console.error('Error updating payment status:', error);
		throw error;
	}
}

// קבלת הזמנות להיום (לאדמין)
export async function getTodayOrders() {
	try {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const q = query(collection(db, ORDERS_COLLECTION), where('createdAt', '>=', today), orderBy('createdAt', 'desc'));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}));
	} catch (error) {
		console.error('Error getting today orders:', error);
		throw error;
	}
}

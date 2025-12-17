import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyDKgaceD3l-uFdbiz4Ose_uhCFW1a4a_l0',
	authDomain: 'margalitut.firebaseapp.com',
	projectId: 'margalitut',
	storageBucket: 'margalitut.firebasestorage.app',
	messagingSenderId: '77219137608',
	appId: '1:77219137608:web:2017ab65c2dc5c77a2b07d',
	measurementId: 'G-PLGDHJ0T5S',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

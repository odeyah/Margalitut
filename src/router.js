import { createRouter, createWebHistory } from 'vue-router';

import Home from './pages/Home.vue';
import Menu from './pages/Menu.vue';
import MenuCategory from './pages/MenuCategory.vue';
import Gallery from './pages/Gallery.vue';
import About from './pages/About.vue';
import Quote from './pages/Quote.vue';
import Checkout from './pages/Checkout.vue';
import Admin from './pages/Admin.vue';
import MyOrders from './pages/MyOrders.vue';
import BakingWorkshops from './pages/BakingWorkshops.vue'; // הוסף

const routes = [
	{ path: '/', name: 'home', component: Home },
	{ path: '/menu', name: 'menu', component: Menu },
	{ path: '/menu/:categoryId', name: 'menu-category', component: MenuCategory, props: true },
	{ path: '/gallery', name: 'gallery', component: Gallery },
	{ path: '/about', name: 'about', component: About },
	{ path: '/quote', name: 'quote', component: Quote },
	{ path: '/checkout', name: 'checkout', component: Checkout },
	{ path: '/admin', name: 'admin', component: Admin },
	{ path: '/my-orders', name: 'my-orders', component: MyOrders },
	{ path: '/workshops', name: 'workshops', component: BakingWorkshops }, // הוסף
	{ path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;
		return { top: 0, behavior: 'smooth' };
	},
});

export default router;

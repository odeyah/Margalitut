import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// State Management
const pinia = createPinia();
app.use(pinia);

// Router
app.use(router);

app.mount('#app');

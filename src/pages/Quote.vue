<template>
	<section class="quote-page">
		<div class="page-header">
			<h1 class="page-title">בקשת הצעת מחיר</h1>
			<p class="page-subtitle">בחרו מוצרים, מלאו פרטים, ונחזור אליכם עם הצעה</p>
		</div>

		<MultiStepForm />

		<NotificationToast />
	</section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useOrderStore } from '../stores/orderStore';
import MultiStepForm from '../components/form/MultiStepForm.vue';
import NotificationToast from '../components/ui/NotificationToast.vue';
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

// Reset form when entering the page
onMounted(() => {
	// Uncomment if you want to reset on each visit:
	// orderStore.resetOrder()
});
</script>

<style scoped>
.quote-page {
	max-width: 1000px;
	margin: 0 auto;
	padding: 1rem;
}

.page-header {
	text-align: center;
	margin-bottom: 2rem;
}

.page-title {
	font-size: 2rem;
	font-weight: 700;
	color: #333;
	margin: 0 0 0.5rem 0;
	background: linear-gradient(135deg, #ff6b9d, #ff8fab);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.page-subtitle {
	color: #666;
	font-size: 1.1rem;
	margin: 0;
}
</style>

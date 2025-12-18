<template>
	<div class="menu-page">
		<!-- Page Header -->
		<header class="page-header">
			<h1 class="page-title">התפריט שלנו</h1>
			<p class="page-subtitle">כל המאפים והמטעמים שלנו, מחולקים לקטגוריות</p>
		</header>

		<!-- Categories Grid -->
		<section class="categories-section">
			<h2 class="section-title">קטגוריות</h2>
			<div class="categories-grid">
				<CategoryCard
					v-for="(category, index) in categories"
					:key="category.id"
					:category="category"
					:style="{ animationDelay: `${index * 80}ms` }"
					class="category-item"
				/>
			</div>
		</section>

		<!-- Divider -->
		<div class="divider">
			<span class="divider-icon">🍰</span>
		</div>

		<!-- Category Previews -->
		<section class="previews-section">
			<h2 class="section-title">טעימות מהתפריט</h2>

			<CategorySection v-for="category in categories" :key="category.id" :category="category" :limit="5" />
		</section>

		<!-- Call to Action -->
		<section class="cta-section">
			<div class="cta-content">
				<span class="cta-icon">🎂</span>
				<h3 class="cta-title">לא מצאתם מה שחיפשתם?</h3>
				<p class="cta-text">אנחנו מכינים גם הזמנות מיוחדות לפי בקשה</p>
				<router-link to="/quote" class="cta-btn"> בקשת הצעת מחיר </router-link>
			</div>
		</section>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useMenuStore } from '../stores/menuStore';
import { CategoryCard, CategorySection } from '../components/menu';
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

const menuStore = useMenuStore();
const categories = computed(() => menuStore.categories);
</script>

<style scoped>
.menu-page {
	max-width: 1200px;
	margin: 0 auto;
}

/* Page Header */
.page-header {
	text-align: center;
	margin-bottom: 2.5rem;
}

.page-title {
	font-size: 2.25rem;
	font-weight: 800;
	margin: 0 0 0.5rem 0;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.page-subtitle {
	font-size: 1.1rem;
	color: var(--text-secondary);
	margin: 0;
}

/* Section Titles */
.section-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 1.5rem 0;
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.section-title::after {
	content: '';
	flex: 1;
	height: 2px;
	background: linear-gradient(90deg, var(--border-pink), transparent);
	border-radius: 1px;
}

/* Categories Section */
.categories-section {
	margin-bottom: 3rem;
}

/* Categories Grid */
.categories-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 1.5rem;
	margin-bottom: 4rem;
}

/* Tablet */
@media (max-width: 1024px) {
	.categories-grid {
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
	}
}

/* Mobile */
@media (max-width: 600px) {
	.categories-grid {
		grid-template-columns: 1fr;
		gap: 1rem;
	}
}

.category-item {
	opacity: 0;
	animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Divider */
.divider {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 3rem 0;
	position: relative;
}

.divider::before,
.divider::after {
	content: '';
	flex: 1;
	height: 2px;
	background: linear-gradient(90deg, transparent, var(--border-pink), transparent);
}

.divider-icon {
	font-size: 2rem;
	padding: 0 1.5rem;
	animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-8px);
	}
}

/* Previews Section */
.previews-section {
	margin-bottom: 3rem;
}

/* CTA Section */
.cta-section {
	margin: 4rem 0 2rem;
}

.cta-content {
	text-align: center;
	padding: 3rem 2rem;
	background: linear-gradient(135deg, var(--pink-light), var(--bg-primary));
	border-radius: 24px;
	border: 2px solid var(--border-pink);
}

.cta-icon {
	font-size: 3.5rem;
	display: block;
	margin-bottom: 1rem;
}

.cta-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.cta-text {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.cta-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.875rem 2rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border-radius: 30px;
	font-weight: 700;
	font-size: 1rem;
	text-decoration: none;
	transition: all 0.3s ease;
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
}

.cta-btn:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 30px rgba(255, 107, 157, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
	.page-title {
		font-size: 1.75rem;
	}

	.page-subtitle {
		font-size: 1rem;
	}

	.categories-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.section-title {
		font-size: 1.25rem;
	}

	.cta-content {
		padding: 2rem 1.5rem;
	}

	.cta-icon {
		font-size: 2.5rem;
	}

	.cta-title {
		font-size: 1.25rem;
	}
}

@media (max-width: 480px) {
	.categories-grid {
		grid-template-columns: 1fr;
	}
}
</style>

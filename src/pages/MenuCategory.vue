<template>
	<div class="category-page" v-if="category">
		<!-- Breadcrumb -->
		<nav class="breadcrumb">
			<router-link to="/menu" class="breadcrumb-link">תפריט</router-link>
			<span class="breadcrumb-separator">/</span>
			<span class="breadcrumb-current">{{ category.name }}</span>
		</nav>

		<!-- Page Header -->
		<header class="page-header" :style="{ '--category-color': category.color }">
			<div class="header-background"></div>
			<div class="header-content">
				<span class="header-icon">{{ category.icon }}</span>
				<div class="header-text">
					<h1 class="page-title">{{ category.name }}</h1>
					<p class="page-subtitle">{{ category.description }}</p>
					<span class="products-count">{{ products.length }} מוצרים</span>
				</div>
			</div>
		</header>

		<!-- Subcategories (for dairy meals) -->
		<div v-if="category.hasSubcategories" class="subcategories-section">
			<div class="subcategories-tabs">
				<button class="subcategory-tab" :class="{ active: activeSubcategory === 'all' }" @click="activeSubcategory = 'all'">
					הכל
				</button>
				<button
					v-for="sub in subcategories"
					:key="sub.id"
					class="subcategory-tab"
					:class="{ active: activeSubcategory === sub.id }"
					@click="activeSubcategory = sub.id"
				>
					<span class="tab-icon">{{ sub.icon }}</span>
					{{ sub.name }}
				</button>
			</div>
		</div>

		<!-- Filters & Sort -->
		<div class="filters-bar">
			<div class="filter-group">
				<button class="filter-btn" :class="{ active: showPopularOnly }" @click="showPopularOnly = !showPopularOnly">
					⭐ פופולריים
				</button>
			</div>
			<div class="sort-group">
				<label class="sort-label">מיון:</label>
				<select v-model="sortBy" class="sort-select">
					<option value="default">ברירת מחדל</option>
					<option value="price-low">מחיר: נמוך לגבוה</option>
					<option value="price-high">מחיר: גבוה לנמוך</option>
					<option value="name">לפי שם</option>
				</select>
			</div>
		</div>

		<!-- Products Grid -->
		<div class="products-section">
			<TransitionGroup name="products" tag="div" class="products-grid">
				<ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
			</TransitionGroup>

			<!-- Empty State -->
			<div v-if="filteredProducts.length === 0" class="empty-state">
				<span class="empty-icon">🔍</span>
				<h3>לא נמצאו מוצרים</h3>
				<p>נסו לשנות את הסינון</p>
				<button class="reset-btn" @click="resetFilters">איפוס סינון</button>
			</div>
		</div>

		<!-- Back to Menu -->
		<div class="back-section">
			<router-link to="/menu" class="back-link">
				<span class="back-arrow">→</span>
				חזרה לתפריט
			</router-link>
		</div>
	</div>

	<!-- Category Not Found -->
	<div v-else class="not-found">
		<span class="not-found-icon">😕</span>
		<h2>הקטגוריה לא נמצאה</h2>
		<router-link to="/menu" class="back-btn">חזרה לתפריט</router-link>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '../stores/menuStore';
import { ProductCard } from '../components/menu';

const route = useRoute();
const menuStore = useMenuStore();

// State
const activeSubcategory = ref('all');
const showPopularOnly = ref(false);
const sortBy = ref('default');

// Get category from route
const category = computed(() => {
	return menuStore.getCategoryById(route.params.categoryId);
});

// Get subcategories (for dairy meals)
const subcategories = computed(() => {
	return menuStore.dairySubcategories;
});

// Get products for this category
const products = computed(() => {
	return menuStore.getProductsByCategory(route.params.categoryId);
});

// Filtered and sorted products
const filteredProducts = computed(() => {
	let result = [...products.value];

	// Filter by subcategory
	if (category.value?.hasSubcategories && activeSubcategory.value !== 'all') {
		result = result.filter(p => p.subcategory === activeSubcategory.value);
	}

	// Filter popular only
	if (showPopularOnly.value) {
		result = result.filter(p => p.popular);
	}

	// Sort
	switch (sortBy.value) {
		case 'price-low':
			result.sort((a, b) => a.price - b.price);
			break;
		case 'price-high':
			result.sort((a, b) => b.price - a.price);
			break;
		case 'name':
			result.sort((a, b) => a.name.localeCompare(b.name, 'he'));
			break;
		default:
			// Popular first
			result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
	}

	return result;
});

// Reset filters
const resetFilters = () => {
	activeSubcategory.value = 'all';
	showPopularOnly.value = false;
	sortBy.value = 'default';
};

// Reset filters when category changes
watch(
	() => route.params.categoryId,
	() => {
		resetFilters();
	},
);
</script>

<style scoped>
.category-page {
	max-width: 1200px;
	margin: 0 auto;
}

/* Breadcrumb */
.breadcrumb {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
	font-size: 0.9rem;
}

.breadcrumb-link {
	color: var(--pink-primary);
	text-decoration: none;
	transition: opacity 0.3s ease;
}

.breadcrumb-link:hover {
	opacity: 0.7;
}

.breadcrumb-separator {
	color: var(--text-muted);
}

.breadcrumb-current {
	color: var(--text-secondary);
}

/* Page Header */
.page-header {
	position: relative;
	padding: 2.5rem 2rem;
	border-radius: 24px;
	margin-bottom: 2rem;
	overflow: hidden;
}

.header-background {
	position: absolute;
	inset: 0;
	background: linear-gradient(135deg, var(--category-color) 0%, transparent 70%);
	opacity: 0.15;
}

.header-content {
	position: relative;
	display: flex;
	align-items: center;
	gap: 1.5rem;
	z-index: 1;
}

.header-icon {
	font-size: 4rem;
	flex-shrink: 0;
}

.header-text {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.page-title {
	font-size: 2rem;
	font-weight: 800;
	color: var(--text-primary);
	margin: 0;
}

.page-subtitle {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0;
}

.products-count {
	display: inline-block;
	padding: 0.35rem 0.75rem;
	background: var(--bg-primary);
	border-radius: 20px;
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--text-secondary);
	width: fit-content;
}

/* Subcategories */
.subcategories-section {
	margin-bottom: 1.5rem;
}

.subcategories-tabs {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.subcategory-tab {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.6rem 1.25rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	border-radius: 25px;
	font-weight: 600;
	font-size: 0.9rem;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.subcategory-tab:hover {
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

.subcategory-tab.active {
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	border-color: transparent;
	color: white;
}

.tab-icon {
	font-size: 1.1rem;
}

/* Filters Bar */
.filters-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
}

.filter-group {
	display: flex;
	gap: 0.5rem;
}

.filter-btn {
	padding: 0.5rem 1rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	border-radius: 20px;
	font-weight: 600;
	font-size: 0.85rem;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.filter-btn:hover {
	border-color: var(--pink-primary);
}

.filter-btn.active {
	background: var(--pink-light);
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

.sort-group {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.sort-label {
	font-size: 0.9rem;
	color: var(--text-secondary);
}

.sort-select {
	padding: 0.5rem 1rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-color);
	border-radius: 12px;
	font-size: 0.9rem;
	color: var(--text-primary);
	cursor: pointer;
	transition: border-color 0.3s ease;
}

.sort-select:focus {
	outline: none;
	border-color: var(--pink-primary);
}

/* Products Grid */
.products-section {
	min-height: 300px;
}

.products-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 1.25rem;
}

/* Products Transition */
.products-enter-active,
.products-leave-active {
	transition: all 0.4s ease;
}

.products-enter-from {
	opacity: 0;
	transform: scale(0.9);
}

.products-leave-to {
	opacity: 0;
	transform: scale(0.9);
}

.products-move {
	transition: transform 0.4s ease;
}

/* Empty State */
.empty-state {
	text-align: center;
	padding: 4rem 2rem;
}

.empty-icon {
	font-size: 4rem;
	display: block;
	margin-bottom: 1rem;
}

.empty-state h3 {
	font-size: 1.25rem;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.empty-state p {
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.reset-btn {
	padding: 0.75rem 1.5rem;
	background: var(--pink-primary);
	color: white;
	border: none;
	border-radius: 25px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.reset-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

/* Back Section */
.back-section {
	margin-top: 3rem;
	text-align: center;
}

.back-link {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	background: var(--bg-secondary);
	border-radius: 25px;
	color: var(--text-secondary);
	text-decoration: none;
	font-weight: 600;
	transition: all 0.3s ease;
}

.back-link:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

.back-arrow {
	transition: transform 0.3s ease;
}

.back-link:hover .back-arrow {
	transform: translateX(4px);
}

/* Not Found */
.not-found {
	text-align: center;
	padding: 4rem 2rem;
}

.not-found-icon {
	font-size: 5rem;
	display: block;
	margin-bottom: 1rem;
}

.not-found h2 {
	color: var(--text-primary);
	margin: 0 0 1.5rem 0;
}

.back-btn {
	display: inline-block;
	padding: 0.75rem 2rem;
	background: var(--pink-primary);
	color: white;
	border-radius: 25px;
	text-decoration: none;
	font-weight: 600;
	transition: all 0.3s ease;
}

.back-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
	.page-header {
		padding: 1.5rem;
	}

	.header-content {
		flex-direction: column;
		text-align: center;
	}

	.header-icon {
		font-size: 3rem;
	}

	.page-title {
		font-size: 1.5rem;
	}

	.products-count {
		margin: 0 auto;
	}

	.filters-bar {
		flex-direction: column;
		align-items: stretch;
	}

	.sort-group {
		justify-content: space-between;
	}

	.products-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}
}

@media (max-width: 480px) {
	.products-grid {
		grid-template-columns: 1fr;
	}

	.subcategories-tabs {
		justify-content: center;
	}
}
</style>

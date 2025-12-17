<template>
	<section class="category-section">
		<!-- Section Header -->
		<div class="section-header">
			<div class="header-content">
				<span class="section-icon">{{ category.icon }}</span>
				<div class="header-text">
					<h2 class="section-title">{{ category.name }}</h2>
					<p class="section-description">{{ category.description }}</p>
				</div>
			</div>
			<router-link :to="`/menu/${category.id}`" class="view-all-btn">
				צפה בהכל
				<span class="btn-arrow">←</span>
			</router-link>
		</div>

		<!-- Products Grid -->
		<div class="products-grid">
			<ProductCard
				v-for="(product, index) in displayProducts"
				:key="product.id"
				:product="product"
				:style="{ animationDelay: `${index * 100}ms` }"
				class="product-item"
			/>
		</div>

		<!-- View More (Mobile) -->
		<router-link :to="`/menu/${category.id}`" class="view-more-mobile">
			עוד ב{{ category.name }}
			<span class="arrow">←</span>
		</router-link>
	</section>
</template>

<script setup>
import { computed } from 'vue';
import { useMenuStore } from '../../stores/menuStore';
import ProductCard from './ProductCard.vue';

const props = defineProps({
	category: {
		type: Object,
		required: true,
	},
	limit: {
		type: Number,
		default: 4,
	},
});

const menuStore = useMenuStore();

const displayProducts = computed(() => {
	return menuStore.getPopularByCategory(props.category.id, props.limit);
});
</script>

<style scoped>
.category-section {
	margin-bottom: 3rem;
}

/* Section Header */
.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1.5rem;
	flex-wrap: wrap;
}

.header-content {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.section-icon {
	font-size: 2.5rem;
	flex-shrink: 0;
}

.header-text {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.section-title {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0;
}

.section-description {
	font-size: 0.9rem;
	color: var(--text-secondary);
	margin: 0;
}

/* View All Button */
.view-all-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.6rem 1.25rem;
	background: var(--pink-light);
	color: var(--pink-primary);
	border-radius: 25px;
	font-weight: 600;
	font-size: 0.9rem;
	text-decoration: none;
	transition: all 0.3s ease;
}

.view-all-btn:hover {
	background: var(--pink-primary);
	color: white;
}

.view-all-btn:hover .btn-arrow {
	transform: translateX(-4px);
}

.btn-arrow {
	transition: transform 0.3s ease;
}

/* Products Grid */
.products-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1.25rem;
}

.product-item {
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

/* View More Mobile */
.view-more-mobile {
	display: none;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	margin-top: 1.25rem;
	padding: 0.75rem;
	background: var(--bg-secondary);
	border-radius: 12px;
	color: var(--pink-primary);
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
}

.view-more-mobile:hover {
	background: var(--pink-light);
}

.view-more-mobile .arrow {
	transition: transform 0.3s ease;
}

.view-more-mobile:hover .arrow {
	transform: translateX(-4px);
}

/* Responsive */
@media (max-width: 768px) {
	.section-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.view-all-btn {
		display: none;
	}

	.view-more-mobile {
		display: flex;
	}

	.products-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.section-icon {
		font-size: 2rem;
	}

	.section-title {
		font-size: 1.25rem;
	}
}

@media (max-width: 480px) {
	.products-grid {
		grid-template-columns: 1fr;
	}
}
</style>

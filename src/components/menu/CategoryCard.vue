<template>
	<router-link :to="category.id === 'baking-workshops' ? '/workshops' : `/menu/${category.id}`" class="category-card">
		<div class="card-background"></div>
		<div class="card-content">
			<span class="card-icon">{{ category.icon }}</span>
			<h3 class="card-title">{{ category.name }}</h3>
			<p class="card-description">{{ category.description }}</p>
			<div class="card-footer">
				<span class="products-count">{{ productsCount }} מוצרים</span>
				<span class="card-arrow">←</span>
			</div>
		</div>
		<div class="card-shine"></div>
	</router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useMenuStore } from '../../stores/menuStore';

const props = defineProps({
	category: {
		type: Object,
		required: true,
	},
});

const menuStore = useMenuStore();

const productsCount = computed(() => {
	return menuStore.getProductsByCategory(props.category.id).length;
});
</script>

<style scoped>
.category-card {
	position: relative;
	display: block;
	padding: 1.75rem;
	border-radius: 20px;
	background: var(--bg-primary);
	overflow: hidden;
	text-decoration: none;
	color: inherit;
	transition: all 0.4s ease;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.category-card:hover {
	transform: translateY(-6px);
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* Background gradient on hover */
.card-background {
	position: absolute;
	inset: 0;
	background: linear-gradient(135deg, var(--category-color) 0%, transparent 60%);
	opacity: 0.1;
	transition: opacity 0.4s ease;
}

.category-card:hover .card-background {
	opacity: 0.2;
}

/* Content */
.card-content {
	position: relative;
	z-index: 1;
}

.card-icon {
	display: inline-block;
	font-size: 3rem;
	margin-bottom: 1rem;
	transition: transform 0.4s ease;
}

.category-card:hover .card-icon {
	transform: scale(1.15) rotate(-5deg);
}

.card-title {
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.card-description {
	font-size: 0.9rem;
	color: var(--text-secondary);
	margin: 0 0 1rem 0;
	line-height: 1.5;
}

.card-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.products-count {
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--category-color);
	background: linear-gradient(135deg, var(--category-color), var(--category-color));
	-webkit-background-clip: text;
	background-clip: text;
}

.card-arrow {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	background: var(--pink-light);
	border-radius: 50%;
	color: var(--pink-primary);
	font-size: 1rem;
	transition: all 0.3s ease;
}

.category-card:hover .card-arrow {
	background: var(--pink-primary);
	color: white;
	transform: translateX(-4px);
}

/* Shine effect */
.card-shine {
	position: absolute;
	top: 0;
	left: -100%;
	width: 50%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
	transition: left 0.6s ease;
	z-index: 2;
	pointer-events: none;
}

.category-card:hover .card-shine {
	left: 150%;
}

/* Dark mode adjustments */
.dark .category-card {
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.dark .category-card:hover {
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}
</style>

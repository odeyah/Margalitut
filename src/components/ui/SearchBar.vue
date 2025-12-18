<template>
	<div class="search-wrapper" :class="{ expanded: isExpanded }">
		<div class="search-container">
			<button class="search-toggle" @click="toggleSearch" v-if="!isExpanded">
				<span class="search-icon">🔍</span>
			</button>

			<div class="search-box" v-show="isExpanded">
				<span class="search-icon">🔍</span>
				<input
					ref="searchInput"
					type="text"
					v-model="searchQuery"
					placeholder="חיפוש מוצרים..."
					class="search-input"
					@input="onSearch"
					@keyup.escape="closeSearch"
					@keyup.enter="goToFirstResult"
				/>
				<button v-if="searchQuery" class="clear-btn" @click="clearSearch">✕</button>
				<button class="close-btn" @click="closeSearch">✕</button>
			</div>
		</div>

		<!-- Search Results Dropdown -->
		<Transition name="dropdown">
			<div v-if="isExpanded && searchQuery && filteredProducts.length > 0" class="search-results">
				<div class="results-header">
					<span>{{ filteredProducts.length }} תוצאות</span>
				</div>
				<div class="results-list">
					<router-link
						v-for="product in filteredProducts.slice(0, 8)"
						:key="product.id"
						:to="`/menu/${product.categoryId}?highlight=${product.id}`"
						class="result-item"
						@click="closeSearch"
					>
						<span class="result-image">{{ product.image }}</span>
						<div class="result-info">
							<span class="result-name">{{ product.name }}</span>
							<span class="result-category">{{ getCategoryName(product.categoryId) }}</span>
						</div>
						<span class="result-price">₪{{ product.price }}</span>
					</router-link>
				</div>
				<router-link v-if="filteredProducts.length > 8" to="/menu" class="view-all-btn" @click="closeSearch">
					צפייה בכל {{ filteredProducts.length }} התוצאות
				</router-link>
			</div>
		</Transition>

		<!-- No Results -->
		<Transition name="dropdown">
			<div v-if="isExpanded && searchQuery && filteredProducts.length === 0" class="search-results no-results">
				<span class="no-results-icon">🔍</span>
				<p>לא נמצאו מוצרים עבור "{{ searchQuery }}"</p>
				<router-link to="/menu" class="browse-link" @click="closeSearch"> לצפייה בתפריט המלא </router-link>
			</div>
		</Transition>

		<!-- Overlay -->
		<Transition name="fade">
			<div v-if="isExpanded" class="search-overlay" @click="closeSearch"></div>
		</Transition>
	</div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useMenuStore } from '../../stores/menuStore';

const menuStore = useMenuStore();

const isExpanded = ref(false);
const searchQuery = ref('');
const searchInput = ref(null);

const filteredProducts = computed(() => {
	if (!searchQuery.value.trim()) return [];
	return menuStore.searchProducts(searchQuery.value);
});

function getCategoryName(categoryId) {
	const category = menuStore.getCategoryById(categoryId);
	return category?.name || '';
}

async function toggleSearch() {
	isExpanded.value = true;
	await nextTick();
	searchInput.value?.focus();
}

function closeSearch() {
	isExpanded.value = false;
	searchQuery.value = '';
}

function clearSearch() {
	searchQuery.value = '';
	searchInput.value?.focus();
}

function onSearch() {
	// Debounce can be added here if needed
}

function goToFirstResult() {
	if (filteredProducts.value.length > 0) {
		const first = filteredProducts.value[0];
		closeSearch();
		// Navigate to category
	}
}
</script>

<style scoped>
.search-wrapper {
	position: relative;
}

.search-container {
	display: flex;
	align-items: center;
}

.search-toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	background: var(--bg-secondary);
	border: none;
	border-radius: 50%;
	cursor: pointer;
	transition: all 0.3s ease;
}

.search-toggle:hover {
	background: var(--pink-light);
}

.search-icon {
	font-size: 1.1rem;
}

.search-box {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: var(--bg-primary);
	border: 2px solid var(--pink-primary);
	border-radius: 25px;
	padding: 0.5rem 1rem;
	width: 300px;
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.2);
}

.search-input {
	flex: 1;
	border: none;
	background: transparent;
	font-size: 1rem;
	color: var(--text-primary);
	outline: none;
}

.search-input::placeholder {
	color: var(--text-muted);
}

.clear-btn,
.close-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	background: var(--bg-secondary);
	border: none;
	border-radius: 50%;
	font-size: 0.8rem;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.clear-btn:hover,
.close-btn:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

/* Search Results */
.search-results {
	position: absolute;
	top: calc(100% + 0.5rem);
	right: 0;
	width: 350px;
	max-height: 400px;
	background: var(--bg-primary);
	border-radius: 16px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
	overflow: hidden;
	z-index: 1001;
}

.results-header {
	padding: 0.75rem 1rem;
	background: var(--bg-secondary);
	font-size: 0.85rem;
	color: var(--text-secondary);
	border-bottom: 1px solid var(--border-color);
}

.results-list {
	max-height: 300px;
	overflow-y: auto;
}

.result-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1rem;
	text-decoration: none;
	transition: all 0.2s ease;
	border-bottom: 1px solid var(--border-color);
}

.result-item:last-child {
	border-bottom: none;
}

.result-item:hover {
	background: var(--pink-light);
}

.result-image {
	font-size: 1.5rem;
}

.result-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.result-name {
	font-weight: 600;
	font-size: 0.95rem;
	color: var(--text-primary);
}

.result-category {
	font-size: 0.8rem;
	color: var(--text-muted);
}

.result-price {
	font-weight: 700;
	color: var(--pink-primary);
}

.view-all-btn {
	display: block;
	padding: 0.75rem;
	text-align: center;
	background: var(--pink-light);
	color: var(--pink-primary);
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
}

.view-all-btn:hover {
	background: var(--pink-primary);
	color: white;
}

/* No Results */
.no-results {
	padding: 2rem;
	text-align: center;
}

.no-results-icon {
	font-size: 2.5rem;
	display: block;
	margin-bottom: 0.5rem;
	opacity: 0.5;
}

.no-results p {
	color: var(--text-secondary);
	margin: 0 0 1rem 0;
}

.browse-link {
	color: var(--pink-primary);
	font-weight: 600;
	text-decoration: none;
}

.browse-link:hover {
	text-decoration: underline;
}

/* Overlay */
.search-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.3);
	z-index: 999;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
	transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Mobile */
@media (max-width: 768px) {
	.search-box {
		position: fixed;
		top: 1rem;
		right: 1rem;
		left: 1rem;
		width: auto;
		z-index: 1002;
	}

	.search-results {
		position: fixed;
		top: 70px;
		right: 1rem;
		left: 1rem;
		width: auto;
	}
}
</style>

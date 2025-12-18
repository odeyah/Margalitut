<template>
	<div class="gallery-page">
		<!-- Hero Section -->
		<header class="page-header">
			<h1 class="page-title">הגלריה שלנו</h1>
			<p class="page-subtitle">תמונות מהיצירות שלנו - עוגות, מאפים ורגעים מתוקים</p>
		</header>

		<!-- Filter Tabs -->
		<div class="filter-tabs">
			<button
				v-for="filter in filters"
				:key="filter.id"
				class="filter-tab"
				:class="{ active: activeFilter === filter.id }"
				@click="activeFilter = filter.id"
			>
				<span class="filter-icon">{{ filter.icon }}</span>
				<span class="filter-label">{{ filter.name }}</span>
			</button>
		</div>

		<!-- Gallery Grid -->
		<div class="gallery-grid">
			<TransitionGroup name="gallery">
				<div
					v-for="(image, index) in filteredImages"
					:key="image.id"
					class="gallery-item"
					:class="image.size"
					@click="openLightbox(index)"
				>
					<div class="image-placeholder">
						<span class="placeholder-icon">{{ image.icon }}</span>
						<span class="placeholder-text">{{ image.title }}</span>
					</div>
					<div class="image-overlay">
						<span class="overlay-icon">🔍</span>
						<span class="overlay-text">{{ image.title }}</span>
						<span class="overlay-category">{{ image.categoryName }}</span>
					</div>
				</div>
			</TransitionGroup>
		</div>

		<!-- Empty State -->
		<div v-if="filteredImages.length === 0" class="empty-state">
			<span class="empty-icon">📷</span>
			<h3>אין תמונות בקטגוריה זו</h3>
			<p>בקרוב נוסיף עוד תמונות!</p>
		</div>

		<!-- Call to Action -->
		<section class="cta-section">
			<div class="cta-content">
				<span class="cta-icon">📸</span>
				<h3 class="cta-title">רוצים לראות את היצירה שלכם כאן?</h3>
				<p class="cta-text">הזמינו עוגה או מאפה ושתפו אותנו בתמונות!</p>
				<div class="cta-buttons">
					<router-link to="/menu" class="cta-btn primary"> לתפריט </router-link>
					<router-link to="/quote" class="cta-btn secondary"> הצעת מחיר </router-link>
				</div>
			</div>
		</section>

		<!-- Lightbox -->
		<Teleport to="body">
			<Transition name="fade">
				<div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
					<button class="lightbox-close" @click="closeLightbox">✕</button>
					<button class="lightbox-nav prev" @click.stop="prevImage">❮</button>
					<button class="lightbox-nav next" @click.stop="nextImage">❯</button>

					<div class="lightbox-content" @click.stop>
						<div class="lightbox-image">
							<span class="lightbox-icon">{{ currentImage?.icon }}</span>
							<span class="lightbox-title">{{ currentImage?.title }}</span>
						</div>
						<div class="lightbox-info">
							<h3>{{ currentImage?.title }}</h3>
							<p>{{ currentImage?.description }}</p>
							<span class="lightbox-category">{{ currentImage?.categoryName }}</span>
						</div>
					</div>

					<div class="lightbox-counter">{{ currentIndex + 1 }} / {{ filteredImages.length }}</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
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
const activeFilter = ref('all');
const lightboxOpen = ref(false);
const currentIndex = ref(0);

const filters = [
	{ id: 'all', name: 'הכל', icon: '📷' },
	{ id: 'cakes', name: 'עוגות', icon: '🎂' },
	{ id: 'cookies', name: 'עוגיות', icon: '🍪' },
	{ id: 'pastries', name: 'מאפים', icon: '🥐' },
	{ id: 'workshops', name: 'חוגים', icon: '👩‍🍳' },
	{ id: 'events', name: 'אירועים', icon: '🎉' },
];

// תמונות לדוגמה - להחליף עם תמונות אמיתיות
const images = ref([
	{
		id: 1,
		icon: '🎂',
		title: 'עוגת יום הולדת',
		description: 'עוגת שכבות עם קרם שוקולד',
		category: 'cakes',
		categoryName: 'עוגות',
		size: 'large',
	},
	{
		id: 2,
		icon: '🍪',
		title: 'עוגיות שוקולד צ׳יפס',
		description: 'עוגיות ביתיות טריות',
		category: 'cookies',
		categoryName: 'עוגיות',
		size: 'small',
	},
	{
		id: 3,
		icon: '🧁',
		title: 'קאפקייקס צבעוניים',
		description: 'קאפקייקס עם קישוטים',
		category: 'cakes',
		categoryName: 'עוגות',
		size: 'small',
	},
	{
		id: 4,
		icon: '🥐',
		title: 'קרואסונים טריים',
		description: 'קרואסונים חמאה',
		category: 'pastries',
		categoryName: 'מאפים',
		size: 'medium',
	},
	{
		id: 5,
		icon: '🎂',
		title: 'עוגת חתונה',
		description: 'עוגת קומות מרשימה',
		category: 'cakes',
		categoryName: 'עוגות',
		size: 'large',
	},
	{
		id: 6,
		icon: '👩‍🍳',
		title: 'חוג אפייה לילדים',
		description: 'ילדים מכינים עוגיות',
		category: 'workshops',
		categoryName: 'חוגים',
		size: 'medium',
	},
	{
		id: 7,
		icon: '🍰',
		title: 'עוגת גבינה',
		description: 'עוגת גבינה אפויה',
		category: 'cakes',
		categoryName: 'עוגות',
		size: 'small',
	},
	{
		id: 8,
		icon: '🥧',
		title: 'פאי תפוחים',
		description: 'פאי עם קינמון',
		category: 'pastries',
		categoryName: 'מאפים',
		size: 'small',
	},
	{
		id: 9,
		icon: '🎉',
		title: 'שולחן מתוקים לאירוע',
		description: 'שולחן קינוחים מפואר',
		category: 'events',
		categoryName: 'אירועים',
		size: 'large',
	},
	{
		id: 10,
		icon: '🍪',
		title: 'מגש עוגיות',
		description: 'מבחר עוגיות לאירוע',
		category: 'cookies',
		categoryName: 'עוגיות',
		size: 'medium',
	},
	{
		id: 11,
		icon: '👩‍🍳',
		title: 'סדנת שוקולד',
		description: 'הכנת פרלינים',
		category: 'workshops',
		categoryName: 'חוגים',
		size: 'small',
	},
	{
		id: 12,
		icon: '🎂',
		title: 'עוגת בת מצווה',
		description: 'עוגה מעוצבת לבת מצווה',
		category: 'events',
		categoryName: 'אירועים',
		size: 'medium',
	},
]);

const filteredImages = computed(() => {
	if (activeFilter.value === 'all') return images.value;
	return images.value.filter(img => img.category === activeFilter.value);
});

const currentImage = computed(() => filteredImages.value[currentIndex.value]);

function openLightbox(index) {
	currentIndex.value = index;
	lightboxOpen.value = true;
	document.body.style.overflow = 'hidden';
}

function closeLightbox() {
	lightboxOpen.value = false;
	document.body.style.overflow = '';
}

function nextImage() {
	currentIndex.value = (currentIndex.value + 1) % filteredImages.value.length;
}

function prevImage() {
	currentIndex.value = (currentIndex.value - 1 + filteredImages.value.length) % filteredImages.value.length;
}

// Keyboard navigation
document.addEventListener('keydown', e => {
	if (!lightboxOpen.value) return;
	if (e.key === 'Escape') closeLightbox();
	if (e.key === 'ArrowRight') prevImage();
	if (e.key === 'ArrowLeft') nextImage();
});
</script>

<style scoped>
.gallery-page {
	max-width: 1200px;
	margin: 0 auto;
}

/* Page Header */
.page-header {
	text-align: center;
	margin-bottom: 2rem;
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

/* Filter Tabs */
.filter-tabs {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	margin-bottom: 2rem;
	flex-wrap: wrap;
}

.filter-tab {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.6rem 1.2rem;
	background: var(--bg-primary);
	border: 2px solid transparent;
	border-radius: 25px;
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--text-secondary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.filter-tab:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

.filter-tab.active {
	background: var(--pink-light);
	border-color: var(--pink-primary);
	color: var(--pink-primary);
}

.filter-icon {
	font-size: 1.1rem;
}

/* Gallery Grid */
.gallery-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-auto-rows: 200px;
	gap: 1rem;
	margin-bottom: 3rem;
}

.gallery-item {
	position: relative;
	border-radius: 16px;
	overflow: hidden;
	cursor: pointer;
	transition: all 0.3s ease;
}

.gallery-item:hover {
	transform: scale(1.02);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.gallery-item.small {
	grid-column: span 1;
	grid-row: span 1;
}

.gallery-item.medium {
	grid-column: span 1;
	grid-row: span 1;
}

.gallery-item.large {
	grid-column: span 2;
	grid-row: span 2;
}

/* Image Placeholder */
.image-placeholder {
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, var(--pink-light), var(--bg-secondary));
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
}

.placeholder-icon {
	font-size: 3rem;
}

.gallery-item.large .placeholder-icon {
	font-size: 5rem;
}

.placeholder-text {
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--text-secondary);
	text-align: center;
	padding: 0 1rem;
}

/* Image Overlay */
.image-overlay {
	position: absolute;
	inset: 0;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	padding: 1.5rem;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.gallery-item:hover .image-overlay {
	opacity: 1;
}

.overlay-icon {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 2rem;
	opacity: 0;
	transition: all 0.3s ease;
}

.gallery-item:hover .overlay-icon {
	opacity: 1;
}

.overlay-text {
	color: white;
	font-weight: 700;
	font-size: 1.1rem;
	text-align: center;
}

.overlay-category {
	color: rgba(255, 255, 255, 0.7);
	font-size: 0.85rem;
	margin-top: 0.25rem;
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
	opacity: 0.5;
}

.empty-state h3 {
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.empty-state p {
	color: var(--text-secondary);
	margin: 0;
}

/* CTA Section */
.cta-section {
	margin: 3rem 0;
}

.cta-content {
	text-align: center;
	padding: 3rem 2rem;
	background: linear-gradient(135deg, var(--pink-light), var(--bg-primary));
	border-radius: 24px;
	border: 2px solid var(--border-pink);
}

.cta-icon {
	font-size: 3rem;
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

.cta-buttons {
	display: flex;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.cta-btn {
	padding: 0.875rem 2rem;
	border-radius: 30px;
	font-weight: 700;
	font-size: 1rem;
	text-decoration: none;
	transition: all 0.3s ease;
}

.cta-btn.primary {
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
}

.cta-btn.primary:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 30px rgba(255, 107, 157, 0.4);
}

.cta-btn.secondary {
	background: var(--bg-primary);
	color: var(--pink-primary);
	border: 2px solid var(--pink-primary);
}

.cta-btn.secondary:hover {
	background: var(--pink-light);
}

/* Lightbox */
.lightbox-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.95);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2000;
	padding: 2rem;
}

.lightbox-close {
	position: absolute;
	top: 1.5rem;
	right: 1.5rem;
	width: 44px;
	height: 44px;
	background: rgba(255, 255, 255, 0.1);
	border: none;
	border-radius: 50%;
	color: white;
	font-size: 1.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.lightbox-close:hover {
	background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 50px;
	height: 50px;
	background: rgba(255, 255, 255, 0.1);
	border: none;
	border-radius: 50%;
	color: white;
	font-size: 1.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.lightbox-nav:hover {
	background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav.prev {
	right: 1.5rem;
}

.lightbox-nav.next {
	left: 1.5rem;
}

.lightbox-content {
	max-width: 800px;
	width: 100%;
	text-align: center;
}

.lightbox-image {
	background: linear-gradient(135deg, var(--pink-light), var(--bg-secondary));
	border-radius: 20px;
	padding: 4rem;
	margin-bottom: 1.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
}

.lightbox-icon {
	font-size: 8rem;
}

.lightbox-title {
	font-size: 1.5rem;
	font-weight: 600;
	color: var(--text-primary);
}

.lightbox-info h3 {
	color: white;
	font-size: 1.5rem;
	margin: 0 0 0.5rem 0;
}

.lightbox-info p {
	color: rgba(255, 255, 255, 0.7);
	margin: 0 0 0.75rem 0;
}

.lightbox-category {
	display: inline-block;
	padding: 0.4rem 1rem;
	background: var(--pink-primary);
	color: white;
	border-radius: 20px;
	font-size: 0.85rem;
	font-weight: 600;
}

.lightbox-counter {
	position: absolute;
	bottom: 1.5rem;
	left: 50%;
	transform: translateX(-50%);
	color: rgba(255, 255, 255, 0.6);
	font-size: 0.9rem;
}

/* Gallery Transition */
.gallery-enter-active,
.gallery-leave-active {
	transition: all 0.3s ease;
}

.gallery-enter-from,
.gallery-leave-to {
	opacity: 0;
	transform: scale(0.9);
}

.gallery-move {
	transition: transform 0.3s ease;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
	.gallery-grid {
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: 180px;
	}

	.gallery-item.large {
		grid-column: span 2;
		grid-row: span 2;
	}
}

@media (max-width: 768px) {
	.gallery-grid {
		grid-template-columns: repeat(2, 1fr);
		grid-auto-rows: 160px;
	}

	.gallery-item.large {
		grid-column: span 2;
		grid-row: span 1;
	}

	.filter-tabs {
		justify-content: flex-start;
		overflow-x: auto;
		padding-bottom: 0.5rem;
	}

	.filter-tab {
		flex-shrink: 0;
	}

	.lightbox-nav.prev {
		right: 0.5rem;
	}

	.lightbox-nav.next {
		left: 0.5rem;
	}
}

@media (max-width: 480px) {
	.gallery-grid {
		grid-template-columns: 1fr;
		grid-auto-rows: 200px;
	}

	.gallery-item.large,
	.gallery-item.medium {
		grid-column: span 1;
		grid-row: span 1;
	}
}
</style>

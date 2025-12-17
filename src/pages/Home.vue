<template>
	<div class="home-page">
		<!-- Hero Section -->
		<section class="hero-section">
			<div class="hero-background">
				<div class="hero-shape shape-1"></div>
				<div class="hero-shape shape-2"></div>
				<div class="hero-shape shape-3"></div>
			</div>

			<div class="hero-content">
				<div class="hero-text">
					<h1 class="hero-title">
						ברוכים הבאים ל
						<span class="brand-name">מרגליתות</span>
						<span class="hero-emoji">🍓</span>
					</h1>
					<p class="hero-subtitle">
						מאפייה ביתית עם אהבה למתוק ולחלבי: עוגות, עוגיות, לחמים, גלידות וארוחות חלביות — הכול טרי, נקי וטעים.
					</p>
					<div class="hero-badges">
						<span class="badge">
							<span class="badge-icon">✡️</span>
							כל הרכיבים בכשרות מהדרין
						</span>
						<span class="badge">
							<span class="badge-icon">🏠</span>
							אפייה ביתית
						</span>
						<span class="badge">
							<span class="badge-icon">❤️</span>
							עבודת יד
						</span>
					</div>
					<div class="hero-actions">
						<router-link to="/menu" class="btn-primary">
							<span>לתפריט</span>
							<span class="btn-arrow">←</span>
						</router-link>
						<router-link to="/quote" class="btn-secondary"> בקשת הצעת מחיר </router-link>
					</div>
				</div>
				<div class="hero-image">
					<img :src="logo" alt="מרגליתות לוגו" class="logo-img" />
					<div class="floating-items">
						<span class="floating-item item-1">🍰</span>
						<span class="floating-item item-2">🍪</span>
						<span class="floating-item item-3">🍕</span>
						<span class="floating-item item-4">🍦</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Categories Preview -->
		<section class="categories-section">
			<div class="section-header">
				<h2 class="section-title">הקטגוריות שלנו</h2>
				<p class="section-subtitle">גלו את כל המטעמים שלנו</p>
			</div>

			<div class="categories-grid">
				<router-link
					v-for="(category, index) in categories"
					:key="category.id"
					:to="`/menu/${category.id}`"
					class="category-preview"
					:style="{
						'--category-color': category.color,
						animationDelay: `${index * 80}ms`,
					}"
				>
					<span class="category-icon">{{ category.icon }}</span>
					<span class="category-name">{{ category.name }}</span>
				</router-link>
			</div>
		</section>

		<!-- Popular Products -->
		<section class="popular-section">
			<div class="section-header">
				<h2 class="section-title">⭐ הפופולריים שלנו</h2>
				<p class="section-subtitle">המוצרים הכי אהובים על הלקוחות</p>
			</div>

			<div class="products-grid">
				<ProductCard v-for="product in popularProducts" :key="product.id" :product="product" />
			</div>

			<div class="section-action">
				<router-link to="/menu" class="view-all-link">
					צפו בכל התפריט
					<span class="link-arrow">←</span>
				</router-link>
			</div>
		</section>

		<!-- Features Section -->
		<section class="features-section">
			<div class="section-header">
				<h2 class="section-title">למה מרגליתות?</h2>
			</div>

			<div class="features-grid">
				<div class="feature-card">
					<span class="feature-icon">🌿</span>
					<h3 class="feature-title">רכיבים איכותיים</h3>
					<p class="feature-text">כל הרכיבים שלנו בכשרות מהדרין, טריים ואיכותיים</p>
				</div>
				<div class="feature-card">
					<span class="feature-icon">👩‍🍳</span>
					<h3 class="feature-title">עבודת יד</h3>
					<p class="feature-text">כל מוצר מוכן בעבודת יד עם אהבה ותשומת לב לפרטים</p>
				</div>
				<div class="feature-card">
					<span class="feature-icon">🎂</span>
					<h3 class="feature-title">התאמה אישית</h3>
					<p class="feature-text">מתאימים לכל צורך: ללא גלוטן, ללא סוכר, טבעוני</p>
				</div>
				<div class="feature-card">
					<span class="feature-icon">🚗</span>
					<h3 class="feature-title">משלוחים</h3>
					<p class="feature-text">משלוחים לכל אזור בית שמש והסביבה</p>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="cta-section">
			<div class="cta-card">
				<div class="cta-content">
					<span class="cta-icon">🎉</span>
					<h2 class="cta-title">מתכננים אירוע?</h2>
					<p class="cta-text">ימי הולדת, בריתות, חינות, שבתות ואירועים - נשמח להכין עבורכם הזמנה מיוחדת!</p>
					<router-link to="/quote" class="cta-btn">
						דברו איתנו
						<span class="btn-arrow">←</span>
					</router-link>
				</div>
				<div class="cta-decoration">
					<span class="deco-item deco-1">🧁</span>
					<span class="deco-item deco-2">🎂</span>
					<span class="deco-item deco-3">🍰</span>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useMenuStore } from '../stores/menuStore';
import { ProductCard } from '../components/menu';
import logo from '../assets/logo.png';

const menuStore = useMenuStore();

const categories = computed(() => menuStore.categories);
const popularProducts = computed(() => menuStore.popularProducts.slice(0, 8));
</script>

<style scoped>
.home-page {
	max-width: 1200px;
	margin: 0 auto;
}

/* ========== HERO SECTION ========== */
.hero-section {
	position: relative;
	padding: 2rem 0 4rem;
	overflow: hidden;
}

.hero-background {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: hidden;
}

.hero-shape {
	position: absolute;
	border-radius: 50%;
	opacity: 0.1;
}

.shape-1 {
	width: 400px;
	height: 400px;
	background: var(--pink-primary);
	top: -100px;
	right: -100px;
}

.shape-2 {
	width: 300px;
	height: 300px;
	background: var(--pink-secondary);
	bottom: -50px;
	left: -100px;
}

.shape-3 {
	width: 200px;
	height: 200px;
	background: #ffd700;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.hero-content {
	position: relative;
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 3rem;
	align-items: center;
	z-index: 1;
}

.hero-text {
	max-width: 600px;
}

.hero-title {
	font-size: 2.5rem;
	font-weight: 800;
	color: var(--text-primary);
	margin: 0 0 1rem 0;
	line-height: 1.3;
}

.brand-name {
	display: block;
	font-size: 3rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.hero-emoji {
	display: inline-block;
	animation: wiggle 2s ease-in-out infinite;
}

@keyframes wiggle {
	0%,
	100% {
		transform: rotate(0deg);
	}
	25% {
		transform: rotate(-10deg);
	}
	75% {
		transform: rotate(10deg);
	}
}

.hero-subtitle {
	font-size: 1.15rem;
	color: var(--text-secondary);
	line-height: 1.7;
	margin: 0 0 1.5rem 0;
}

.hero-badges {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	margin-bottom: 2rem;
}

.badge {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.5rem 1rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-pink);
	border-radius: 25px;
	font-size: 0.85rem;
	font-weight: 600;
	color: var(--text-secondary);
}

.badge-icon {
	font-size: 1rem;
}

.hero-actions {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
}

.btn-primary {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem 2rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border-radius: 30px;
	font-weight: 700;
	font-size: 1.1rem;
	text-decoration: none;
	transition: all 0.3s ease;
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
}

.btn-primary:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 30px rgba(255, 107, 157, 0.4);
}

.btn-primary:hover .btn-arrow {
	transform: translateX(-4px);
}

.btn-arrow {
	transition: transform 0.3s ease;
}

.btn-secondary {
	display: inline-flex;
	align-items: center;
	padding: 1rem 2rem;
	background: var(--bg-primary);
	border: 2px solid var(--border-pink);
	color: var(--pink-primary);
	border-radius: 30px;
	font-weight: 700;
	font-size: 1.1rem;
	text-decoration: none;
	transition: all 0.3s ease;
}

.btn-secondary:hover {
	background: var(--pink-light);
	transform: translateY(-3px);
}

/* Hero Image */
.hero-image {
	position: relative;
	width: 280px;
	height: 280px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.logo-img {
	width: 200px;
	height: auto;
	filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
	animation: float 4s ease-in-out infinite;
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-15px);
	}
}

.floating-items {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.floating-item {
	position: absolute;
	font-size: 2rem;
	animation: floatItem 3s ease-in-out infinite;
}

.item-1 {
	top: 0;
	right: 20%;
	animation-delay: 0s;
}
.item-2 {
	top: 30%;
	left: 0;
	animation-delay: 0.5s;
}
.item-3 {
	bottom: 20%;
	right: 0;
	animation-delay: 1s;
}
.item-4 {
	bottom: 0;
	left: 20%;
	animation-delay: 1.5s;
}

@keyframes floatItem {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-10px) rotate(10deg);
	}
}

/* ========== CATEGORIES SECTION ========== */
.categories-section {
	padding: 3rem 0;
}

.section-header {
	text-align: center;
	margin-bottom: 2rem;
}

.section-title {
	font-size: 1.75rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.section-subtitle {
	font-size: 1rem;
	color: var(--text-secondary);
	margin: 0;
}

/* Categories Grid */
.categories-grid {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 1.5rem;
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

.category-preview {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.75rem;
	padding: 1.5rem 1rem;
	background: var(--bg-primary);
	border-radius: 16px;
	text-decoration: none;
	transition: all 0.3s ease;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	opacity: 0;
	animation: fadeInUp 0.5s ease forwards;
}

.category-preview:hover {
	transform: translateY(-6px);
	box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	background: linear-gradient(135deg, var(--category-color) 0%, transparent 100%);
	background-size: 200% 200%;
	background-position: 0 0;
}

.category-preview:hover .category-icon {
	transform: scale(1.2) rotate(-5deg);
}

.category-icon {
	font-size: 2.5rem;
	transition: transform 0.3s ease;
}

.category-name {
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--text-primary);
	text-align: center;
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

/* ========== POPULAR SECTION ========== */
.popular-section {
	padding: 3rem 0;
}

.products-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 1.25rem;
	margin-bottom: 2rem;
}

.section-action {
	text-align: center;
}

.view-all-link {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	background: var(--pink-light);
	color: var(--pink-primary);
	border-radius: 25px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
}

.view-all-link:hover {
	background: var(--pink-primary);
	color: white;
}

.view-all-link:hover .link-arrow {
	transform: translateX(-4px);
}

.link-arrow {
	transition: transform 0.3s ease;
}

/* ========== FEATURES SECTION ========== */
.features-section {
	padding: 3rem 0;
}

.features-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	gap: 1.5rem;
}

.feature-card {
	text-align: center;
	padding: 2rem 1.5rem;
	background: var(--bg-primary);
	border-radius: 20px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	transition: transform 0.3s ease;
}

.feature-card:hover {
	transform: translateY(-5px);
}

.feature-icon {
	font-size: 3rem;
	display: block;
	margin-bottom: 1rem;
}

.feature-title {
	font-size: 1.1rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.feature-text {
	font-size: 0.9rem;
	color: var(--text-secondary);
	margin: 0;
	line-height: 1.5;
}

/* ========== CTA SECTION ========== */
.cta-section {
	padding: 3rem 0;
}

.cta-card {
	position: relative;
	padding: 3rem 2rem;
	background: linear-gradient(135deg, var(--pink-light), var(--bg-primary));
	border-radius: 24px;
	border: 2px solid var(--border-pink);
	overflow: hidden;
}

.cta-content {
	position: relative;
	text-align: center;
	z-index: 1;
}

.cta-icon {
	font-size: 3.5rem;
	display: block;
	margin-bottom: 1rem;
}

.cta-title {
	font-size: 1.75rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.75rem 0;
}

.cta-text {
	font-size: 1.05rem;
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
	max-width: 500px;
	margin-left: auto;
	margin-right: auto;
	line-height: 1.6;
}

.cta-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 1rem 2rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border-radius: 30px;
	font-weight: 700;
	font-size: 1.1rem;
	text-decoration: none;
	transition: all 0.3s ease;
	box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
}

.cta-btn:hover {
	transform: translateY(-3px);
	box-shadow: 0 8px 30px rgba(255, 107, 157, 0.4);
}

.cta-btn:hover .btn-arrow {
	transform: translateX(-4px);
}

.cta-decoration {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.deco-item {
	position: absolute;
	font-size: 4rem;
	opacity: 0.15;
}

.deco-1 {
	top: 10%;
	left: 5%;
}
.deco-2 {
	bottom: 10%;
	right: 5%;
}
.deco-3 {
	top: 50%;
	right: 15%;
	transform: translateY(-50%);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
	.hero-content {
		grid-template-columns: 1fr;
		text-align: center;
	}

	.hero-text {
		max-width: 100%;
	}

	.hero-title {
		font-size: 2rem;
	}

	.brand-name {
		font-size: 2.5rem;
	}

	.hero-badges {
		justify-content: center;
	}

	.hero-actions {
		justify-content: center;
	}

	.hero-image {
		width: 200px;
		height: 200px;
		margin: 0 auto;
	}

	.logo-img {
		width: 150px;
	}

	.floating-item {
		font-size: 1.5rem;
	}

	.categories-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	.products-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.section-title {
		font-size: 1.5rem;
	}

	.cta-card {
		padding: 2rem 1.5rem;
	}

	.cta-title {
		font-size: 1.5rem;
	}
}

@media (max-width: 480px) {
	.hero-title {
		font-size: 1.75rem;
	}

	.brand-name {
		font-size: 2rem;
	}

	.btn-primary,
	.btn-secondary {
		width: 100%;
		justify-content: center;
	}

	.categories-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.products-grid {
		grid-template-columns: 1fr;
	}

	.features-grid {
		grid-template-columns: 1fr;
	}
}
</style>

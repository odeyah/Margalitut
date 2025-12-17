<template>
	<div class="workshops-page">
		<!-- Hero Section -->
		<section class="hero-section">
			<div class="hero-content">
				<span class="hero-icon">👩‍🍳</span>
				<h1 class="hero-title">חוגי אפייה לילדים</h1>
				<p class="hero-subtitle">
					חוויה מתוקה ויצירתית לילדים שלכם!<br />
					לומדים להכין עוגות, עוגיות ומאפים טעימים
				</p>
			</div>
			<div class="hero-decoration">
				<span class="floating-emoji e1">🧁</span>
				<span class="floating-emoji e2">🍪</span>
				<span class="floating-emoji e3">🎂</span>
				<span class="floating-emoji e4">🍰</span>
			</div>
		</section>

		<!-- Age Groups -->
		<section class="age-groups-section">
			<h2 class="section-title">בחרו קבוצת גיל</h2>
			<p class="section-subtitle">החוגים מותאמים לכל גיל עם פעילויות מתאימות</p>

			<div class="age-groups-grid">
				<!-- Group 1: 3.5-6 -->
				<div class="age-card" @click="selectGroup('toddlers')">
					<div class="age-icon">👶</div>
					<div class="age-range">3.5-6</div>
					<h3 class="age-title">אפרוחי האפייה</h3>
					<p class="age-description">פעילויות אפייה פשוטות וכיפיות, עיצוב עוגיות, משחקים עם בצק ויצירה מתוקה</p>
					<ul class="age-features">
						<li>🍪 עוגיות מעוצבות</li>
						<li>🧁 קאפקייקס צבעוניים</li>
						<li>🎨 קישוט בסוכריות</li>
						<li>👐 משחק עם בצק</li>
					</ul>
					<div class="age-meta">
						<span class="duration">⏱️ 60 דקות</span>
						<span class="group-size">👥 עד 8 ילדים</span>
					</div>
					<button class="age-btn">לפרטים נוספים</button>
				</div>

				<!-- Group 2: 6-9 -->
				<div class="age-card featured" @click="selectGroup('kids')">
					<div class="featured-badge">הכי פופולרי ⭐</div>
					<div class="age-icon">🧒</div>
					<div class="age-range">6-9</div>
					<h3 class="age-title">שפים צעירים</h3>
					<p class="age-description">לומדים טכניקות אפייה אמיתיות, מכינים עוגות ומאפים מרשימים</p>
					<ul class="age-features">
						<li>🎂 עוגות שכבות</li>
						<li>🥐 מאפים מעוצבים</li>
						<li>🍫 עבודה עם שוקולד</li>
						<li>📖 מתכונים לקחת הביתה</li>
					</ul>
					<div class="age-meta">
						<span class="duration">⏱️ 75 דקות</span>
						<span class="group-size">👥 עד 10 ילדים</span>
					</div>
					<button class="age-btn">לפרטים נוספים</button>
				</div>

				<!-- Group 3: 9-12 -->
				<div class="age-card" @click="selectGroup('tweens')">
					<div class="age-icon">👧</div>
					<div class="age-range">9-12</div>
					<h3 class="age-title">אופים מקצועיים</h3>
					<p class="age-description">טכניקות מתקדמות, מתכונים מאתגרים והכנה לעולם הקונדיטוריה</p>
					<ul class="age-features">
						<li>🎂 עוגות מעוצבות</li>
						<li>🍰 טארטים וקינוחים</li>
						<li>🧁 קישוט מקצועי</li>
						<li>👨‍🍳 טכניקות שף</li>
					</ul>
					<div class="age-meta">
						<span class="duration">⏱️ 90 דקות</span>
						<span class="group-size">👥 עד 10 ילדים</span>
					</div>
					<button class="age-btn">לפרטים נוספים</button>
				</div>
			</div>
		</section>

		<!-- What's Included -->
		<section class="included-section">
			<h2 class="section-title">מה כולל החוג?</h2>
			<div class="included-grid">
				<div class="included-item">
					<span class="included-icon">🥣</span>
					<h4>חומרי גלם</h4>
					<p>כל החומרים והמרכיבים כלולים במחיר</p>
				</div>
				<div class="included-item">
					<span class="included-icon">👩‍🍳</span>
					<h4>הדרכה מקצועית</h4>
					<p>מדריכה מנוסה עם המון סבלנות</p>
				</div>
				<div class="included-item">
					<span class="included-icon">📦</span>
					<h4>לקחת הביתה</h4>
					<p>כל ילד לוקח את היצירות שלו הביתה</p>
				</div>
				<div class="included-item">
					<span class="included-icon">🎉</span>
					<h4>חוויה מתוקה</h4>
					<p>כיף, יצירתיות והרבה טעימות!</p>
				</div>
			</div>
		</section>

		<!-- Contact Form / CTA -->
		<section class="contact-section">
			<div class="contact-card">
				<h2>רוצים לשמוע עוד?</h2>
				<p>השאירו פרטים ונחזור אליכם עם כל המידע</p>

				<form class="contact-form" @submit.prevent="submitInquiry">
					<div class="form-row">
						<div class="form-group">
							<label class="form-label">שם ההורה</label>
							<input type="text" v-model="inquiry.parentName" class="form-input" placeholder="שם מלא" required />
						</div>
						<div class="form-group">
							<label class="form-label">טלפון</label>
							<input type="tel" v-model="inquiry.phone" class="form-input" placeholder="050-0000000" dir="ltr" required />
						</div>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label class="form-label">שם הילד/ה</label>
							<input type="text" v-model="inquiry.childName" class="form-input" placeholder="שם הילד/ה" />
						</div>
						<div class="form-group">
							<label class="form-label">גיל</label>
							<select v-model="inquiry.ageGroup" class="form-input">
								<option value="">בחרו קבוצת גיל</option>
								<option value="3.5-6">3.5-6 - אפרוחי האפייה</option>
								<option value="6-9">6-9 - שפים צעירים</option>
								<option value="9-12">9-12 - אופים מקצועיים</option>
							</select>
						</div>
					</div>

					<div class="form-group">
						<label class="form-label">הערות</label>
						<textarea
							v-model="inquiry.notes"
							class="form-input form-textarea"
							placeholder="שאלות, בקשות מיוחדות..."
							rows="3"
						></textarea>
					</div>

					<button type="submit" class="submit-btn" :disabled="isSubmitting">
						<span v-if="isSubmitting" class="loading-spinner small"></span>
						<span v-else>
							שליחה
							<span class="btn-icon">📩</span>
						</span>
					</button>
				</form>

				<!-- WhatsApp Alternative -->
				<div class="whatsapp-alternative">
					<span>או פנו אלינו ישירות:</span>
					<a :href="whatsappLink" target="_blank" class="whatsapp-btn">
						<span class="wa-icon">💬</span>
						וואטסאפ
					</a>
					<a href="tel:0528460331" class="phone-btn">
						<span class="phone-icon">📱</span>
						052-846-0331
					</a>
				</div>
			</div>
		</section>

		<!-- Success Modal -->
		<Teleport to="body">
			<Transition name="fade">
				<div v-if="showSuccess" class="success-modal-overlay" @click="showSuccess = false">
					<div class="success-modal" @click.stop>
						<span class="success-icon">✅</span>
						<h3>תודה רבה!</h3>
						<p>קיבלנו את הפנייה שלכם ונחזור אליכם בהקדם.</p>
						<button class="close-btn" @click="showSuccess = false">סגור</button>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const inquiry = ref({
	parentName: '',
	phone: '',
	childName: '',
	ageGroup: '',
	notes: '',
});

const isSubmitting = ref(false);
const showSuccess = ref(false);

const whatsappLink = computed(() => {
	let message = '🍓 היי, אשמח לשמוע פרטים על חוגי האפייה';
	if (inquiry.value.ageGroup) {
		message += ` לגילאי ${inquiry.value.ageGroup}`;
	}
	return `https://wa.me/972528460331?text=${encodeURIComponent(message)}`;
});

function selectGroup(group) {
	const ageMap = {
		toddlers: '3.5-6',
		kids: '6-9',
		tweens: '9-12',
	};
	inquiry.value.ageGroup = ageMap[group];

	// גלול לטופס
	document.querySelector('.contact-section')?.scrollIntoView({
		behavior: 'smooth',
	});
}

async function submitInquiry() {
	if (!inquiry.value.parentName || !inquiry.value.phone) return;

	isSubmitting.value = true;

	try {
		// בעתיד - שמירה ב-Firebase או שליחת אימייל
		// לעכשיו - פתיחת וואטסאפ עם הפרטים

		let message = `🍓 *פנייה לגבי חוגי אפייה*\n\n`;
		message += `👤 שם ההורה: ${inquiry.value.parentName}\n`;
		message += `📱 טלפון: ${inquiry.value.phone}\n`;
		if (inquiry.value.childName) {
			message += `👶 שם הילד/ה: ${inquiry.value.childName}\n`;
		}
		if (inquiry.value.ageGroup) {
			message += `🎂 קבוצת גיל: ${inquiry.value.ageGroup}\n`;
		}
		if (inquiry.value.notes) {
			message += `\n📝 הערות:\n${inquiry.value.notes}\n`;
		}

		const link = `https://wa.me/972528460331?text=${encodeURIComponent(message)}`;
		window.open(link, '_blank');

		// הצג הודעת הצלחה
		showSuccess.value = true;

		// אפס טופס
		inquiry.value = {
			parentName: '',
			phone: '',
			childName: '',
			ageGroup: '',
			notes: '',
		};
	} catch (error) {
		console.error('Failed to submit inquiry:', error);
	} finally {
		isSubmitting.value = false;
	}
}
</script>

<style scoped>
.workshops-page {
	max-width: 1200px;
	margin: 0 auto;
}

/* Hero Section */
.hero-section {
	position: relative;
	text-align: center;
	padding: 3rem 1rem;
	background: linear-gradient(135deg, var(--pink-light) 0%, var(--bg-primary) 100%);
	border-radius: 30px;
	margin-bottom: 3rem;
	overflow: hidden;
}

.hero-content {
	position: relative;
	z-index: 2;
}

.hero-icon {
	font-size: 4rem;
	display: block;
	margin-bottom: 1rem;
	animation: bounce 2s ease infinite;
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

.hero-title {
	font-size: 2.5rem;
	font-weight: 800;
	color: var(--text-primary);
	margin: 0 0 1rem 0;
}

.hero-subtitle {
	font-size: 1.2rem;
	color: var(--text-secondary);
	margin: 0;
	line-height: 1.8;
}

.hero-decoration {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 1;
}

.floating-emoji {
	position: absolute;
	font-size: 2rem;
	opacity: 0.5;
	animation: float 4s ease-in-out infinite;
}

.floating-emoji.e1 {
	top: 10%;
	right: 10%;
	animation-delay: 0s;
}
.floating-emoji.e2 {
	top: 20%;
	left: 15%;
	animation-delay: 1s;
}
.floating-emoji.e3 {
	bottom: 15%;
	right: 20%;
	animation-delay: 2s;
}
.floating-emoji.e4 {
	bottom: 20%;
	left: 10%;
	animation-delay: 3s;
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-15px) rotate(10deg);
	}
}

/* Section Titles */
.section-title {
	font-size: 1.75rem;
	font-weight: 700;
	color: var(--text-primary);
	text-align: center;
	margin: 0 0 0.5rem 0;
}

.section-subtitle {
	font-size: 1rem;
	color: var(--text-secondary);
	text-align: center;
	margin: 0 0 2rem 0;
}

/* Age Groups Section */
.age-groups-section {
	margin-bottom: 4rem;
}

.age-groups-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 1.5rem;
}

/* Age Card */
.age-card {
	position: relative;
	background: var(--bg-primary);
	border-radius: 24px;
	padding: 2rem;
	box-shadow: var(--card-shadow);
	cursor: pointer;
	transition: all 0.3s ease;
	border: 2px solid transparent;
}

.age-card:hover {
	transform: translateY(-8px);
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	border-color: var(--pink-primary);
}

.age-card.featured {
	border-color: var(--pink-primary);
	background: linear-gradient(135deg, var(--bg-primary) 0%, var(--pink-light) 100%);
}

.featured-badge {
	position: absolute;
	top: -12px;
	right: 20px;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	padding: 0.4rem 1rem;
	border-radius: 20px;
	font-size: 0.85rem;
	font-weight: 700;
}

.age-icon {
	font-size: 3rem;
	margin-bottom: 0.5rem;
}

.age-range {
	display: inline-block;
	background: var(--pink-light);
	color: var(--pink-primary);
	padding: 0.4rem 1rem;
	border-radius: 20px;
	font-size: 1.25rem;
	font-weight: 700;
	margin-bottom: 1rem;
}

.age-title {
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.75rem 0;
}

.age-description {
	font-size: 0.95rem;
	color: var(--text-secondary);
	margin: 0 0 1.25rem 0;
	line-height: 1.6;
}

.age-features {
	list-style: none;
	padding: 0;
	margin: 0 0 1.25rem 0;
}

.age-features li {
	padding: 0.4rem 0;
	font-size: 0.9rem;
	color: var(--text-primary);
}

.age-meta {
	display: flex;
	gap: 1rem;
	margin-bottom: 1.25rem;
	flex-wrap: wrap;
}

.age-meta span {
	font-size: 0.85rem;
	color: var(--text-secondary);
	background: var(--bg-secondary);
	padding: 0.4rem 0.8rem;
	border-radius: 15px;
}

.age-btn {
	width: 100%;
	padding: 0.875rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 12px;
	font-weight: 700;
	font-size: 1rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.age-btn:hover {
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

/* Included Section */
.included-section {
	margin-bottom: 4rem;
}

.included-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.5rem;
}

.included-item {
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 1.5rem;
	text-align: center;
	box-shadow: var(--card-shadow);
	transition: all 0.3s ease;
}

.included-item:hover {
	transform: translateY(-5px);
}

.included-icon {
	font-size: 2.5rem;
	display: block;
	margin-bottom: 0.75rem;
}

.included-item h4 {
	font-size: 1.1rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.included-item p {
	font-size: 0.9rem;
	color: var(--text-secondary);
	margin: 0;
}

/* Contact Section */
.contact-section {
	margin-bottom: 3rem;
}

.contact-card {
	background: var(--bg-primary);
	border-radius: 24px;
	padding: 2.5rem;
	box-shadow: var(--card-shadow);
	text-align: center;
}

.contact-card h2 {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.contact-card > p {
	color: var(--text-secondary);
	margin: 0 0 2rem 0;
}

/* Form */
.contact-form {
	max-width: 600px;
	margin: 0 auto;
	text-align: right;
}

.form-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
	margin-bottom: 1rem;
}

.form-group {
	margin-bottom: 0;
}

.form-label {
	display: block;
	font-weight: 600;
	font-size: 0.9rem;
	color: var(--text-primary);
	margin-bottom: 0.5rem;
}

.form-input {
	width: 100%;
	padding: 0.875rem 1rem;
	background: var(--bg-secondary);
	border: 2px solid transparent;
	border-radius: 12px;
	font-size: 1rem;
	color: var(--text-primary);
	transition: all 0.3s ease;
}

.form-input:focus {
	outline: none;
	border-color: var(--pink-primary);
	background: var(--bg-primary);
}

.form-textarea {
	resize: vertical;
	min-height: 100px;
}

.submit-btn {
	width: 100%;
	padding: 1rem;
	background: linear-gradient(135deg, var(--pink-primary), var(--pink-secondary));
	color: white;
	border: none;
	border-radius: 12px;
	font-size: 1.1rem;
	font-weight: 700;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	margin-top: 1.5rem;
}

.submit-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(255, 107, 157, 0.4);
}

.submit-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.loading-spinner.small {
	width: 20px;
	height: 20px;
	border: 2px solid white;
	border-top-color: transparent;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

/* WhatsApp Alternative */
.whatsapp-alternative {
	margin-top: 2rem;
	padding-top: 2rem;
	border-top: 1px dashed var(--border-color);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.whatsapp-alternative span {
	color: var(--text-secondary);
}

.whatsapp-btn,
.phone-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.6rem 1.2rem;
	border-radius: 25px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
}

.whatsapp-btn {
	background: #25d366;
	color: white;
}

.whatsapp-btn:hover {
	background: #128c7e;
}

.phone-btn {
	background: var(--bg-secondary);
	color: var(--text-primary);
}

.phone-btn:hover {
	background: var(--pink-light);
	color: var(--pink-primary);
}

/* Success Modal */
.success-modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	padding: 1rem;
}

.success-modal {
	background: var(--bg-primary);
	border-radius: 20px;
	padding: 2.5rem;
	text-align: center;
	max-width: 400px;
	width: 100%;
}

.success-icon {
	font-size: 4rem;
	display: block;
	margin-bottom: 1rem;
}

.success-modal h3 {
	font-size: 1.5rem;
	color: var(--text-primary);
	margin: 0 0 0.5rem 0;
}

.success-modal p {
	color: var(--text-secondary);
	margin: 0 0 1.5rem 0;
}

.close-btn {
	padding: 0.75rem 2rem;
	background: var(--pink-primary);
	color: white;
	border: none;
	border-radius: 25px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.close-btn:hover {
	background: var(--pink-secondary);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
	.hero-title {
		font-size: 2rem;
	}

	.hero-subtitle {
		font-size: 1rem;
	}

	.age-groups-grid {
		grid-template-columns: 1fr;
	}

	.form-row {
		grid-template-columns: 1fr;
	}

	.whatsapp-alternative {
		flex-direction: column;
	}
}
</style>

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMenuStore = defineStore('menu', () => {
	// ===== CATEGORIES =====
	const categories = ref([
		{
			id: 'yeast-cakes',
			name: 'עוגות שמרים',
			icon: '🥐',
			description: 'עוגות שמרים טריות ורכות',
			color: '#F4A460',
		},
		{
			id: 'mixed-cakes',
			name: 'עוגות בחושות',
			icon: '🍰',
			description: 'עוגות בחושות ביתיות ועשירות',
			color: '#DDA0DD',
		},
		{
			id: 'cookies',
			name: 'עוגיות',
			icon: '🍪',
			description: 'עוגיות פריכות וטעימות',
			color: '#D2691E',
		},
		{
			id: 'breads',
			name: 'לחמים',
			icon: '🍞',
			description: 'לחמים טריים מהתנור',
			color: '#DEB887',
		},
		{
			id: 'sugar-free',
			name: 'ללא סוכר',
			icon: '🌿',
			description: 'מתוקים בריאים ללא סוכר',
			color: '#90EE90',
		},
		{
			id: 'gluten-free',
			name: 'ללא גלוטן',
			icon: '🌾',
			description: 'אפייה ללא גלוטן',
			color: '#F0E68C',
		},
		{
			id: 'vegan',
			name: 'טבעוני',
			icon: '🌱',
			description: 'מאפים טבעוניים ללא מוצרי בעלי חיים',
			color: '#98FB98',
		},
		{
			id: 'ice-cream',
			name: 'גלידות',
			icon: '🍦',
			description: 'גלידות ביתיות בטעמים מיוחדים',
			color: '#FFB6C1',
		},
		{
			id: 'dairy-meals',
			name: 'ארוחות חלביות',
			icon: '🧀',
			description: 'ארוחות חלביות טריות וטעימות',
			color: '#FFA07A',
			hasSubcategories: true,
		},
		{
			id: 'baking-workshops',
			name: 'חוגי אפייה',
			icon: '👩‍🍳',
			color: '#FF6B9D',
			description: 'חוגי אפייה לילדים בכל הגילאים',
			isExternal: false, // בעתיד ישתנה ל-true עם קישור חיצוני
		},
	]);

	// ===== DAIRY MEALS SUBCATEGORIES =====
	const dairySubcategories = ref([
		{ id: 'pizzas', name: 'פיצות', icon: '🍕' },
		{ id: 'quiches', name: 'קישים', icon: '🥧' },
		{ id: 'salads', name: 'סלטים', icon: '🥗' },
		{ id: 'pastas', name: 'פסטות', icon: '🍝' },
		{ id: 'soups', name: 'מרקים', icon: '🍲' },
	]);

	// ===== PRODUCTS =====
	const products = ref([
		// עוגות שמרים
		{
			id: 1,
			name: 'עוגת שמרים שוקולד',
			category: 'yeast-cakes',
			price: 85,
			image: '🥐',
			description: 'עוגת שמרים עם שכבות שוקולד עשיר',
			popular: true,
		},
		{
			id: 2,
			name: 'עוגת שמרים קינמון',
			category: 'yeast-cakes',
			price: 80,
			image: '🥐',
			description: 'עוגת שמרים עם קינמון וסוכר חום',
		},
		{
			id: 3,
			name: 'עוגת שמרים גבינה',
			category: 'yeast-cakes',
			price: 90,
			image: '🥐',
			description: 'עוגת שמרים במילוי גבינה מתוקה',
			popular: true,
		},
		{
			id: 4,
			name: 'רולדת שמרים תמרים',
			category: 'yeast-cakes',
			price: 75,
			image: '🥐',
			description: 'רולדה עם ממרח תמרים ביתי',
		},
		{
			id: 5,
			name: 'עוגת שמרים פרג',
			category: 'yeast-cakes',
			price: 85,
			image: '🥐',
			description: 'עוגת שמרים עם מילוי פרג מסורתי',
		},

		// עוגות בחושות
		{
			id: 10,
			name: 'עוגת שוקולד עשירה',
			category: 'mixed-cakes',
			price: 95,
			image: '🍫',
			description: 'עוגת שוקולד כהה עשירה ולחה',
			popular: true,
		},
		{
			id: 11,
			name: 'עוגת גבינה אפויה',
			category: 'mixed-cakes',
			price: 110,
			image: '🍰',
			description: 'עוגת גבינה קרמית עם תחתית פריכה',
			popular: true,
		},
		{
			id: 12,
			name: 'עוגת גזר',
			category: 'mixed-cakes',
			price: 85,
			image: '🥕',
			description: 'עוגת גזר עם ציפוי גבינת שמנת',
		},
		{
			id: 13,
			name: 'עוגת תפוחים',
			category: 'mixed-cakes',
			price: 80,
			image: '🍎',
			description: 'עוגת תפוחים עם קינמון וקראמבל',
		},
		{
			id: 14,
			name: 'עוגת שיש',
			category: 'mixed-cakes',
			price: 75,
			image: '🍰',
			description: 'עוגת שיש וניל ושוקולד קלאסית',
		},
		{
			id: 15,
			name: 'עוגת לימון',
			category: 'mixed-cakes',
			price: 80,
			image: '🍋',
			description: 'עוגת לימון רעננה עם זיגוג',
		},

		// עוגיות
		{
			id: 20,
			name: "עוגיות שוקולד צ'יפס",
			category: 'cookies',
			price: 45,
			image: '🍪',
			description: "עוגיות עם שוקולד צ'יפס בלגי",
			popular: true,
		},
		{ id: 21, name: 'עוגיות חמאה', category: 'cookies', price: 40, image: '🍪', description: 'עוגיות חמאה פריכות קלאסיות' },
		{ id: 22, name: 'עוגיות שקדים', category: 'cookies', price: 50, image: '🥜', description: 'עוגיות שקדים פריכות' },
		{
			id: 23,
			name: 'עוגיות שיבולת שועל',
			category: 'cookies',
			price: 45,
			image: '🍪',
			description: 'עוגיות שיבולת שועל עם צימוקים',
		},
		{
			id: 24,
			name: 'עוגיות לוטוס',
			category: 'cookies',
			price: 50,
			image: '🍪',
			description: 'עוגיות עם ממרח לוטוס',
			popular: true,
		},
		{ id: 25, name: 'מקרונים', category: 'cookies', price: 60, image: '🌈', description: 'מקרונים צרפתיים בצבעים' },

		// לחמים
		{
			id: 30,
			name: 'לחם מחמצת',
			category: 'breads',
			price: 35,
			image: '🍞',
			description: 'לחם מחמצת בעבודת יד',
			popular: true,
		},
		{ id: 31, name: 'חלה מתוקה', category: 'breads', price: 30, image: '🍞', description: 'חלה מתוקה לשבת' },
		{ id: 32, name: 'לחם שיפון', category: 'breads', price: 35, image: '🍞', description: 'לחם שיפון כהה ובריא' },
		{ id: 33, name: "פוקצ'ה", category: 'breads', price: 40, image: '🫓', description: "פוקצ'ה איטלקית עם זיתים ורוזמרין" },
		{ id: 34, name: 'לחמניות', category: 'breads', price: 25, image: '🥖', description: "לחמניות רכות (6 יח')" },

		// ללא סוכר
		{
			id: 40,
			name: 'עוגת תמרים ללא סוכר',
			category: 'sugar-free',
			price: 90,
			image: '🌿',
			description: 'עוגה ממותקת בתמרים בלבד',
			popular: true,
		},
		{
			id: 41,
			name: 'עוגיות שיבולת שועל ללא סוכר',
			category: 'sugar-free',
			price: 50,
			image: '🌿',
			description: 'עוגיות בריאות עם דבש',
		},
		{
			id: 42,
			name: 'מאפינס בננה ללא סוכר',
			category: 'sugar-free',
			price: 55,
			image: '🍌',
			description: 'מאפינס ממותקים בבננה בשלה',
		},
		{
			id: 43,
			name: 'עוגת גבינה ללא סוכר',
			category: 'sugar-free',
			price: 100,
			image: '🌿',
			description: 'עוגת גבינה עם סטיביה',
		},

		// ללא גלוטן
		{
			id: 50,
			name: 'עוגת שוקולד ללא גלוטן',
			category: 'gluten-free',
			price: 100,
			image: '🌾',
			description: 'עוגת שוקולד עשירה מקמח שקדים',
			popular: true,
		},
		{
			id: 51,
			name: 'עוגיות קוקוס ללא גלוטן',
			category: 'gluten-free',
			price: 55,
			image: '🥥',
			description: 'עוגיות קוקוס פריכות',
		},
		{ id: 52, name: 'לחם ללא גלוטן', category: 'gluten-free', price: 45, image: '🍞', description: 'לחם מקמחים ללא גלוטן' },
		{
			id: 53,
			name: 'עוגת גבינה ללא גלוטן',
			category: 'gluten-free',
			price: 110,
			image: '🌾',
			description: 'עוגת גבינה עם תחתית ללא גלוטן',
		},

		// טבעוני
		{
			id: 60,
			name: 'עוגת שוקולד טבעונית',
			category: 'vegan',
			price: 95,
			image: '🌱',
			description: 'עוגת שוקולד ללא ביצים וחלב',
			popular: true,
		},
		{
			id: 61,
			name: 'עוגיות טבעוניות',
			category: 'vegan',
			price: 50,
			image: '🌱',
			description: "עוגיות שוקולד צ'יפס טבעוניות",
		},
		{ id: 62, name: 'מאפינס טבעוניים', category: 'vegan', price: 55, image: '🌱', description: 'מאפינס אוכמניות טבעוניים' },
		{ id: 63, name: 'עוגת בננה טבעונית', category: 'vegan', price: 80, image: '🍌', description: 'עוגת בננה לחה וטעימה' },
		{ id: 64, name: 'לחם טבעוני', category: 'vegan', price: 35, image: '🌱', description: 'לחם ביתי ללא מוצרי חלב' },

		// גלידות
		{
			id: 70,
			name: 'גלידת וניל',
			category: 'ice-cream',
			price: 40,
			image: '🍦',
			description: 'גלידת וניל קלאסית ביתית',
			popular: true,
		},
		{
			id: 71,
			name: 'גלידת שוקולד בלגי',
			category: 'ice-cream',
			price: 45,
			image: '🍫',
			description: 'גלידת שוקולד בלגי עשיר',
		},
		{
			id: 72,
			name: 'גלידת תות',
			category: 'ice-cream',
			price: 40,
			image: '🍓',
			description: 'גלידת תות עם פירות טריים',
			popular: true,
		},
		{ id: 73, name: 'גלידת פיסטוק', category: 'ice-cream', price: 50, image: '🟢', description: 'גלידת פיסטוק איטלקית' },
		{ id: 74, name: 'גלידת מנגו', category: 'ice-cream', price: 45, image: '🥭', description: 'גלידת מנגו טרופית' },
		{ id: 75, name: 'סורבה לימון', category: 'ice-cream', price: 40, image: '🍋', description: 'סורבה לימון מרעננת' },

		// ארוחות חלביות - פיצות
		{
			id: 80,
			name: 'פיצה מרגריטה',
			category: 'dairy-meals',
			subcategory: 'pizzas',
			price: 55,
			image: '🍕',
			description: 'פיצה עם רוטב עגבניות ומוצרלה',
			popular: true,
		},
		{
			id: 81,
			name: 'פיצה גבינות',
			category: 'dairy-meals',
			subcategory: 'pizzas',
			price: 65,
			image: '🍕',
			description: 'פיצה עם 4 סוגי גבינות',
		},
		{
			id: 82,
			name: 'פיצה זיתים ופטריות',
			category: 'dairy-meals',
			subcategory: 'pizzas',
			price: 60,
			image: '🍕',
			description: 'פיצה עם זיתים שחורים ופטריות',
		},
		{
			id: 83,
			name: 'פיצה פסטו',
			category: 'dairy-meals',
			subcategory: 'pizzas',
			price: 65,
			image: '🍕',
			description: 'פיצה עם רוטב פסטו ביתי',
		},

		// ארוחות חלביות - קישים
		{
			id: 90,
			name: 'קיש לורן',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 70,
			image: '🥧',
			description: 'קיש קלאסי עם גבינות',
			popular: true,
		},
		{
			id: 91,
			name: 'קיש תרד',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 65,
			image: '🥬',
			description: 'קיש תרד וגבינת פטה',
		},
		{
			id: 92,
			name: 'קיש בטטה',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 65,
			image: '🍠',
			description: 'קיש בטטה וגבינת עיזים',
		},
		{
			id: 93,
			name: 'קיש ירקות',
			category: 'dairy-meals',
			subcategory: 'quiches',
			price: 65,
			image: '🥦',
			description: 'קיש ירקות צבעוני',
		},

		// ארוחות חלביות - סלטים
		{
			id: 100,
			name: 'סלט יווני',
			category: 'dairy-meals',
			subcategory: 'salads',
			price: 45,
			image: '🥗',
			description: 'סלט יווני עם פטה',
			popular: true,
		},
		{
			id: 101,
			name: 'סלט קיסר',
			category: 'dairy-meals',
			subcategory: 'salads',
			price: 50,
			image: '🥗',
			description: 'סלט קיסר עם קרוטונים ופרמזן',
		},
		{
			id: 102,
			name: 'סלט קפרזה',
			category: 'dairy-meals',
			subcategory: 'salads',
			price: 50,
			image: '🍅',
			description: 'עגבניות, מוצרלה ובזיליקום',
		},
		{
			id: 103,
			name: 'סלט חלומי',
			category: 'dairy-meals',
			subcategory: 'salads',
			price: 55,
			image: '🧀',
			description: 'סלט ירוק עם גבינת חלומי צלויה',
		},

		// ארוחות חלביות - פסטות
		{
			id: 110,
			name: 'פסטה אלפרדו',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 55,
			image: '🍝',
			description: 'פסטה ברוטב שמנת ופרמזן',
			popular: true,
		},
		{
			id: 111,
			name: 'פסטה עגבניות',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 50,
			image: '🍝',
			description: 'פסטה ברוטב עגבניות ביתי',
		},
		{
			id: 112,
			name: 'פסטה פסטו',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 55,
			image: '🍝',
			description: 'פסטה ברוטב פסטו טרי',
		},
		{
			id: 113,
			name: 'לזניה',
			category: 'dairy-meals',
			subcategory: 'pastas',
			price: 65,
			image: '🍝',
			description: 'לזניה גבינות ביתית',
		},

		// ארוחות חלביות - מרקים
		{
			id: 120,
			name: 'מרק עגבניות',
			category: 'dairy-meals',
			subcategory: 'soups',
			price: 35,
			image: '🍲',
			description: 'מרק עגבניות קרמי עם בזיליקום',
		},
		{
			id: 121,
			name: 'מרק בטטה',
			category: 'dairy-meals',
			subcategory: 'soups',
			price: 35,
			image: '🍲',
			description: 'מרק בטטה קרמי',
		},
		{
			id: 122,
			name: 'מרק פטריות',
			category: 'dairy-meals',
			subcategory: 'soups',
			price: 40,
			image: '🍄',
			description: 'מרק פטריות עם שמנת',
		},
		{
			id: 123,
			name: 'מרק כרישה',
			category: 'dairy-meals',
			subcategory: 'soups',
			price: 35,
			image: '🍲',
			description: 'מרק כרישה ותפוחי אדמה',
		},
	]);

	// ===== GETTERS =====

	// Get category by ID
	const getCategoryById = computed(() => {
		return categoryId => categories.value.find(c => c.id === categoryId);
	});

	// Get products by category
	const getProductsByCategory = computed(() => {
		return categoryId => products.value.filter(p => p.category === categoryId);
	});

	// Get products by subcategory (for dairy meals)
	const getProductsBySubcategory = computed(() => {
		return subcategoryId => products.value.filter(p => p.subcategory === subcategoryId);
	});

	// Get popular products from a category (limit)
	const getPopularByCategory = computed(() => {
		return (categoryId, limit = 4) => {
			const categoryProducts = products.value.filter(p => p.category === categoryId);
			const popular = categoryProducts.filter(p => p.popular);
			const others = categoryProducts.filter(p => !p.popular);
			return [...popular, ...others].slice(0, limit);
		};
	});

	// Get all popular products
	const popularProducts = computed(() => {
		return products.value.filter(p => p.popular);
	});

	// Get preview for homepage (4-5 items from each category)
	const getCategoryPreview = computed(() => {
		return categories.value.map(category => ({
			...category,
			products: getPopularByCategory.value(category.id, 5),
		}));
	});

	// Search products
	const searchProducts = computed(() => {
		return query => {
			if (!query) return [];
			const lowerQuery = query.toLowerCase();
			return products.value.filter(p => p.name.includes(query) || p.description.includes(query));
		};
	});

	return {
		// State
		categories,
		products,
		dairySubcategories,
		// Getters
		getCategoryById,
		getProductsByCategory,
		getProductsBySubcategory,
		getPopularByCategory,
		popularProducts,
		getCategoryPreview,
		searchProducts,
	};
});

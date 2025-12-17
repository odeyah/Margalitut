import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable for scroll-triggered animations using Intersection Observer
 */
export function useScrollAnimation(options = {}) {
	const { threshold = 0.1, rootMargin = '0px', once = true } = options;

	const elementRef = ref(null);
	const isVisible = ref(false);
	let observer = null;

	onMounted(() => {
		if (!elementRef.value) return;

		observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					isVisible.value = true;
					if (once && observer) {
						observer.unobserve(entry.target);
					}
				} else if (!once) {
					isVisible.value = false;
				}
			},
			{ threshold, rootMargin },
		);

		observer.observe(elementRef.value);
	});

	onUnmounted(() => {
		if (observer) {
			observer.disconnect();
		}
	});

	return { elementRef, isVisible };
}

/**
 * Composable for staggered list animations
 */
export function useStaggerAnimation(itemCount, baseDelay = 100) {
	const getDelay = index => `${index * baseDelay}ms`;

	const getStaggerStyle = index => ({
		animationDelay: getDelay(index),
		transitionDelay: getDelay(index),
	});

	return { getDelay, getStaggerStyle };
}

/**
 * Composable for mouse-follow effects
 */
export function useMouseFollow() {
	const mouseX = ref(0);
	const mouseY = ref(0);
	const isHovering = ref(false);

	const handleMouseMove = event => {
		const rect = event.currentTarget.getBoundingClientRect();
		mouseX.value = event.clientX - rect.left;
		mouseY.value = event.clientY - rect.top;
	};

	const handleMouseEnter = () => {
		isHovering.value = true;
	};

	const handleMouseLeave = () => {
		isHovering.value = false;
	};

	return {
		mouseX,
		mouseY,
		isHovering,
		handlers: {
			onMousemove: handleMouseMove,
			onMouseenter: handleMouseEnter,
			onMouseleave: handleMouseLeave,
		},
	};
}

/**
 * Composable for parallax effects
 */
export function useParallax(speed = 0.5) {
	const scrollY = ref(0);
	const offset = ref(0);

	const handleScroll = () => {
		scrollY.value = window.scrollY;
		offset.value = scrollY.value * speed;
	};

	onMounted(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
	});

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll);
	});

	return { scrollY, offset };
}

/**
 * Composable for counting animation
 */
export function useCountAnimation(targetValue, duration = 2000) {
	const currentValue = ref(0);
	const isAnimating = ref(false);

	const startCounting = () => {
		if (isAnimating.value) return;

		isAnimating.value = true;
		const startTime = Date.now();
		const startValue = currentValue.value;

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Easing function (ease-out-cubic)
			const eased = 1 - Math.pow(1 - progress, 3);

			currentValue.value = Math.round(startValue + (targetValue - startValue) * eased);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				isAnimating.value = false;
			}
		};

		requestAnimationFrame(animate);
	};

	return { currentValue, isAnimating, startCounting };
}

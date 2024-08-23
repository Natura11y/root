import { delegateEvent } from './utilities/eventDelegation';

export default class Carousel {

	// Private properties

	#carouselList = document.querySelectorAll('.carousel');

	// Private methods
	
    // Update the slides' visibility and active state of indicators
	#updateSlides(carouselElement, currentSlide, slides, indicators) {
		slides.forEach((slide, index) => {
			const isActive = index === currentSlide;
			slide.setAttribute('aria-hidden', !isActive);
		});

		indicators.forEach((indicator, index) => {
			indicator.classList.toggle('active', index === currentSlide);
		});

		const transformValue = `translateX(-${currentSlide * 100}%)`;
		carouselElement.querySelector('.carousel__slides').style.transform = transformValue;

		this.#updateLiveRegion(carouselElement, currentSlide, slides.length);
	}

	// Move to a specific slide
	#goToSlide(carouselElement, slides, indicators, currentSlide, newIndex) {
		currentSlide = (newIndex + slides.length) % slides.length;
		this.#updateSlides(carouselElement, currentSlide, slides, indicators);
		return currentSlide;
	}

	// Initialize the live region for screen readers
	#initLiveRegion(carouselElement) {
		const liveRegion = document.createElement('div');
		liveRegion.setAttribute('aria-live', 'polite');
		liveRegion.setAttribute('aria-atomic', 'true');
		liveRegion.classList.add('liveregion', 'screen-reader-only');
		carouselElement.appendChild(liveRegion);
	}

	// Update the live region content
	#updateLiveRegion(carouselElement, currentSlide, totalSlides) {
		const liveRegion = carouselElement.querySelector('.liveregion');
		liveRegion.textContent = `Item ${currentSlide + 1} of ${totalSlides}`;
	}

	// Initialize event listeners for the carousel
	#initEventListeners(carouselElement) {
		const slides = carouselElement.querySelectorAll('.carousel__slide');
		const indicators = carouselElement.querySelectorAll('.carousel__indicator');
		let currentSlide = 0;

		delegateEvent(carouselElement, 'click', '.carousel__prev', () => {
			currentSlide = this.#goToSlide(carouselElement, slides, indicators, currentSlide, currentSlide - 1);
		});

		delegateEvent(carouselElement, 'click', '.carousel__next', () => {
			currentSlide = this.#goToSlide(carouselElement, slides, indicators, currentSlide, currentSlide + 1);
		});

		delegateEvent(carouselElement, 'click', '.carousel__indicator', (event) => {
			const newIndex = parseInt(event.target.getAttribute('data-slide'));
			currentSlide = this.#goToSlide(carouselElement, slides, indicators, currentSlide, newIndex);
		});

        carouselElement.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    currentSlide = this.#goToSlide(carouselElement, slides, indicators, currentSlide, currentSlide - 1);
                    break;
                case 'ArrowRight':
                    currentSlide = this.#goToSlide(carouselElement, slides, indicators, currentSlide, currentSlide + 1);
                    break;
                default:
                    break;
            }
        });

		this.#updateSlides(carouselElement, currentSlide, slides, indicators); // Initialize the first slide
	}

	// Public method to initialize all carousels on the page
	init() {
		this.#carouselList.forEach((carouselElement) => {
			this.#initLiveRegion(carouselElement);
			this.#initEventListeners(carouselElement);
		});
	}
}
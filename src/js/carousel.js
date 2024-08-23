import { delegateEvent } from './utilities/eventDelegation';

export default class Carousel {

  // Private properties
  #carouselList = document.querySelectorAll('.carousel');

  // Private methods
  #updateSlides(carouselElement, currentSlide, slides, indicators) {
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== currentSlide);
    });
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
    carouselElement.querySelector('.carousel__slides').style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update the live region with the current slide info
    this.#updateLiveRegion(carouselElement, currentSlide, slides.length);
  }

  #goToSlide(carouselElement, slides, indicators, currentSlide, newIndex) {
    currentSlide = (newIndex + slides.length) % slides.length;
    this.#updateSlides(carouselElement, currentSlide, slides, indicators);
    return currentSlide;
  }

  #initLiveRegion(carouselElement) {
    const liveregion = document.createElement('div');
    liveregion.setAttribute('aria-live', 'polite');
    liveregion.setAttribute('aria-atomic', 'true');
    liveregion.classList.add('liveregion', 'screen-reader-only'); // Use your existing class
    carouselElement.appendChild(liveregion);
  }

  #updateLiveRegion(carouselElement, currentSlide, totalSlides) {
    const liveregion = carouselElement.querySelector('.liveregion');
    liveregion.textContent = `Item ${currentSlide + 1} of ${totalSlides}`;
  }

  #initEventListeners(carouselElement) {
    const slides = carouselElement.querySelectorAll('.carousel__slide');
    const indicators = carouselElement.querySelectorAll('.carousel__indicator');
    let currentSlide = 0;

    // Delegate event for previous and next buttons
    delegateEvent(carouselElement, 'click', '.carousel__prev', () => {
      currentSlide = this.#goToSlide(carouselElement, slides, indicators, currentSlide, currentSlide - 1);
    });

    delegateEvent(carouselElement, 'click', '.carousel__next', () => {
      currentSlide = this.#goToSlide(carouselElement, slides, indicators, currentSlide, currentSlide + 1);
    });

    // Delegate event for indicator click
    delegateEvent(carouselElement, 'click', '.carousel__indicator', (event) => {
      currentSlide = this.#goToSlide(carouselElement, slides, indicators, currentSlide, parseInt(event.target.getAttribute('data-slide')));
    });

    // Directly add the keydown event listener since it's on the carousel level
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

    // Initialize the first slide as active
    this.#updateSlides(carouselElement, currentSlide, slides, indicators);
  }

  // Public methods
  init() {
    this.#carouselList.forEach((carouselElement) => {
      this.#initLiveRegion(carouselElement);
      this.#initEventListeners(carouselElement);
    });
  }
}
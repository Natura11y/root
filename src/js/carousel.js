import { delegateEvent } from './utilities/eventDelegation';

export default class Carousel {

  // Private properties
  #carouselElement;
  #slides;
  #prevButton;
  #nextButton;
  #indicators;
  #currentSlide = 0;

  // Private methods
  #updateSlides() {
    this.#slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== this.#currentSlide);
    });
    this.#indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.#currentSlide);
    });
    this.#carouselElement.querySelector('.carousel__slides').style.transform = `translateX(-${this.#currentSlide * 100}%)`;
    
    this.#updateLiveRegion(); // Update the live region with the current slide info
  }

  #goToSlide(index) {
    this.#currentSlide = (index + this.#slides.length) % this.#slides.length;
    this.#updateSlides();
  }

  #handlePrevClick = () => {
    this.#goToSlide(this.#currentSlide - 1);
  };

  #handleNextClick = () => {
    this.#goToSlide(this.#currentSlide + 1);
  };

  #handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        this.#goToSlide(this.#currentSlide - 1);
        break;
      case 'ArrowRight':
        this.#goToSlide(this.#currentSlide + 1);
        break;
      default:
        break;
    }
  };

  #handleIndicatorClick = (event) => {
    this.#goToSlide(parseInt(event.target.getAttribute('data-slide')));
  };

  #initLiveRegion() {
    const liveregion = document.createElement('div');
    liveregion.setAttribute('aria-live', 'polite');
    liveregion.setAttribute('aria-atomic', 'true');
    liveregion.classList.add('liveregion', 'screen-reader-only'); // Use your existing class
    this.#carouselElement.appendChild(liveregion);
  }

  #updateLiveRegion() {
    const liveregion = this.#carouselElement.querySelector('.liveregion');
    liveregion.textContent = `Item ${this.#currentSlide + 1} of ${this.#slides.length}`;
  }

  #initEventListeners() {
    if (!this.#carouselElement) return;

    this.#prevButton.addEventListener('click', this.#handlePrevClick);
    this.#nextButton.addEventListener('click', this.#handleNextClick);

    this.#indicators.forEach((indicator) => {
      indicator.addEventListener('click', this.#handleIndicatorClick);
    });

    document.addEventListener('keydown', this.#handleKeyDown);

    // Initialize the first slide as active
    this.#updateSlides();
  }

  // Public methods
  init() {
    this.#carouselElement = document.querySelector('.carousel');
    if (!this.#carouselElement) return;

    this.#slides = this.#carouselElement.querySelectorAll('.carousel__slide');
    this.#prevButton = this.#carouselElement.querySelector('.carousel__prev');
    this.#nextButton = this.#carouselElement.querySelector('.carousel__next');
    this.#indicators = this.#carouselElement.querySelectorAll('.carousel__indicator');

    this.#initLiveRegion(); // Initialize the live region
    this.#initEventListeners();
  }
}
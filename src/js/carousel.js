import { delegateEvent } from './utilities/eventDelegation';

export default class Carousel {

  // Private properties
  #carouselList = document.querySelectorAll('.carousel');
  #startX = 0;
  #currentX = 0;
  #currentSlide = 0;
  #isDragging = false;
  #isMobile = false;
  #dragThreshold = 0.05; // Sensitivity: 0.15 means 15% of the slide's width

  // Private methods
  #updateSlides(carouselElement, slides, indicators) {
    slides.forEach((slide, index) => {
      const isActive = index === this.#currentSlide;
      slide.setAttribute('aria-hidden', !isActive);
    });

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.#currentSlide);
    });

    const transformValue = `translateX(-${this.#currentSlide * 100}%)`;
    carouselElement.querySelector('.carousel__slides').style.transform = transformValue;
  }

  #goToSlide(carouselElement, slides, indicators, newIndex) {
    this.#currentSlide = (newIndex + slides.length) % slides.length;
    this.#updateSlides(carouselElement, slides, indicators);
  }

  #initLiveRegion(carouselElement) {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('liveregion', 'screen-reader-only');
    carouselElement.appendChild(liveRegion);
  }

  #handleDragStart(event) {
    this.#isDragging = true;
    this.#startX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    this.#isMobile = event.type.includes('touch'); // Detect if the interaction is on a mobile device
    if (this.#isMobile) {
      event.preventDefault(); // Prevent default touch behavior that might interfere
    }
  }

  #handleDragMove(event, carouselElement) {
    if (!this.#isDragging) return;
    this.#currentX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    const deltaX = this.#currentX - this.#startX;

    // Move the slides with the drag
    carouselElement.querySelector('.carousel__slides').style.transform = `translateX(calc(-${this.#currentSlide * 100}% + ${deltaX}px))`;
  }

  #handleDragEnd(carouselElement, slides, indicators) {
    this.#isDragging = false;
    const deltaX = this.#currentX - this.#startX;
    const slideWidth = carouselElement.offsetWidth;

    if (deltaX < -slideWidth * this.#dragThreshold && this.#currentSlide < slides.length - 1) { // Swipe left
      this.#goToSlide(carouselElement, slides, indicators, this.#currentSlide + 1);
    } else if (deltaX > slideWidth * this.#dragThreshold && this.#currentSlide > 0) { // Swipe right
      this.#goToSlide(carouselElement, slides, indicators, this.#currentSlide - 1);
    } else {
      this.#updateSlides(carouselElement, slides, indicators); // Snap back to the current slide
    }

    if (this.#isMobile) {
      // Trigger a click event manually for mobile after touch end
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      event.target.dispatchEvent(clickEvent);
    }
  }

  #initEventListeners(carouselElement) {
    const slides = carouselElement.querySelectorAll('.carousel__slide');
    const indicators = carouselElement.querySelectorAll('.carousel__indicator');
    this.#currentSlide = 0;

    carouselElement.querySelector('.carousel__prev').addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent event bubbling
      this.#goToSlide(carouselElement, slides, indicators, this.#currentSlide - 1); // Allow looping
    });

    carouselElement.querySelector('.carousel__next').addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent event bubbling
      this.#goToSlide(carouselElement, slides, indicators, this.#currentSlide + 1); // Allow looping
    });

    delegateEvent(carouselElement, 'click', '.carousel__indicator', (event) => {
      const newIndex = parseInt(event.target.getAttribute('data-slide'));
      this.#goToSlide(carouselElement, slides, indicators, newIndex);
    });

    carouselElement.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.#goToSlide(carouselElement, slides, indicators, this.#currentSlide - 1); // Allow looping
          break;
        case 'ArrowRight':
          this.#goToSlide(carouselElement, slides, indicators, this.#currentSlide + 1); // Allow looping
          break;
        default:
          break;
      }
    });

    // Prevent default dragging behavior on images
    slides.forEach(slide => {
      slide.addEventListener('dragstart', (event) => event.preventDefault());
    });

    // Drag events
    carouselElement.addEventListener('mousedown', (event) => this.#handleDragStart(event));
    carouselElement.addEventListener('mousemove', (event) => this.#handleDragMove(event, carouselElement));
    carouselElement.addEventListener('mouseup', () => this.#handleDragEnd(carouselElement, slides, indicators));

    carouselElement.addEventListener('touchstart', (event) => this.#handleDragStart(event));
    carouselElement.addEventListener('touchmove', (event) => this.#handleDragMove(event, carouselElement));
    carouselElement.addEventListener('touchend', (event) => this.#handleDragEnd(carouselElement, slides, indicators));

    this.#updateSlides(carouselElement, slides, indicators); // Initialize the first slide
  }

  // Public method to initialize all carousels on the page
  init() {
    this.#carouselList.forEach((carouselElement) => {
      this.#initLiveRegion(carouselElement);
      this.#initEventListeners(carouselElement);
    });
  }
}
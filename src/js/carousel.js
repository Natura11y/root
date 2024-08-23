import { delegateEvent } from './utilities/eventDelegation';

export default class Carousel {

  // Private properties
  #carouselList = document.querySelectorAll('.carousel');

  // Private methods
  #updateIndicators(carouselElement, indicators) {
    const slides = carouselElement.querySelectorAll('.carousel__slide');
    const scrollLeft = carouselElement.scrollLeft;
    const slideWidth = carouselElement.offsetWidth;
    const activeIndex = Math.round(scrollLeft / slideWidth);

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === activeIndex);
    });

    // Update live region
    this.#updateLiveRegion(carouselElement, activeIndex, slides.length);
  }

  #updateLiveRegion(carouselElement, currentIndex, totalSlides) {
    const liveRegion = carouselElement.querySelector('.liveregion');
    if (liveRegion) {
      liveRegion.textContent = `Item ${currentIndex + 1} of ${totalSlides}`;
    }
  }

  #initEventListeners(carouselElement) {
    const indicators = carouselElement.querySelectorAll('.carousel__indicator');
    const slides = carouselElement.querySelectorAll('.carousel__slide');

    carouselElement.querySelector('.carousel__prev').addEventListener('click', (event) => {
      event.stopPropagation();
      carouselElement.scrollBy({ left: -carouselElement.offsetWidth, behavior: 'smooth' });
    });

    carouselElement.querySelector('.carousel__next').addEventListener('click', (event) => {
      event.stopPropagation();
      carouselElement.scrollBy({ left: carouselElement.offsetWidth, behavior: 'smooth' });
    });

    delegateEvent(carouselElement, 'click', '.carousel__indicator', (event) => {
      const newIndex = parseInt(event.target.getAttribute('data-slide'));
      const slideWidth = carouselElement.offsetWidth;
      carouselElement.scrollTo({ left: newIndex * slideWidth, behavior: 'smooth' });
    });

    carouselElement.addEventListener('scroll', () => {
      this.#updateIndicators(carouselElement, indicators);
    });

    carouselElement.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          carouselElement.scrollBy({ left: -carouselElement.offsetWidth, behavior: 'smooth' });
          break;
        case 'ArrowRight':
          carouselElement.scrollBy({ left: carouselElement.offsetWidth, behavior: 'smooth' });
          break;
        default:
          break;
      }
    });
  }

  // Public methods
  init() {
    this.#carouselList.forEach((carouselElement) => {
      const slides = carouselElement.querySelectorAll('.carousel__slide');
      this.#generateIndicators(carouselElement, slides.length);
      this.#initLiveRegion(carouselElement);
      this.#initEventListeners(carouselElement);
    });
  }

  #generateIndicators(carouselElement, slideCount) {
    const indicatorContainer = carouselElement.querySelector('.carousel__indicators');
    if (!indicatorContainer) return;

    indicatorContainer.innerHTML = ''; // Clear existing indicators

    // Generate new indicators using Array.from and map
    const indicators = Array.from({ length: slideCount }).map((_, i) => {
        const listItem = document.createElement('li');
        const button = document.createElement('button');
        button.className = 'carousel__indicator';
        button.setAttribute('data-slide', i);
        if (i === 0) {
            button.classList.add('active'); // Make the first indicator active initially
        }

        listItem.appendChild(button);
        return listItem;
    });

    indicators.forEach(indicator => indicatorContainer.appendChild(indicator));
  }

  #initLiveRegion(carouselElement) {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.classList.add('liveregion', 'screen-reader-only');
    carouselElement.appendChild(liveRegion);
  }
}

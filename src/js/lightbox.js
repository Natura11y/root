import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';

export default class Lightbox {
  
  // Private properties

  #lightboxImages = document.querySelectorAll('img[data-lightbox]');

  #lightboxHTML = (`
    <div class="button-group lightbox__buttons">
      <button class="button button--icon-only" data-lightbox-previous>
        <span class="icon icon-arrow-left" aria-label="Previous" aria-hidden="true"></span>
      </button>
      <button class="button button--icon-only" data-lightbox-next>
        <span class="icon icon-arrow-right" aria-label="Next" aria-hidden="true"></span>
      </button>
      <button class="button button--icon-only" data-lightbox-close>
        <span class="icon icon-close" aria-label="Close" aria-hidden="true"></span>
      </button>
    </div>
    <figure class="lightbox__container">
      <div class="lightbox__image"></div>           
      <figcaption class="lightbox__caption">A caption for the image.</figcaption>
    </figure>
  `);

  #lightboxVideoHTML = `<video controls><source src="" type="video/mp4"></video>`;
  #lightboxElementHTML = `<img src="https://source.unsplash.com/1600x900" />`;
  
  #lightboxes = [];

  // Private methods

  #handleLightboxOpen = (image, index) => (e) => {

	const hasLightbox = document.querySelector('.lightbox');

	if (hasLightbox) return;

    e.preventDefault();

    this.lightbox = this.#createLightbox();
    
    this.currentLB = index;
    
    handleOverlayOpen(this.lightbox);
    
    this.#updateLightbox(index);
  };

  #handleLightboxClose = (e) => {
    e.stopPropagation();

    if (e.target !== e.currentTarget && e.type === 'click') return;

    handleOverlayClose(this.lightbox);
    
    this.lightbox.parentElement.removeChild(this.lightbox);

    window.removeEventListener('keyup', this.#handleLightboxUpdateKey);
  };

  #handleLightboxUpdateClick = (e) => {
    e.preventDefault();

    if (e.target.hasAttribute('data-lightbox-previous')) {
      this.#updateDirection(-1);
    } else if (e.target.hasAttribute('data-lightbox-next')) {
      this.#updateDirection(1);
    } else {
      return;
    }
  };

  #handleLightboxUpdateKey = (e) => {
    e.preventDefault();

    switch (e.code) {
      case 'ArrowLeft':
        this.#updateDirection(-1);
        this.lightbox.querySelector('[data-lightbox-previous]').focus();
        break;
      case 'ArrowRight':
        this.#updateDirection(1);
        this.lightbox.querySelector('[data-lightbox-next]').focus();
        break;
      case 'Escape':
        this.#handleLightboxClose(e);
        break;
      default:
        return;
    }
  };

  #updateDirection(dir) {
    this.currentLB += dir;

    if (this.currentLB < 0) {
      this.currentLB = this.#lightboxes.length - 1;
    } else if (this.currentLB >= this.#lightboxes.length) {
      this.currentLB = 0;
    }
    
    this.#updateLightbox(this.currentLB);
  }

  #updateLightbox(index) {
    const lightboxElement = this.lightbox.querySelector('.lightbox__image');
    const lightboxCaption = this.lightbox.querySelector('.lightbox__caption');

    let lightboxElementTarget;

    if (this.#lightboxes[index].imgType === 'video') {
      lightboxElement.innerHTML = this.#lightboxVideoHTML;
      lightboxElementTarget = lightboxElement.querySelector('source');
    } else {
      lightboxElement.innerHTML = this.#lightboxElementHTML;
      lightboxElementTarget = lightboxElement.querySelector('img');
      lightboxElementTarget.alt = this.#lightboxes[index].imgAlt;
    }

    lightboxElementTarget.src = this.#lightboxes[index].imgSrc;
    lightboxCaption.innerHTML = this.#lightboxes[index].imgCaption;

    if (this.#lightboxes[index].imgWidth) {
      lightboxElementTarget.setAttribute('width', this.#lightboxes[index].imgWidth);
    }
  }

  #createLightbox() {
    const lightbox = document.createElement('div');

    lightbox.classList.add('lightbox');
    lightbox.setAttribute('aria-hidden', true);
    lightbox.innerHTML = this.#lightboxHTML;

    document.body.appendChild(lightbox);

    const lightboxPrevious = lightbox.querySelector('[data-lightbox-previous]');
    const lightboxNext = lightbox.querySelector('[data-lightbox-next]');
    const lightboxClose = lightbox.querySelector('[data-lightbox-close]');

    lightbox.querySelector('.lightbox__image').classList.add('box-shadow-3');
    lightbox.addEventListener('click', this.#handleLightboxClose);
    lightboxClose.addEventListener('click', this.#handleLightboxClose);

    lightboxPrevious.addEventListener('click', this.#handleLightboxUpdateClick);
    lightboxNext.addEventListener('click', this.#handleLightboxUpdateClick);

    window.addEventListener('keyup', this.#handleLightboxUpdateKey);

    return lightbox;
  }

  #configureLightboxElements() {
    this.#lightboxImages.forEach((image, index) => {
      const wrapper = document.createElement('button');
      wrapper.setAttribute('class', 'lightbox-element');
      this.#wrapWithButton(image, wrapper);
      this.#lightboxes.push(this.#setImgProperties(image));
    });
  }

  #wrapWithButton(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }

  #setImgProperties(image) {
    const lbType = image.getAttribute('data-lightbox') || 'image';
    const lbSrc = image.getAttribute('data-lightbox-src') || image.src || null;
    const lbCaption = image.getAttribute('data-lightbox-caption') || image.alt || null;
    const lbAlt = image.getAttribute('data-lightbox-alt') || image.alt || '';
    const lbWidth = image.getAttribute('data-lightbox-width') || null;

    return {
      imgType: lbType,
      imgSrc: lbSrc,
      imgCaption: lbCaption,
      imgAlt: lbAlt,
      imgWidth: lbWidth,
    };
  }

  #initLazyLoading() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          observer.unobserve(lazyImage);

          // Create and load hidden large image
          const hiddenLargeImage = new Image();
          hiddenLargeImage.src = lazyImage.dataset.lightboxSrc || lazyImage.src;
          hiddenLargeImage.style.display = 'none';

          document.body.appendChild(hiddenLargeImage);
          
		      this.#lightboxes[Number(lazyImage.dataset.index)].hiddenImage = hiddenLargeImage;
        }
      });
    }, options);

    this.#lightboxImages.forEach((image, index) => {
      image.dataset.index = index;
      observer.observe(image);
    });
  }

  #initEventListeners() {
    this.#lightboxImages.forEach((image, index) => {
      const imageBtn = image.closest('button');
      imageBtn.addEventListener('click', this.#handleLightboxOpen(image, index));
    });
  }

  // Public methods

  init() {

    this.#configureLightboxElements();
    this.#initEventListeners();
    this.#initLazyLoading();
    
  }
}
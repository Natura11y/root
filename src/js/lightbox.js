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
      <div class="lightbox__media"></div>           
      <figcaption class="lightbox__caption">A caption for the image.</figcaption>
    </figure>
  `);

  #lightboxVideoHTML = (`
    <video controls>
      <source type="video/mp4">
    </video>
  `);
  
  #lightboxElementHTML = `<img src="https://source.unsplash.com/1600x900" />`;
  
  #lightboxes = [];

  // Private methods

  #handleLightboxOpen = (image, index) => (e) => {

    const lbTybe = image.getAttribute('data-lightbox') || 'image';

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

    const lightboxElement = this.lightbox.querySelector('.lightbox__media');
    const lightboxCaption = this.lightbox.querySelector('.lightbox__caption');

    let lightboxElementTarget;

    // Extract lightbox object data into variables
    const { lbType, lbSrc, lbAlt, lbCaption, lbWidth } = this.#lightboxes[index];

    switch (lbType) {

      case 'image':
        // Call image update function
        lightboxElementTarget = this.#updateLightboxImage(lightboxElement, lbSrc, lbAlt, lbWidth);
        break;

      case 'video':
        // Call video update function
        lightboxElementTarget = this.#updateLightboxVideo(lightboxElement, lbSrc);
        break;
    
      default:
        break;
    }

    lightboxCaption.innerHTML = lbCaption;
  }

  #updateLightboxImage(lightboxElement, lbSrc, lbAlt, lbWidth) {

    if (lightboxElement.hasAttribute('style')) {
      lightboxElement.removeAttribute('style');
    }

    lightboxElement.innerHTML = this.#lightboxElementHTML;

    const loader = this.#createLoader();
    lightboxElement.appendChild(loader);
  
    const lightboxElementTarget = lightboxElement.querySelector('img');
  
    lightboxElementTarget.alt = lbAlt;
    lightboxElementTarget.src = lbSrc;

    this.#handleMediaLoading(lightboxElementTarget, loader);

    if (lbWidth) {
      lightboxElementTarget.setAttribute('width', lbWidth);
    }

    return lightboxElementTarget;
  }

  #updateLightboxVideo(lightboxElement, lbSrc) {
  
    lightboxElement.innerHTML = this.#lightboxVideoHTML;

    const loader = this.#createLoader();
    lightboxElement.appendChild(loader);
  
    const lightboxElementTarget = lightboxElement.querySelector('source');
    const video = lightboxElement.querySelector('video');

    video.addEventListener('loadedmetadata', () => {
      // The intrinsic width and height of the video
      let intrinsicWidth = video.videoWidth;
      let intrinsicHeight = video.videoHeight;

      // The aspect ratio of the video
      lightboxElement.style.maxWidth = `${intrinsicWidth}px`;
      lightboxElement.style.aspectRatio = `${intrinsicWidth} / ${intrinsicHeight}`;
    });

    this.#handleMediaLoading(lightboxElementTarget, loader);

    lightboxElementTarget.src = lbSrc;

    return lightboxElementTarget;
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
      wrapper.setAttribute('class', 'lightbox-button');
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
      lbType: lbType,
      lbSrc: lbSrc,
      lbCaption: lbCaption,
      lbAlt: lbAlt,
      lbWidth: lbWidth,
    };
  }

  #createLoader = () => {

    const loader = document.createElement('div');
  
    loader.className = 'loader';
    loader.innerHTML = `
      <span class="icon icon-loading icon--rotate" aria-hidden="true"></span>
      <p class="error-message" style="display: none;">Failed to load content. Please try again later.</p>
    `;
    return loader;
  };

  #handleMediaLoading = (media, loader) => {
    const mediaLoadEvent = media.nodeName === 'SOURCE' ? 'loadeddata' : 'load';

    media.closest(media.nodeName === 'SOURCE' ? 'video' : 'img').addEventListener(mediaLoadEvent, () => {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    });

    media.onerror = () => {
      const loaderIcon = loader.querySelector('.icon-loading');
      const errorMessage = loader.querySelector('.error-message');
    
      // Hide the media on error
      media.style.display = 'none';

      loaderIcon.style.display = 'none';
      errorMessage.style.display = 'block';
    };
  };

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

    // Filter out video elements before observing
    const lazyImages = Array.from(this.#lightboxImages).filter(img => img.getAttribute('data-lightbox') === 'image');

    lazyImages.forEach((image, index) => {
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
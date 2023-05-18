import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';

// Lightbox
export default class Lightbox {
  #lightboxImages = document.querySelectorAll('img[data-lightbox]');
  
  #lightboxHTML = `
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
  `;
  #lightboxVideoHTML = '<video controls><source src="" type="video/mp4"></video>';
  #lightboxElementHTML = '<img src="https://source.unsplash.com/1600x900" />';
  
  init() {
    if (!this.#lightboxImages.length) return;

    const wrap = (el, wrapper) => {
      if (el && el.parentNode) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
      }
    };

    let lightboxes = [];
    let currentLB;

    this.#lightboxImages.forEach((image, index) => {
      const wrapper = document.createElement('button');
      wrapper.setAttribute('class', 'lightbox-element');

      wrap(image, wrapper);

      const setImgType = () => image.getAttribute('data-lightbox') === 'video' ? 'video' : 'image';
      const setImgSrc = () => image.getAttribute('data-lightbox-src') || image.src || null;
      const setImgCaption = () => image.getAttribute('data-lightbox-caption') || image.alt || null;
      const setImgAlt = () => image.getAttribute('data-lightbox-alt') || image.alt || '';
      const setlbWidth = () => image.getAttribute('data-lightbox-width') || null;

      lightboxes.push({
        imgType: setImgType(),
        imgSrc: setImgSrc(),
        imgCaption: setImgCaption(),
        imgAlt: setImgAlt(),
        imgWidth: setlbWidth()
      });

      const imageBtn = image.closest('button');

      imageBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const handleLightboxUpdate = (e) => {
          const directionalFocus = (dir) => {
            e.preventDefault();

            currentLB = parseInt(currentLB) + dir;

            if (dir === -1 && currentLB < 0) {
              currentLB = lightboxes.length - 1;
            } else if (dir === 1 && currentLB >= lightboxes.length) {
              currentLB = 0;
            }

            updateLighbox(currentLB);
          };

          if (e.target.hasAttribute('data-lightbox-previous')) directionalFocus(-1);
          if (e.target.hasAttribute('data-lightbox-next')) directionalFocus(1);

          switch (e.code) {
            case 'ArrowLeft':
              directionalFocus(-1);
              break;
            case 'ArrowRight':
              directionalFocus(1);
              break;
            default:
              // do nothing
          }
        };

        const updateLighbox = (current) => {
          let lightboxElementTarget = null;

          if (lightboxes[current].imgType === 'video') {
            lightboxElement.innerHTML = this.#lightboxVideoHTML;
            lightboxElementTarget = lightboxElement.querySelector('source');
          } else {
            lightboxElement.innerHTML = this.#lightboxElementHTML;

            lightboxElementTarget = lightboxElement.querySelector('img');
            lightboxElementTarget.alt = lightboxes[current].imgAlt;
          }

          lightboxElementTarget.src = lightboxes[current].imgSrc;
          lightboxCaption.innerHTML = lightboxes[current].imgCaption;

          if (lightboxes[current].imgWidth !== null) {
            lightboxElementTarget.setAttribute('width', lightboxes[current].imgWidth);
          }
        };

        const handleLightboxClose = (e) => {
          if (e.target !== e.currentTarget) return;
          handleOverlayClose(lightbox);
          document.body.removeChild(lightbox);
          window.removeEventListener('keyup', handleLightboxUpdate);
        }

        let lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.setAttribute('aria-hidden', true);
        lightbox.innerHTML = this.#lightboxHTML;
        document.body.appendChild(lightbox);
        
        const lightboxPrevious = lightbox.querySelector('[data-lightbox-previous]'); 
        const lightboxNext = lightbox.querySelector('[data-lightbox-next]'); 
        const lightboxClose = lightbox.querySelector('[data-lightbox-close]');
        const lightboxElement = lightbox.querySelector('.lightbox__image');
        const lightboxCaption = lightbox.querySelector('.lightbox__caption');
        
        lightboxElement.classList.add('box-shadow-3');
        lightboxClose.addEventListener('click', handleLightboxClose);
        lightbox.addEventListener('click', handleLightboxClose);
        lightboxPrevious.addEventListener('click', handleLightboxUpdate);
        lightboxNext.addEventListener('click', handleLightboxUpdate);

        currentLB = index;
        handleOverlayOpen(lightbox);
        updateLighbox(index);
        window.addEventListener('keyup', handleLightboxUpdate);
      });
    });
  }
}
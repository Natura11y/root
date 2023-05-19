import { handleOverlayOpen, handleOverlayClose } from './utilities/overlay';

//////////////////////////////////////////////
// Lightbox
//////////////////////////////////////////////

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

	#lightboxVideoHTML = `<video controls><source src="" type="video/mp4"></video>`;
	#lightboxElementHTML = `<img src="https://source.unsplash.com/1600x900" />`;

	#lightboxes = [];

	init() {
		this.configureLightboxElements();
		this.initEventListeners();
	}

	configureLightboxElements() {
		this.#lightboxImages.forEach((image, index) => {
			const wrapper = document.createElement('button');
			wrapper.setAttribute('class', 'lightbox-element');
			this.wrap(image, wrapper);
			this.#lightboxes.push(this.setImgProperties(image));
		});
	}

	initEventListeners() {
		this.#lightboxImages.forEach((image, index) => {
			const imageBtn = image.closest('button');
			imageBtn.addEventListener('click', this.handleClick(image, index));
		});
	}

	wrap = (el, wrapper) => {
		el.parentNode.insertBefore(wrapper, el);
		wrapper.appendChild(el);
	};

	setImgProperties = (image) => {
		const lbType = image.getAttribute('data-lightbox') || 'image';
		const lbSrc = image.getAttribute('data-lightbox-src') || image.src || null;
		const lbCaption =
			image.getAttribute('data-lightbox-caption') || image.alt || null;
		const lbAlt = image.getAttribute('data-lightbox-alt') || image.alt || '';
		const lbWidth = image.getAttribute('data-lightbox-width') || null;

		return {
			imgType: lbType,
			imgSrc: lbSrc,
			imgCaption: lbCaption,
			imgAlt: lbAlt,
			imgWidth: lbWidth,
		};
	};

	handleClick = (image, index) => (e) => {
		e.preventDefault();
		this.lightbox = this.createLightbox();
		this.currentLB = index;
		handleOverlayOpen(this.lightbox);
		this.updateLightbox(index);
		window.addEventListener('keyup', this.handleLightboxUpdate);
	};

	handleLightboxClose = (e) => {
		if (e.target !== e.currentTarget) return;
		handleOverlayClose(this.lightbox);
		document.body.removeChild(this.lightbox);
		this.removeLightboxUpdateHandler();
	};

	handleLightboxUpdate = (e) => {
		e.preventDefault();

		let dir;
		switch (e.code) {
			case 'ArrowLeft':
				dir = -1;
				document.querySelector('[data-lightbox-previous]').focus();
				break;
			case 'ArrowRight':
				dir = 1;
				document.querySelector('[data-lightbox-next]').focus();
				break;
			default:
				return;
		}
		this.updateDirection(dir);
	};

	removeLightboxUpdateHandler() {
		window.removeEventListener('keyup', this.handleLightboxUpdate);
	}

	handleNextPrevious = (e) => {
		let dir;
		if (e.target.hasAttribute('data-lightbox-previous')) {
			dir = -1;
		} else if (e.target.hasAttribute('data-lightbox-next')) {
			dir = 1;
		}
		this.updateDirection(dir);
		e.preventDefault();
	};

	updateLightbox = (index) => {
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
			lightboxElementTarget.setAttribute(
				'width',
				this.#lightboxes[index].imgWidth
			);
		}
	};

	updateDirection = (dir) => {
		this.currentLB += dir;
		if (this.currentLB < 0) {
			this.currentLB = this.#lightboxes.length - 1;
		} else if (this.currentLB >= this.#lightboxes.length) {
			this.currentLB = 0;
		}
		this.updateLightbox(this.currentLB);
	};

	createLightbox = () => {
		const lightbox = document.createElement('div');
		lightbox.classList.add('lightbox');
		lightbox.setAttribute('aria-hidden', true);
		lightbox.innerHTML = this.#lightboxHTML;

		document.body.appendChild(lightbox);

		const lightboxPrevious = lightbox.querySelector('[data-lightbox-previous]');
		const lightboxNext = lightbox.querySelector('[data-lightbox-next]');
		const lightboxClose = lightbox.querySelector('[data-lightbox-close]');

		lightbox.querySelector('.lightbox__image').classList.add('box-shadow-3');
		lightboxClose.addEventListener('click', this.handleLightboxClose);
		lightbox.addEventListener('click', this.handleLightboxClose);

		lightboxPrevious.addEventListener('click', this.handleNextPrevious);
		lightboxNext.addEventListener('click', this.handleNextPrevious);

		return lightbox;
	};
}
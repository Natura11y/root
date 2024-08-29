import { delegateEvent } from './utilities/eventDelegation';

export default class Track {

    // Private properties
    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null;

    // Private methods

    #getVisiblePanels(trackElement) {
        return parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
    }


    #getTotalPages(trackPanels, visiblePanels) {
        return Math.ceil(trackPanels.children.length / visiblePanels);
    }

    #calculateEffectiveWidth(trackContainer) {
        const panelPeeking = parseFloat(getComputedStyle(trackContainer).getPropertyValue('--panel-peaking')) || 0;
        return trackContainer.offsetWidth - panelPeeking;
    }

    #scrollByAmount(trackContainer, amount) {
        trackContainer.scrollBy({ left: amount, behavior: 'smooth' });
    }

    #scrollToPosition(trackContainer, position) {
        trackContainer.scrollTo({ left: position, behavior: 'smooth' });
        this.#updatePagination(trackContainer.closest('.track'));
    }

    #calculateTotalPages(trackContainer) {
        console.log('visiblePanels', this.#getVisiblePanels(trackContainer));
        console.log('totalPages', this.#getTotalPages(trackContainer, this.#getVisiblePanels(trackContainer)));
        
        const effectiveWidth = this.#calculateEffectiveWidth(trackContainer);
        return Math.ceil(trackContainer.scrollWidth / effectiveWidth);

    }

    #generatePagination(trackElement) {
        const totalPages = this.#calculateTotalPages(trackElement.querySelector('.track__panels'));
        const paginationContainer = trackElement.querySelector('.track__pagination');

        if (!paginationContainer) return;

        if (paginationContainer.childElementCount !== totalPages) {
            paginationContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `
                <li>
                    <button class="track__pagination__item" data-item="${i}" aria-label="Page ${i + 1}" ${i === 0 ? 'class="active" aria-current="true"' : ''}></button>
                </li>
            `).join('');
        }

        return totalPages;
    }

    #updatePagination(trackElement) {
        const trackContainer = trackElement.querySelector('.track__panels');
        const paginationItems = trackElement.querySelectorAll('.track__pagination__item');
        const effectiveWidth = this.#calculateEffectiveWidth(trackContainer);
        const activeIndex = Math.min(Math.max(Math.round(trackContainer.scrollLeft / effectiveWidth), 0), paginationItems.length - 1);

        paginationItems.forEach((item, index) => {
            const isActive = index === activeIndex;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-current', isActive);
        });

        this.#updateLiveRegion(trackElement, activeIndex, paginationItems.length);
    }

    #resetPagination(trackElement) {
        const totalPages = this.#generatePagination(trackElement);
        const trackContainer = trackElement.querySelector('.track__panels');
        // const paginationItems = trackElement.querySelectorAll('.track__pagination__item');

        this.#updatePagination(trackElement);

        if (totalPages === 1) {
            trackElement.classList.add('hide-controls');
        } else {
            trackElement.classList.remove('hide-controls');
        }
    }

    #initEventListeners(trackElement) {
        const trackContainer = trackElement.querySelector('.track__panels');
        const prevButton = trackElement.querySelector('.track__prev');
        const nextButton = trackElement.querySelector('.track__next');
        const scrollAmount = this.#calculateEffectiveWidth(trackContainer);

        prevButton?.addEventListener('click', () => this.#scrollByAmount(trackContainer, -scrollAmount));
        nextButton?.addEventListener('click', () => this.#scrollByAmount(trackContainer, scrollAmount));

        delegateEvent(trackElement, 'click', '.track__pagination__item', (event) => {
            const newIndex = parseInt(event.target.getAttribute('data-item'));
            this.#scrollToPosition(trackContainer, newIndex * scrollAmount);
        });

        trackContainer.addEventListener('scroll', () => {
            clearTimeout(this.#scrollTimeout);
            this.#scrollTimeout = setTimeout(() => this.#updatePagination(trackElement), 75);
        });

        trackElement.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.#scrollByAmount(trackContainer, -scrollAmount);
            } else if (event.key === 'ArrowRight') {
                this.#scrollByAmount(trackContainer, scrollAmount);
            }
        });

        window.addEventListener('resize', () => this.#resetPagination(trackElement));
    }

    #initLiveRegion(trackElement) {
        const liveRegion = document.createElement('div');
        liveRegion.className = 'liveregion screen-reader-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        trackElement.appendChild(liveRegion);
    }

    #updateLiveRegion(trackElement, currentIndex, totalPages) {
        const liveRegion = trackElement.querySelector('.liveregion');
        if (liveRegion) {
            liveRegion.textContent = `Page ${currentIndex + 1} of ${totalPages}`;
        }
    }

    // Public methods

    init() {
        this.#trackList.forEach(trackElement => {
            this.#resetPagination(trackElement);
            this.#initLiveRegion(trackElement);
            this.#initEventListeners(trackElement);
        });
    }
}
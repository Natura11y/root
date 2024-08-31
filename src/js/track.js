import { delegateEvent } from './utilities/eventDelegation';

export default class Track {

    // Private properties
    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null;

    // Private methods

    #getVisiblePanels(trackElement) {
        return parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
    }

    #getPeekingAmount(trackElement) {
        return parseFloat(getComputedStyle(trackElement).getPropertyValue('--_peaking')) || 0;
    }

    #getTotalPages(trackContainer) {
        const visiblePanels = this.#getVisiblePanels(trackContainer);
        const totalPanels = trackContainer.children.length;
        return Math.ceil(totalPanels / visiblePanels);
    }

    #scrollByAmount(trackContainer, amount) {
        trackContainer.scrollBy({ left: amount, behavior: 'smooth' });
    }

    #scrollToPosition(trackContainer, position) {
        trackContainer.scrollTo({ left: position, behavior: 'smooth' });
        this.#updatePagination(trackContainer.closest('.track'));
    }

    #generatePagination(trackElement) {
        const totalPages = this.#getTotalPages(trackElement.querySelector('.track__panels'));
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
        const scrollPosition = trackContainer.scrollLeft;

        // Calculate the width of a single panel
        const panelWidth = trackContainer.scrollWidth / trackContainer.children.length;
        const visiblePanels = this.#getVisiblePanels(trackContainer);
        const activeIndex = Math.round(scrollPosition / (panelWidth * visiblePanels));

        paginationItems.forEach((item, index) => {
            const isActive = index === activeIndex;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-current', isActive);
        });

        this.#updateLiveRegion(trackElement, activeIndex, paginationItems.length);
    }

    #resetPagination(trackElement) {
        const trackContainer = trackElement.querySelector('.track__panels');
        const peekingAmount = this.#getPeekingAmount(trackContainer);
        const scrollAmount = trackContainer.offsetWidth - peekingAmount;
        const currentIndex = Math.round(trackContainer.scrollLeft / scrollAmount);

        console.log('peakingAmount', peekingAmount);

        // Regenerate pagination based on the new visible panels count
        const totalPages = this.#generatePagination(trackElement);

        // Update pagination display based on the current scroll position
        this.#scrollToPosition(trackContainer, currentIndex * scrollAmount);

        // Toggle control visibility based on the number of pages
        trackElement.classList.toggle('hide-controls', totalPages === 1);
    }

    #initEventListeners(trackElement) {
        const trackContainer = trackElement.querySelector('.track__panels');

        let peekingAmount = this.#getPeekingAmount(trackContainer.closest('.track'));
        let scrollAmount = trackContainer.offsetWidth - peekingAmount;

        // Scroll by the calculated amount on button click
        trackElement.querySelector('.track__prev')?.addEventListener('click', () => this.#scrollByAmount(trackContainer, -scrollAmount));
        trackElement.querySelector('.track__next')?.addEventListener('click', () => this.#scrollByAmount(trackContainer, scrollAmount));

        // Delegate pagination item clicks
        delegateEvent(trackElement, 'click', '.track__pagination__item', (event) => {
            const newIndex = parseInt(event.target.getAttribute('data-item'));
            this.#scrollToPosition(trackContainer, newIndex * scrollAmount);
        });

        // Update pagination on scroll, throttled to prevent excessive updates
        trackContainer.addEventListener('scroll', () => {
            clearTimeout(this.#scrollTimeout); 
            this.#scrollTimeout = setTimeout(() => this.#updatePagination(trackElement), 75);
        });
        
        // Handle keyboard navigation
        trackElement.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.#scrollByAmount(trackContainer, -scrollAmount);
            } else if (event.key === 'ArrowRight') {
                this.#scrollByAmount(trackContainer, scrollAmount);
            }
        });

        // Recalculate pagination on window resize
        window.addEventListener('resize', () => {
            peekingAmount = this.#getPeekingAmount(trackContainer.closest('.track'));
            scrollAmount = trackContainer.offsetWidth - peekingAmount;
            this.#resetPagination(trackElement);
        });
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

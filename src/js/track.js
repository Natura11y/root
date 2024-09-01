export default class Track {

    #trackList = document.querySelectorAll('.track');

    // Private methods

    #getVisiblePanels(trackElement) {
        return parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
    }

    #getTotalPages(trackPanels) {
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const totalPanels = trackPanels.children.length;
        return Math.ceil(totalPanels / visiblePanels);
    }

    #generatePagination(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const totalPages = this.#getTotalPages(trackPanels);
        const paginationContainer = trackElement.querySelector('.track__pagination');

        if (!paginationContainer) return;

        paginationContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <li>
                <button
                    class="track__pagination__item ${i === 0 ? 'active' : ''}"
                    data-item="${i}"
                    aria-label="Page ${i + 1}"
                    ${i === 0 ? 'aria-current="true"' : ''}
                ></button>
            </li>
        `).join('');
    }

    #updatePagination(trackElement, activeIndex) {
        const paginationItems = trackElement.querySelectorAll('.track__pagination__item');
        paginationItems.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
            item.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
        });
    }

    #scrollToPage(trackElement, pageIndex) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const panelWidth = trackPanels.children[0].offsetWidth;
        const targetScrollLeft = pageIndex * panelWidth * visiblePanels;

        trackPanels.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        this.#updatePagination(trackElement, pageIndex);
    }

    #getCurrentPageIndex(trackPanels) {
        const scrollLeft = trackPanels.scrollLeft;
        const visiblePanels = this.#getVisiblePanels(trackPanels);
        const panelWidth = trackPanels.children[0].offsetWidth;
        return Math.round(scrollLeft / (panelWidth * visiblePanels));
    }

    #resetTrack(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        const paginationContainer = trackElement.querySelector('.track__pagination');

        paginationContainer.innerHTML = '';
        trackPanels.scrollLeft = 0;

        this.#generatePagination(trackElement);
    }

    #initEventListeners(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');

        trackElement.querySelector('.track__pagination').addEventListener('click', (event) => {
            if (event.target.closest('.track__pagination__item')) {
                const newIndex = parseInt(event.target.getAttribute('data-item'));
                this.#scrollToPage(trackElement, newIndex);
            }
        });

        trackElement.querySelector('.track__prev')?.addEventListener('click', () => {
            const currentIndex = this.#getCurrentPageIndex(trackPanels);
            if (currentIndex > 0) {
                this.#scrollToPage(trackElement, currentIndex - 1);
            }
        });

        trackElement.querySelector('.track__next')?.addEventListener('click', () => {
            const currentIndex = this.#getCurrentPageIndex(trackPanels);
            const totalPages = this.#getTotalPages(trackPanels);
            if (currentIndex < totalPages - 1) {
                this.#scrollToPage(trackElement, currentIndex + 1);
            }
        });

        window.addEventListener('resize', () => {
            this.#resetTrack(trackElement);
        });
    }

    // Public methods

    init() {
        this.#trackList.forEach(trackElement => {
            this.#resetTrack(trackElement);
            this.#initEventListeners(trackElement);
        });
    }
}

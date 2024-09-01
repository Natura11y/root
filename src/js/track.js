import { delegateEvent } from './utilities/eventDelegation';

export default class Track {

    #trackList = document.querySelectorAll('.track');
    #scrollTimeout = null;

    #getVisiblePanels(trackElement) {
        return parseInt(getComputedStyle(trackElement).getPropertyValue('--visible-panels'), 10) || 1;
    }

    #getTotalPages(trackContainer) {
        const visiblePanels = this.#getVisiblePanels(trackContainer);
        const totalPanels = trackContainer.children.length;
        return Math.ceil(totalPanels / visiblePanels);
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

    #updatePagination(paginationItems, activeIndex) {
        paginationItems.forEach((item, index) => {
            const isActive = index === activeIndex;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-current', isActive ? "true" : "false");
        });
    }

    #observePanels(trackElement) {
        const panels = trackElement.querySelectorAll('.track__panel');
        const paginationItems = trackElement.querySelectorAll('.track__pagination__item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const visibleIndex = Array.from(panels).indexOf(entry.target);
                    const visiblePanels = this.#getVisiblePanels(trackElement);
                    const activePage = Math.floor(visibleIndex / visiblePanels);
                    this.#updatePagination(paginationItems, activePage);
                }
            });
        }, { threshold: 0.5 });

        panels.forEach(panel => observer.observe(panel));
    }

    #initEventListeners(trackElement) {
        const trackContainer = trackElement.querySelector('.track__panels');
        const paginationItems = trackElement.querySelectorAll('.track__pagination__item');
        const visiblePanels = this.#getVisiblePanels(trackContainer);

        paginationItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const targetPanel = trackContainer.children[index * visiblePanels];
                targetPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            });
        });

        window.addEventListener('resize', () => {
            this.#observePanels(trackElement);
        });
    }

    init() {
        this.#trackList.forEach(trackElement => {
            this.#generatePagination(trackElement);
            this.#observePanels(trackElement);
            this.#initEventListeners(trackElement);
        });
    }
}

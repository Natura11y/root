import { delegateEvent } from './utilities/eventDelegation';

export default class Track {

    // Private properties
    #trackList = document.querySelectorAll('.track');

    // Private methods

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

    #scrollByAmount(trackContainer, direction) {
        const containerWidth = trackContainer.offsetWidth;
        trackContainer.scrollBy({ left: direction * containerWidth, behavior: 'smooth' });
    }

    #initEventListeners(trackElement) {
        const trackContainer = trackElement.querySelector('.track__panels');
        
        // Use event delegation for pagination clicks
        delegateEvent(trackElement, 'click', '.track__pagination__item', (event) => {
            const newIndex = parseInt(event.target.getAttribute('data-item'));
            const visiblePanels = this.#getVisiblePanels(trackContainer);
            const targetPanelIndex = newIndex * visiblePanels;

            // Ensure the target panel index is within bounds
            if (targetPanelIndex >= 0 && targetPanelIndex < trackContainer.children.length) {
                const targetPanel = trackContainer.children[targetPanelIndex];
                targetPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            } else {
                console.error(`Invalid target panel index: ${targetPanelIndex}`);
            }
        });

        // Handle Previous and Next Buttons
        trackElement.querySelector('.track__prev')?.addEventListener('click', () => {
            this.#scrollByAmount(trackContainer, -1);
        });
        trackElement.querySelector('.track__next')?.addEventListener('click', () => {
            this.#scrollByAmount(trackContainer, 1);
        });

        // Recalculate everything on window resize
        window.addEventListener('resize', () => {
            this.#reset(trackElement);
        });
    }

    #reset(trackElement) {
        const paginationContainer = trackElement.querySelector('.track__pagination');
        const trackContainer = trackElement.querySelector('.track__panels');

        // Clear existing observers and pagination
        paginationContainer.innerHTML = '';
        trackContainer.scrollLeft = 0;

        // Re-generate and re-apply everything
        this.#generatePagination(trackElement);
        this.#observePanels(trackElement);
    }

    // Public methods

    init() {
        this.#trackList.forEach(trackElement => {
            this.#reset(trackElement);  // Initialize everything
            this.#initEventListeners(trackElement);  // Setup event listeners
        });
    }
}

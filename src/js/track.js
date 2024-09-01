import { delegateEvent } from './utilities/eventDelegation';

export default class Track {

    // Private properties
    #trackList = document.querySelectorAll('.track');
    #observers = new WeakMap(); // Store observers for each track element

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
        const totalPages = this.#getTotalPages(trackElement.querySelector('.track__panels'));
        const paginationContainer = trackElement.querySelector('.track__pagination');

        if (!paginationContainer) return;

        if (paginationContainer.childElementCount !== totalPages) {
            paginationContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `
                <li>
                    <button
                        class="track__pagination__item"
                        data-item="${i}"
                        aria-label="Page ${i + 1}" ${i === 0 ? 'class="active" aria-current="true"' : ''}
                    ></button>
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

        // Disconnect any existing observer for this element before creating a new one
        const existingObserver = this.#observers.get(trackElement);

        if (existingObserver) {
            existingObserver.disconnect();
        }

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

        // Store the observer so it can be disconnected later if necessary
        this.#observers.set(trackElement, observer);
    }

    #scrollByAmount(trackPanels, direction) {
        const containerWidth = trackPanels.offsetWidth;
        trackPanels.scrollBy({ left: direction * containerWidth, behavior: 'smooth' });
    }

    #resetTrack(trackElement) {
        const paginationContainer = trackElement.querySelector('.track__pagination');
        const trackPanels = trackElement.querySelector('.track__panels');

        paginationContainer.innerHTML = '';
        trackPanels.scrollLeft = 0;
        
        this.#generatePagination(trackElement);
        this.#observePanels(trackElement);
    }

    #initEventListeners(trackElement) {
        const trackPanels = trackElement.querySelector('.track__panels');
        
        // Use event delegation for pagination clicks
        delegateEvent(trackElement, 'click', '.track__pagination__item', (event) => {
            const newIndex = parseInt(event.target.getAttribute('data-item'));
            const visiblePanels = this.#getVisiblePanels(trackPanels);
            const targetPanelIndex = newIndex * visiblePanels;

            // Ensure the target panel index is within bounds
            if (targetPanelIndex >= 0 && targetPanelIndex < trackPanels.children.length) {
                const targetPanel = trackPanels.children[targetPanelIndex];
                targetPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            } else {
                console.error(`Invalid target panel index: ${targetPanelIndex}`);
            }
        });

        trackElement.querySelector('.track__prev')?.addEventListener('click', () => {
            this.#scrollByAmount(trackPanels, -1);
        });

        trackElement.querySelector('.track__next')?.addEventListener('click', () => {
            this.#scrollByAmount(trackPanels, 1);
        });

        window.addEventListener('resize', this.#resetTrack.bind(this, trackElement));
    }

    // Public methods

    init() {
        this.#trackList.forEach(trackElement => {
            this.#resetTrack(trackElement);  // Initialize everything
            this.#initEventListeners(trackElement);  // Setup event listeners
        });
    }
}

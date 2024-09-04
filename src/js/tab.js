import { delegateEvent } from './utilities/eventDelegation';
import { handleArrowKeyNavigation } from './utilities/keyboardNavigation';

export default class Tab {

  // Private properties

  #tabsList = document.querySelectorAll('.tabs');

  // Private methods

  #deactivateTabs(tabsButtonList, tabsPanelList) {
    // Deactivate all tabs
    tabsButtonList.forEach((tab) => {
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });

    // Hide all tab panels
    tabsPanelList.forEach((panel) => {
      panel.classList.remove('shown'); // Use 'shown' to hide the panel
      panel.setAttribute('aria-hidden', 'true'); // Ensure it's hidden from screen readers
    });
  }

  #activateTab(tab, tabsButtonList, tabsPanelList) {
    // Activate the selected tab
    this.#deactivateTabs(tabsButtonList, tabsPanelList);

    tab.setAttribute('aria-selected', 'true');
    tab.removeAttribute('tabindex');
    tab.focus(); // Focus remains on the activated tab

    // Get the associated tab panel
    const controls = tab.getAttribute('aria-controls');
    const currentTabPanel = document.getElementById(controls);

    // Show the corresponding tab panel
    currentTabPanel.classList.add('shown'); // Use 'shown' to make the panel visible
    currentTabPanel.setAttribute('aria-hidden', 'false'); // Make it visible to screen readers
  }

  // Public methods

  init() {
    this.#tabsList.forEach((tab) => {
      const tabsButtonList = tab.querySelectorAll('[role="tab"]');
      const tabsPanelList = tab.querySelectorAll('[role="tabpanel"]');

      // Delegate click and keydown events for activating tabs
      delegateEvent(tab, 'click', '[role="tab"]', (event) => {
        const clickedTab = event.target.closest('[role="tab"]');
        this.#activateTab(clickedTab, tabsButtonList, tabsPanelList);
      });

      delegateEvent(tab, 'keydown', '[role="tab"]', (event) => {
        const focusedTab = event.target.closest('[role="tab"]');
        const index = Array.from(tabsButtonList).indexOf(focusedTab);

        switch (event.code) {
          case 'Enter':
          case 'Space':
            event.preventDefault();
            this.#activateTab(focusedTab, tabsButtonList, tabsPanelList);
            break;
          case 'ArrowLeft':
          case 'ArrowRight':
          case 'Home':
          case 'End':
            handleArrowKeyNavigation(event, index, tabsButtonList, (targetIndex) => {
              tabsButtonList[targetIndex].focus();
              // Do not activate the tab until Enter or Space is pressed
            });
            break;
          default:
            break;
        }
      });

      // Initialize the first tab as active, but focus remains on the tab
      this.#activateTab(tabsButtonList[0], tabsButtonList, tabsPanelList);
    });
  }
}
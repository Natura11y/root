import { delegateEvent } from './utilities/eventDelegation';

export default class Tab {

  // Private properties
  #tabsList = document.querySelectorAll('.tabs');

  // Private methods

  #directionalFocus(event, index, tabsButtonList, dir) {
    event.preventDefault();

    let targetFocus = index + dir;

    if (dir === -1 && targetFocus < 0) {
      tabsButtonList[tabsButtonList.length - 1].focus();
    } else if (dir === 1 && targetFocus >= tabsButtonList.length) {
      tabsButtonList[0].focus();
    } else {
      tabsButtonList[targetFocus].focus();
    }
  }

  #deactivateTabs(tabsButtonList, tabsPanelList) {
    tabsButtonList.forEach((tab) => {
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });

    tabsPanelList.forEach((panel) => {
      panel.classList.remove('shown');
      panel.setAttribute('hidden', '');
    });
  }

  #activateTab(tab, tabsButtonList, tabsPanelList) {
    this.#deactivateTabs(tabsButtonList, tabsPanelList);

    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    // tab.focus();

    let controls = tab.getAttribute('aria-controls');
    let currentTabPanel = document.getElementById(controls);

    currentTabPanel.classList.add('shown');
    currentTabPanel.removeAttribute('hidden');
  }

  // Public methods

  init() {
    this.#tabsList.forEach((tab) => {
      const tabsButtonList = tab.querySelectorAll('[role="tab"]');
      const tabsPanelList = tab.querySelectorAll('[role="tabpanel"]');

      // Delegate click event for activating tabs
      delegateEvent(tab, 'click', '[role="tab"]', (event) => {
        const clickedTab = event.target.closest('[role="tab"]');
        const index = Array.from(tabsButtonList).indexOf(clickedTab);
        if (index !== -1) {
          this.#activateTab(clickedTab, tabsButtonList, tabsPanelList);
        }
      });

      // Delegate keydown event for navigation between tabs
      delegateEvent(tab, 'keydown', '[role="tab"]', (event) => {
        const focusedTab = event.target.closest('[role="tab"]');
        const index = Array.from(tabsButtonList).indexOf(focusedTab);

        if (index !== -1) {
          switch (event.code) {
            case 'Home':
              event.preventDefault();
              tabsButtonList[0].focus();
              break;
            case 'End':
              event.preventDefault();
              tabsButtonList[tabsButtonList.length - 1].focus();
              break;
            case 'ArrowLeft':
              this.#directionalFocus(event, index, tabsButtonList, -1);
              break;
            case 'ArrowRight':
              this.#directionalFocus(event, index, tabsButtonList, 1);
              break;
            default:
            // do nothing
          }
        }
      });

      // Initialize the first tab as active
      this.#activateTab(tabsButtonList[0], tabsButtonList, tabsPanelList);
    });
  }
}
//////////////////////////////////////////////
// Tab
//////////////////////////////////////////////

export default class Tab {
    
    #tabsList = document.querySelectorAll('.tabs');

    init() {

        this.#tabsList.forEach((tab) => {

            const tabsButtonList = tab.querySelectorAll('[role="tab"]');
            const tabsPanelList = tab.querySelectorAll('[role="tabpanel"]');

            tabsButtonList.forEach((tabsButton, index) => {

                const activateTab = (tab) => {
                
                    // Deactivate all other tabs
                    deactivateTabs();

                    // Set the tab as selected
                    tab.setAttribute('aria-selected', 'true');

                    // Get the value of aria-controls (which is an ID)
                    let controls = tab.getAttribute('aria-controls');

                    let currentTabPanel = document.getElementById(controls);

                    currentTabPanel.classList.add('shown');
                    currentTabPanel.removeAttribute('hidden');

                }

                const deactivateTabs = () => {

                    tabsButtonList.forEach((tab) => {
                        tab.setAttribute('aria-selected', 'false');
                    });

                    tabsPanelList.forEach((panel) => {
                        panel.classList.remove('shown');
                        panel.setAttribute('hidden', '');
                    });
                    
                };

                const focusLastTab = (event) => {
                    event.preventDefault();
                    tabsButtonList[tabsButtonList.length - 1].focus();
                };

                const focusFirstTab = (event) => {
                    event.preventDefault();
                    tabsButtonList[0].focus();
                };

                tabsButton.addEventListener('click', (event) => {
                    let tab = event.target;
                    activateTab(tab);
                });

                tabsButton.addEventListener('keydown', (event) => {

                    const directionalFocus = (dir) => {
                    
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

                    switch (event.code) {
                        case 'Home':
                            focusFirstTab(event)
                            break;
                        case 'End':
                            focusLastTab(event)
                            break;
                        case 'ArrowLeft':
                            directionalFocus(-1);
                            break;
                        case 'ArrowRight':
                            directionalFocus(1);
                            break;
                        default:
                        // do nothing
                    }

                });

            });

        });
    }
}
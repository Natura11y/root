import { getFocusableElements } from './utilities/focus';

export default class Navigation {

    // Private properties
    #dropdownButtonList = document.querySelectorAll('[data-toggle="dropdown"]');

    // Private methods
    #toggleDropdown(dropdownButton, dropdownMenu) {
        dropdownMenu.classList.toggle('shown');
        dropdownButton.setAttribute('aria-expanded', dropdownButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    }

    #openDropdown(dropdownButton, dropdownMenu) {
        dropdownMenu.classList.add('shown');
        dropdownButton.setAttribute('aria-expanded', 'true');
    }

    #closeDropdown(dropdownButton, dropdownMenu) {
        dropdownMenu.classList.remove('shown');
        dropdownButton.setAttribute('aria-expanded', 'false');
    }

    // Public methods
    // init() {
    //     window.addEventListener('click', (event) => {
    //         this.#dropdownButtonList.forEach((dropdownButton) => {
    //             let dropdownMenuId = dropdownButton.getAttribute('aria-controls');
    //             let dropdownMenu = document.getElementById(dropdownMenuId);

    //             if (!dropdownMenu) {
    //                 console.warn(`No dropdown menu found for ${dropdownMenuId}`);
    //                 return;
    //             }

    //             let dropdownButtonClick = dropdownButton.contains(event.target) || dropdownMenu.contains(event.target);

    //             if (!dropdownButtonClick) {
    //                 this.#closeDropdown(dropdownButton, dropdownMenu);
    //             }
    //         });
    //     });

    //     document.addEventListener('keydown', (event) => {
    //         if (event.key === 'Escape') {
    //             this.#dropdownButtonList.forEach((dropdownButton) => {
    //                 let dropdownMenuId = dropdownButton.getAttribute('aria-controls');
    //                 let dropdownMenu = document.getElementById(dropdownMenuId);

    //                 if (dropdownButton.getAttribute('aria-expanded') === 'true') {
    //                     this.#closeDropdown(dropdownButton, dropdownMenu);
    //                     dropdownButton.focus();
    //                 }
    //             });
    //         }
    //     });

    //     this.#dropdownButtonList.forEach((dropdownButton) => {
    //         let dropdownMenuId = dropdownButton.getAttribute('aria-controls');
    //         let dropdownMenu = document.getElementById(dropdownMenuId);
    //         let trigger = dropdownButton.dataset.trigger;

    //         if (!dropdownMenu) {
    //             console.warn(`No dropdown menu found for ${dropdownMenuId}`);
    //             return;
    //         }

    //         dropdownButton.setAttribute('aria-expanded', 'false');
    //         dropdownButton.setAttribute('aria-haspopup', 'true');

    //         let timeout;

    //         if (trigger === 'hover') {

    //             dropdownButton.addEventListener('mouseenter', () => {
    //                 clearTimeout(timeout);
    //                 this.#openDropdown(dropdownButton, dropdownMenu);
    //             });

    //             dropdownButton.addEventListener('mouseleave', () => {
    //                 timeout = setTimeout(() => {
    //                     this.#closeDropdown(dropdownButton, dropdownMenu);
    //                 }, 500);
    //             });

    //             dropdownButton.addEventListener('focus', () => {
    //                 this.#openDropdown(dropdownButton, dropdownMenu);
    //             });

    //             dropdownMenu.addEventListener('mouseenter', () => {
    //                 clearTimeout(timeout);
    //                 this.#openDropdown(dropdownButton, dropdownMenu);
    //             });

    //             dropdownMenu.addEventListener('mouseleave', () => {
    //                 timeout = setTimeout(() => {
    //                     this.#closeDropdown(dropdownButton, dropdownMenu);
    //                 }, 500);
    //             });
    //         } else {
    //             dropdownButton.addEventListener('click', (event) => {
    //                 event.preventDefault();
    //                 this.#toggleDropdown(dropdownButton, dropdownMenu);
    //             });
    //         }

    //     });
    // }

    init() {
        window.addEventListener('click', (event) => {
            this.#dropdownButtonList.forEach((dropdownButton) => {
                let dropdownMenuId = dropdownButton.getAttribute('aria-controls');
                let dropdownMenu = document.getElementById(dropdownMenuId);

                if (!dropdownMenu) {
                    console.warn(`No dropdown menu found for ${dropdownMenuId}`);
                    return;
                }

                let dropdownButtonClick = dropdownButton.contains(event.target) || dropdownMenu.contains(event.target);

                if (!dropdownButtonClick) {
                    this.#closeDropdown(dropdownButton, dropdownMenu);
                }
            });
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.#dropdownButtonList.forEach((dropdownButton) => {
                    let dropdownMenuId = dropdownButton.getAttribute('aria-controls');
                    let dropdownMenu = document.getElementById(dropdownMenuId);

                    if (dropdownButton.getAttribute('aria-expanded') === 'true') {
                        this.#closeDropdown(dropdownButton, dropdownMenu);
                        dropdownButton.focus();
                    }
                });
            }
        });

        this.#dropdownButtonList.forEach((dropdownButton) => {
            let dropdownMenuId = dropdownButton.getAttribute('aria-controls');
            let dropdownMenu = document.getElementById(dropdownMenuId);
            let trigger = dropdownButton.dataset.trigger;

            if (!dropdownMenu) {
                console.warn(`No dropdown menu found for ${dropdownMenuId}`);
                return;
            }

            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.setAttribute('aria-haspopup', 'true');

            let timeout;

            if (trigger === 'hover') {
                dropdownButton.addEventListener('mouseenter', () => {
                    clearTimeout(timeout);
                    this.#openDropdown(dropdownButton, dropdownMenu);
                });

                dropdownButton.addEventListener('mouseleave', () => {
                    timeout = setTimeout(() => {
                        if (!dropdownMenu.contains(document.activeElement)) {
                            this.#closeDropdown(dropdownButton, dropdownMenu);
                        }
                    }, 500);
                });

                dropdownButton.addEventListener('focus', () => {
                    this.#openDropdown(dropdownButton, dropdownMenu);
                });

                dropdownMenu.addEventListener('mouseenter', () => {
                    clearTimeout(timeout);
                    this.#openDropdown(dropdownButton, dropdownMenu);
                });

                dropdownMenu.addEventListener('mouseleave', () => {
                    timeout = setTimeout(() => {
                        if (!dropdownMenu.contains(document.activeElement)) {
                            this.#closeDropdown(dropdownButton, dropdownMenu);
                        }
                    }, 500);
                });

                // Handling focusout to manage focus loss
                dropdownButton.addEventListener('focusout', (event) => {
                    setTimeout(() => {
                        if (!dropdownButton.contains(event.relatedTarget) && !dropdownMenu.contains(event.relatedTarget)) {
                            this.#closeDropdown(dropdownButton, dropdownMenu);
                        }
                    }, 10);
                });

            } else {
                dropdownButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.#toggleDropdown(dropdownButton, dropdownMenu);
                });
            }
        });
    }

}
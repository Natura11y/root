import './_style.scss';

//////////////////////////////////////////////
// Navigation
//////////////////////////////////////////////

export default class Navigation {

    constructor() {

        const dropdownButtonList = document.querySelectorAll('[data-toggle="dropdown"]');
            
        dropdownButtonList.forEach((dropdownButton) => {

            let dropdownButtonParent = dropdownButton.closest('li');
            let dropdownMenu = dropdownButton.nextElementSibling;

            dropdownButton.setAttribute('aria-expanded', false);
            dropdownButton.setAttribute('aria-haspopup', true);

            dropdownButton.addEventListener('click', (event) => {

                event.preventDefault();

                dropdownMenu.classList.toggle('shown');

                let expanded = dropdownButton.getAttribute('aria-expanded');

                if (expanded === 'true') {
                    dropdownButton.setAttribute('aria-expanded', false);
                } else if (expanded === 'false') {
                    dropdownButton.setAttribute('aria-expanded', true);
                }
            });

            window.addEventListener('click', (event) => {

                let dropdownButtonClick = dropdownButtonParent.contains(event.target);

                if (!dropdownButtonClick) {
                    dropdownMenu.classList.remove('shown');
                    dropdownButton.setAttribute('aria-expanded', false);
                }
            });

        });

        const observer = new MutationObserver((mutationList) => {

            console.log(mutationList);

            mutationList.forEach((mutation) => {

                switch(mutation.attributeName) {
                    case "aria-expanded":

                        console.log(
                            'WHOA!!', 
                            mutation.target.ariaExpanded
                        );
                        const icon = mutation.target.querySelector('.icon');
                        
                        if(mutation.target.ariaExpanded === 'true') {

                            sessionStorage.setItem('iconClass', icon.classList[1]);
                            
                            icon.classList.replace(sessionStorage.getItem('iconClass'), 'icon-close');

                        } else if(mutation.target.ariaExpanded === 'false'){
                            icon.classList.replace( 'icon-close', sessionStorage.getItem('iconClass'));
                        }

                        break;
                    case "class":
                        break;
                    }
            });
            
        });

        const toggleButtonList = document.querySelectorAll('.primary-nav__toggle button');

        toggleButtonList.forEach((toggleButton) => {
        
            const icon = toggleButton.querySelector('.icon');

            // sessionStorage.setItem('iconClass', icon.classList[1]);

            // let cool = sessionStorage.getItem('iconClass');

            // console.log(
            //                 'COOL!!', 
            //                 cool
            //             );

            observer.observe(toggleButton, {
                subtree: false,
                attributeFilter: ['aria-expanded'],
                attributeOldValue: true
            });

        });

    }
}
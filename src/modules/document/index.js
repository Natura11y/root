import './_style.scss';

//////////////////////////////////////////////
// Document
//////////////////////////////////////////////

export default class Document {

    constructor() {
        
        ///////////////////////
        // Copyright Year
        ///////////////////////

        const copyrightYear = document.querySelector('.copyright-year');

        if (copyrightYear) {
            const currentYear = new Date().getFullYear();
            copyrightYear.innerHTML = currentYear;
        }

        ///////////////////////
        // Language & RTL 
        ///////////////////////

        window.addEventListener('load', () => {

            // Google Translate

            const googleTranslateSelect = document.querySelector('.goog-te-combo');

            if (typeof(googleTranslateSelect) !== 'undefined' && googleTranslateSelect !== null) {

                const setLanguage = (myLang) => {
                    googleTranslateSelect.value = myLang;
                    googleTranslateSelect.querySelector(`option[value="${myLang}"]`).selected = true;

                    languageChangeEvent(googleTranslateSelect, 'change');
                }

                const languageChangeEvent = (element, event) => {

                    let eventObject;
                    
                    if (document.createEventObject){
                        eventObject = document.createEventObject();
                        return element.languageChangeEvent('on' + event, eventObject)
                    } else {
                        eventObject = document.createEvent('HTMLEvents'); 
                        // event type, bubbling, cancelable
                        eventObject.initEvent(event, false, true);
                        return !element.dispatchEvent(eventObject);
                    }
                }

                const allLanguageSelect = document.getElementById('custom-language-select');
                const allLanguageButton = document.getElementById('custom-language-update');

                allLanguageSelect.classList.add('notranslate');

                const langSelectObserverOptions = {
                    childList: true
                }

                const langSelectObserver = new MutationObserver(() => {

                    if(allLanguageSelect.childElementCount === 0) {

                        const languagesList = googleTranslateSelect.querySelectorAll('option');

                        languagesList.forEach((language) => {

                            let value = language.getAttribute('value');
                            let text = language.innerHTML;
                            let option = document.createElement('option');

                            option.setAttribute('value', value);
                            option.innerHTML = text;
                            
                            allLanguageSelect.appendChild(option);
                        });
                    } else {
                        allLanguageSelect.value = googleTranslateSelect.value;
                    }

                });
                
                langSelectObserver.observe(googleTranslateSelect, langSelectObserverOptions);

                allLanguageButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    if(allLanguageSelect.value !== '') {
                        setLanguage(allLanguageSelect.value)
                    }
                });

            }

            // Observe RTL

            const rtlTarget = document.querySelector('html');

            const rtlObserverOptions = {
                attributes: true,
                attributeFilter: ['class']
            }

            const rtlObserver = new MutationObserver((mutations) => {

                mutations.forEach((mutation) => {

                    if(mutation.type === 'attributes') {

                        const rtlClass = 'translated-rtl';

                        if (rtlTarget.classList.contains(rtlClass)) {
                            rtlTarget.setAttribute('dir', 'rtl');
                        } else {
                            rtlTarget.setAttribute('dir', 'ltr');
                        }
                    }

                });
            });

            rtlObserver.observe(rtlTarget, rtlObserverOptions);

        });
        
    }
}
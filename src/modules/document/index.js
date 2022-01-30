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
        
    }
}
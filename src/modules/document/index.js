import './_style.scss';

//////////////////////////////////////////////
// Document
//////////////////////////////////////////////

export default class Document {

    constructor() {
        this.copyrightYear = document.querySelector('.copyright-year');
    }

    init(){
        if(this.copyrightYear) {
            const currentYear = new Date().getFullYear();
            this.copyrightYear.innerHTML = currentYear;
        }
    }
}
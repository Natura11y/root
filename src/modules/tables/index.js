import './_style.scss';

//////////////////////////////////////////////
// Table
//////////////////////////////////////////////

export default class Tables {

    #tableStackList = document.querySelectorAll('[class*="table--stack"]');
    #tableScrollList = document.querySelectorAll('.table-scroll');

    init() {
    
        this.#tableStackList.forEach((tableStack) => {

            const tableHeaderList = tableStack.querySelectorAll('thead th');
            const tableRowList = tableStack.querySelectorAll('tbody tr');

            let myHeaders = [];

            tableHeaderList.forEach((tableHeader) => {

                if (tableHeader.textContent !== '') {
                    let myTitle = tableHeader.textContent.trim();
                    myHeaders.push(myTitle);
                }

            });

            tableRowList.forEach((tableRow) => {

                const tableDataList = tableRow.querySelectorAll('td');

                tableDataList.forEach((tableData, index) => {

                    let tableDataHTML = tableData.innerHTML;

                    let myNewContent = (`
                        <div class="td-content">
                            ${tableDataHTML}
                        </div>
                    `);

                    tableData.innerHTML = myNewContent;
                    tableData.setAttribute('data-before', myHeaders[index]);

                });

            });

        });

        const initTableScroll = () => {

            this.#tableScrollList.forEach((scrollElement) => {

                let scrollTarget = scrollElement.querySelector('.table-scroll__container');

                let maxWidth = scrollElement.offsetWidth;
                let scrollWidth = scrollTarget.scrollWidth;

                const removeGradient = () => {

                    let scrollPosition = scrollTarget.scrollLeft;

                    scrollPosition > 1
                        ? scrollTarget.setAttribute('data-scrolling', true)
                        : scrollTarget.setAttribute('data-scrolling', false)
                }

                scrollWidth > maxWidth
                    ? scrollElement.setAttribute('data-scroll', true)
                    : scrollElement.setAttribute('data-scroll', false)

                scrollTarget.addEventListener('scroll', removeGradient, {
                    passive: true
                });

            });
        }
    
        initTableScroll();
        window.addEventListener('resize', initTableScroll);
    }
}
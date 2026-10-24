export default class Table {

  // Private properties
  
  #tableStackList = [];
  #tableScrollList = [];
  #scrollTargets = [];
  #resizeTimeout = null;

  // Private methods

  #populateHeaders(tableStack) {
    const tableHeaderList = tableStack.querySelectorAll('thead th');
    const tableRowList = tableStack.querySelectorAll('tbody tr');
    let headers = [];

    tableHeaderList.forEach((tableHeader, index) => {
      if (tableHeader.textContent !== '') {
        const title = tableHeader.textContent.trim();
        headers.push({ title, id: `header-${index}` });
        tableHeader.setAttribute('id', `header-${index}`);
      }
    });

    tableRowList.forEach((tableRow) => {
      const tableDataList = tableRow.querySelectorAll('td');

      tableDataList.forEach((tableData, index) => {
        tableData.innerHTML = this.#createNewTableDataContent(tableData.innerHTML);
        tableData.setAttribute('data-header', headers[index].title);
        tableData.setAttribute('aria-labelledby', headers[index].id);
      });
    });
  }

  #createNewTableDataContent(oldContent) {
    return `
      <div class="td-content">
        ${oldContent}
      </div>
    `;
  }

  #handleTableScroll() {
    this.#tableScrollList.forEach((scrollElement) => {
      let scrollTarget = scrollElement.querySelector('.table-scroll__container');
      let maxWidth = scrollElement.offsetWidth;
      let scrollWidth = scrollTarget.scrollWidth;

      scrollWidth > maxWidth
        ? scrollElement.setAttribute('data-scroll', true)
        : scrollElement.setAttribute('data-scroll', false);

    });
  }

  #removeGradient = (event) => {
    const scrollTarget = event.currentTarget;
    const scrollPosition = scrollTarget.scrollLeft;

    scrollPosition > 1
      ? scrollTarget.setAttribute('data-scrolling', true)
      : scrollTarget.setAttribute('data-scrolling', false);
  };

  #handleTableScrollDebounced = () => {
    clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = setTimeout(() => {
      this.#handleTableScroll();
    }, 150);
  };

  // Public methods

  init(root = document) {
    this.destroy();

    this.#tableStackList = root.querySelectorAll('[class*="table--stack"]');
    this.#tableScrollList = root.querySelectorAll('.table-scroll');
    this.#scrollTargets = root.querySelectorAll('.table-scroll .table-scroll__container');

    this.#tableStackList.forEach((tableStack) => {
      this.#populateHeaders(tableStack);
    });

    this.#scrollTargets.forEach((scrollTarget) => {
      scrollTarget.addEventListener('scroll', this.#removeGradient, {
        passive: true,
      });
    });

    this.#handleTableScroll();
    window.addEventListener('resize', this.#handleTableScrollDebounced);
  }

  destroy() {
    clearTimeout(this.#resizeTimeout);
    window.removeEventListener('resize', this.#handleTableScrollDebounced);

    this.#scrollTargets.forEach((scrollTarget) => {
      scrollTarget.removeEventListener('scroll', this.#removeGradient);
    });
  }
}

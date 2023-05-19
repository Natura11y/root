//////////////////////////////////////////////
// Table
//////////////////////////////////////////////

export default class Table {

	#tableStackList = document.querySelectorAll('[class*="table--stack"]');
	#tableScrollList = document.querySelectorAll('.table-scroll');

	populateHeaders(tableStack) {
		const tableHeaderList = tableStack.querySelectorAll('thead th');
		const tableRowList = tableStack.querySelectorAll('tbody tr');
		let headers = [];

		tableHeaderList.forEach((tableHeader) => {
			if (tableHeader.textContent !== '') {
				const title = tableHeader.textContent.trim();
				headers.push(title);
			}
		});

		tableRowList.forEach((tableRow) => {
			const tableDataList = tableRow.querySelectorAll('td');

			tableDataList.forEach((tableData, index) => {
				let tableDataHTML = tableData.innerHTML;

				let myNewContent = `
                    <div class="td-content">
                        ${tableDataHTML}
                    </div>
                `;

				tableData.innerHTML = myNewContent;
				tableData.setAttribute('data-header', headers[index]);
			});
		});
	}

	initTableScroll() {
		this.#tableScrollList.forEach((scrollElement) => {
			let scrollTarget = scrollElement.querySelector(
				'.table-scroll__container'
			);
			let maxWidth = scrollElement.offsetWidth;
			let scrollWidth = scrollTarget.scrollWidth;

			const removeGradient = () => {
				let scrollPosition = scrollTarget.scrollLeft;
				scrollPosition > 1
					? scrollTarget.setAttribute('data-scrolling', true)
					: scrollTarget.setAttribute('data-scrolling', false);
			};

			scrollWidth > maxWidth
				? scrollElement.setAttribute('data-scroll', true)
				: scrollElement.setAttribute('data-scroll', false);

			scrollTarget.addEventListener('scroll', removeGradient, {
				passive: true,
			});
		});
	}

	init() {
		this.#tableStackList.forEach((tableStack) => {
			this.populateHeaders(tableStack);
		});

		this.initTableScroll();
		window.addEventListener('resize', () => this.initTableScroll());
	}
}
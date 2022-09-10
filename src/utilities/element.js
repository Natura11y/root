export const isElementLoaded = async (...selectors) => {

	console.log("Checking for .... ", selectors)

	while (document.querySelector(selectors) === null) {
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}

    const els = document.querySelectorAll(selectors);

	return els;
};


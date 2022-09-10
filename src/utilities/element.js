
export const isElementLoaded = async (selector) => {
	while (document.querySelector(selector) === null) {
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}

    const els = document.querySelectorAll(selector);

    console.log('promise fullfilled');

	return els;
};


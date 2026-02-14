import { useState, useRef, forwardRef } from 'react';


import TabsNav from './TabsNav';
import TabPanel from './TabPanel';

const Tabs = forwardRef((props, ref) => {

    const { 
        pill = false,
        breakpoint = 'md' 
    } = props;

  	const data = [
		{
			title: 'Mackerel',
			content: (
                <p>
                    The mackerel tabby pattern gives slender vertical, gently curving stripes on the sides of the body. These stripes may be continuous or broken into bars and short segments/spots, especially on the flanks and stomach. Three or five vertical lines in an 'M' shape almost always appear on the forehead, along with dark lines from the corners of the eyes, one or more crossing each cheek, and of course many stripes and lines at various angles on the neck and shoulder area, on the flanks, and around the legs and tail. Mackerel tabbies are also called 'fishbone tabbies,' probably doubly named after the <a href="#1">mackerel</a> fish.
                </p>
			),
		},
		{
			title: 'Classic',
			content: (
				<p>
                    The classic tabby (also known as blotched or marbled tabby) has the 'M' pattern on the forehead but the body markings, rather than primarily thin stripes or spots, are thick curving bands in a whirled or swirled pattern with a distinctive mark on each side of the body resembling a bullseye. Classic tabby is a <a href="#1">recessive</a>  trait. Classic tabbies are the most common type of tabby in much of the United Kingdom and the Middle East, among other places, but they are a far second in number to mackerel tabbies in most parts of the world.
                </p>
			),
		},
		{
			title: 'Ticked',
			content: (
				<p>
                    The ticked tabby pattern is due to even fields of <a href="#1">agouti</a> hairs, each with distinct bands of color, which break up the tabby patterning into a salt-and-pepper appearance that makes them look sand-like—thus there are few to no stripes or bands. Residual ghost striping and/or barring can often be seen on the lower legs, face, and belly and sometimes at the tail tip, as well as the standard 'M' and a long dark line running along the spine, primarily in ticked tabbies who also carry a mackerel or classic tabby allele. These types of cats come in many forms and colors.
                </p>
			),
		}
	];

    const [activeTab, setActiveTab] = useState(data[0].title);

	const tabs = useRef(null);
	const tabButtons = useRef([]);

	const handleClick = (e) => {

		const clicked = e.target.dataset.title;

		activeTab === clicked
			? setActiveTab(data[0].title)
			: setActiveTab(clicked);
	};

	const handleKeyDown = (e) => {

		if (e.target === document.activeElement) {

			const pressed = e.target.dataset.index;

			const focusLastTab = (e) => {
				e.preventDefault();
				tabButtons.current[tabButtons.current.length - 1].focus();
			};

			const focusFirstTab = (e) => {
				e.preventDefault();
				tabButtons.current[0].focus();
			};

			const directionalFocus = (dir) => {

				e.preventDefault();

				if (tabButtons.current) {
					
					let targetFocus = parseInt(pressed) + dir;

					if (dir === -1 && targetFocus < 0) {
						tabButtons.current[tabButtons.current.length -1].focus();
					} else if (dir === 1 && targetFocus >= tabButtons.current.length) {
						tabButtons.current[0].focus();
					} else {
						tabButtons.current[targetFocus].focus();
					}
				}

			}

			switch (e.code) {
				case 'Home':
					focusFirstTab(e)
					break;
				case 'End':
					focusLastTab(e)
					break;
				case 'ArrowUp':
				case 'ArrowLeft':
					directionalFocus(-1);
					break;
				case 'ArrowDown':
				case 'ArrowRight':
					directionalFocus(1);
					break;
				default:
				// do nothing
			}

		}
	};

	const tabPanels = data.map((panel, index) => (
        <TabPanel
            key={index}
            isActive={activeTab === panel.title ? true : false}
        >
            {panel.content}
        </TabPanel>
	));


	return (
		<div
			ref={ref || tabs}
			className='tabs box-shadow-1'
			role='tablist'
		>

			<TabsNav
				data={data} 
				activeTab={activeTab}
				handleClick={handleClick}
				handleKeyDown={handleKeyDown}
				pill={pill}
				breakpoint={breakpoint}
				tabButtonRefs={tabButtons}
			/>

			{tabPanels}
		</div>
	);
});

Tabs.displayName = 'Tabs';

export default Tabs;
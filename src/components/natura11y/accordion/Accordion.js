import React, { useState, useEffect, useRef } from 'react';

import AccordionItem from './AccordionItem';

import { getFilteredElements } from '../../../utilities/filter';

const Accordion = ({ openDefault = null }) => {

  	const data = [
		{
			title: 'Danaus Plexippus',
			content: (
				<p>
					The monarch butterfly or simply monarch is a milkweed butterfly in the
					family Nymphalidae. Other common names, depending on region, include
					milkweed, common tiger, wanderer, and black veined brown. It may be
					the most familiar <a href='#1'>North American</a> butterfly, and is
					considered an iconic pollinator species.
				</p>
			),
		},
		{
			title: 'Papilio Polyxenes',
			content: (
				<p>
					The black swallowtail, American swallowtail, or parsnip swallowtail,
					is a butterfly found throughout much of <a href='#1'>North America</a>
					. It is the state butterfly of Oklahoma and New Jersey.
				</p>
			),
		},
		{
			title: 'Hyalophora Cecropia',
			content: (
				<p>
					The cecropia moth is <a href='#1'>North America's</a> largest native
					moth. It is a member of the family Saturniidae, or giant silk moths.
					Females have been documented with a wingspan of five to seven inches
					or more.
				</p>
			),
		},
		{
			title: 'Deilephila Elpenor',
			content: (
				<p>
					The elephant hawk moth or large elephant hawk moth, is a moth in the
					family Sphingidae. Its common name is derived from the caterpillar's
					resemblance to an elephant's trunk. It is most common in
					<a href='#1'>central Europe</a> and is distributed throughout the
					Palearctic region.
				</p>
			),
		},
		{
			title: 'Papilio Troilus',
			content: (
				<p>
					The spicebush swallowtail or green-clouded butterfly, is a common
					black swallowtail butterfly found in <a href='#1'>North America</a>.
					It has two subspecies, Papilio troilus troilus and Papilio troilus
					ilioneus, the latter found mainly in the Florida peninsula.
				</p>
			),
		},
	];

  	const [openAccordion, setOpenAccordion] = useState(openDefault);

	const accordion = useRef(null);
	const accordionButtons = useRef();

	const handleClick = (e) => {

		const clicked = e.target.dataset.title;

		openAccordion === clicked
			? setOpenAccordion(null)
			: setOpenAccordion(clicked);

	};

	const handleKeyDown = (e) => {

		if (e.target === document.activeElement) {

			const pressed = e.target.dataset.index;

			const directionalFocus = (dir) => {

				e.preventDefault();

				if (accordionButtons.current) {
					
					let targetFocus = parseInt(pressed) + dir;

					if (dir === -1 && targetFocus < 0) {
						accordionButtons.current[accordionButtons.current.length -1].focus();
					} else if (dir === 1 && targetFocus >= accordionButtons.current.length) {
						accordionButtons.current[0].focus();
					} else {
						accordionButtons.current[targetFocus].focus();
					}
				}

			}

			switch (e.code) {
				case 'ArrowLeft':
				case 'ArrowUp':
					directionalFocus(-1);
					break;
				case 'ArrowRight':
				case'ArrowDown':
					directionalFocus(1);
					break;
				default:
					// do nothing
			}

		}
	};

	const accordionItems = data.map((item, index) => (
		
		<AccordionItem
			key={index}
			title={item.title}
			isActive={openAccordion === item.title ? true : false}
			handleClick={handleClick}
			handleKeyDown={handleKeyDown}
			id={`example-${index}`}
			dataIndex={index}
		>

			{item.content}

		</AccordionItem>
	));
	
	useEffect(() => {
		accordionButtons.current = getFilteredElements(accordion.current, 'accordion__button');
	}, []);

	return (
		<div
			className='accordion'
			ref={accordion}
		>

			{accordionItems}
		
		</div>
	);

}

export default Accordion;
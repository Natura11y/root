import React, { useState } from 'react';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import ButtonIconOnly from '../button/ButtonIconOnly';
import Button from '../button';

import Dropdown from './Dropdown';
import Brand from './Brand';

const PrimaryNavigation = ( props ) => {

	const { 
		navType = 'inline', // 'inline' or 'below'
		breakpoint = 'lg',
		includeSearch = true,
		utilities = null,
	} = props;

	const [menuShow, setMenuShow] = useState(false);
	const [searchShow, setSearchShow] = useState(false);

	const handleMenuClick = () => {
		setSearchShow(false);
		setMenuShow(!menuShow);
	};

	const handleSearchClick = () => {
		setMenuShow(false);
		setSearchShow(!searchShow);
	};

	const componentClasses = classNames(
		`primary-nav--${navType}--${breakpoint}`,
		{
			[`${utilities}`] : utilities !== null
		}
	);

	return (
		<div className={`${componentClasses}`}>
		
			<div className='primary-nav__logo'>
				<Link to='/' title='Home' data-logo='brand'>
					<Brand />
				</Link>
			</div>

			<nav
				className={`primary-nav__menu ${menuShow ? 'shown' : ''}`}
				id='main-menu'
				aria-label='Main Menu'
			>
				<ul>
					<li>
						<Dropdown />
					</li>
					<li>
						<Link to='#1'>Link</Link>
					</li>
					<li>
						<Link to='#1'>Link</Link>
					</li>
					<li>
						<Link to='#1'>Link</Link>
					</li>
				</ul>
			</nav>

			<div className='primary-nav__toggle'>

				{includeSearch && navType === 'inline' && (
				
					<ButtonIconOnly
						iconHandle='search'
						clickHandler={handleSearchClick}
						ariaLabel='Search'
						ariaExpanded={searchShow ? true : false}
					/>

				)}

				<ButtonIconOnly
					iconHandle={menuShow ? 'close' : 'menu'}
					clickHandler={handleMenuClick}
					ariaLabel='Menu'
					ariaExpanded={menuShow ? true : false}
				/>

			</div>

			{includeSearch && (
					
				<form
					className={`primary-nav__search ${searchShow ? 'shown' : ''}`}
					role='search'
					id='search'
				>
					<div className='form-entry' aria-label='Search'>
						<div className='form-entry__field'>
							<span className='form-entry__field__input'>
								<input type='text' name='global-search' />
								<Button title="Search" />
							</span>
						</div>
					</div>

				</form>
			)}

			<div className='primary-nav__actions'>
				<ButtonIconOnly iconHandle='mode-light-dark' />
			</div>
		</div>
	);
};

export default PrimaryNavigation;
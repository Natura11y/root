import { useState, useRef, useEffect } from 'react';

import classNames from 'classnames';

import { Link } from 'react-router-dom';

import ButtonIconOnly from '../button/ButtonIconOnly';
import Button from '../button';
import NavigationItem from './NavigationItem';
import Brand from './Brand';

import { getFocusableElements } from 'natura11y/src/js/utilities/focus';
import { handleArrowKeyNavigation } from 'natura11y/src/js/utilities/keyboardNavigation';

const PrimaryNavigation = ( props ) => {

	const { 
		navType = 'inline', // 'inline' or 'below'
		breakpoint = 'lg',
		includeSearch = true,
		utilities = null,
	} = props;

	const [menuShow, setMenuShow] = useState(false);
	const [searchShow, setSearchShow] = useState(false);

	const navigationRef = useRef();
	const searchInputRef = useRef();

	const handleMenuClick = () => {
		setSearchShow(false);
		setMenuShow(!menuShow);
	};

	const handleSearchClick = () => {
		setMenuShow(false);
		setSearchShow(!searchShow);
		
		// Focus search input when opened
		if (!searchShow) {
			setTimeout(() => {
				searchInputRef.current?.focus();
			}, 100);
		}
	};

	const handleNavigationKeyDown = (e) => {
		// Handle main navigation keyboard navigation
		const focusableElements = getFocusableElements(navigationRef.current);
		const currentIndex = focusableElements.findIndex(el => el === document.activeElement);

		if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
			handleArrowKeyNavigation(
				e, 
				currentIndex, 
				focusableElements, 
				(targetIndex) => focusableElements[targetIndex]?.focus()
			);
		}
	};

	useEffect(() => {
		if (menuShow) {
			// Focus first navigation item when menu opens on mobile
			const firstNavItem = getFocusableElements(navigationRef.current)[0];
			setTimeout(() => {
				firstNavItem?.focus();
			}, 100);
		}
	}, [menuShow]);

	const navigationClasses = classNames(
		`primary-nav--${navType}--${breakpoint}`,
		{
			[`${utilities}`] : utilities !== null
		}
	);

	const companyItems = [
		{ to: '/about', label: 'About Us' },
		{ to: '/team', label: 'Our Team' },
		{ to: '/careers', label: 'Careers' },
		{ to: '/contact', label: 'Contact' }
	];

	const componentItems = [
		{ to: '/accordion', label: 'Accordion' },
		{ to: '/button', label: 'Buttons' },
		{ to: '/modal', label: 'Modal' },
		{ to: '/navigation', label: 'Navigation' }
	];

	// Mega menu content
	const megaMenuContent = (
		<div className="container">
			<div className="grid grid--column-3--lg gap-4">
				<div>
					<p className="h6 margin-bottom-2">Products</p>
					<ul className="nav">
						<li><Link to="/product-1">Product One</Link></li>
						<li><Link to="/product-2">Product Two</Link></li>
						<li><Link to="/product-3">Product Three</Link></li>
					</ul>
				</div>
				<div>
					<p className="h6 margin-bottom-2">Services</p>
					<ul className="nav">
						<li><Link to="/service-1">Service One</Link></li>
						<li><Link to="/service-2">Service Two</Link></li>
						<li><Link to="/service-3">Service Three</Link></li>
					</ul>
				</div>
				<div>
					<p className="h6 margin-bottom-2">Support</p>
					<ul className="nav">
						<li><Link to="/support-1">Documentation</Link></li>
						<li><Link to="/support-2">Help Center</Link></li>
						<li><Link to="/support-3">Contact Support</Link></li>
					</ul>
				</div>
			</div>
		</div>
	);

	return (
		<div className={`${navigationClasses}`}>
		
			<div className='primary-nav__logo'>
				<Link to='/' title='Home' data-logo='brand'>
					<Brand />
				</Link>
			</div>

			<nav
				ref={navigationRef}
				className={`primary-nav__menu ${menuShow ? 'shown' : ''}`}
				id='main-menu'
				aria-label='Main Menu'
				onKeyDown={handleNavigationKeyDown}
			>
				<ul>
					{/* Mega Menu - Button dropdown with rich content */}
					<NavigationItem
						title="Products"
						items={megaMenuContent}
						isMegaMenu={true}
						hover={true}
						breakpoint={breakpoint}
					/>
					
					{/* Link + Dropdown - Company page with submenu */}
					<NavigationItem
						title="Company"
						to="/company"
						items={companyItems}
						hover={true}
					/>
					
					{/* Button Dropdown - Components menu */}
					<NavigationItem
						title="Components"
						items={componentItems}
						hover={false}
					/>
					
					{/* Simple Link - All Examples */}
					<NavigationItem
						title="All Examples"
						to="/"
					/>
					
					{/* Simple Link - Blog */}
					<NavigationItem
						title="Blog"
						to="/blog"
					/>
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
								<input 
									ref={searchInputRef}
									type='text' 
									name='global-search' 
									placeholder='Search...'
								/>
								<Button title="Search" />
							</span>
						</div>
					</div>

				</form>
			)}

			<div className='primary-nav__actions'>
				<ButtonIconOnly iconHandle='mode-light-dark' ariaLabel='Toggle dark mode' />
			</div>
		</div>
	);
};

export default PrimaryNavigation;
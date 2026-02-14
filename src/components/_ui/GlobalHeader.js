import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import Brand from '../natura11y/navigation/Brand';
import ButtonIconOnly from '../natura11y/button/ButtonIconOnly';
import Button from '../natura11y/button';

const GlobalHeader = () => {
	const [menuShow, setMenuShow] = useState(false);
	const navigationRef = useRef();
	const location = useLocation();

	const handleMenuClick = () => {
		setMenuShow(!menuShow);
	};

	return (
		<div className="primary-nav--inline--lg border-bottom">
			<div className="primary-nav__logo">
				<Link to="/" title="Home" data-logo="brand">
					<Brand />
				</Link>
			</div>

			<nav
				ref={navigationRef}
				className={classNames('primary-nav__menu', { shown: menuShow })}
				id="main-menu"
				aria-label="Main Menu"
			>
				<ul>
					<li>
						<Link
							to="/"
							aria-current={location.pathname === '/' ? 'page' : undefined}
						>
							Examples
						</Link>
					</li>
					<li>
						<Link
							to="/about"
							aria-current={location.pathname === '/about' ? 'page' : undefined}
						>
							About
						</Link>
					</li>
				</ul>
			</nav>

			<div className="primary-nav__toggle">
				<ButtonIconOnly
					iconHandle={menuShow ? 'close' : 'menu'}
					clickHandler={handleMenuClick}
					ariaLabel="Menu"
					ariaExpanded={menuShow}
				/>
			</div>

			<div className="primary-nav__actions">
				<Button
					tag="a"
					linkUrl="https://gonatura11y.com/"
					title="Docs"
					iconHandle="open-new"
					target="_blank"
					rel="noopener noreferrer"
				/>
			</div>
		</div>
	);
};

export default GlobalHeader;

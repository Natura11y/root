import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import ButtonIconOnly from '../natura11y/button/ButtonIconOnly';
import Button from '../natura11y/button';

const MainMenuBar = () => {
	const [menuShow, setMenuShow] = useState(false);
	const navigationRef = useRef();
	const location = useLocation();

	const handleMenuClick = () => {
		setMenuShow(!menuShow);
	};

	return (
		<div className="main-menu--bar--lg border-bottom">
			<div className="main-menu__logo">
				<Link to="/" title="Home" data-logo="brand">
					<p className='font-weight-bold'>
						Natura11y React<br />Components
					</p> 
				</Link>
			</div>

			<nav
				ref={navigationRef}
				className={classNames('main-menu__nav', { shown: menuShow })}
				id="main-menu"
				aria-label="Main Menu"
			>
				<ul>
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

			<div className="main-menu__toggle">
				<ButtonIconOnly
					iconHandle={menuShow ? 'close' : 'menu'}
					clickHandler={handleMenuClick}
					ariaLabel="Menu"
					ariaExpanded={menuShow}
				/>
			</div>

			<div className="main-menu__actions">
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

export default MainMenuBar;

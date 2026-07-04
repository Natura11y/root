import { Link, useLocation } from 'react-router-dom';

import MainMenu from '@lib/components/main-menu';
import Button from '@lib/components/button';

const MainMenuBar = () => {
	const location = useLocation();

	const logo = (
		<Link to="/" title="Home">
			<p className="font-weight-bold">
				Natura11y React<br />Components
			</p>
		</Link>
	);

	const actions = (
		<Button
			tag="a"
			linkUrl="https://gonatura11y.com/"
			title="Docs"
			iconStartHandle="open-new"
			target="_blank"
			rel="noopener noreferrer"
		/>
	);

	return (
		<MainMenu logo={logo} actions={actions} utilities="border-bottom">
			<li>
				<Link
					to="/about"
					aria-current={location.pathname === '/about' ? 'page' : undefined}
				>
					About
				</Link>
			</li>
		</MainMenu>
	);
};

export default MainMenuBar;

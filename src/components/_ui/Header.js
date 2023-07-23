import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<div className='container wide display-flex justify-content-center padding-y-4'>
			<Link to='/'>
				<h1 className='font-size-lg'>Natura11y React Components</h1>
			</Link>
		</div>
	);
};

export default Header;
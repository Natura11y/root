
import { Link } from 'react-router-dom';

import PrimaryNavigation from '../natura11y/navigation/PrimaryNavigation';

const Header = () => {
	return (
		<>
			<PrimaryNavigation 
				navType="inline"
				breakpoint="xl"
				includeSearch={false}
				includeMegaMenu={true}
				utilities="border-bottom"
			/>
			<div className='container wide display-flex justify-content-center padding-y-4'>
				<Link to='/'>
					<h1 className='font-size-lg'>Natura11y React Components</h1>
				</Link>
			</div>
		</>
	);
};

export default Header;
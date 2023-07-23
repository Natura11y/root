/*

// Home

*/

import { useParams, Outlet } from 'react-router-dom';

import Preview from './Preview';

const Home = ({ examples }) => {

	const { slug } = useParams();

	const exampleLinks = examples.map((component, index) => (
		<Preview
			key={index}
			title={component.title}
			imageURL={`images/banner/${component.slug}.jpg`}
			fixedHeight='300px'
			slug={component.slug}
		/>
	));

	return (
		<>
			<h1 className='screen-reader-only'>Component Examples</h1>
			{slug === undefined
				? (
					<div className="grid gap-border">
						{exampleLinks}
					</div>
				) : <Outlet examples={examples} id={slug} />
			}
		</>
	);
};

export default Home;
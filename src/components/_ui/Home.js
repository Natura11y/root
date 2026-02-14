import Preview from './Preview';

const Home = ({ examples }) => {
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
			<div className="grid gap-border margin-y-6">
				{exampleLinks}
			</div>
		</>
	);
};

export default Home;
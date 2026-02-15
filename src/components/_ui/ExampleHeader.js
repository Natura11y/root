const ExampleHeader = ({ title, slug }) => {
	return (
		<header
			className='backdrop backdrop--fixed'
			style={{ '--backdrop-fixed-height': '600px' }}
		>
			<div className='backdrop__media'>
				<img
					className='opacity-30'
					src={`/images/banner/${slug}.jpg`}
					alt={`${title} example`}
				/>
			</div>
			<div className='backdrop__cover'>
				<div className='container medium margin-y-4'>
					<h1 className='banner-headline text-align-center text-shadow'>{title}</h1>
				</div>
			</div>
		</header>
	);
};

export default ExampleHeader;
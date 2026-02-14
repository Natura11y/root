import PrimaryNavigation from '../../natura11y/navigation/PrimaryNavigation';

const NavigationExamples = () => {
	return (
		<div className="grid">
			<div className='box-shadow-1 theme-light margin-y-3'>
				<PrimaryNavigation />
			</div>
			<div className='box-shadow-1 theme-light margin-y-3'>
				<PrimaryNavigation navType={'below'} />
			</div>
		</div>
	);
};

export default NavigationExamples;

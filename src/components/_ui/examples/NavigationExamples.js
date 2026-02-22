import MainMenu from '../../natura11y/navigation/MainMenu';

const NavigationExamples = () => {
	return (
		<div className="grid">
			<div className='box-shadow-1 theme-light margin-y-3'>
				<MainMenu />
			</div>
			<div className='box-shadow-1 theme-light margin-y-3'>
				<MainMenu navType={'stack'} />
			</div>
		</div>
	);
};

export default NavigationExamples;

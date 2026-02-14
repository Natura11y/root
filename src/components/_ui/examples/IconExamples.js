import Icon from '../../natura11y/icon/Icon';

const IconExamples = () => {
	const iconSamples = [
		'home',
		'settings',
		'bell',
		'calendar',
		'search',
		'menu',
		'close',
		'open-new',
		'car',
		'map-pin',
	];

	return (
		<div className='narrow margin-x-auto'>
			<div className='grid grid--column-4--md gap-3'>
				{iconSamples.map((iconHandle, index) => (
					<div key={index} className='display-flex flex-direction-column align-items-center padding-3 border-radius theme-light'>
						<Icon iconHandle={iconHandle} utilities='font-size-lg margin-bottom-2' />
						<code className='font-size-sm'>{iconHandle}</code>
					</div>
				))}
			</div>
		</div>
	);
};

export default IconExamples;

import Button from '../../natura11y/button';
import ButtonIconOnly from '../../natura11y/button/ButtonIconOnly';
import ButtonIconOverText from '../../natura11y/button/ButtonIconOverText';

const ButtonExamples = () => {
	return (
		<>
			<div className='medium margin-x-auto text-color-link button-group justify-content-center margin-y-3'>
				<ButtonIconOnly />
				<ButtonIconOnly
					iconHandle='settings'
					utilities='theme-primary'
					tag='link'
				/>
				<ButtonIconOnly iconHandle='bell' />
				<ButtonIconOnly iconHandle='calendar' />
			</div>
			<div className='medium margin-x-auto button-group justify-content-center margin-y-3'>
				<Button
					utilities='theme-primary border-radius-pill'
					iconHandle='home'
					utilityClasses='theme-light border-radius-pill'
				/>
				<Button
					iconHandle='bell'
					title='Notifications'
				/>
				<Button
					outline={true}
					title='Settings'
				/>
			</div>
			<div className='display-flex justify-content-center margin-y-3'>
				<ButtonIconOverText
					iconHandle='car'
					label='Directions'
					iconUtilities='border-radius-circle'
				/>
				<ButtonIconOverText
					iconHandle='map-pin'
					label='Directions to the store'
					iconUtilities='theme-primary border-radius-circle'
				/>
			</div>

			{/* New: Dual Icon Support Examples */}
			<div className='medium margin-x-auto button-group justify-content-center margin-y-3'>
				<Button
					title='Edit'
					iconStartHandle='edit'
					utilities='theme-primary'
				/>
				<Button
					title='Next'
					iconEndHandle='arrow-right'
					utilities='theme-secondary'
				/>
				<Button
					title='Transfer'
					iconStartHandle='arrow-left'
					iconEndHandle='arrow-right'
					outline={true}
				/>
			</div>

			{/* New: wrapText Control Examples */}
			<div className='medium margin-x-auto button-group justify-content-center margin-y-3'>
				<Button
					title='With Wrapper'
					iconStartHandle='check'
					wrapText={true}
					utilities='theme-primary'
				/>
				<Button
					title='No Wrapper'
					iconStartHandle='check'
					wrapText={false}
					utilities='theme-dark'
				/>
			</div>
		</>
	);
};

export default ButtonExamples;

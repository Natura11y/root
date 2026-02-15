import Button from '../../natura11y/button';
import ButtonIconOnly from '../../natura11y/button/ButtonIconOnly';
import ButtonIconOverText from '../../natura11y/button/ButtonIconOverText';

const ButtonExamples = () => {
	return (
		<div className='container narrow margin-y-5'>

			{/* Basic Buttons */}
			<section className='margin-y-4'>
				<h2 className='h4 margin-bottom-2'>Basic Buttons</h2>
				<div className='display-flex gap-1'>
					<Button title='Button' />
					<Button title='Primary Theme' utilities='theme-primary' />
					<Button title='Outline' outline={true} />
				</div>
			</section>

			{/* Icon-Only Buttons */}
			<section className='margin-y-4'>
				<h2 className='h4 margin-bottom-2'>Icon-Only Buttons</h2>
				<div className='display-flex gap-1'>
					<ButtonIconOnly iconHandle='home' />
					<ButtonIconOnly iconHandle='settings' utilities='theme-primary' />
					<ButtonIconOnly iconHandle='bell' outline={true} />
				</div>
			</section>

			{/* Text & Icon Buttons */}
			<section className='margin-y-4'>
				<h2 className='h4 margin-bottom-2'>Text & Icon Buttons</h2>
				<div className='display-flex gap-1'>
					<Button
						title='Home'
						iconStartHandle='home'
						utilities='theme-primary'
					/>
					<Button
						title='Notifications'
						iconStartHandle='bell'
					/>
					<Button
						title='Settings'
						iconStartHandle='settings'
						outline={true}
					/>
				</div>
			</section>

			{/* Dual Icon Support */}
			<section className='margin-y-4'>
				<h2 className='h4 margin-bottom-2'>Dual Icon Support</h2>
				<div className='display-flex gap-1'>
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
			</section>

			{/* Icon Over Text */}
			<section className='margin-y-4'>
				<h2 className='h4 margin-bottom-2'>Icon Over Text</h2>
				<div className='display-flex gap-1'>
					<ButtonIconOverText
						iconHandle='car'
						label='Directions'
						iconUtilities='border-radius-circle'
					/>
					<ButtonIconOverText
						iconHandle='map-pin'
						label='Location'
						iconUtilities='theme-primary border-radius-circle'
					/>
				</div>
			</section>

			{/* Advanced Features */}
			<section className='margin-y-4'>
				<h2 className='h4 margin-bottom-2'>Advanced Features</h2>
				<div className='display-flex gap-1'>
					<Button
						title='With Data Attrs'
						iconStartHandle='tag'
						utilities='theme-primary'
						attributes={{ 'data-custom': 'value', 'data-id': '123' }}
					/>
					<Button
						title='No Text Wrapper'
						iconStartHandle='check'
						wrapText={false}
						utilities='theme-dark'
					/>
				</div>
			</section>

		</div>
	);
};

export default ButtonExamples;

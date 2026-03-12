import Icon from '../icon';

const RequiredIndicator = ({ ref, text = 'Required fields indicated with' }) => {
	return (
		<p ref={ref} className='required-indicator' aria-hidden='true'>
			<span className='required-indicator__text'>
				{text}
			</span>
            <Icon iconHandle='asterisk' />
		</p>
	);
};

export default RequiredIndicator;
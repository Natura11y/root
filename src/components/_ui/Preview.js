
import { Link } from 'react-router-dom';

import classNames from 'classnames';

const Preview = ( props ) => {

    const {
		title = 'Backdrop Title',
		fixedHeight = null,
		imageOpacity = '30',
		imageURL = 'https://via.placeholder.com/1500x750',
		imageAlt = 'Placeholder',
		slug = null
	} = props;

	const backdropClasses = classNames(
		'backdrop',
		{
			'backdrop--fixed': fixedHeight !== null
		}
	);

	let styleFixed = {'--backdrop-fixed-height': fixedHeight !== null ? `${fixedHeight}` : null };

	const backdropContent = (
		<>
			<div className='backdrop__media'>
				<img
					className={`opacity-${imageOpacity}`}
					src={imageURL}
					alt={imageAlt}
				/>
			</div>

			<div className='backdrop__cover'>
				<div className='container medium margin-y-4'>
					<h1 className='text-shadow'>{title}</h1>
				</div>
			</div>
		</>
	);

	if (slug) {
		return (
			<Link
				to={`/${slug}`}
				className={backdropClasses}
				style={styleFixed}>
				{backdropContent}
			</Link>
		);
	}

	return (
		<div className={backdropClasses} style={styleFixed}>
			{backdropContent}
		</div>
	);
}

export default Preview;
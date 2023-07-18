import { useParams } from 'react-router-dom';

import Accordion from '../natura11yComponents/accordion/Accordion'

import AlertParent from '../natura11yComponents/alert/AlertParent';

import Backdrop from '../natura11yComponents/backdrop/Backdrop';

import Button from '../natura11yComponents/button';

import ButtonIconOnly from '../natura11yComponents/button/ButtonIconOnly';

import ButtonIconOverText from '../natura11yComponents/button/ButtonIconOverText';

import FormValidation from '../natura11yComponents/form/FormValidation';

import PrimaryNavigation from '../natura11yComponents/navigation/PrimaryNavigation';

import ModalParent from '../natura11yComponents/modal/ModalParent';

import LightboxExample from '../natura11yComponents/lightbox/LightboxExample';

import Tabs from '../natura11yComponents/tab/Tabs';

import Table from '../natura11yComponents/table/Table';

import TableScroll from '../natura11yComponents/table/TableScroll';

const Example = ({ examples }) => {

	const { slug } = useParams();

	const examplesList = examples
		.filter((header) => header.slug === slug)
		.map((header, index) => (
			<Backdrop
				key={index}
				title={header.title}
				fixedHeight='400px'
				imageURL={`images/banner/${header.slug}.jpg`}
			/>
	));


	const activeExample = () => {

		switch (slug) {

			case 'accordion':
				return (
					<div className='narrow margin-x-auto'>
						<Accordion />
					</div>
				);

			case 'alert':
				return (
					<div className='narrow margin-x-auto'>
						<AlertParent />
					</div>
				);

			case 'backdrop':
				return (
					<div className='medium margin-x-auto'>
						<Backdrop stack='lg' utilities='theme-primary' />
					</div>
				);
			
			case 'button':
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
					</>
				);

			case 'form':
				return (
					<div className='narrow margin-x-auto'>
						<FormValidation />
					</div>
				);

			case 'modal':
				return (
					<div className='narrow margin-x-auto'>
						<ModalParent />
					</div>
				);

			case 'lightbox':
				return (
					<div className='medium margin-x-auto'>
						<LightboxExample />
					</div>
				);

			case 'navigation':
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

			case 'tab':
				return (
					<div className='medium margin-x-auto'>
						<Tabs />
					</div>
				);

			case 'table':
				return (
					<div className='wide margin-x-auto'>
						<TableScroll />
						<Table utilities={'table--stack--lg margin-y-5'} />
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div>
			{examplesList}

			<div className='margin-y-5'>
				{activeExample()}
			</div>
		</div>
	);
};

export default Example;
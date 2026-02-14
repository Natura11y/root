import { useParams } from 'react-router-dom';

import Accordion from '../natura11y/accordion/Accordion';
import AlertParent from '../natura11y/alert/AlertParent';
import FormValidation from '../natura11y/form/FormValidation';
import ModalParent from '../natura11y/modal/ModalParent';
import LightboxExample from '../natura11y/lightbox/LightboxExample';
import Tabs from '../natura11y/tab/Tabs';

import ButtonExamples from './examples/ButtonExamples';
import NavigationExamples from './examples/NavigationExamples';
import TableExamples from './examples/TableExamples';

import Backdrop from './Backdrop';

// Configuration map for all examples
const exampleConfig = {
	accordion: {
		component: Accordion,
		wrapperClass: 'narrow margin-x-auto',
	},
	alert: {
		component: AlertParent,
		wrapperClass: 'narrow margin-x-auto',
	},
	button: {
		component: ButtonExamples,
		wrapperClass: null, // ButtonExamples handles its own layout
	},
	form: {
		component: FormValidation,
		wrapperClass: 'narrow margin-x-auto',
	},
	modal: {
		component: ModalParent,
		wrapperClass: 'narrow margin-x-auto',
	},
	lightbox: {
		component: LightboxExample,
		wrapperClass: 'medium margin-x-auto',
	},
	navigation: {
		component: NavigationExamples,
		wrapperClass: null, // NavigationExamples handles its own layout
	},
	tab: {
		component: Tabs,
		wrapperClass: 'medium margin-x-auto',
	},
	table: {
		component: TableExamples,
		wrapperClass: null, // TableExamples handles its own layout
	},
};

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

	const renderExample = () => {
		const config = exampleConfig[slug];

		if (!config) {
			return null;
		}

		const { component: Component, wrapperClass } = config;

		// If there's a wrapper class, wrap the component
		if (wrapperClass) {
			return (
				<div className={wrapperClass}>
					<Component />
				</div>
			);
		}

		// Otherwise render the component directly (it handles its own layout)
		return <Component />;
	};

	return (
		<div>
			{examplesList}

			<div className='margin-y-5'>
				{renderExample()}
			</div>
		</div>
	);
};

export default Example;

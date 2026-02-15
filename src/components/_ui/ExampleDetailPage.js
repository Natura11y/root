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
import TrackExamples from './examples/TrackExamples';

import ExampleHeader from './ExampleHeader';

// Configuration map for all examples

const exampleConfig = {
	accordion: {
		component: Accordion,
		wrapperClass: 'narrow margin-x-auto',
		title: 'Accordion',
	},
	alert: {
		component: AlertParent,
		wrapperClass: 'narrow margin-x-auto',
		title: 'Alert',
	},
	button: {
		component: ButtonExamples,
		wrapperClass: null,
		title: 'Button',
	},
	form: {
		component: FormValidation,
		wrapperClass: 'narrow margin-x-auto',
		title: 'Form',
	},
	modal: {
		component: ModalParent,
		wrapperClass: 'narrow margin-x-auto',
		title: 'Modal',
	},
	lightbox: {
		component: LightboxExample,
		wrapperClass: 'medium margin-x-auto',
		title: 'Lightbox',
	},
	navigation: {
		component: NavigationExamples,
		wrapperClass: 'container',
		title: 'Navigation',
	},
	tab: {
		component: Tabs,
		wrapperClass: 'medium margin-x-auto',
		title: 'Tab',
	},
	table: {
		component: TableExamples,
		wrapperClass: null,
		title: 'Table',
	},
	track: {
		component: TrackExamples,
		wrapperClass: 'container wide--md',
		title: 'Track',
	},
};

const ExampleDetailPage = () => {
	const { slug } = useParams();
	const config = exampleConfig[slug];

	if (!config) {
		return (
			<div className="container narrow margin-y-5">
				<h1>Example not found</h1>
				<p>The example you're looking for doesn't exist.</p>
			</div>
		);
	}

	const { component: Component, wrapperClass, title } = config;

	const renderExample = () => {
		if (wrapperClass) {
			return (
				<div className={wrapperClass}>
					<Component />
				</div>
			);
		}
		return <Component />;
	};

	return (
		<>
			<ExampleHeader title={title} slug={slug} />

			<div className='margin-y-6'>
				{renderExample()}
			</div>
		</>
	);
};

export default ExampleDetailPage;
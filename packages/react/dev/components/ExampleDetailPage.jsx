import { useParams } from 'react-router-dom';

import AccordionExamples from './examples/AccordionExamples';
import AlertParent from '@lib/components/natura11y/alert/AlertParent';
import FormValidation from '@lib/components/natura11y/form/FormValidation';
import ModalParent from '@lib/components/natura11y/modal/ModalParent';
import LightboxExample from '@lib/components/natura11y/lightbox/LightboxExample';
import TabExamples from './examples/TabExamples';

import BackdropVideoExamples from './examples/BackdropVideoExamples';
import BadgeExamples from './examples/BadgeExamples';
import BreadcrumbExamples from './examples/BreadcrumbExamples';
import CardExamples from './examples/CardExamples';
import CollapseExamples from './examples/CollapseExamples';
import ButtonExamples from './examples/ButtonExamples';
import DropdownExamples from './examples/DropdownExamples';
import FlyoutExamples from './examples/FlyoutExamples';
import MainMenuExamples from './examples/MainMenuExamples';
import NestedNavExamples from './examples/NestedNavExamples';
import PaginationExamples from './examples/PaginationExamples';
import IconExamples from './examples/IconExamples';
import TableExamples from './examples/TableExamples';
import TrackExamples from './examples/TrackExamples';

import ExampleHeader from './ExampleHeader';

// Configuration map for all examples

const exampleConfig = {
	accordion: {
		component: AccordionExamples,
		wrapperClass: 'narrow margin-x-auto',
		title: 'Accordion',
	},
	alert: {
		component: AlertParent,
		wrapperClass: 'narrow margin-x-auto',
		title: 'Alert',
	},
	backdrop: {
		component: BackdropVideoExamples,
		wrapperClass: null,
		title: 'Backdrop',
	},
	badge: {
		component: BadgeExamples,
		wrapperClass: null,
		title: 'Badge',
	},
	breadcrumb: {
		component: BreadcrumbExamples,
		wrapperClass: null,
		title: 'Breadcrumb',
	},
	button: {
		component: ButtonExamples,
		wrapperClass: null,
		title: 'Button',
	},
	card: {
		component: CardExamples,
		wrapperClass: null,
		title: 'Card',
	},
	collapse: {
		component: CollapseExamples,
		wrapperClass: null,
		title: 'Collapse',
	},
	dropdown: {
		component: DropdownExamples,
		wrapperClass: 'container',
		title: 'Dropdown',
	},
	flyout: {
		component: FlyoutExamples,
		wrapperClass: null,
		title: 'Flyout',
	},
	form: {
		component: FormValidation,
		wrapperClass: 'narrow margin-x-auto',
		title: 'Form',
	},
	icon: {
		component: IconExamples,
		wrapperClass: 'container narrow margin-x-auto',
		title: 'Icon',
	},
	lightbox: {
		component: LightboxExample,
		wrapperClass: 'medium margin-x-auto',
		title: 'Lightbox',
	},
	'main-menu': {
		component: MainMenuExamples,
		wrapperClass: null,
		title: 'Main Menu',
	},
	modal: {
		component: ModalParent,
		wrapperClass: 'narrow margin-x-auto',
		title: 'Modal',
	},
	'nested-nav': {
		component: NestedNavExamples,
		wrapperClass: null,
		title: 'Nested Nav',
	},
	pagination: {
		component: PaginationExamples,
		wrapperClass: null,
		title: 'Pagination',
	},
	tab: {
		component: TabExamples,
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

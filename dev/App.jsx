import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { LightboxProvider } from '@lib/context/LightboxContext';

import classNames from 'classnames';

// LOCAL: full SCSS with local component additions (development)
import './styles/index.scss';
// NPM: swap to this line after publishing natura11y with new components
// import 'natura11y/src/scss/index.scss';

import ScrollToTop from './components/ScrollToTop';
import MainMenuBar from './components/MainMenuBar';
import Home from './components/Home';
import ExampleDetailPage from './components/ExampleDetailPage';
import About from './components/About';

const App = () => {

	const examples = [
		{
			title: 'Accordion',
			slug: 'accordion'
		},
		{
			title: 'Alert',
			slug: 'alert'
		},
		{
			title: 'Backdrop',
			slug: 'backdrop'
		},
		{
			title: 'Badge',
			slug: 'badge'
		},
		{
			title: 'Breadcrumb',
			slug: 'breadcrumb'
		},
		{
			title: 'Button',
			slug: 'button'
		},
		{
			title: 'Card',
			slug: 'card'
		},
		{
			title: 'Collapse',
			slug: 'collapse'
		},
		{
			title: 'Dropdown',
			slug: 'dropdown'
		},
		{
			title: 'Flyout',
			slug: 'flyout'
		},
		{
			title: 'Form',
			slug: 'form'
		},
		{
			title: 'Icon',
			slug: 'icon'
		},
		{
			title: 'Lightbox',
			slug: 'lightbox'
		},
		{
			title: 'Main Menu',
			slug: 'main-menu'
		},
		{
			title: 'Modal',
			slug: 'modal'
		},
		{
			title: 'Nested Nav',
			slug: 'nested-nav'
		},
		{
			title: 'Pagination',
			slug: 'pagination'
		},
		{
			title: 'Tab',
			slug: 'tab'
		},
		{
			title: 'Table',
			slug: 'table'
		},
		{
			title: 'Track',
			slug: 'track'
		},
	];

  	return (
		<Router>
			<ScrollToTop />

			<MainMenuBar />

			<LightboxProvider>
				<Routes>
					<Route path='/' element={
						<main className={classNames('container', 'wide')}>
							<Home examples={examples} />
						</main>
					} />
					<Route path='/about' element={
						<main className={classNames('container', 'medium')}>
							<About />
						</main>
					} />
					<Route path='/:slug' element={
						<main>
							<ExampleDetailPage />
						</main>
					} />
				</Routes>
			</LightboxProvider>
		</Router>
	);
}

export default App;
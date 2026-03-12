import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { LightboxProvider } from './context/LightboxContext';

import classNames from 'classnames';

// LOCAL: full SCSS with local component additions (development)
import './styles/index.scss';
// NPM: swap to this line after publishing natura11y with new components
// import 'natura11y/src/scss/index.scss';

import ScrollToTop from './components/_ui/ScrollToTop';
import MainMenuBar from './components/_ui/MainMenuBar';
import Home from './components/_ui/Home';
import ExampleDetailPage from './components/_ui/ExampleDetailPage';
import About from './components/_ui/About';

const App = () => {

	const examples = [
		{
			title: 'Accordion',
			slug: 'accordion'
		},
		{
			title: 'Backdrop',
			slug: 'backdrop'
		},
		{
			title: 'Alert',
			slug: 'alert'
		},
		{
			title: 'Button',
			slug: 'button'
		},
		{
			title: 'Collapse',
			slug: 'collapse'
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
			title: 'Modal',
			slug: 'modal'
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
			title: 'Dropdown',
			slug: 'dropdown'
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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { LightboxProvider } from './context/LightboxContext';

import classNames from 'classnames';

import 'natura11y/src/scss/index.scss';

import ScrollToTop from './components/_ui/ScrollToTop';
import GlobalHeader from './components/_ui/GlobalHeader';
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
			title: 'Alert',
			slug: 'alert'
		},
		{
			title: 'Button',
			slug: 'button'
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
			title: 'Navigation',
			slug: 'navigation'
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

			<GlobalHeader />

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
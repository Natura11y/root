import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { LightboxProvider } from './context/LightboxContext';

import classNames from 'classnames';

import 'natura11y/src/scss/index.scss';

import Header from './components/_ui/Header';
import Home from './components/_ui/Home';
import Example from './components/_ui/Example';
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
			title: 'Icon',
			slug: 'icon'
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
	];

  	return ( 
		<Router>
			
			<Header />
			
			<LightboxProvider>
				<main className={classNames('container', 'medium')}>
					<Routes>
						<Route path='/' element={<Home examples={examples} />}>
							<Route path=':slug' element={<Example examples={examples} />} />
						</Route>
						<Route path='/about' element={<About />} />
					</Routes>
				</main>
			</LightboxProvider>
		</Router>
	);
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { LightboxProvider } from './context/LightboxContext';

import classNames from 'classnames';

import 'natura11y/src/scss/natura11y.scss';

import Header from './_uiComponents/Header';
import Home from './_uiComponents/Home';
import Example from './_uiComponents/Example';

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
					</Routes>
				</main>
			</LightboxProvider>
		</Router>
	);
}

export default App;
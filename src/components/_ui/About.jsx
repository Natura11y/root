const About = () => {
	return (
		<div className="container narrow margin-y-5">
			<h1>About Natura11y React Components</h1>

			<div className="margin-y-4">
				<h2 className="h4">What is this?</h2>
				<p>
					This is a showcase of React component implementations for the{' '}
					<a href="https://natura11y.com" target="_blank" rel="noopener noreferrer">
						Natura11y Inclusive Framework
					</a>
					. These components demonstrate how to integrate Natura11y's accessible CSS and JavaScript utilities into React applications.
				</p>
			</div>

			<div className="margin-y-4">
				<h2 className="h4">About Natura11y</h2>
				<p>
					Natura11y is an open-source, accessibility-first CSS framework that provides modern,
					inclusive components and utilities. It's designed to work across different frameworks
					and build tools, making accessible web development easier and more consistent.
				</p>
			</div>

			<div className="margin-y-4">
				<h2 className="h4">Philosophy</h2>
				<p>
					These React components follow a <strong>zero duplication</strong> approach:
				</p>
				<ul>
					<li>All styles come from the Natura11y NPM package</li>
					<li>JavaScript utilities are imported from Natura11y core</li>
					<li>React patterns are used only where they add value</li>
					<li>Components are portable and framework-agnostic</li>
				</ul>
			</div>

			<div className="margin-y-4">
				<h2 className="h4">Get Started</h2>
				<p>
					Install Natura11y and start using these components in your React project:
				</p>
				<pre className="padding-3 theme-primary border-radius">
					<code>npm install natura11y classnames</code>
				</pre>
			</div>

			<div className="margin-y-4">
				<h2 className="h4">Resources</h2>
				<ul>
					<li>
						<a href="https://github.com/cavidano/natura11y" target="_blank" rel="noopener noreferrer">
							Natura11y Framework on GitHub
						</a>
					</li>
					<li>
						<a href="https://github.com/cavidano/natura11y-react" target="_blank" rel="noopener noreferrer">
							This React Showcase on GitHub
						</a>
					</li>
					<li>
						<a href="https://natura11y.com" target="_blank" rel="noopener noreferrer">
							Official Natura11y Documentation
						</a>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default About;

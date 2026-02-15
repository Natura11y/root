import { useState, useRef } from 'react';

import classNames from 'classnames';

import Alert from './';

const AlertParent = () => {

	const [showAlert, setShowAlert] = useState(true);
	const alertRef = useRef();

    const handleAlertClose = () => {
		setShowAlert(false);
	};

	return (
		<>
			{showAlert && (
				<Alert
					ref={alertRef}
					handleAlertClose={handleAlertClose}
					title="Success!"
					utilities={classNames('box-shadow-1', 'margin-bottom-4')}
				>
					<p>
						Thank you for your feedback. A confirmation message has been sent to
						your email. Return to our <a href='#1'>homepage</a>.
					</p>
				</Alert>
			)}

			<Alert
				success={false}
				title="Warning!"
				utilities="margin-bottom-4"
			>
				<p>
					Your feedback was not sent. Please check your connection and try again.
					Return to our <a href='#1'>homepage</a>.
				</p>
			</Alert>

			<Alert 
				success={false} 
				inverse={true}
				title="Critical Error"
				utilities="margin-bottom-4"
			>
				<p>
					System error occurred. Please contact support immediately.
					Return to our <a href='#1'>homepage</a>.
				</p>
			</Alert>

			<Alert
				success={true}
				inverse={true}
				title="Information"
			>
				<p>
					This is an informational message with inverse styling.
					Return to our <a href='#1'>homepage</a>.
				</p>
			</Alert>
		</>
	);
};

export default AlertParent;
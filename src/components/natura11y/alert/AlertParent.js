import React, { useState } from 'react';

import classNames from 'classnames';
import Alert from './Alert';

const AlertParent = () => {

	const [showAlert, setShowAlert] = useState(true);

    const handleAlertClose = () => {
		setShowAlert(false);
	};

	return (
		<>
			{showAlert && (
				<Alert
					handleAlertClose={handleAlertClose}
					utilities={classNames('box-shadow-1')}
				>
					<p>
						Thank you for your feedback. A confirmation message has been sent to
						your email. Return to our <a href='#1'>homepage</a>.
					</p>
				</Alert>
			)}

			<div className="margin-y-4">
				<Alert
					success={false}
				>
					<p>
						Your feedback was not sent. A confirmation message has been sent to
						your email. Return to our <a href='#1'>homepage</a>.
					</p>
				</Alert>
			</div>

			<div className="margin-y-4">
				<Alert success={false} inverse={true}>
					<p>
						Thank you for your feedback. A confirmation message has been sent to
						your email. Return to our <a href='#1'>homepage</a>.
					</p>
				</Alert>
			</div>
		</>
	);
};

export default AlertParent;
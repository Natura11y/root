import React, { useContext } from 'react';

import classNames from 'classnames';

import { LightboxContext } from '../../context/LightboxContext';

const LightboxButton = (props) => {

  const {
    lbType = 'image',
    lbSrc = '', 
    lbCaption = 'A caption for the image',
    utilities = null,
    children = 'Lightbox Button'
  } = props;

  const { handleLightboxOpen } = useContext(LightboxContext);

  const componentClasses = classNames({
    [`${utilities}`]: utilities !== null,
  });

  return (
    <button
      data-lightbox-type={lbType}
      className={componentClasses}
      onClick={() => handleLightboxOpen(lbType, lbSrc, lbCaption)}
    >
      {children}
    </button>
  );
};

export default LightboxButton;
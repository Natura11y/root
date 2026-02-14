import { useContext } from 'react';

import classNames from 'classnames';

import { LightboxContext } from '../../../context/LightboxContext';

const LightboxButton = (props) => {

  const {
    lbType = 'image',
    lbSrc = '', 
    lbCaption = 'A caption for the image',
    utilities = null,
    children = 'Lightbox Button'
  } = props;

  const { handleLightboxOpen } = useContext(LightboxContext);

  const lightboxButtonClasses = classNames({
    [`${utilities}`]: utilities !== null,
  });

  return (
    <button
      className={lightboxButtonClasses}
      data-lightbox={lbType}
      onClick={() => handleLightboxOpen(lbType, lbSrc, lbCaption)}
    >
      {children}
    </button>
  );
};

export default LightboxButton;
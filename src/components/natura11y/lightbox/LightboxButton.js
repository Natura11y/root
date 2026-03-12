import { useContext } from 'react';

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

  return (
    <button
      className={utilities || undefined}
      data-lightbox={lbType}
      onClick={() => handleLightboxOpen(lbType, lbSrc, lbCaption)}
    >
      {children}
    </button>
  );
};

export default LightboxButton;
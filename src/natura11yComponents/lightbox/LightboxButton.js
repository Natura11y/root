import React, { useContext } from 'react';
import classNames from 'classnames';
import { LightboxContext } from '../../context/LightboxContext';

const LightboxButton = (props) => {
  const { lbType, lbSrc, lbCaption, utilities = null, children = 'Lightbox Button' } = props;
  const { lightboxOpenHandler } = useContext(LightboxContext);

  const componentClasses = classNames({
    [`${utilities}`]: utilities !== null,
  });

  return (
    <button
      data-lightbox-type={lbType}
      className={componentClasses}
      onClick={() => lightboxOpenHandler(lbType, lbSrc, lbCaption)}
    >
      {children}
    </button>
  );
};

export default LightboxButton;
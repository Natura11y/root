import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { LightboxContext } from '../../context/LightboxContext';

const LightboxButton = (props) => {
  const { lbType, lbSrc, lbCaption, onMount, utilities = null, children = 'Lightbox Button' } = props;

  const { lightboxOpenHandler } = useContext(LightboxContext);

  useEffect(() => {
    onMount({ lbType, lbSrc, lbCaption });
  }, []);

  const componentClasses = classNames({
    [`${utilities}`]: utilities !== null,
  });

  const handleClick = () => {
    lightboxOpenHandler(lbType, lbSrc, lbCaption);
  };

  return (
    <button
      data-lightbox-type={lbType}
      className={componentClasses}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default LightboxButton;
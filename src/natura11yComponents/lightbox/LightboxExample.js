import React, { Fragment, useContext } from 'react';
import { LightboxContext } from '../../context/LightboxContext';
import LightboxButton from './LightboxButton';

import LocalImage from './_assets/eberhard-grossgasteiger-yF9Tm4qrYmM-unsplash.jpg';
import LocalVideoThumb from './_assets/pexels-dmitry-varennikov-5527698-thumbnail.jpg';
import LocalVideo from './_assets/pexels-dmitry-varennikov-5527698-1080p.mp4';

const LightboxExample = () => {
  const { addToMediaArray, lightboxOpenHandler, mediaArray } = useContext(LightboxContext);

  const lightboxButtonMount = (media) => {
    addToMediaArray(media);
  };

  return (
    <Fragment>
      <div className='container narrow grid gap-3'>
        <LightboxButton
          utilities='lightbox-button'
          lbType='image'
          lbSrc={LocalImage}
          lbCaption='Caption for example 1'
          lightboxOpenHandler={lightboxOpenHandler}
          onMount={lightboxButtonMount}
        >
          <img src={LocalImage} alt='Placeholder' />
        </LightboxButton>
      </div>
    </Fragment>
  );
};

export default LightboxExample;

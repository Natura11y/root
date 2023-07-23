import React, { useEffect, useContext } from 'react';

import { LightboxContext } from '../../context/LightboxContext';

import LightboxButton from './LightboxButton';

import LocalImage from './images/eberhard-grossgasteiger-yF9Tm4qrYmM-unsplash.jpg';
import LocalVideoThumb from './images/pexels-dmitry-varennikov-5527698-thumbnail.jpg';
import LocalVideo from './images/pexels-dmitry-varennikov-5527698-1080p.mp4';

const LightboxExample = () => {
  const { addToMediaArray } = useContext(LightboxContext);

  const localImageMedia = {
    utilities: 'lightbox-button',
    lbType: 'image',
    lbSrc: LocalImage,
    lbCaption: 'Caption for example 1',
  };

  const localVideoMedia = {
    utilities: 'lightbox-button',
    lbType: 'video',
    lbSrc: LocalVideo,
    lbCaption: 'Caption for example 2',
  };

  const youtubeMedia = {
    utilities: 'button theme-primary width-100',
    lbType: 'youtube',
    lbSrc: 'k3ftlbnbwuc',
    lbCaption: 'Caption for example 3',
  };

  const vimeoMedia = {
    utilities: 'button theme-primary width-100',
    lbType: 'vimeo',
    lbSrc: '54802209?h=53340e8e30',
    lbCaption: 'Caption for example 4',
  };

  useEffect(() => {
    addToMediaArray(localImageMedia);
    addToMediaArray(localVideoMedia);
    addToMediaArray(youtubeMedia);
    addToMediaArray(vimeoMedia);

    // Clean up on unmount
    return () => {
      // You may want to update your context function to specifically remove items if necessary
    };
  }, []);

  return (
    <div className='container narrow grid gap-4'>
      <LightboxButton {...localImageMedia}>
        <img src={LocalImage} alt='Placeholder' />
      </LightboxButton>

      <LightboxButton {...localVideoMedia}>
        <img src={LocalVideoThumb} alt='Placeholder' />
      </LightboxButton>

      <LightboxButton {...youtubeMedia}>
        Open YouTube Video
      </LightboxButton>

      <LightboxButton {...vimeoMedia}>
        Open Vimeo Video
      </LightboxButton>
    </div>
  );
};

export default LightboxExample;
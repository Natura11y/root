import { useEffect, useContext } from 'react';
import { LightboxContext } from '../../context/LightboxContext';
import LightboxButton from './LightboxButton';

const LightboxExample = () => {
  const ctx = useContext(LightboxContext);
  if (!ctx) return null;

  const { addToMediaArray } = ctx;

  const imageMedia1 = {
    utilities: 'lightbox-thumbnail',
    lbType: 'image',
    lbSrc: 'https://placehold.co/1500x750',
    lbCaption: 'Caption for example 1',
  };

  const imageMedia2 = {
    utilities: 'lightbox-thumbnail',
    lbType: 'image',
    lbSrc: 'https://placehold.co/1500x750',
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
    addToMediaArray(imageMedia1);
    addToMediaArray(imageMedia2);
    addToMediaArray(youtubeMedia);
    addToMediaArray(vimeoMedia);
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='container narrow grid gap-4'>
      <LightboxButton {...imageMedia1}>
        <img src='https://placehold.co/1500x750' alt='Placeholder' />
      </LightboxButton>
      <LightboxButton {...imageMedia2}>
        <img src='https://placehold.co/1500x750' alt='Placeholder' />
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
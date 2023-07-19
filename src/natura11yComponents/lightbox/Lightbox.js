import React, { useContext } from 'react';
import { LightboxContext } from '../../context/LightboxContext';

const Lightbox = () => {

  const {
    mediaArray, 
    lightboxData, 
    lightboxCloseHandler,
    handleNextPrevious,
    handleCloseOutside,
    lbContainer,
    lbPrevious,
    lbNext,
    lbClose
  } = useContext(LightboxContext);

  const {
    isOpen, 
    lbType, 
    lbSrc, 
    lbCaption 
  } = lightboxData;

  const updateLightboxContent = () => {
    if (lbType === 'video') {
      return (
        <video controls key={lbSrc}>
          <source src={lbSrc} type='video/mp4' />
        </video>
      );
    } else if (lbType === 'youtube') {
      return (
        <iframe
          key={lbSrc}
          title='YouTube Video'
          src={`https://www.youtube.com/embed/${lbSrc}`}
          frameBorder='0'
          allow='autoplay; fullscreen;'
          allowFullScreen
        ></iframe>
      );
    } else if (lbType === 'vimeo') {
      return (
        <iframe
          key={lbSrc}
          title='Vimeo Video'
          src={`https://player.vimeo.com/video/${lbSrc}`}
          frameBorder='0'
          allow='autoplay; fullscreen;'
          allowFullScreen
        ></iframe>
      );
    } else {
      return <img src={lbSrc} alt='' key={lbSrc} />;
    }
  };

  return (
    <div className='lightbox' ref={lbContainer} aria-hidden={!isOpen} onClick={handleCloseOutside}>

      <div className='lightbox__buttons'>
        {mediaArray.length > 1 && (
          <>
            <button
              className='button button--icon-only'
              ref={lbPrevious}
              onClick={() => handleNextPrevious(-1)}
            >
              <span className='icon icon-arrow-left' aria-label='Previous'></span>
            </button>

            <button
              className='button button--icon-only'
              ref={lbNext} 
              onClick={() => handleNextPrevious(1)}
            >
              <span className='icon icon-arrow-right' aria-label='Next'></span>
            </button>
          </>
        )}

        <button
          className='button button--icon-only'
          ref={lbClose}
          onClick={lightboxCloseHandler}
        >
          <span className='icon icon-close' aria-label='Close'></span>
        </button>
      </div>

      <figure className='lightbox__container'>
        <div className='lightbox__media'>{updateLightboxContent()}</div>
        {lbCaption && <figcaption className='lightbox__caption'>{lbCaption}</figcaption>}
      </figure>
      
    </div>
  );

};

export default Lightbox;
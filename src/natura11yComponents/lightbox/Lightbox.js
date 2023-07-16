import React from 'react';

const Lightbox = (props) => {

    const { 
        isOpen,
        lbType,
        lbSrc,
        lbCaption,
        onClose,
        onNext,
        onPrevious,
        onClickOutside,
        refs
    } = props;

    const updateLightboxContent = () => {

        if (lbType === 'video') {
            return (
                <video controls>
                    <source src={lbSrc} type='video/mp4' />
                </video>
            );
        } else if (lbType === 'youtube') {
            return (
                <iframe
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
                title='Vimeo Video'
                src={`https://player.vimeo.com/video/${lbSrc}`}
                frameBorder='0'
                allow='autoplay; fullscreen;'
                allowFullScreen
                ></iframe>
            );
        } else {
            return (
                <img src={lbSrc} alt="" />
            );
        }
    };
    
	return (

        <div
            className='lightbox'
            ref={refs.lbContainer}
            aria-hidden={!isOpen}
            onClick={onClickOutside}
        >
            <div className='lightbox__buttons'>
                <button
                    className='button button--icon-only'
                    ref={refs.lbPrevious}
                    onClick={onPrevious}
                >
                    <span className='icon icon-arrow-left' aria-label='Previous'></span>
                </button>
                <button
                    className='button button--icon-only'
                    ref={refs.lbNext}
                    onClick={onNext}
                >
                    <span className='icon icon-arrow-right' aria-label='Next'></span>
                </button>
                <button
                    className='button button--icon-only'
                    ref={refs.lbClose}
                    onClick={onClose}
                >
                    <span className='icon icon-close' aria-label='Close'></span>
                </button>
            </div>

            <figure className='lightbox__container'>
                <div className='lightbox__media'>{updateLightboxContent()}</div>
                <figcaption className='lightbox__caption'>
                    {lbCaption}
                </figcaption>
            </figure>
        </div>
    
    );
};

export default Lightbox;
import React, { Fragment, useEffect, useState, useRef, forwardRef } from 'react';

const Lightbox = (props) => {

    const { 
        isOpen,
        type,
        src,
        caption,
        onClose,
        onNext,
        onPrevious,
        onClickOutside,
        refs
    } = props;

    const updateLightboxContent = () => {

        if (type === 'video') {
            return (
                <video controls>
                    <source src={src} type='video/mp4' />
                </video>
            );
        } else if (type === 'youtube') {
            return (
                <iframe
                title='YouTube Video'
                src={`https://www.youtube.com/embed/${src}`}
                frameBorder='0'
                allow='autoplay; fullscreen;'
                allowFullScreen
                ></iframe>
            );
        } else if (type === 'vimeo') {
            return (
                <iframe
                title='Vimeo Video'
                src={`https://player.vimeo.com/video/${src}`}
                frameBorder='0'
                allow='autoplay; fullscreen;'
                allowFullScreen
                ></iframe>
            );
        } else {
            return (
                <img src={src} alt="" />
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
            <div className='button-group lightbox__buttons'>
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
                    {caption}
                </figcaption>
            </figure>
        </div>
    
    );
};

export default Lightbox;
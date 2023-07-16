import React, { Fragment, useState, useEffect, useRef } from 'react';

import { handleOverlayOpen, handleOverlayClose } from '../../utilities/overlay';

import LightboxButton from './LightboxButton';
import Lightbox from './Lightbox';

import LocalImage from './_assets/eberhard-grossgasteiger-yF9Tm4qrYmM-unsplash.jpg';

import LocalVideoThumb from './_assets/pexels-dmitry-varennikov-5527698-thumbnail.jpg';
import LocalVideo from './_assets/pexels-dmitry-varennikov-5527698-1080p.mp4';

const LightboxParent = () => {

    const [mediaArray, setMediaArray] = useState([]);
	const [currentLB, setCurrentLB] = useState(0);
    const [lightboxState, setLightboxState] = useState({
        isOpen: false,
        lbType: '',
        lbSrc: '',
        lbCaption: '',
    });

    const lbContainer = useRef(null);
    const lbPrevious = useRef(null);
    const lbNext = useRef(null);
    const lbClose = useRef(null);

    const lightboxRefs = {
        lbContainer, 
        lbPrevious, 
        lbNext, 
        lbClose
    };

    const lightboxButtonMount = (media) => {
        setMediaArray((prevArray) => [...prevArray, media]);
    };

    const lightboxOpenHandler = (lbType, lbSrc, lbCaption) => {
        setLightboxState({ isOpen: true, lbType, lbSrc, lbCaption });

        console.log(lbContainer.current, 'lbContainer.current');

		handleOverlayOpen(lbContainer.current);
    };

    const lightboxCloseHandler = () => {
        setLightboxState({ isOpen: false, lbType: '', lbSrc: '', lbCaption: '' });
        handleOverlayClose(lbContainer.current);
    };

	const handleLightboxUpdate = (e) => {
		switch (e.code) {
			case 'ArrowLeft':
				updateDirection(-1);
				lbPrevious.current.focus();
				break;
			case 'ArrowRight':
				updateDirection(1);
				lbNext.current.focus();
				break;
			case 'Escape':
				lightboxCloseHandler();
				break;
			default:
				return;
		}
	};

	const handleNextPrevious = (dir) => {
		updateDirection(dir);
	};

    const updateDirection = (dir) => {
        let newLB = currentLB + dir;

        if (newLB < 0) {
            newLB = mediaArray.length - 1;
        } else if (newLB >= mediaArray.length) {
            newLB = 0;
        }
        
        setCurrentLB(newLB);
    };

    const handleCloseOutside = (event) => {
        if (event.target.classList.contains('lightbox')) {
        lightboxCloseHandler();
        }
    };

    useEffect(() => {
        const currentMedia = mediaArray[currentLB];

        if (currentMedia) {
            setLightboxState({
                isOpen: true,
                lbType: currentMedia.lbType,
                lbSrc: currentMedia.lbSrc,
                lbCaption: currentMedia.lbCaption
            });
        }
    }, [currentLB]);

    useEffect(() => {
        console.log(mediaArray, 'mediaArray');
		document.addEventListener('keydown', handleLightboxUpdate);

		return () => {
			document.removeEventListener('keydown', handleLightboxUpdate);
		};
	}, [lightboxState, mediaArray]);

    return (
        <Fragment>

            <div className="container narrow grid gap-3">
            
                <LightboxButton
                    utilities='lightbox-button'
                    lbType='image'
                    lbSrc={LocalImage}
                    lbCaption='Caption for example 1'
                    onClick={lightboxOpenHandler}
                    onMount={lightboxButtonMount}
                >
                    <img src={LocalImage} alt='Placeholder' />
                </LightboxButton>
            
                <LightboxButton
                    utilities='lightbox-button'
                    lbType='video'
                    lbSrc={LocalVideo}
                    lbCaption='Caption for example 2'
                    onClick={lightboxOpenHandler}
                    onMount={lightboxButtonMount}
                >
                    <img src={LocalVideoThumb} alt='Placeholder' />
                </LightboxButton>

                <LightboxButton
                    utilities='button theme-primary width-100'
                    lbType='youtube'
                    lbSrc='k3ftlbnbwuc'
                    lbCaption='Caption for example 3'
                    onClick={lightboxOpenHandler}
                    onMount={lightboxButtonMount}
                >
                    Open YouTube Video
                </LightboxButton>

                <LightboxButton
                    utilities='button theme-primary width-100'
                    lbType='vimeo'
                    lbSrc='54802209?h=53340e8e30'
                    lbCaption='Caption for example 4'
                    onClick={lightboxOpenHandler}
                    onMount={lightboxButtonMount}
                >
                    Open Vimeo Video
                </LightboxButton>

            </div>

            <Lightbox
                refs={lightboxRefs}
                isOpen={lightboxState.isOpen}
                lbType={lightboxState.lbType}
                lbSrc={lightboxState.lbSrc}
                lbCaption={lightboxState.lbCaption}
                onNext={() => handleNextPrevious(1)}
                onPrevious={() => handleNextPrevious(-1)}
                onClose={lightboxCloseHandler}
                onClickOutside={handleCloseOutside}
            />
        </Fragment>
    );
};

export default LightboxParent;
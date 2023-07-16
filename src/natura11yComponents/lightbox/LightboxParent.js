import React, { useState, useEffect, useRef } from 'react';

import LightboxButton from './LightboxButton';
import Lightbox from './Lightbox';

import LocalImage from './_assets/eberhard-grossgasteiger-yF9Tm4qrYmM-unsplash.jpg';

import LocalVideoThumb from './_assets/pexels-dmitry-varennikov-5527698-thumbnail.jpg';
import LocalVideo from './_assets/pexels-dmitry-varennikov-5527698-1080p.mp4';

const LightboxParent = () => {

    const [mediaArray, setMediaArray] = useState([]);
	const [currentLB, setCurrentLB] = useState(0);

    const lbPrevious = useRef(null);
    const lbNext = useRef(null);
    const lbClose = useRef(null);

    const [lightboxState, setLightboxState] = useState({
        isOpen: false,
        type: '',
        src: '',
        caption: '',
    });

    const lightboxButtonMount = (media) => {
        setMediaArray((prevArray) => [...prevArray, media]);
    };

    const lightboxOpenHandler = (src, caption, type) => {
        setLightboxState({ isOpen: true, src, caption, type });
    };

    const lightboxCloseHandler = () => {
        setLightboxState({ isOpen: false, src: '', caption: '', type: '' });
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

    useEffect(() => {
        const currentMedia = mediaArray[currentLB];

        if (currentMedia) {
            setLightboxState({
                isOpen: true,
                src: currentMedia.src,
                caption: currentMedia.caption,
                type: currentMedia.type
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
        <div>

        <div className="grid grid--column-2 gap-2">
        
            <LightboxButton
                utilities='lightbox-button'
                type='image'
                src={LocalImage}
                caption='Caption for example 1'
                onClick={lightboxOpenHandler}
                onMount={lightboxButtonMount}
            >
                <img src={LocalImage} alt='Placeholder' />
            </LightboxButton>
        
            <LightboxButton
                utilities='lightbox-button'
                type='video'
                src={LocalVideo}
                caption='Caption for example 1'
                onClick={lightboxOpenHandler}
                onMount={lightboxButtonMount}
            >
                <img src={LocalVideoThumb} alt='Placeholder' />
            </LightboxButton>

            <LightboxButton
                type='vimeo'
                src='54802209?h=53340e8e30'
                caption='Caption for example 2'
                onClick={lightboxOpenHandler}
                onMount={lightboxButtonMount}
            />

        </div>
            <Lightbox
                refs={{lbPrevious, lbNext, lbClose}}
                isOpen={lightboxState.isOpen}
                src={lightboxState.src}
                caption={lightboxState.caption}
                type={lightboxState.type}
                onNext={() => handleNextPrevious(1)}
                onPrevious={() => handleNextPrevious(-1)}
                onClose={lightboxCloseHandler}
            />
        </div>
    );
};

export default LightboxParent;
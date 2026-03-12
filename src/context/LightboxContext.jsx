import { createContext, useState, useRef, useEffect } from 'react';

import { handleOverlayOpen, handleOverlayClose } from 'natura11y/src/js/utilities/overlay';

import Lightbox from '../components/natura11y/lightbox';

export const LightboxContext = createContext(null);

export const LightboxProvider = ({ children }) => {

  const [mediaArray, setMediaArray] = useState([]);
  const [lightboxData, setLightboxData] = useState({
    isOpen: false,
    lbType: '',
    lbSrc: '',
    lbCaption: '',
    currentLB: 0,
  });

  const lbContainer = useRef(null);
  const lbPrevious = useRef(null);
  const lbNext = useRef(null);
  const lbClose = useRef(null);

  const previousIsOpen = useRef(lightboxData.isOpen);

  const addToMediaArray = (media) => {
    setMediaArray((prevArray) => [...prevArray, media]);
  };

  const updateLightboxState = (lbType, lbSrc, lbCaption, isOpen) => {
    setLightboxData(prevState => ({
      ...prevState,
      isOpen,
      lbType,
      lbSrc,
      lbCaption
    }));
  };

  const updateCurrentLB = (newIndex) => {
    setLightboxData(prevState => ({ ...prevState, currentLB: newIndex }));
  };

  const handleLightboxOpen = (lbType, lbSrc, lbCaption) => {
    updateLightboxState(lbType, lbSrc, lbCaption, true);
  };

  const handleLightboxClose = () => {
    updateLightboxState('', '', '', false);
    handleOverlayClose(lbContainer.current);
  };

  const updateLightboxAndFocus = (direction, refToFocus) => {
    updateDirection(direction);
    refToFocus.current.focus();
  };

  const handleLightboxUpdate = (e) => {
    if (!lightboxData.isOpen || mediaArray.length <= 1) {
      return;
    }

    const keyHandlers = {
      ArrowLeft: () => updateLightboxAndFocus(-1, lbPrevious),
      ArrowRight: () => updateLightboxAndFocus(1, lbNext),
      Escape: handleLightboxClose,
    };

    return keyHandlers[e.code]?.();
  };

  const handleNextPrevious = (dir) => {
		if (mediaArray.length <= 1) {
			return;
		}

		updateDirection(dir);
	};

  const updateDirection = (dir) => {
    let newLB = lightboxData.currentLB + dir;

    if (newLB < 0) {
      newLB = mediaArray.length - 1;
    } else if (newLB >= mediaArray.length) {
      newLB = 0;
    }

    updateCurrentLB(newLB);
  };

  const handleCloseOutside = (event) => {
    if (event.target.classList.contains('lightbox')) {
      handleLightboxClose();
    }
  };

  useEffect(() => {
		if (lightboxData.isOpen) {
			document.addEventListener('keydown', handleLightboxUpdate);

      if(!previousIsOpen.current) { 
        handleOverlayOpen(lbContainer.current);
      }
		
    } else if (!lightboxData.isOpen) {
			document.removeEventListener('keydown', handleLightboxUpdate);
		}

		previousIsOpen.current = lightboxData.isOpen;

		return () => {
			document.removeEventListener('keydown', handleLightboxUpdate);
		};
	}, [lightboxData, mediaArray]);

	useEffect(() => {
		const currentMedia = mediaArray[lightboxData.currentLB];

		if (currentMedia) {
			updateLightboxState(currentMedia.lbType, currentMedia.lbSrc, currentMedia.lbCaption, true);
		}
	}, [lightboxData.currentLB]);

  const lightboxContextValue = {
    mediaArray,
    addToMediaArray,
    lightboxData,
    handleLightboxOpen,
    handleLightboxClose,
    handleNextPrevious,
    handleCloseOutside,
    lbContainer,
    lbPrevious,
    lbNext,
    lbClose
  };

  return (
    <LightboxContext.Provider value={lightboxContextValue}>
      {children}
      {lightboxData.isOpen ? (
        <Lightbox />
      ) : null}
    </LightboxContext.Provider>
  );
};
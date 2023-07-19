import React, { createContext, useState, useRef, useEffect } from 'react';

import { handleOverlayOpen, handleOverlayClose } from '../utilities/overlay';

import Lightbox from '../natura11yComponents/lightbox/Lightbox';

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

  const lightboxOpenHandler = (lbType, lbSrc, lbCaption) => {
    updateLightboxState(lbType, lbSrc, lbCaption, true);
  };

  const lightboxCloseHandler = () => {
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
      Escape: lightboxCloseHandler,
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
      lightboxCloseHandler();
    }
  };

	useEffect(() => {
		if (lightboxData.isOpen) {
			document.addEventListener('keydown', handleLightboxUpdate);
      handleOverlayOpen(lbContainer.current);
		} else {
      document.removeEventListener('keydown', handleLightboxUpdate);
    }

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
    lightboxOpenHandler,
    lightboxCloseHandler,
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
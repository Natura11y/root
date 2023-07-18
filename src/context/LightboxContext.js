import React, { createContext, useState, useRef, useEffect } from 'react';
import { handleOverlayOpen, handleOverlayClose } from '../utilities/overlay';
import Lightbox from '../natura11yComponents/lightbox/Lightbox';

export const LightboxContext = createContext();

export const LightboxProvider = ({ children }) => {
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

  const addToMediaArray = (media) => {
    setMediaArray((prevArray) => [...prevArray, media]);
  };

  const lightboxOpenHandler = (lbType, lbSrc, lbCaption) => {
    setLightboxState({ isOpen: true, lbType, lbSrc, lbCaption });
    handleOverlayOpen(lbContainer.current);
  };

  const lightboxCloseHandler = () => {
    setLightboxState({ isOpen: false, lbType: '', lbSrc: '', lbCaption: '' });
    handleOverlayClose(lbContainer.current);
  };

  const handleNextPrevious = (dir) => {
    if (mediaArray.length <= 1) {
      return;
    }

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

  const handleOverlayOpen = () => {
    document.addEventListener('keydown', handleLightboxUpdate);
  };

  const handleOverlayClose = () => {
    document.removeEventListener('keydown', handleLightboxUpdate);
  };

  const handleLightboxUpdate = (e) => {
    if (!lightboxState.isOpen || mediaArray.length <= 1) {
      return;
    }

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

  useEffect(() => {
    const currentMedia = mediaArray[currentLB];

    if (currentMedia) {
      setLightboxState({
        isOpen: false,
        lbType: currentMedia.lbType,
        lbSrc: currentMedia.lbSrc,
        lbCaption: currentMedia.lbCaption,
      });
    }
  }, [currentLB, mediaArray]);

  const lightboxContextValue = {
    mediaArray,
    addToMediaArray,
    lightboxState,
    lightboxOpenHandler,
    lightboxCloseHandler,
    handleNextPrevious,
    handleCloseOutside,
    lbContainer,
    lbPrevious,
    lbNext,
    lbClose,
  };

  return (
    <LightboxContext.Provider value={lightboxContextValue}>
      {children}
      {lightboxState.isOpen && <Lightbox />}
    </LightboxContext.Provider>
  );
};


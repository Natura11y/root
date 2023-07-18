import React, { createContext, useState } from 'react';

export const LightboxContext = createContext();

export const LightboxProvider = ({ children }) => {

  const [mediaArray, setMediaArray] = useState([]);
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    lbType: '',
    lbSrc: '',
    lbCaption: '',
  });

  // const openLightbox = (lbType, lbSrc, lbCaption) => {
  //   setLightboxState({
  //     isOpen: true,
  //     lbType,
  //     lbSrc,
  //     lbCaption,
  //   });
  // };

  // const closeLightbox = () => {
  //   setLightboxState({
  //     isOpen: false,
  //     lbType: '',
  //     lbSrc: '',
  //     lbCaption: '',
  //   });
  // };

  const addToMediaArray = (media) => {
    setMediaArray((prevArray) => [...prevArray, media]);
  };

  return (
    <LightboxContext.Provider value={
      { 
        mediaArray,
        addToMediaArray,
        lightboxState, 
        // openLightbox, 
        // closeLightbox 
      }
    }
    >
      {children}
    </LightboxContext.Provider>
  );
};
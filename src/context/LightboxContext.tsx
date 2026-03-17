import { createContext, useState, useRef, useEffect, type ReactNode, type RefObject } from 'react';
import { useScrollLock } from '../hooks/useScrollLock';
import Lightbox from '../components/natura11y/lightbox';

export interface MediaItem {
  lbType: string;
  lbSrc: string;
  lbCaption: string;
  utilities?: string;
}

export interface LightboxData {
  isOpen: boolean;
  lbType: string;
  lbSrc: string;
  lbCaption: string;
  currentLB: number;
}

export interface LightboxContextValue {
  mediaArray: MediaItem[];
  addToMediaArray: (media: MediaItem) => void;
  lightboxData: LightboxData;
  handleLightboxOpen: (lbType: string, lbSrc: string, lbCaption: string) => void;
  handleLightboxClose: () => void;
  handleNextPrevious: (dir: number) => void;
  handleCloseOutside: (event: React.MouseEvent) => void;
  lbContainer: RefObject<HTMLDivElement | null>;
  lbPrevious: RefObject<HTMLButtonElement | null>;
  lbNext: RefObject<HTMLButtonElement | null>;
  lbClose: RefObject<HTMLButtonElement | null>;
}

export const LightboxContext = createContext<LightboxContextValue | null>(null);

export const LightboxProvider = ({ children }: { children: ReactNode }) => {
  const [mediaArray, setMediaArray] = useState<MediaItem[]>([]);
  const [lightboxData, setLightboxData] = useState<LightboxData>({
    isOpen: false,
    lbType: '',
    lbSrc: '',
    lbCaption: '',
    currentLB: 0,
  });

  const lbContainer = useRef<HTMLDivElement>(null);
  const lbPrevious = useRef<HTMLButtonElement>(null);
  const lbNext = useRef<HTMLButtonElement>(null);
  const lbClose = useRef<HTMLButtonElement>(null);

  const previousIsOpen = useRef(lightboxData.isOpen);

  useScrollLock(lightboxData.isOpen);

  const addToMediaArray = (media: MediaItem) => {
    setMediaArray((prevArray) => [...prevArray, media]);
  };

  const updateLightboxState = (lbType: string, lbSrc: string, lbCaption: string, isOpen: boolean) => {
    setLightboxData(prevState => ({ ...prevState, isOpen, lbType, lbSrc, lbCaption }));
  };

  const updateCurrentLB = (newIndex: number) => {
    setLightboxData(prevState => ({ ...prevState, currentLB: newIndex }));
  };

  const handleLightboxOpen = (lbType: string, lbSrc: string, lbCaption: string) => {
    updateLightboxState(lbType, lbSrc, lbCaption, true);
  };

  const handleLightboxClose = () => {
    updateLightboxState('', '', '', false);
  };

  const updateDirection = (dir: number) => {
    let newLB = lightboxData.currentLB + dir;
    if (newLB < 0) {
      newLB = mediaArray.length - 1;
    } else if (newLB >= mediaArray.length) {
      newLB = 0;
    }
    updateCurrentLB(newLB);
  };

  const updateLightboxAndFocus = (direction: number, refToFocus: RefObject<HTMLButtonElement | null>) => {
    updateDirection(direction);
    refToFocus.current?.focus();
  };

  const handleLightboxUpdate = (e: KeyboardEvent) => {
    if (!lightboxData.isOpen || mediaArray.length <= 1) return;

    const keyHandlers: Record<string, () => void> = {
      ArrowLeft: () => updateLightboxAndFocus(-1, lbPrevious),
      ArrowRight: () => updateLightboxAndFocus(1, lbNext),
      Escape: handleLightboxClose,
    };

    keyHandlers[e.code]?.();
  };

  const handleNextPrevious = (dir: number) => {
    if (mediaArray.length <= 1) return;
    updateDirection(dir);
  };

  const handleCloseOutside = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains('lightbox')) {
      handleLightboxClose();
    }
  };

  useEffect(() => {
    if (lightboxData.isOpen) {
      document.addEventListener('keydown', handleLightboxUpdate);

      if (!previousIsOpen.current) {
        lbClose.current?.focus();
      }
    } else {
      document.removeEventListener('keydown', handleLightboxUpdate);
    }

    previousIsOpen.current = lightboxData.isOpen;

    return () => {
      document.removeEventListener('keydown', handleLightboxUpdate);
    };
  }, [lightboxData, mediaArray]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const currentMedia = mediaArray[lightboxData.currentLB];
    if (currentMedia) {
      updateLightboxState(currentMedia.lbType, currentMedia.lbSrc, currentMedia.lbCaption, true);
    }
  }, [lightboxData.currentLB]); // eslint-disable-line react-hooks/exhaustive-deps

  const lightboxContextValue: LightboxContextValue = {
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
    lbClose,
  };

  return (
    <LightboxContext.Provider value={lightboxContextValue}>
      {children}
      {lightboxData.isOpen ? <Lightbox /> : null}
    </LightboxContext.Provider>
  );
};
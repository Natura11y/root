import { useContext } from 'react';
import classNames from 'classnames';
import { LightboxContext } from '../../../context/LightboxContext';
import ButtonIconOnly from '../button/ButtonIconOnly';
import ImageWithLoading from './ImageWithLoading';

const Lightbox = () => {
  const ctx = useContext(LightboxContext);
  if (!ctx) return null;

  const {
    mediaArray,
    lightboxData,
    handleLightboxClose,
    handleNextPrevious,
    handleCloseOutside,
    lbContainer,
    lbPrevious,
    lbNext,
    lbClose,
  } = ctx;

  const { isOpen, lbType, lbSrc, lbCaption } = lightboxData;

  const mediaTypes: Record<string, (src: string) => React.ReactNode> = {
    video: src => (
      <video controls key={src}>
        <source src={src} type='video/mp4' />
      </video>
    ),
    youtube: src => (
      <iframe
        key={src}
        title='YouTube Video'
        src={`https://www.youtube.com/embed/${src}`}
        allow='autoplay; fullscreen;'
        allowFullScreen
      />
    ),
    vimeo: src => (
      <iframe
        key={src}
        title='Vimeo Video'
        src={`https://player.vimeo.com/video/${src}`}
        allow='autoplay; fullscreen;'
        allowFullScreen
      />
    ),
    default: src => <ImageWithLoading src={src} alt='Lightbox content' key={src} />,
  };

  const renderContent = () => (mediaTypes[lbType] ?? mediaTypes.default)(lbSrc);

  return (
    <div
      className={classNames('lightbox', { 'shown': isOpen })}
      ref={lbContainer}
      aria-hidden={!isOpen}
      tabIndex={isOpen ? 0 : -1}
      onClick={handleCloseOutside}
    >
      <figure className='lightbox__container'>
        <div className='lightbox__media display-block' tabIndex={isOpen ? 0 : -1}>
          {renderContent()}
        </div>
        {lbCaption && <figcaption className='lightbox__caption'>{lbCaption}</figcaption>}
      </figure>

      <div className='lightbox__controls'>
        {mediaArray.length > 1 && (
          <>
            <ButtonIconOnly
              ref={lbPrevious}
              buttonType='button'
              iconHandle='arrow-left'
              onClick={() => handleNextPrevious(-1)}
            />
            <ButtonIconOnly
              ref={lbNext}
              buttonType='button'
              iconHandle='arrow-right'
              onClick={() => handleNextPrevious(1)}
            />
          </>
        )}
        <ButtonIconOnly
          ref={lbClose}
          buttonType='button'
          iconHandle='close'
          onClick={handleLightboxClose}
        />
      </div>
    </div>
  );
};

export default Lightbox;
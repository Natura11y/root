import classNames from 'classnames';
import { useLightbox } from '../../context/LightboxContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import ButtonIconOnly from '../button/ButtonIconOnly';
import ImageWithLoading from './ImageWithLoading';

const Lightbox = () => {
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
  } = useLightbox();

  const { isOpen, lbType, lbSrc, lbCaption, lbAlt } = lightboxData;

  useFocusTrap(lbContainer, {
    enabled: isOpen,
    onEscape: handleLightboxClose,
  });

  const mediaTypes: Record<string, (src: string) => React.ReactNode> = {
    video: src => (
      <video controls aria-label={lbCaption || 'Video'} key={src}>
        <source src={src} type='video/mp4' />
      </video>
    ),
    youtube: src => (
      <iframe
        key={src}
        title={lbCaption || 'YouTube video'}
        src={`https://www.youtube.com/embed/${src}`}
        allow='autoplay; fullscreen;'
        allowFullScreen
      />
    ),
    vimeo: src => (
      <iframe
        key={src}
        title={lbCaption || 'Vimeo video'}
        src={`https://player.vimeo.com/video/${src}`}
        allow='autoplay; fullscreen;'
        allowFullScreen
      />
    ),
    default: src => <ImageWithLoading src={src} alt={lbAlt} key={src} />,
  };

  const renderContent = () => (mediaTypes[lbType as keyof typeof mediaTypes] ?? mediaTypes.default)!(lbSrc);

  return (
    <div
      className={classNames('lightbox', { 'shown': isOpen })}
      ref={lbContainer}
      aria-hidden={!isOpen}
      aria-label='Media viewer'
      aria-modal='true'
      role='dialog'
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
              ariaLabel='Previous item'
              onClick={() => handleNextPrevious(-1)}
            />
            <ButtonIconOnly
              ref={lbNext}
              buttonType='button'
              iconHandle='arrow-right'
              ariaLabel='Next item'
              onClick={() => handleNextPrevious(1)}
            />
          </>
        )}
        <ButtonIconOnly
          ref={lbClose}
          buttonType='button'
          iconHandle='close'
          ariaLabel='Close media viewer'
          onClick={handleLightboxClose}
        />
      </div>
    </div>
  );
};

export default Lightbox;

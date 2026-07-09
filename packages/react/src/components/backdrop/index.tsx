import { useState, useEffect, useRef, type ElementType, type Ref, type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import { useMergedRefs } from '../../hooks/useMergedRefs';

interface BackdropVideoProps {
  ref?: Ref<HTMLElement>;
  tag?: ElementType;
  id?: string;
  videoSrc: string;
  videoType?: string;
  fixedHeight?: string | null;
  stack?: string | null;
  utilities?: string | null;
  mediaUtilities?: string | null;
  videoUtilities?: string | null;
  controlUtilities?: string | null;
  controlButtonUtilities?: string | null;
  credit?: ReactNode;
  children?: ReactNode;
}

interface BackdropProps {
  ref?: Ref<HTMLElement>;
  tag?: ElementType;
  id?: string;
  href?: string;
  target?: string;
  rel?: string;
  imageSrc: string;
  imageAlt?: string;
  fixedHeight?: string | null;
  stack?: string | null;
  utilities?: string | null;
  mediaUtilities?: string | null;
  imageUtilities?: string | null;
  coverUtilities?: string | null;
  credit?: ReactNode;
  children?: ReactNode;
}

const getBackdropClasses = (
  fixedHeight: string | null,
  stack: string | null,
  utilities: string | null
) => classNames(
  'backdrop',
  {
    'backdrop--fixed': fixedHeight !== null || utilities?.includes('aspect-ratio'),
    [`backdrop--stack--${stack}`]: stack !== null && fixedHeight === null,
  },
  utilities
);

const getBackdropStyle = (fixedHeight: string | null) => ({
  '--backdrop-fixed-height': fixedHeight ?? undefined,
}) as CSSProperties;

const Backdrop = ({
  ref,
  tag: Tag = 'div',
  id,
  href,
  target,
  rel,
  imageSrc,
  imageAlt = '',
  fixedHeight = null,
  stack = null,
  utilities = null,
  mediaUtilities = null,
  imageUtilities = null,
  coverUtilities = null,
  credit = null,
  children,
}: BackdropProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const mergedRef = useMergedRefs(containerRef, ref);

  return (
    <Tag
      ref={mergedRef}
      id={id}
      href={href}
      target={target}
      rel={rel}
      className={getBackdropClasses(fixedHeight, stack, utilities)}
      style={getBackdropStyle(fixedHeight)}
    >
      <div className={classNames('backdrop__media', mediaUtilities)}>
        <img className={classNames(imageUtilities)} src={imageSrc} alt={imageAlt} />
      </div>

      <div className={classNames('backdrop__cover', coverUtilities)}>
        {children}
      </div>

      {credit}
    </Tag>
  );
};

const BackdropVideo = ({
  ref,
  tag: Tag = 'div',
  id,
  videoSrc,
  videoType = 'video/mp4',
  fixedHeight = null,
  stack = null,
  utilities = null,
  mediaUtilities = null,
  videoUtilities = 'opacity-30 gradient-mask-bottom',
  controlUtilities = null,
  controlButtonUtilities = null,
  credit = null,
  children,
}: BackdropVideoProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mergedRef = useMergedRefs(containerRef, ref);

  const [isPlaying, setIsPlaying] = useState(
    () => typeof window !== 'undefined'
      ? !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : true
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setIsPlaying(!mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <Tag ref={mergedRef} id={id} className={getBackdropClasses(fixedHeight, stack, utilities)} style={getBackdropStyle(fixedHeight)}>
      <div className={classNames('backdrop__media__control', controlUtilities)}>
        <button
          className={classNames('button button--icon-only', controlButtonUtilities)}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          aria-pressed={isPlaying}
          onClick={() => setIsPlaying(prev => !prev)}
        >
          <Icon iconHandle={isPlaying ? 'pause' : 'play'} />
        </button>
      </div>

      <div className={classNames('backdrop__media', mediaUtilities)}>
        <video
          className={classNames(videoUtilities)}
          ref={videoRef}
          muted
          loop
          playsInline
        >
          <source src={videoSrc} type={videoType} />
        </video>
      </div>

      <div className='backdrop__cover'>
        {children}
      </div>

      {credit}
    </Tag>
  );
};

export { Backdrop };
export default BackdropVideo;

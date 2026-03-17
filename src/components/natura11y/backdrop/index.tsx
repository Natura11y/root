import { useState, useEffect, useRef, type Ref, type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import { useMergedRefs } from '../../../hooks/useMergedRefs';

interface BackdropVideoProps {
  ref?: Ref<HTMLDivElement>;
  videoSrc?: string;
  videoType?: string;
  fixedHeight?: string | null;
  stack?: string | null;
  utilities?: string | null;
  children?: ReactNode;
}

const BackdropVideo = ({
  ref,
  videoSrc,
  videoType = 'video/mp4',
  fixedHeight = null,
  stack = null,
  utilities = null,
  children,
}: BackdropVideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
      video.play();
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

  const backdropClasses = classNames(
    'backdrop',
    {
      'backdrop--fixed': fixedHeight !== null || utilities?.includes('aspect-ratio'),
      [`backdrop--stack--${stack}`]: stack !== null && fixedHeight === null,
    },
    utilities
  );

  const backdropStyle = {
    '--backdrop-fixed-height': fixedHeight ?? undefined,
  } as CSSProperties;

  return (
    <div ref={mergedRef} className={backdropClasses} style={backdropStyle}>
      <div className='backdrop__media'>
        <video
          className='opacity-30 gradient-mask-bottom'
          ref={videoRef}
          muted
          loop
          playsInline
        >
          <source src={videoSrc} type={videoType} />
        </video>

        <div className='backdrop__media__control'>
          <button
            className='button button--icon-only'
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            aria-pressed={isPlaying}
            onClick={() => setIsPlaying(prev => !prev)}
          >
            <Icon iconHandle={isPlaying ? 'pause' : 'play'} />
          </button>
        </div>
      </div>

      <div className='backdrop__cover'>
        {children}
      </div>
    </div>
  );
};

export default BackdropVideo;
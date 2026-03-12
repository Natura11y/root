import { useState, useEffect, useRef } from 'react';

import classNames from 'classnames';

import Icon from '../icon';

const BackdropVideo = ({
	ref,
	videoSrc,
	videoType = 'video/mp4',
	fixedHeight = null,
	stack = null,
	utilities = null,
	children,
}) => {

	const videoRef = useRef(null);

	const [isPlaying, setIsPlaying] = useState(
		() => typeof window !== 'undefined'
			? !window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: true
	);

	// Sync play/pause state to the video element
	
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		if (isPlaying) {
			video.play();
		} else {
			video.pause();
		}
	}, [isPlaying]);

	// Respond to changes in prefers-reduced-motion
	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

		const handler = () => setIsPlaying(!mq.matches);

		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, []);

	const setRef = (node) => {
		if (typeof ref === 'function') ref(node);
		else if (ref) ref.current = node;
	};

	const backdropClasses = classNames(
		'backdrop',
		{
			'backdrop--fixed': fixedHeight !== null || utilities?.includes('aspect-ratio'),
			[`backdrop--stack--${stack}`]: stack !== null && fixedHeight === null,
		},
		utilities
	);

	const backdropStyle = {
		'--backdrop-fixed-height': fixedHeight !== null ? fixedHeight : null
	};

	return (
		<div ref={setRef} className={backdropClasses} style={backdropStyle}>

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
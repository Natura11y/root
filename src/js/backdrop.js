import { delegateEvent } from './utilities/eventDelegation';

export default class Backdrop {

  // Private properties
  #backdropWithVideo = document.querySelectorAll('.backdrop:has(video)');

  // Private methods

  // Initialize media controls for video
  #initMediaControls(videoElement, controlButton) {
    const icon = controlButton.querySelector('.icon');

    // Toggle play/pause state
    const togglePlayPause = () => {
      if (videoElement.paused) {
        videoElement.play();
        icon.classList.remove('icon-play');
        icon.classList.add('icon-pause');
        controlButton.setAttribute('aria-label', 'Pause video');
        controlButton.setAttribute('aria-pressed', 'false');
      } else {
        videoElement.pause();
        icon.classList.remove('icon-pause');
        icon.classList.add('icon-play');
        controlButton.setAttribute('aria-label', 'Play video');
        controlButton.setAttribute('aria-pressed', 'true');
      }
    };

    // Event listener for play/pause button
    controlButton.addEventListener('click', togglePlayPause);

    // If reduced motion is preferred, pause the video
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      videoElement.pause();
      icon.classList.remove('icon-pause');
      icon.classList.add('icon-play');
    }
  }

  // Initialize each backdrop with video
  #initializeBackdrop(backdrop) {
    const videoElement = backdrop.querySelector('video');
    const controlButton = backdrop.querySelector('.backdrop__media__control .button');

    if (videoElement && controlButton) {
      // Video-specific setup
      videoElement.setAttribute('preload', 'metadata');
      videoElement.setAttribute('playsinline', '');
      videoElement.setAttribute('muted', '');
      videoElement.setAttribute('loop', '');
      videoElement.setAttribute('aria-hidden', 'true');

      // Load video and initialize controls
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play();
      });

      this.#initMediaControls(videoElement, controlButton);
    }
  }

  // Public methods
  init = () => {
    // Initialize backdrops with videos only
    this.#backdropWithVideo.forEach((backdrop) => {
      this.#initializeBackdrop(backdrop);
    });

    // Delegate event for dynamically added videos
    delegateEvent(document, 'play', '.backdrop:has(video)', (event) => {
      const backdrop = event.target.closest('.backdrop');
      const controlButton = backdrop.querySelector('.backdrop__media__control .button');
      this.#initMediaControls(event.target, controlButton);
    });
  };
}
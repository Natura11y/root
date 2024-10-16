import { delegateEvent } from './utilities/eventDelegation';

export default class Backdrop {

  // Private properties
  #backdropVideoList = document.querySelectorAll('.backdrop:has(video)');

  // Media query for reduced motion preference
  #reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Private methods

  // Toggle play/pause state for a specific video
  #togglePlayPause(videoElement, controlButton) {
    const icon = controlButton.querySelector('.icon');
    if (videoElement.paused) {
      videoElement.play();
      this.#updateControlState(icon, controlButton, 'pause');
    } else {
      videoElement.pause();
      this.#updateControlState(icon, controlButton, 'play');
    }
  }

  // Apply reduced motion preference (pause video if preferred)
  #applyReducedMotionPreference(videoElement, controlButton) {
    const icon = controlButton.querySelector('.icon');
    if (this.#reducedMotionMediaQuery.matches) {
      videoElement.pause();
      this.#updateControlState(icon, controlButton, 'play');
    } else {
      videoElement.play();
      this.#updateControlState(icon, controlButton, 'pause');
    }
  }

  // Update button state (ARIA and icon)
  #updateControlState(icon, controlButton, state) {
    const isPlaying = (state === 'pause');
    icon.classList.toggle('icon-play', !isPlaying);
    icon.classList.toggle('icon-pause', isPlaying);
    controlButton.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');
    controlButton.setAttribute('aria-pressed', String(isPlaying));
  }

  // Initialize media controls for each backdrop
  #initializeBackdrop(backdrop) {
    const videoElement = backdrop.querySelector('video');
    const controlButton = backdrop.querySelector('.backdrop__media__control .button');

    if (videoElement && controlButton) {
      // Set necessary attributes on the video
      videoElement.setAttribute('preload', 'metadata');
      videoElement.setAttribute('playsinline', '');
      videoElement.setAttribute('muted', '');
      videoElement.setAttribute('loop', '');

      // Apply media preference on load
      this.#applyReducedMotionPreference(videoElement, controlButton);

      // Listen for reduced motion preference changes
      this.#reducedMotionMediaQuery.addEventListener('change', () => {
        this.#applyReducedMotionPreference(videoElement, controlButton);
      });

      // Delegate play/pause control to the backdrop instance itself
      delegateEvent(backdrop, 'click', '.backdrop__media__control .button', (event) => {
        this.#togglePlayPause(videoElement, controlButton);
      });
    }
  }

  // Public method to initialize all backdrops
  init = () => {
    this.#backdropVideoList.forEach((backdrop) => this.#initializeBackdrop(backdrop));
  };
}

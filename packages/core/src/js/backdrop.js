export default class Backdrop {

  // Private properties
  #backdropVideoList = null;
  #reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  #mediaQueryHandlers = new Map();

  // Private methods

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

  #applyReducedMotionPreference(videoElement, controlButton) {
    if (controlButton.hasAttribute('data-check-reduced-motion')) {
      const icon = controlButton.querySelector('.icon');
      if (this.#reducedMotionMediaQuery.matches) {
        videoElement.pause();
        this.#updateControlState(icon, controlButton, 'play');
      } else {
        videoElement.play();
        this.#updateControlState(icon, controlButton, 'pause');
      }

      // Remove existing handler if any to prevent duplicates
      const existingHandler = this.#mediaQueryHandlers.get(controlButton);
      if (existingHandler) {
        this.#reducedMotionMediaQuery.removeEventListener('change', existingHandler);
      }

      // Create and store new handler
      const changeHandler = () => {
        if (this.#reducedMotionMediaQuery.matches) {
          videoElement.pause();
          this.#updateControlState(icon, controlButton, 'play');
        } else {
          videoElement.play();
          this.#updateControlState(icon, controlButton, 'pause');
        }
      };

      this.#reducedMotionMediaQuery.addEventListener('change', changeHandler);
      this.#mediaQueryHandlers.set(controlButton, changeHandler);
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
      this.#applyReducedMotionPreference(videoElement, controlButton);

      controlButton.addEventListener('click', () => {
        this.#togglePlayPause(videoElement, controlButton);
      });
    }
  }

  // Public methods
  
  init = () => {
    // Move DOM query to init method for better performance
    this.#backdropVideoList = document.querySelectorAll('.backdrop:has(video)');
    this.#backdropVideoList.forEach((backdrop) => this.#initializeBackdrop(backdrop));
  };
}
import { delegateEvent } from './utilities/eventDelegation';

export default class Alert {

  // Private methods

  #handleAlertClose = (event) => {
    event.preventDefault();
    const alert = event.target.closest('.alert');
    if (alert) {
      const removeAlert = () => {
        alert.remove();
      };

      alert.classList.add('dismissed');

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        removeAlert();
      } else {
        alert.addEventListener('animationend', removeAlert, { once: true });
      }
    }
  };

  // Public methods

  init = () => {
    delegateEvent(document, 'click', '[data-alert-close]', this.#handleAlertClose);
  };

}

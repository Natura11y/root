import { delegateEvent } from './utilities/eventDelegation';

export default class Alert {

  // Private methods

  #handleAlertClose = (event) => {
    event.preventDefault();
    const alert = event.target.closest('.alert');
    if (alert) {
      alert.classList.add('dismissed');
      alert.addEventListener('animationend', () => {
        alert.remove();
      });
    }
  };

  // Public methods

  init = () => {
    delegateEvent(document, 'click', '[data-alert-close]', this.#handleAlertClose);
  };

}
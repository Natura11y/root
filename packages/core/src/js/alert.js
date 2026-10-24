export default class Alert {

  // Private properties

  static #initializedRoots = new WeakMap();

  #root = null;

  // Private methods

  #handleAlertClose = (event) => {
    const closeButton = event.target.closest('[data-alert-close]');
    if (!closeButton || !this.#root.contains(closeButton)) return;

    const alert = closeButton.closest('.alert');
    if (alert && this.#root.contains(alert)) {
      event.preventDefault();
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

  init = (root = document) => {
    const owner = Alert.#initializedRoots.get(root);
    if (owner) return owner;

    if (this.#root) this.destroy();

    this.#root = root;
    root.addEventListener('click', this.#handleAlertClose);
    Alert.#initializedRoots.set(root, this);

    return this;
  };

  destroy() {
    if (!this.#root) return;

    this.#root.removeEventListener('click', this.#handleAlertClose);
    Alert.#initializedRoots.delete(this.#root);
    this.#root = null;
  }

}
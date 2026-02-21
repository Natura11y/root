import { delegateEvent } from './utilities/eventDelegation';
import { getFocusableElements } from './utilities/focus';
import { handleArrowKeyNavigation } from './utilities/keyboardNavigation';

export default class PrimaryNav {

  // Private properties

  #primaryNavMenuList = document.querySelectorAll('.primary-nav__menu');

  // Public methods

  init() {

    this.#primaryNavMenuList.forEach(nav => {
      delegateEvent(nav, 'keydown', ':is(button, a)', (event) => {

        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.code)) return;

        const items = getFocusableElements(nav, { exclude: ['.nav__dropdown', '[class*="mega-menu"]'] });
        const index = items.indexOf(event.target);

        if (index === -1) return;

        handleArrowKeyNavigation(event, index, items, (targetIndex) => items[targetIndex].focus());
      });
    });

  }

}
/*

In this file:

// A. Arrow Navigation Manager

*/

import { delegateEvent } from './eventDelegation';
import { handleArrowKeyNavigation } from './keyboardNavigation';

//////////////////////////////////////////////
// A. Arrow Navigation Manager
//////////////////////////////////////////////

// Track active navigation instances to prevent memory leaks
const activeNavigations = new Map();

export const enableArrowNavigation = (targetElement, options = {}) => {

  const {
    selector = 'button, a',
    exclude = [],
    keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
  } = options;

  // Clean up existing navigation if already enabled
  if (activeNavigations.has(targetElement)) {
    disableArrowNavigation(targetElement);
  }

  const handleKeydown = (event) => {
    if (!keys.includes(event.code)) return;

    // Get all items, filtering out excluded containers
    const items = Array.from(targetElement.querySelectorAll(selector))
      .filter(el => !exclude.some(exclusion => el.closest(exclusion)));

    const index = items.indexOf(event.target);
    if (index === -1) return;

    handleArrowKeyNavigation(event, index, items, (targetIndex) => {
      items[targetIndex].focus();
    });
  };

  // Add event delegation
  delegateEvent(targetElement, 'keydown', selector, handleKeydown);

  // Store handler for cleanup
  activeNavigations.set(targetElement, { handleKeydown, selector });
};

export const disableArrowNavigation = (targetElement) => {
  const navigation = activeNavigations.get(targetElement);
  if (!navigation) return;

  // Remove event listener
  targetElement.removeEventListener('keydown', navigation.handleKeydown);

  // Clean up
  activeNavigations.delete(targetElement);
};
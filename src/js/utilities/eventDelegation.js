/*

In this file:

// A. Delegate Event

*/

//////////////////////////////////////////////
// A. Delegate Event
//////////////////////////////////////////////

export const delegateEvent = (parent, eventType, selector, handler) => {
  parent.addEventListener(eventType, (event) => {
    if (event.target.matches(selector) || event.target.closest(selector)) {
      handler(event);
    }
  });
};
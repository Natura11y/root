/*

In this file:

// A. Delegate Event

*/

//////////////////////////////////////////////
// A. Delegate Event
//////////////////////////////////////////////

export const delegateEvent = (parent, eventType, selector, handler) => {
  parent.addEventListener(eventType, (event) => {
  console.log('event.target:', event.target);
    if (event.target.matches(selector)) {
      handler(event);
    }
  });
};
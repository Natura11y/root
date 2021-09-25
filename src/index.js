/*

In this file:

// A. Polyfills
// B. Required Modules
// C. Optional Modules

*/

//////////////////////////////////////////////
// A. Polyfills
//////////////////////////////////////////////

import "element-closest-polyfill";

//////////////////////////////////////////////
// B. Imports
//////////////////////////////////////////////

import "./modules/accents";

import Accessibility from "./modules/accessibility";

import Accordion from "./modules/accordion";

import Alerts from "./modules/alerts";

import "./modules/article";

import "./modules/aspect-ratios";

import "./modules/backdrops";

import "./modules/borders";

import "./modules/breakpoints";

import Buttons from "./modules/buttons";

import "./modules/cards";

import Collapse from "./modules/collapse";

import "./modules/color";

import "./modules/containers";

import "./modules/display";

import Document from "./modules/document";

import "./modules/flex";

import Forms from "./modules/forms";

import "./modules/grid";

import "./modules/icons";

import "./modules/language";

import "./modules/links";

import Modal from "./modules/modal";

import Navigation from "./modules/navigation";

import "./modules/opacity";

import "./modules/overflow";

import "./modules/position";

import "./modules/shadows";

import "./modules/sizing";

import "./modules/spacing";

import Tabs from "./modules/tabs";

import Tables from "./modules/tables";

import Tearsheet from "./modules/tearsheet";

import "./modules/typography";

import "./modules/z-index/index";

//////////////////////////////////////////////
// C. Objects
//////////////////////////////////////////////

window.addEventListener('load', () => {

    console.log('page is fully loaded');

    new Accessibility();
    new Accordion();
    new Alerts();
    new Buttons();
    new Collapse();
    new Document();
    new Forms();
    new Modal();
    new Navigation();
    new Tabs();
    new Tables();
    new Tearsheet();

});

//////////////////////////////////////////////
// Environments (For Testing Webpack)
//////////////////////////////////////////////

if (process.env.NODE_ENV === 'development') {
    console.log("Development Mode");
} else if (process.env.NODE_ENV === 'production') {
    console.log("Production Mode");
}
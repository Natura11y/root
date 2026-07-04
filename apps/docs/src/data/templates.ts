import templateForm from '../assets/template-thumbnails/template-form.jpg';
import templateFullWidth from '../assets/template-thumbnails/template-full-width.jpg';
import templateLanding from '../assets/template-thumbnails/template-landing.jpg';
import templateSearchResults from '../assets/template-thumbnails/template-search-results.jpg';
import templateThreeColumn from '../assets/template-thumbnails/template-three-column.jpg';
import templateTwoColumn from '../assets/template-thumbnails/template-two-column.jpg';

export const templates = [
  {
    title: 'Landing Page',
    description: 'A minimal, unstyled starting point for a hero-driven landing page. Includes a header, hero section, feature grid, and footer.',
    image: templateLanding,
    previewUrl: 'https://cavidano.github.io/natura11y/dist/html/templates/landing/',
    codeUrl: 'https://github.com/cavidano/natura11y/blob/main/dist/html/templates/landing/index.html',
  },
  {
    title: 'Two Column',
    description: 'A clean, semantic article layout with a header, body, and sidebar. A solid foundation for blog posts, or editorial content.',
    image: templateTwoColumn,
    previewUrl: 'https://cavidano.github.io/natura11y/dist/html/templates/two-column/',
    codeUrl: 'https://github.com/cavidano/natura11y/blob/main/dist/html/templates/two-column/index.html',
  },
  {
    title: 'Three Column',
    description: 'A three-column layout with a main content area flanked by two sidebars. A structural starting point for any content-heavy page.',
    image: templateThreeColumn,
    previewUrl: 'https://cavidano.github.io/natura11y/dist/html/templates/three-column/',
    codeUrl: 'https://github.com/cavidano/natura11y/blob/main/dist/html/templates/three-column/index.html',
  },
  {
    title: 'Full Width',
    description: 'A flexible full-width page layout with a banner, page header, and open content area. A clean starting point for articles, landing sections, or any single-column content page.',
    image: templateFullWidth,
    previewUrl: 'https://cavidano.github.io/natura11y/dist/html/templates/full-width/',
    codeUrl: 'https://github.com/cavidano/natura11y/blob/main/dist/html/templates/full-width/index.html',
  },
  {
    title: 'Form',
    description: "An accessible, bare-bones form template built with Natura11y's form entry components. Covers text inputs, selects, textarea, radio groups, checkboxes, and a switch toggle.",
    image: templateForm,
    previewUrl: 'https://cavidano.github.io/natura11y/dist/html/templates/form/',
    codeUrl: 'https://github.com/cavidano/natura11y/blob/main/dist/html/templates/form/index.html',
  },
  {
    title: 'Search Results',
    description: 'A structured, accessible search results page with a query display, result count, filter sidebar, and paginated result cards. A solid starting point for any site-wide search experience.',
    image: templateSearchResults,
    previewUrl: 'https://cavidano.github.io/natura11y/dist/html/templates/search-results/',
    codeUrl: 'https://github.com/cavidano/natura11y/blob/main/dist/html/templates/search-results/index.html',
  },
] as const;

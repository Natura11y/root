export const templateRoutes = [
  { path: '/templates/two-column', label: 'Two Column' },
  { path: '/templates/search-results', label: 'Search Results' },
  { path: '/templates/form', label: 'Form' },
];

const templateRouteAliases = {
  '/': '/templates/landing',
  '/templates': '/templates/landing',
  '/contact': '/templates/form',
  '/nutrition': '/templates/form',
};

const templateRoutePaths = new Set([
  '/templates/landing',
  ...templateRoutes.map(({ path }) => path),
]);

export const resolveRoutePath = (path) => {
  const canonicalPath = templateRouteAliases[path] ?? path;
  return templateRoutePaths.has(canonicalPath) ? canonicalPath : '/templates/landing';
};

export const getRoutePath = () => resolveRoutePath(window.location.pathname);

export const getNavigationTarget = (target) => {
  const targetUrl = new URL(target, window.location.origin);
  const path = resolveRoutePath(targetUrl.pathname);

  return {
    path,
    search: targetUrl.search,
    url: `${path}${targetUrl.search}`,
  };
};

export const getSearchResultsUrl = (value) => {
  const query = value.trim();
  return `/templates/search-results?q=${encodeURIComponent(query)}`;
};

export const getSearchQueryFromSearch = (search) => {
  const params = new URLSearchParams(search);
  return params.has('q') ? params.get('q') ?? '' : 'Lorem ipsum';
};

export const placeholderImage = ({ width = 800, height = 500, text = 'Placeholder' }) => (
  `https://placehold.co/${width}x${height}/4b5563/6b7280?text=${encodeURIComponent(text)}&font=oswald`
);

export const loremParagraphs = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam.',
];

export const articleSections = [
  ['Heading 2', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[5]],
  ['Heading 2', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[6]],
  ['Heading 3', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[5]],
  ['Heading 4', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[6]],
  ['Heading 5', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[5]],
  ['Heading 6', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[6]],
];

export const getHeadingTag = (heading) => `h${heading.match(/[2-6]$/)?.[0] ?? '2'}`;

export const searchFilters = [
  { label: 'Omnis', value: 'all' },
  { label: 'Aliquet', value: 'Aliquet' },
  { label: 'Viverra', value: 'Viverra' },
  { label: 'Ornare', value: 'Ornare' },
  { label: 'Morbi', value: 'Morbi' },
];

export const searchResults = [
  {
    category: 'Aliquet',
    title: 'Lorem ipsum dolor sit amet consectetur',
    description: loremParagraphs[0],
  },
  {
    category: 'Aliquet',
    title: 'Consectetur adipiscing elit sed do eiusmod',
    description: loremParagraphs[1],
  },
  {
    category: 'Viverra',
    title: 'Ut enim ad minim veniam quis nostrud',
    description: loremParagraphs[2],
  },
  {
    category: 'Aliquet',
    title: 'Excepteur sint occaecat cupidatat non proident',
    description: loremParagraphs[5],
  },
  {
    category: 'Aliquet',
    title: 'Sunt in culpa qui officia deserunt mollit',
    description: loremParagraphs[6],
  },
  {
    category: 'Ornare',
    title: 'Duis aute irure dolor in reprehenderit',
    description: loremParagraphs[4],
  },
  {
    category: 'Viverra',
    title: 'Voluptate velit esse cillum dolore',
    description: loremParagraphs[2],
  },
  {
    category: 'Morbi',
    title: 'Fugiat nulla pariatur laborum perspiciatis',
    description: loremParagraphs[6],
  },
  {
    category: 'Aliquet',
    title: 'Nemo enim ipsam voluptatem quia',
    description: loremParagraphs[5],
  },
  {
    category: 'Aliquet',
    title: 'Itaque earum rerum hic tenetur sapiente',
    description: loremParagraphs[4],
  },
];

export const latestCards = [
  ['Technology', 'Enim Ad Minim Veniam Quis Nostrud Elit'],
  ['Design', 'Consectetur Adipiscing Elit Sed Do Eiusmod'],
  ['Culture', 'Ut Labore Et Dolore Magna Aliqua Ut Enim'],
];

export const starterStats = [
  ['50', 'States & Territories'],
  ['300M+', 'People Served'],
  ['10,000+', 'Registered Agencies'],
  ['24/7', 'Service Availability'],
];

export const trackPanels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'].map((label) => ({
  id: `starter-${label.toLowerCase()}`,
  linkUrl: '#1',
  imageUrl: placeholderImage({ width: 1500, height: 750, text: label }),
  altText: 'Placeholder',
  buttonText: 'Button Label',
}));

export const faqItems = [
  ['faq-1', 'Who is eligible to use this program?', 'Eligibility is open to all residents and organizations operating within the jurisdiction. Specific requirements may vary by program type. Review the eligibility guidelines or contact your local office for more information.'],
  ['faq-2', 'How long does the application process take?', 'Most applications are processed within 5-7 business days. Complex requests or those requiring additional documentation may take up to 30 days. You will receive a status update at each stage of the review process.'],
  ['faq-3', 'What documents do I need to submit?', 'Required documents vary by request type. Generally, you will need a valid government-issued ID, proof of address, and any program-specific forms. A full checklist is available on the application page.'],
  ['faq-4', 'How can I check the status of my submission?', 'Log in to your account at any time to view the current status of your application. You will also receive email notifications at key milestones. If you need assistance, contact our support team.'],
];

export const templateSidebarItems = [
  { id: 'section-one', label: 'Section One', href: '#1' },
  {
    id: 'section-two',
    label: 'Section Two',
    href: '#1',
    current: 'true',
    children: [
      { id: 'section-two-item-one', label: 'Item One', href: '#1' },
      { id: 'section-two-item-one', label: 'Item One', href: '#1' },
      { id: 'section-two-item-two', label: 'Item Two', href: '#1', current: 'page' },
      { id: 'section-two-item-three', label: 'Item Three', href: '#1' },
    ],
  },
  {
    id: 'section-three',
    label: 'Section Three',
    href: '#1',
    children: [
      {
        id: 'section-three-item-one',
        label: 'Item One',
        href: '#1',
        children: [
          { id: 'section-three-subitem-one', label: 'Sub-item One', href: '#1' },
          { id: 'section-three-subitem-two', label: 'Sub-item Two', href: '#1' },
        ],
      },
      { id: 'section-three-item-two', label: 'Item Two', href: '#1' },
    ],
  },
  { id: 'section-four', label: 'Section Four', href: '#1' },
  { id: 'section-five', label: 'Section Five', href: '#1' },
];

export const initialContactForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  contactMethod: 'email',
  topics: [],
  newsletter: false,
};

export const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'feedback', label: 'Feedback' },
];

export const contactMethodOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'either', label: 'Either is fine' },
];

export const topicOptions = [
  { value: 'events', label: 'Events' },
  { value: 'programs', label: 'Programs' },
  { value: 'volunteering', label: 'Volunteering' },
];

export const validateContactForm = (formData) => {
  const errors = {};

  if (!formData.firstName.trim()) errors.firstName = 'Enter your first name.';
  if (!formData.lastName.trim()) errors.lastName = 'Enter your last name.';
  if (!formData.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!formData.subject) errors.subject = 'Select a subject.';
  if (!formData.message.trim()) errors.message = 'Enter a message.';

  return errors;
};

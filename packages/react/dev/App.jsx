import '@natura11y/core/dist/natura11y.css';
import './style.css';

import { useEffect, useState } from 'react';
import {
  Accordion,
  Alert,
  Badge,
  Backdrop,
  Brand,
  Breadcrumb,
  Button,
  ButtonIconOnly,
  Card,
  CardBody,
  CardFoot,
  CardMedia,
  Collapse,
  Form,
  FormEntry,
  FormEntrySearch,
  Icon,
  MainMenu,
  NestedNav,
  Pagination,
  RequiredIndicator,
  Track,
} from '@lib/components';

const scrollToTop = (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const templateRoutes = [
  { path: '/templates/landing', label: 'Landing' },
  { path: '/templates/form', label: 'Form' },
  { path: '/templates/search-results', label: 'Search Results' },
  { path: '/templates/full-width', label: 'Full Width' },
  { path: '/templates/two-column', label: 'Two Column' },
  { path: '/templates/three-column', label: 'Three Column' },
];

const templateRouteAliases = {
  '/': '/templates/landing',
  '/templates': '/templates/landing',
  '/contact': '/templates/form',
  '/nutrition': '/templates/form',
};

const templateRoutePaths = new Set(templateRoutes.map(({ path }) => path));

const resolveRoutePath = (path) => {
  const canonicalPath = templateRouteAliases[path] ?? path;
  return templateRoutePaths.has(canonicalPath) ? canonicalPath : '/templates/landing';
};

const getRoutePath = () => resolveRoutePath(window.location.pathname);

const getNavigationTarget = (target) => {
  const targetUrl = new URL(target, window.location.origin);
  const path = resolveRoutePath(targetUrl.pathname);

  return {
    path,
    search: targetUrl.search,
    url: `${path}${targetUrl.search}`,
  };
};

const getSearchResultsUrl = (value) => {
  const query = value.trim();
  return `/templates/search-results?q=${encodeURIComponent(query)}`;
};

const getSearchQueryFromSearch = (search) => {
  const params = new URLSearchParams(search);
  return params.has('q') ? params.get('q') ?? '' : 'Lorem ipsum';
};

const placeholderImage = ({ width = 800, height = 500, text = 'Placeholder' }) => (
  `https://placehold.co/${width}x${height}/4b5563/6b7280?text=${encodeURIComponent(text)}&font=oswald`
);

const RouteLink = ({ href, currentPath, onNavigate, children, ...props }) => (
  <a
    href={href}
    aria-current={currentPath === getNavigationTarget(href).path ? 'page' : undefined}
    onClick={(event) => {
      event.preventDefault();
      onNavigate(href);
    }}
    {...props}
  >
    {children}
  </a>
);

const loremParagraphs = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam.',
];

const articleSections = [
  ['Heading 2', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[5]],
  ['Heading 2', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[6]],
  ['Heading 3', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[5]],
  ['Heading 4', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[6]],
  ['Heading 5', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[5]],
  ['Heading 6', `${loremParagraphs[0]} ${loremParagraphs[1]} ${loremParagraphs[2]} ${loremParagraphs[3]} ${loremParagraphs[4]}`, loremParagraphs[6]],
];

const getHeadingTag = (heading) => `h${heading.match(/[2-6]$/)?.[0] ?? '2'}`;

const searchFilters = [
  { label: 'Omnis', value: 'all' },
  { label: 'Aliquet', value: 'Aliquet' },
  { label: 'Viverra', value: 'Viverra' },
  { label: 'Ornare', value: 'Ornare' },
  { label: 'Morbi', value: 'Morbi' },
];

const searchResults = [
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

const latestCards = [
  ['Technology', 'Enim Ad Minim Veniam Quis Nostrud Elit'],
  ['Design', 'Consectetur Adipiscing Elit Sed Do Eiusmod'],
  ['Culture', 'Ut Labore Et Dolore Magna Aliqua Ut Enim'],
];

const starterStats = [
  ['50', 'States & Territories'],
  ['300M+', 'People Served'],
  ['10,000+', 'Registered Agencies'],
  ['24/7', 'Service Availability'],
];

const trackPanels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'].map((label) => ({
  id: `starter-${label.toLowerCase()}`,
  linkUrl: '#1',
  imageUrl: placeholderImage({ width: 1500, height: 750, text: label }),
  altText: 'Placeholder',
  buttonText: 'Button Label',
}));

const faqItems = [
  ['faq-1', 'Who is eligible to use this program?', 'Eligibility is open to all residents and organizations operating within the jurisdiction. Specific requirements may vary by program type. Review the eligibility guidelines or contact your local office for more information.'],
  ['faq-2', 'How long does the application process take?', 'Most applications are processed within 5-7 business days. Complex requests or those requiring additional documentation may take up to 30 days. You will receive a status update at each stage of the review process.'],
  ['faq-3', 'What documents do I need to submit?', 'Required documents vary by request type. Generally, you will need a valid government-issued ID, proof of address, and any program-specific forms. A full checklist is available on the application page.'],
  ['faq-4', 'How can I check the status of my submission?', 'Log in to your account at any time to view the current status of your application. You will also receive email notifications at key milestones. If you need assistance, contact our support team.'],
];

const templateSidebarItems = [
  { id: 'section-one', label: 'Section One', href: '#1' },
  {
    id: 'section-two',
    label: 'Section Two',
    href: '#1',
    current: 'true',
    children: [
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

const initialContactForm = {
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

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'feedback', label: 'Feedback' },
];

const contactMethodOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'either', label: 'Either is fine' },
];

const topicOptions = [
  { value: 'events', label: 'Events' },
  { value: 'programs', label: 'Programs' },
  { value: 'volunteering', label: 'Volunteering' },
];

const validateContactForm = (formData) => {
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

const Logo = ({ currentPath, onNavigate }) => (
  <RouteLink href="/" currentPath={currentPath} onNavigate={onNavigate} title="Home" data-logo="brand">
    <Brand />
  </RouteLink>
);

const TemplateNavItems = ({ currentPath, onNavigate }) => (
  <>
    {templateRoutes.map((route) => (
      <li key={route.path}>
        <RouteLink href={route.path} currentPath={currentPath} onNavigate={onNavigate}>
          {route.label}
        </RouteLink>
      </li>
    ))}
  </>
);

const TemplateHeader = ({ currentPath, onNavigate }) => {
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  const handleMenuSearchSubmit = (event) => {
    event.preventDefault();
    onNavigate(getSearchResultsUrl(menuSearchQuery));
  };

  return (
    <header className="margin-x-auto wide--lg">
      <MainMenu
        navId="main-menu"
        searchId="main-menu-search"
        searchFormProps={{
          'aria-label': 'Search templates',
          onSubmit: handleMenuSearchSubmit,
        }}
        search={
          <FormEntrySearch
            id="main-menu-search-input"
            name="search"
            labelText="Search"
            submitButton="text"
            leadingIcon={false}
            onSearch={setMenuSearchQuery}
            onClear={() => setMenuSearchQuery('')}
          />
        }
        logo={<Logo currentPath={currentPath} onNavigate={onNavigate} />}
      >
        <TemplateNavItems currentPath={currentPath} onNavigate={onNavigate} />
      </MainMenu>
    </header>
  );
};

const TemplateFooter = () => (
  <footer className="subtle-fill-1" id="global-footer">
    <h2 className="screen-reader-only">Page Footer</h2>

    <div className="container narrow wide--lg padding-y-4 font-size-md">
      <div className="grid grid--column-2 grid--column-4--lg gap-4">
        <div>
          <div className="margin-bottom-3">
            <a href="/" title="Home" data-logo="brand">
              <Brand />
            </a>
          </div>

          <address>
            <strong>Example Organization</strong><br />
            123 Springwater Rd<br />
            Anytown, ST 00000<br />
            <a href="mailto:contact@example.org">contact@example.org</a>
          </address>
        </div>

        {['Section One', 'Section Two'].map((section) => (
          <nav aria-label={section} key={section}>
            <p><strong>{section}</strong></p>
            <ul className="nav">
              {['Link One', 'Link Two', 'Link Three', 'Link Four'].map((label) => (
                <li key={label}><a href="#1">{label}</a></li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Social Media">
          <p><strong>Follow Us</strong></p>
          <ul className="nav nav--horizontal gap-1">
            {['facebook', 'instagram', 'linkedin', 'youtube'].map((icon) => (
              <li key={icon}>
                <ButtonIconOnly tag="a" linkUrl="#1" iconHandle={icon} ariaLabel={icon} />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>

    <hr />

    <div className="container narrow wide--lg padding-y-2 font-size-sm">
      <div className="flex-row justify-content-between align-items-center">
        <span>&copy; 2026 Your Company Name. All rights reserved.</span>

        <Button
          tag="a"
          linkUrl="#"
          title="Back to Top"
          outline
          iconStartHandle="arrow-up"
          attributes={{ onClick: scrollToTop }}
        />
      </div>
    </div>
  </footer>
);

const TemplateBreadcrumb = () => (
  <div className="border-bottom display-none display-block--lg">
    <div className="container wide padding-y-2">
      <Breadcrumb
        items={[
          { id: 'grandparent', label: 'Grandparent', href: '#1' },
          { id: 'parent', label: 'Parent', href: '#1' },
          { id: 'child-page', label: 'Child Page' },
        ]}
      />
    </div>
  </div>
);

const PageBanner = ({ label, aspectRatioClass = 'aspect-ratio-3x1--lg' }) => (
  <Backdrop
    tag="header"
    imageSrc={placeholderImage({ width: 1500, height: 500, text: label })}
    imageUtilities="opacity-30 gradient-mask-left"
    utilities={`${aspectRatioClass} theme-dark`}
  >
    <TemplateBreadcrumb />

    <div className="margin-y-auto">
      <div className="container wide">
        <h1 className="banner-headline">Page Title</h1>
      </div>
    </div>
  </Backdrop>
);

const TemplateArticleContent = () => (
  <div className="medium margin-x-auto">
    <h2 className="h1">Introduction</h2>
    <p className="font-size-lg">
      {loremParagraphs[0]} {loremParagraphs[1]}
    </p>

    <div className="narrow">
      {articleSections.slice(0, 4).map(([heading, firstParagraph, secondParagraph], index) => {
        const Heading = getHeadingTag(heading);

        return (
          <section key={`${heading}-${index}`}>
            <Heading>{heading}</Heading>
            <p>{firstParagraph}</p>
            <p>{secondParagraph}</p>
          </section>
        );
      })}
    </div>
  </div>
);

const TemplateSidebarNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="margin-x-auto">
      <Button
        title="Navigation"
        utilities="sidebar-toggle button--disperse display-none--lg"
        iconEndHandle="chevron-down"
        onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        attributes={{ 'aria-controls': 'sidebar-nav', 'aria-expanded': isSidebarOpen }}
      />

      <Collapse id="sidebar-nav" isOpen={isSidebarOpen} showAt="lg">
        <NestedNav
          ariaLabel="Section Navigation"
          items={templateSidebarItems}
          utilities="border-radius-2--lg box-shadow-2--lg"
        />
      </Collapse>
    </div>
  );
};

const OnThisPage = () => (
  <div className="narrow margin-x-auto">
    <nav aria-label="On This Page">
      <h2 className="h6">On This Page:</h2>
      <ul className="nav nav--divider font-size-sm">
        {['Introduction', 'Heading 2', 'Heading 3', 'Heading 4'].map((label) => (
          <li key={label}><a href="#1">{label}</a></li>
        ))}
      </ul>
    </nav>
  </div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState(initialContactForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const clearError = (field) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleFieldChange = (field) => (event) => {
    const target = event.target;
    const nextValue = target.type === 'checkbox' ? target.checked : target.value;
    setFormData((current) => ({ ...current, [field]: nextValue }));
    setSubmitted(false);
    clearError(field);
  };

  const handleTopicsChange = (event) => {
    const { checked, value } = event.target;
    setFormData((current) => {
      const topics = checked
        ? [...current.topics, value]
        : current.topics.filter((item) => item !== value);

      return { ...current, topics };
    });
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateContactForm(formData);
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <RequiredIndicator text="Required fields are marked with" />

      {submitted && (
        <Alert title="Message ready" utilities="margin-bottom-3">
          <p>
            Thanks, {formData.firstName}. This demo submission shows the React contact form pattern is working end to end.
          </p>
        </Alert>
      )}

      {Object.keys(errors).length > 0 && (
        <Alert success={false} title="Review the form" utilities="margin-bottom-3">
          <p>A few required details need attention before this can be submitted.</p>
        </Alert>
      )}

      <FormEntry
        labelText="First Name"
        required
        entryId="first-name"
        entryName="firstName"
        value={formData.firstName}
        onChange={handleFieldChange('firstName')}
        showError={Boolean(errors.firstName)}
        errorTitle="Required"
        errorMessage={errors.firstName}
      />

      <FormEntry
        labelText="Last Name"
        required
        entryId="last-name"
        entryName="lastName"
        value={formData.lastName}
        onChange={handleFieldChange('lastName')}
        showError={Boolean(errors.lastName)}
        errorTitle="Required"
        errorMessage={errors.lastName}
      />

      <FormEntry
        labelText="Email Address"
        required
        entryType="email"
        entryId="email"
        entryName="email"
        value={formData.email}
        onChange={handleFieldChange('email')}
        helpText="We'll never share your email address."
        showError={Boolean(errors.email)}
        errorTitle="Invalid email"
        errorMessage={errors.email}
      />

      <FormEntry
        labelText="Phone Number"
        entryType="tel"
        entryId="phone"
        entryName="phone"
        value={formData.phone}
        onChange={handleFieldChange('phone')}
      />

      <FormEntry
        labelText="Subject"
        required
        entryType="select"
        entryId="subject"
        entryName="subject"
        value={formData.subject}
        options={subjectOptions}
        emptyOptionLabel="Select a subject"
        onChange={handleFieldChange('subject')}
        showError={Boolean(errors.subject)}
        errorTitle="Required"
        errorMessage={errors.subject}
      />

      <FormEntry
        labelText="Message"
        required
        entryType="textarea"
        entryId="message"
        entryName="message"
        value={formData.message}
        rows={8}
        onChange={handleFieldChange('message')}
        helpText="Please be as specific as possible."
        showError={Boolean(errors.message)}
        errorTitle="Required"
        errorMessage={errors.message}
      />

      <FormEntry
        labelText="Preferred Contact Method"
        entryType="groupRadio"
        entryId="contact-method"
        entryName="contactMethod"
        value={formData.contactMethod}
        options={contactMethodOptions}
        onChange={handleFieldChange('contactMethod')}
      />

      <FormEntry
        labelText="Topics of Interest"
        entryType="groupCheck"
        entryId="topics"
        entryName="topics"
        options={topicOptions}
        onChange={handleTopicsChange}
      />

      <FormEntry
        labelText="Newsletter"
        labelVisible={false}
        entryType="singleCheckSwitch"
        entryId="newsletter"
        entryName="newsletter"
        value={formData.newsletter ? 'true' : 'false'}
        optionLabel="Subscribe to our newsletter"
        onChange={handleFieldChange('newsletter')}
      />

      <div className="margin-top-4">
        <Button
          buttonType="submit"
          title="Send Message"
          utilities="theme-dark"
          iconEndHandle="send"
        />
      </div>
    </Form>
  );
};

const FormTemplatePage = () => (
  <main id="main-content">
    <header className="theme-light">
      <TemplateBreadcrumb />

      <div className="container wide padding-y-5">
        <h1 className="banner-headline">Contact Us</h1>
      </div>
    </header>

    <div className="container wide--lg margin-y-6">
      <div className="grid-sidebar--right gap-5">
        <article className="grid-sidebar__major">
          <div className="medium--lg">
            <h2 className="h1 margin-bottom-2">Send Us a Message</h2>
            <p className="font-size-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula feugiat erat, vitae placerat turpis facilisis vel. Donec fringilla orci at libero tristique.
            </p>

            <div className="narrow--lg">
              <ContactForm />
            </div>
          </div>
        </article>

        <aside className="grid-sidebar__minor" aria-label="Contact Information">
          <div className="narrow--lg margin-x-auto">
            <div className="grid gap-4">
              <div>
                <h2 className="h6">Example Organization</h2>

                <address className="margin-bottom-2 font-size-md">
                  <p>
                    <strong>Main office</strong><br />
                    123 Springwater Rd<br />
                    Anytown, ST 00000
                  </p>
                </address>

                <Button
                  tag="a"
                  linkUrl="tel:+12025550100"
                  title="(202) 555-0100"
                  iconStartHandle="call"
                  utilities="text-color-link font-size-md"
                />
              </div>

              <div>
                <h3 className="h6">Office Hours:</h3>

                <dl className="font-size-md grid grid--divider gap-1">
                  <div className="flex-row gap-2 justify-content-between">
                    <dt>Monday - Friday</dt>
                    <dd>9am - 5pm</dd>
                  </div>
                  <div className="flex-row gap-2 justify-content-between">
                    <dt>Saturday</dt>
                    <dd>10am - 2pm</dd>
                  </div>
                  <div className="flex-row gap-2 justify-content-between">
                    <dt>Sunday</dt>
                    <dd>Closed</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
);

const SearchFilters = ({ activeFilter, filterCount, onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="margin-x-auto">
      <Button
        title="Filter Results"
        utilities="sidebar-toggle button--disperse display-none--lg"
        iconEndHandle="chevron-down"
        onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
        attributes={{ 'aria-controls': 'search-filters', 'aria-expanded': isFilterOpen }}
      />

      <Collapse id="search-filters" isOpen={isFilterOpen} showAt="lg">
        <nav className="padding-3 padding-0--lg" aria-label="Filter by type">
          <p className="display-none display-block--lg"><strong>Filter Results</strong></p>

          <ul className="nav gap-3">
            {searchFilters.map((filter) => (
              <li key={filter.value}>
                <a
                  href="#1"
                  aria-current={activeFilter === filter.value ? 'true' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onFilterChange(filter.value);
                  }}
                >
                  {filter.label}
                  <Badge>{filterCount(filter.value)}</Badge>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Collapse>
    </div>
  );
};

const SearchResultsTemplatePage = ({ currentSearch, onNavigate }) => {
  const searchQuery = getSearchQueryFromSearch(currentSearch);
  const [query, setQuery] = useState(searchQuery);
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const nextQuery = getSearchQueryFromSearch(currentSearch);
    setQuery(nextQuery);
    setDraftQuery(nextQuery);
    setPage(1);
  }, [currentSearch]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredResults = searchResults.filter((result) => {
    const matchesFilter = activeFilter === 'all' || result.category === activeFilter;
    const matchesQuery = !normalizedQuery ||
      `${result.title} ${result.description}`.toLowerCase().includes(normalizedQuery);
    return matchesFilter && matchesQuery;
  });

  const filterCount = (value) => (
    value === 'all'
      ? searchResults.length
      : searchResults.filter((result) => result.category === value).length
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextQuery = draftQuery.trim();
    setQuery(nextQuery);
    setPage(1);
    onNavigate(getSearchResultsUrl(nextQuery));
  };

  const handleClear = () => {
    setDraftQuery('');
    setQuery('');
    setPage(1);
    onNavigate(getSearchResultsUrl(''));
  };

  const handleFilterChange = (value) => {
    setActiveFilter(value);
    setPage(1);
  };

  const resultStart = filteredResults.length > 0 ? 1 : 0;
  const resultEnd = filteredResults.length;

  return (
    <main id="main-content">
      <div className="theme-light padding-y-5">
        <div className="container wide--lg">
          <h1 className="h2">
            Search Results for <em>&ldquo;{query || 'All'}&rdquo;</em>
          </h1>

          <div className="margin-top-3">
            <form role="search" aria-label="Refine search" onSubmit={handleSubmit}>
              <FormEntrySearch
                key={query}
                id="search-results-input"
                name="search"
                labelText="Search"
                defaultValue={draftQuery}
                leadingIcon={false}
                submitButton="text"
                fieldInputUtilities="border-radius-pill"
                submitButtonUtilities="theme-dark"
                onSearch={setDraftQuery}
                onClear={handleClear}
              />
            </form>
          </div>
        </div>
      </div>

      <div className="container wide--lg margin-y-5">
        <div className="grid-sidebar--left gap-5">
          <aside className="grid-sidebar__minor" aria-label="Filter Results">
            <SearchFilters
              activeFilter={activeFilter}
              filterCount={filterCount}
              onFilterChange={handleFilterChange}
            />
          </aside>

          <div className="grid-sidebar__major">
            <div className="medium margin-x-auto">
              <p className="font-size-sm opacity-70">
                Showing {resultStart}-{resultEnd} of {filteredResults.length} results
              </p>

              <ul className="grid grid--divider">
                {filteredResults.map((result) => (
                  <li key={`${result.category}-${result.title}`}>
                    <p className="margin-bottom-2">
                      <Badge>{result.category}</Badge>
                    </p>
                    <h2 className="h5 margin-bottom-1">
                      <a className="link" href="#1">{result.title}</a>
                    </h2>
                    <p>{result.description}</p>
                  </li>
                ))}
              </ul>

              {filteredResults.length === 0 && (
                <Alert success={false} title="No Results" utilities="margin-top-4">
                  <p>Try another search term or filter.</p>
                </Alert>
              )}

              <div className="margin-top-5">
                <Pagination
                  ariaLabel="Search Results Pages"
                  items={[
                    { id: 'previous-page', iconHandle: 'arrow-left', ariaLabel: 'Previous page', href: '#1', linkProps: { onClick: (event) => { event.preventDefault(); setPage(Math.max(1, page - 1)); } } },
                    { id: 'page-1', label: '1', href: '#1', current: page === 1, linkProps: { onClick: (event) => { event.preventDefault(); setPage(1); } } },
                    { id: 'page-2', label: '2', href: '#1', current: page === 2, linkProps: { onClick: (event) => { event.preventDefault(); setPage(2); } } },
                    { id: 'page-3', label: '3', href: '#1', current: page === 3, linkProps: { onClick: (event) => { event.preventDefault(); setPage(3); } } },
                    { id: 'more-pages', ellipsis: true },
                    { id: 'page-15', label: '15', href: '#1', linkProps: { onClick: (event) => event.preventDefault() } },
                    { id: 'next-page', iconHandle: 'arrow-right', ariaLabel: 'Next page', href: '#1', linkProps: { onClick: (event) => { event.preventDefault(); setPage(Math.min(3, page + 1)); } } },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const FullWidthTemplatePage = () => (
  <main id="main-content">
    <PageBanner label="Full Width" aspectRatioClass="aspect-ratio-3x1" />

    <div className="container--lg wide--lg margin-y-5">
      <h2 className="h1">Introduction</h2>
      <p className="font-size-lg">
        {loremParagraphs[0]} {loremParagraphs[1]}
      </p>

      {articleSections.map(([heading, firstParagraph, secondParagraph], index) => {
        const Heading = getHeadingTag(heading);

        return (
          <section key={`${heading}-${index}`}>
            <Heading>{heading}</Heading>
            <p>{firstParagraph}</p>
            <p>{secondParagraph}</p>
          </section>
        );
      })}
    </div>
  </main>
);

const TwoColumnTemplatePage = () => (
  <main id="main-content">
    <PageBanner label="Two Column" />

    <div className="container wide--lg margin-y-5">
      <div className="grid-sidebar--left gap-5">
        <aside className="grid-sidebar__minor" aria-label="Page Navigation">
          <TemplateSidebarNav />
        </aside>

        <article className="grid-sidebar__major">
          <TemplateArticleContent />
        </article>
      </div>
    </div>
  </main>
);

const ThreeColumnTemplatePage = () => (
  <main id="main-content">
    <PageBanner label="Three Column" />

    <div className="container wide--lg margin-y-5">
      <div className="grid-sidebars gap-5">
        <aside className="grid-sidebar__minor-start" aria-label="Page Navigation">
          <TemplateSidebarNav />
        </aside>

        <article className="grid-sidebars__major">
          <TemplateArticleContent />
        </article>

        <aside className="grid-sidebars__minor-end display-none display-block--lg" aria-label="On This Page">
          <OnThisPage />
        </aside>
      </div>
    </div>
  </main>
);

const LatestCard = ({ badge, title }) => (
  <Card tag="a" utilities="theme- border-radius-2 drop-shadow-2" attributes={{ href: '#1' }}>
    <CardMedia utilities="backdrop theme-dark">
      <Backdrop
        imageSrc={placeholderImage({ width: 800, height: 400, text: 'Feature Image' })}
        utilities="theme-dark"
        coverUtilities="justify-content-end container"
      >
        <Badge utilities="margin-y-3">{badge}</Badge>
      </Backdrop>
    </CardMedia>
    <CardBody>
      <h3 className="h4">{title}</h3>
      <p>{loremParagraphs[0]}</p>
    </CardBody>
    <CardFoot>
      <Icon iconHandle="arrow-right" />
    </CardFoot>
  </Card>
);

const LandingTemplatePage = () => (
  <main id="main-content">
    <Backdrop
      imageSrc={placeholderImage({ width: 2000, height: 1000, text: 'Landing' })}
      stack="lg"
      utilities="theme-dark"
      imageUtilities="opacity-30 gradient-mask-bottom"
    >
      <div className="margin-y-6">
        <div className="container wide--lg">
          <div className="narrow--lg">
            <h1 className="banner-headline text-shadow">Page Headline</h1>
            <p className="font-size-lg text-shadow">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>
            <div className="flex-row gap-3 margin-top-4">
              <Button tag="a" linkUrl="#1" title="Get Started" utilities="theme-canvas" />
              <Button tag="a" linkUrl="#1" title="Learn More" outline />
            </div>
          </div>
        </div>
      </div>
    </Backdrop>

    <section className="theme-light padding-y-4" aria-labelledby="stats-heading">
      <h2 className="screen-reader-only" id="stats-heading">Program Statistics</h2>
      <div className="container wide">
        <div className="grid grid--column-2 grid--column-4--md gap-4 text-align-center">
          {starterStats.map(([value, label]) => (
            <div key={label}>
              <p className="h1 margin-bottom-1">{value}</p>
              <p className="font-size-md">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section aria-labelledby="features-heading">
      <div className="container wide margin-y-5">
        <h2 className="text-align-center margin-bottom-4" id="features-heading">The Latest</h2>
        <div className="grid grid--column-3--md gap-4">
          {latestCards.map(([badge, title]) => (
            <LatestCard badge={badge} title={title} key={title} />
          ))}
        </div>
      </div>
    </section>

    <section className="theme-light padding-y-5" aria-labelledby="section-dark-heading">
      <div className="container wide">
        <div className="grid grid--column-2--lg gap-5 align-items-center">
          <div className="narrow">
            <h2 id="section-dark-heading">Section Heading</h2>
            <p>{loremParagraphs[1]} {loremParagraphs[2]}</p>
            <Button tag="a" linkUrl="#1" title="Learn More" />
          </div>
          <div>
            <img src={placeholderImage({ width: 800, height: 500, text: 'Section Image' })} alt="" />
          </div>
        </div>
      </div>
    </section>

    <section className="padding-y-5" aria-labelledby="section-light-heading">
      <div className="container wide">
        <div className="grid grid--column-2--lg gap-5 align-items-center">
          <div>
            <img src={placeholderImage({ width: 800, height: 500, text: 'Section Image' })} alt="" />
          </div>
          <div>
            <h2 id="section-light-heading">Section Heading</h2>
            <p>{loremParagraphs[1]} {loremParagraphs[2]}</p>
            <Button tag="a" linkUrl="#1" title="Learn More" />
          </div>
        </div>
      </div>
    </section>

    <section className="theme-light padding-y-5">
      <div className="wide--lg margin-x-auto">
        <Track
          ariaLabel="Recent news"
          panels={trackPanels}
          utilities="track--peeking--xl track--peeking-edge--xl track--column-2--xl"
        />
      </div>
    </section>

    <section className="padding-y-5" aria-labelledby="faq-heading">
      <div className="container medium">
        <h2 className="margin-bottom-4 text-align-center" id="faq-heading">Frequently Asked Questions</h2>
        <Accordion>
          {faqItems.map(([itemId, title, text]) => (
            <Accordion.Item itemId={itemId} title={title} key={itemId}>
              <p>{text}</p>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </section>

    <Backdrop
      tag="section"
      imageSrc={placeholderImage({ width: 1500, height: 500, text: 'Call to action' })}
      imageUtilities="opacity-30"
      utilities="theme-dark"
      attributes={{ 'aria-labelledby': 'cta-heading' }}
    >
      <div className="margin-y-5 text-align-center">
        <div className="container narrow">
          <h2 id="cta-heading">Ready to Get Started?</h2>
          <p className="font-size-lg">Join us and start building something great today.</p>
          <Button tag="a" linkUrl="#1" title="Get Started Today" utilities="theme-canvas" />
        </div>
      </div>
    </Backdrop>
  </main>
);

const templatePageMap = {
  '/templates/landing': LandingTemplatePage,
  '/templates/form': FormTemplatePage,
  '/templates/search-results': SearchResultsTemplatePage,
  '/templates/full-width': FullWidthTemplatePage,
  '/templates/two-column': TwoColumnTemplatePage,
  '/templates/three-column': ThreeColumnTemplatePage,
};

const App = () => {
  const [currentPath, setCurrentPath] = useState(getRoutePath);
  const [currentSearch, setCurrentSearch] = useState(() => window.location.search);
  const TemplatePage = templatePageMap[currentPath] ?? LandingTemplatePage;

  const navigate = (target) => {
    const nextRoute = getNavigationTarget(target);

    if (nextRoute.path === currentPath && nextRoute.search === currentSearch) return;

    window.history.pushState({}, '', nextRoute.url);
    setCurrentPath(nextRoute.path);
    setCurrentSearch(nextRoute.search);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getRoutePath());
      setCurrentSearch(window.location.search);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      <div className="skip-links">
        <a href="#main-content">Jump to main content</a>
        <a href="#global-footer">Jump to website footer</a>
      </div>

      <TemplateHeader currentPath={currentPath} onNavigate={navigate} />
      <TemplatePage currentPath={currentPath} currentSearch={currentSearch} onNavigate={navigate} />
      <TemplateFooter />
    </>
  );
};

export default App;

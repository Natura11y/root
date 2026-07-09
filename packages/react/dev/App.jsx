import '@natura11y/core/dist/natura11y.css';
import './style.css';

import { useEffect, useState } from 'react';
import {
  Alert,
  Brand,
  Button,
  ButtonIconOnly,
  Backdrop,
  BackdropVideo,
  Card,
  CardBody,
  Dropdown,
  Form,
  FormEntry,
  Icon,
  MainMenu,
  RequiredIndicator,
} from '@lib/components';

const assets = {
  video: new URL('../../core/dist/html/examples/peak-performance-page/images/BackdropVideo.mp4', import.meta.url).href,
  featuredPrimary: new URL('../../core/dist/html/examples/peak-performance-page/images/kalen-emsley-Bkci_8qcdvQ-unsplash.jpg', import.meta.url).href,
  featuredSecondary: new URL('../../core/dist/html/examples/peak-performance-page/images/tomasz-smal-HJNQCoXVkU-unsplash.jpg', import.meta.url).href,
  featuredTertiary: new URL('../../core/dist/html/examples/peak-performance-page/images/tono-graphy-k7SElGCAmgc-unsplash.jpg', import.meta.url).href,
  alpineTrails: new URL('../../core/dist/html/examples/peak-performance-page/images/mujo-hasanovic-kgoOGADs6c8-unsplash.jpg', import.meta.url).href,
  forestValleys: new URL('../../core/dist/html/examples/peak-performance-page/images/alessio-soggetti-umnkKO0xgco-unsplash.jpg', import.meta.url).href,
  snowPeaks: new URL('../../core/dist/html/examples/peak-performance-page/images/saira-ahmed-nLdTtHGZ25E-unsplash.jpg', import.meta.url).href,
  volcanicRidges: new URL('../../core/dist/html/examples/peak-performance-page/images/till-rottmann-xhDQ2qkDuaE-unsplash.jpg', import.meta.url).href,
  wildPlaces: new URL('../../core/dist/html/examples/peak-performance-page/images/christian-joudrey-mWRR1xj95hg-unsplash.jpg', import.meta.url).href,
  northernRange: new URL('../../core/dist/html/examples/peak-performance-page/images/jerry-zhang-ePpaQC2c1xA-unsplash.jpg', import.meta.url).href,
  alpineLakes: new URL('../../core/dist/html/examples/peak-performance-page/images/alin-andersen-f0SgAs27BYI-unsplash.jpg', import.meta.url).href,
  mountainRivers: new URL('../../core/dist/html/examples/peak-performance-page/images/deogyeon-hwang-zBLoozHjHwY-unsplash.jpg', import.meta.url).href,
  highCountry: new URL('../../core/dist/html/examples/peak-performance-page/images/thomas-henke-mWk5pbVELDU-unsplash.jpg', import.meta.url).href,
  wildlife: new URL('../../core/dist/html/examples/peak-performance-page/images/rutger-heijmerikx-iQiFZ_MnzKo-unsplash.jpg', import.meta.url).href,
  autumn: new URL('../../core/dist/html/examples/peak-performance-page/images/kurt-liebhaeuser-CcWSIocNThA-unsplash.jpg', import.meta.url).href,
};

const externalLinkProps = {
  target: '_blank',
  rel: 'noreferrer',
};

const scrollToTop = (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const getRoutePath = () => {
  const path = window.location.pathname;
  return path === '/contact' || path === '/nutrition' ? '/contact' : '/';
};

const RouteLink = ({ href, currentPath, onNavigate, children, ...props }) => (
  <a
    href={href}
    aria-current={currentPath === href ? 'page' : undefined}
    onClick={(event) => {
      event.preventDefault();
      onNavigate(href);
    }}
    {...props}
  >
    {children}
  </a>
);

const featuredCards = [
  {
    href: 'https://unsplash.com/@kalenemsley',
    image: assets.featuredPrimary,
    title: 'Vast valleys and forested peaks shape unforgettable journeys',
    credit: 'Kalen Emsley',
    action: 'Explore the Region',
    primary: true,
  },
  {
    href: 'https://unsplash.com/@apphex',
    image: assets.featuredSecondary,
    title: 'High mountain passes reveal breathtaking views',
    credit: 'Tomasz Smal',
    action: 'Scenic Routes',
  },
  {
    href: 'https://unsplash.com/@tonography',
    image: assets.featuredTertiary,
    title: 'Golden light transforms rugged peaks at sunset',
    credit: 'Tono Graphy',
    action: 'Photography Guide',
  },
];

const landscapeCards = [
  {
    href: 'https://unsplash.com/@mujoh',
    image: assets.alpineTrails,
    title: 'Alpine Trails',
    credit: 'Mujo Hasanovic',
    text: 'Winding paths lead through dramatic mountain scenery and open alpine meadows.',
    action: 'Trail Guide',
  },
  {
    href: 'https://unsplash.com/@asoggetti',
    image: assets.forestValleys,
    title: 'Forest Valleys',
    credit: 'Alessio Soggetti',
    text: 'Dense evergreen forests shelter rivers, wildlife, and peaceful backcountry routes.',
    action: 'Explore Valleys',
  },
  {
    href: 'https://unsplash.com/@sairaa',
    image: assets.snowPeaks,
    title: 'Snow-Capped Peaks',
    credit: 'saira ahmed',
    text: 'Towering summits create some of the most iconic landscapes in the world.',
    action: 'Mountain Views',
  },
  {
    href: 'https://unsplash.com/@till2',
    image: assets.volcanicRidges,
    title: 'Volcanic Ridges',
    credit: 'Till Rottmann',
    text: 'Ancient volcanic formations shape rugged terrain and dramatic skylines.',
    action: 'Learn More',
  },
];

const storyLinks = [
  {
    href: 'https://unsplash.com/@z734923105',
    image: assets.northernRange,
    title: 'The Northern Range',
    credit: 'Jerry Zhang',
  },
  {
    href: 'https://unsplash.com/@onixion',
    image: assets.alpineLakes,
    title: 'Above the Alpine Lakes',
    credit: 'Alin Andersen',
  },
  {
    href: 'https://unsplash.com/@lalalife',
    image: assets.mountainRivers,
    title: 'Mountain Rivers',
    credit: 'Deogyeon Hwang',
  },
  {
    href: 'https://unsplash.com/@weinraum',
    image: assets.highCountry,
    title: 'High Country Trails',
    credit: 'thomas henke',
  },
  {
    href: 'https://unsplash.com/@heijmerikx',
    image: assets.wildlife,
    title: 'Wildlife at Dusk',
    credit: 'Rutger Heijmerikx',
  },
  {
    href: 'https://unsplash.com/@kurti',
    image: assets.autumn,
    title: 'Autumn in the Backcountry',
    credit: 'Kurt Liebhaeuser',
  },
];

const footerNav = [
  ['Training', ['Workout Plans', 'Nutrition', 'Recovery', 'Technique', 'Coaching']],
  ['Gear', ['Footwear', 'Apparel', 'Equipment', 'Accessories', 'Sale']],
  ['Company', ['About Us', 'Careers', 'Press', 'Contact', 'Blog']],
];

const subjectOptions = [
  { label: 'General Inquiry', value: 'general' },
  { label: 'Technical Support', value: 'support' },
  { label: 'Billing Question', value: 'billing' },
  { label: 'Feedback', value: 'feedback' },
  { label: 'Other', value: 'other' },
];

const contactMethodOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Either', value: 'either' },
];

const topicOptions = [
  { label: 'Products & Services', value: 'products' },
  { label: 'Events & Webinars', value: 'events' },
  { label: 'News & Updates', value: 'updates' },
  { label: 'Resources & Guides', value: 'resources' },
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

const validateContactForm = (formData) => {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.firstName.trim()) {
    errors.firstName = 'Enter your first name.';
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'Enter your last name.';
  }

  if (!emailPattern.test(formData.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!formData.subject) {
    errors.subject = 'Select a subject.';
  }

  if (!formData.message.trim()) {
    errors.message = 'Enter a message.';
  }

  return errors;
};

const Logo = ({ currentPath, onNavigate }) => (
  <RouteLink href="/" currentPath={currentPath} onNavigate={onNavigate} title="Home" data-logo="brand">
    <Brand />
  </RouteLink>
);

const Header = ({ currentPath, onNavigate }) => (
  <header className="margin-x-auto wide">
    <MainMenu
      navId="main-menu"
      logo={<Logo currentPath={currentPath} onNavigate={onNavigate} />}
      actions={
        <ButtonIconOnly
          iconHandle="language"
          ariaLabel="Language"
        />
      }
    >
      <li>
        <Dropdown buttonText="Training" dropdownId="dropdown-1" utilities="box-shadow-1--lg">
          <li><a href="#1">Strength</a></li>
          <li><a href="#1">Endurance</a></li>
          <li><a href="#1">Recovery</a></li>
        </Dropdown>
      </li>
      <li>
        <RouteLink href="/contact" currentPath={currentPath} onNavigate={onNavigate}>
          Contact
        </RouteLink>
      </li>
      <li><a href="#1">Athletes</a></li>
      <li><a href="#1">Gear</a></li>
    </MainMenu>
  </header>
);

const Hero = () => (
  <BackdropVideo
    tag="section"
    id="introduction"
    videoSrc={assets.video}
    utilities="theme-dark"
    mediaUtilities="gradient-mask-bottom"
    videoUtilities="opacity-40"
    controlUtilities="margin-2"
    controlButtonUtilities="font-size-md border-radius-circle"
    credit={
      <div className="backdrop__media__credit margin-1">
        <p>
          Photo by <a href="https://unsplash.com/@jonnyjames2" {...externalLinkProps}>Jonny James</a> on Unsplash
        </p>
      </div>
    }
  >
    <div className="container narrow--sm medium--lg text-align-center margin-y-6">
      <h1 className="banner-headline text-shadow margin-bottom-4">
        Endless mountain landscapes waiting beyond the horizon
      </h1>

      <div className="narrow margin-x-auto">
        <div className="grid grid--column-2--md gap-3">
          <Button tag="a" linkUrl="#1" title="Plan Your Visit" utilities="theme-primary box-shadow-1" />
          <Button tag="a" linkUrl="#1" title="View Destinations" utilities="theme-secondary box-shadow-1" />
        </div>
      </div>
    </div>
  </BackdropVideo>
);

const FeaturedCard = ({ href, image, title, credit, action, primary = false }) => (
  <Backdrop
    tag="a"
    href={href}
    {...externalLinkProps}
    imageSrc={image}
    imageAlt="Placeholder"
    utilities="theme-dark"
    mediaUtilities="gradient-mask-bottom"
    imageUtilities={primary ? 'opacity-40' : 'opacity-50'}
    coverUtilities={`justify-content-end${primary ? '' : ' text-shadow'}`}
  >
    <div className={primary ? 'container width-100 margin-y-3' : 'container narrow margin-y-3'}>
      <div className="narrow">
        <div className={primary ? 'text-shadow margin-bottom-3' : undefined}>
          <h2 className={primary ? undefined : 'h4'}>{title}</h2>
          <p className="font-size-sm opacity-80">
            Photo by <span className="text-decoration-underline">{credit}</span>
          </p>
        </div>

        <span className={primary ? 'button button--has-icon theme-secondary font-size-md' : 'link text-color-secondary font-size-md'}>
          <span className="text">{action}</span>
          <Icon iconHandle="chevron-right" />
        </span>
      </div>
    </div>
  </Backdrop>
);

const Featured = () => (
  <section className="container medium wide--xl margin-y-6" id="featured">
    <div className="grid grid--features">
      {featuredCards.map((card) => (
        <FeaturedCard key={card.title} {...card} />
      ))}
    </div>
  </section>
);

const LandscapeCard = ({ href, image, title, credit, text, action }) => (
  <Backdrop
    tag="a"
    href={href}
    {...externalLinkProps}
    imageSrc={image}
    imageAlt="Placeholder"
    utilities="box-shadow-3"
    mediaUtilities="gradient-mask-bottom"
    imageUtilities="opacity-50"
    coverUtilities="justify-content-end text-shadow"
  >
    <div className="container wide margin-y-3">
      <div className="narrow">
        <div className="text-shadow margin-bottom-1">
          <h2 className="h5">{title}</h2>
          <p className="font-size-sm opacity-80">
            Photo by <span className="text-decoration-underline">{credit}</span>
          </p>
          <p>{text}</p>
        </div>

        <span className="link text-color-secondary font-size-md">
          <span className="text">{action}</span>
          <Icon iconHandle="arrow-right" />
        </span>
      </div>
    </div>
  </Backdrop>
);

const Landscapes = () => (
  <section className="theme-dark">
    <div className="container medium wide--xl padding-y-6">
      <header className="narrow text-align-center margin-x-auto">
        <h2>Explore Landscapes That Inspire Adventure</h2>
        <p>
          From towering summits to quiet forest trails, every landscape offers a different way to experience the outdoors.
        </p>
      </header>

      <div className="grid grid--column-2--lg grid--column-4--xl gap-3 margin-y-5">
        {landscapeCards.map((card) => (
          <LandscapeCard key={card.title} {...card} />
        ))}
      </div>

      <div className="narrow text-align-center margin-x-auto">
        <a className="button button--has-icon theme-secondary" href="#1">
          <span className="button__text">View All Destinations</span>
          <Icon iconHandle="chevron-right" />
        </a>
      </div>
    </div>
  </section>
);

const WildPlaces = () => (
  <section className="container wide margin-y-6">
    <div className="grid grid--column-2--md gap-4 align-items-center">
      <div className="position-relative">
        <img src={assets.wildPlaces} alt="Placeholder" />

        <div className="position-bottom-right theme-dark padding-x-2 padding-y-1 font-size-sm">
          Photo by <a className="link-expanded" href="https://unsplash.com/@cjoudrey" {...externalLinkProps}>Christian Joudrey</a>
        </div>
      </div>

      <div className="narrow">
        <h2 className="h3">The Beauty of Wild Places</h2>
        <p>
          Towering cliffs, winding rivers, and quiet forests offer endless opportunities to explore nature at your own pace.
        </p>

        <a className="button button--has-icon theme-secondary" href="#1">
          <span className="button__text">Start Exploring</span>
          <Icon iconHandle="chevron-right" />
        </a>
      </div>
    </div>
  </section>
);

const Stories = () => (
  <section className="theme-light">
    <div className="container medium wide--xl padding-y-5">
      <header className="narrow text-align-center margin-x-auto">
        <h2>Stories from the Mountains</h2>
        <p>
          Travel notes, outdoor guides, and photography stories inspired by wild landscapes.
        </p>
      </header>

      <div className="grid grid--column-3--xl gap-2 margin-y-5">
        {storyLinks.map(({ href, image, title, credit }) => (
          <a className="thumb-button no-hover-focus" href={href} key={title} {...externalLinkProps}>
            <p>
              <span className="thumb-button__text">{title}</span>
              <span className="thumb-button__credit">
                Photo by <span className="text-decoration-underline">{credit}</span>
              </span>
            </p>

            <img className="thumb-button__image" src={image} alt="Placeholder" />
          </a>
        ))}
      </div>
    </div>
  </section>
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
          <p>
            A few required details need attention before this can be submitted.
          </p>
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
        <button className="button theme-dark" type="submit">
          <span className="text">Send Message</span>
          <Icon iconHandle="send" />
        </button>
      </div>
    </Form>
  );
};

const ContactPage = () => (
  <main id="main">
    <header className="theme-light">
      <div className="border-bottom display-none display-block--lg">
        <div className="container wide padding-y-2">
          <nav aria-label="Breadcrumb">
            <ul className="breadcrumb">
              <li>
                <a href="#1">Grandparent</a>
              </li>
              <li>
                <a href="#1">Parent</a>
              </li>
              <li aria-current="page">Child Page</li>
            </ul>
          </nav>
        </div>
      </div>

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

                <a className="button text-color-link font-size-md" href="tel:+12025550100">
                  <Icon iconHandle="call" />
                  <span className="text">(202) 555-0100</span>
                </a>
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

const HomePage = () => (
  <main id="main">
    <Hero />
    <Featured />
    <Landscapes />
    <WildPlaces />
    <Stories />
  </main>
);

const FooterNav = ({ title, links }) => (
  <nav>
    <p className="h6 margin-bottom-2">{title}</p>
    <ul className="nav">
      {links.map((link) => (
        <li key={link}>
          <a href="#1">{link}</a>
        </li>
      ))}
    </ul>
  </nav>
);

const Footer = ({ currentPath, onNavigate }) => (
  <footer className="font-size-md" id="global-footer">
    <h2 className="screen-reader-only">Page Footer</h2>

    <div className="container narrow wide--lg padding-y-4">
      <div className="grid grid--column-2 grid--column-4--lg gap-4">
        {footerNav.map(([title, links]) => (
          <FooterNav key={title} title={title} links={links} />
        ))}

        <div>
          <Logo currentPath={currentPath} onNavigate={onNavigate} />

          <p>
            Journeys begin with landscapes that invite exploration and wonder.
          </p>

          <ul className="nav nav--horizontal font-size-sm">
            <li>
              <ButtonIconOnly tag="a" linkUrl="#1" iconHandle="facebook" ariaLabel="Facebook" utilities="theme-dark border-radius-circle" />
            </li>
            <li>
              <ButtonIconOnly tag="a" linkUrl="#1" iconHandle="bluesky" ariaLabel="Bluesky" utilities="theme-dark border-radius-circle" />
            </li>
            <li>
              <ButtonIconOnly tag="a" linkUrl="#1" iconHandle="instagram" ariaLabel="Instagram" utilities="theme-dark border-radius-circle" />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <hr />

    <div className="container narrow wide--lg padding-y-2 font-size-sm">
      <div className="display-flex justify-content-between">
        <span>&copy; Copyright 2024. All rights reserved.</span>

        <a className="link" href="#" onClick={scrollToTop}>
          <Icon iconHandle="arrow-up" />
          <span className="text">Back to Top</span>
        </a>
      </div>
    </div>
  </footer>
);

const App = () => {
  const [currentPath, setCurrentPath] = useState(getRoutePath);

  const navigate = (path) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getRoutePath());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      <div className="skip-links">
        <a href="#main">Jump to main content</a>
        <a href="#global-footer">Jump to website footer</a>
      </div>

      <Header currentPath={currentPath} onNavigate={navigate} />

      {currentPath === '/contact' ? (
        <ContactPage />
      ) : (
        <HomePage />
      )}

      <Footer currentPath={currentPath} onNavigate={navigate} />
    </>
  );
};

export default App;

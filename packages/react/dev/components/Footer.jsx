import { Brand, Button, ButtonIconOnly } from '@lib/components';

const scrollToTop = (event) => {
  event.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const Footer = () => (
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

export default Footer;

import {
  Accordion,
  Badge,
  Backdrop,
  Button,
  Card,
  CardBody,
  CardFoot,
  CardMedia,
  Icon,
  Track,
} from '@lib/components';
import {
  faqItems,
  latestCards,
  loremParagraphs,
  placeholderImage,
  starterStats,
  trackPanels,
} from '../data';

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

const LandingTemplate = () => (
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

export default LandingTemplate;

import { Track as ReactTrack } from '@natura11y/react';
import track01 from './images/track-01.jpg?url';
import track02 from './images/track-02.jpg?url';
import track03 from './images/track-03.jpg?url';
import track04 from './images/track-04.jpg?url';
import track05 from './images/track-05.jpg?url';
import track06 from './images/track-06.jpg?url';
import track07 from './images/track-07.jpg?url';

interface TrackDocsPanel extends Record<string, unknown> {
  imageUrl: string;
  altText: string;
  imageCredit: string;
  linkUrl: string;
}

interface TrackDocsProps {
  trackId?: string;
  utilities?: string | null;
  floatDirectionalButtons?: boolean;
}

const panels: TrackDocsPanel[] = [
  {
    imageUrl: track01,
    altText: 'Placeholder Image One',
    imageCredit: 'Abhijit Sinha',
    linkUrl: 'https://unsplash.com/@abhijit_sinha',
  },
  {
    imageUrl: track02,
    altText: 'Placeholder Image Two',
    imageCredit: 'Getty Images',
    linkUrl: 'https://unsplash.com/photos/a-lion-portrait-in-the-maasai-mara-africa-MinC4zW268E',
  },
  {
    imageUrl: track03,
    altText: 'Placeholder Image Three',
    imageCredit: 'Getty Images',
    linkUrl: 'https://unsplash.com/photos/cheetah-cubs-play-with-each-other-in-the-savannah-kenya-tanzania-africa-national-park-serengeti-maasai-mara-an-excellent-illustration-optyeeOoqkM',
  },
  {
    imageUrl: track04,
    altText: 'Placeholder Image Four',
    imageCredit: 'Getty Images',
    linkUrl: 'https://unsplash.com/photos/big-male-lion-with-cub-national-park-kenya-tanzania-masai-mara-serengeti-an-excellent-illustration-NPTL0JlyVHk',
  },
  {
    imageUrl: track05,
    altText: 'Placeholder Image Five',
    imageCredit: 'Getty Images',
    linkUrl: 'https://unsplash.com/photos/lioness-lying-on-a-big-tree-close-up-uganda-east-africa-an-excellent-illustration-vJwRjignzJI',
  },
  {
    imageUrl: track06,
    altText: 'Placeholder Image Six',
    imageCredit: 'Getty Images',
    linkUrl: 'https://unsplash.com/photos/leopard-in-the-afternoon-light-3A1pT3_cAXM',
  },
  {
    imageUrl: track07,
    altText: 'Placeholder Image Seven',
    imageCredit: 'Zdenek Machacek',
    linkUrl: 'https://unsplash.com/photos/a-group-of-cats-sitting-on-top-of-snow-covered-ground-eejn-j7etVo',
  },
];

const CreditPanel = ({ panel }: { panel: Record<string, unknown> }) => {
  const { linkUrl, imageUrl, altText, imageCredit } = panel as TrackDocsPanel;

  return (
    <a
      className="backdrop"
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="backdrop__media">
        <img src={imageUrl} alt={altText} />
        <div className="backdrop__media__credit margin-1 position-bottom-left border-radius-1">
          <p>
            Photo by{' '}
            <span className="text-decoration-underline text-color-link">
              {imageCredit}
            </span>
          </p>
        </div>
      </div>
    </a>
  );
};

const Track = ({
  trackId = 'track-docs',
  utilities = null,
  floatDirectionalButtons = false,
}: TrackDocsProps) => (
  <ReactTrack
    ariaLabel="Featured Content"
    trackId={trackId}
    utilities={utilities}
    panels={panels}
    floatDirectionalButtons={floatDirectionalButtons}
    PanelComponent={CreditPanel}
  />
);

export default Track;

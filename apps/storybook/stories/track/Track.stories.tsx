import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaTrack from '@core-js/track';
import Track from '@lib/components/natura11y/track';
import VanillaExample from '../../utils/VanillaExample';
import { storyMedia } from '../media';
import trackMarkup from './track.example.html?raw';

const initializeTrack = () => {
  new VanillaTrack().init();
};

interface TrackStoryPanel extends Record<string, unknown> {
  linkUrl: string;
  imageUrl: string;
  altText: string;
  buttonText: string;
  imageCredit: string;
}

const panels: TrackStoryPanel[] = [
  {
    linkUrl: '#1',
    imageUrl: storyMedia.landscapeImage,
    altText: 'Snowy mountain ridge at sunset',
    buttonText: 'Explore',
    imageCredit: 'Eberhard Grossgasteiger',
  },
  {
    linkUrl: '#2',
    imageUrl: storyMedia.videoOneThumbnail,
    altText: 'Person walking through a misty landscape',
    buttonText: 'Watch',
    imageCredit: 'Dmitry Varennikov',
  },
  {
    linkUrl: '#3',
    imageUrl: storyMedia.videoTwoThumbnail,
    altText: 'Person standing near a mountain lake',
    buttonText: 'Watch',
    imageCredit: 'Dmitry Varennikov',
  },
  {
    linkUrl: '#4',
    imageUrl: storyMedia.landscapeImage,
    altText: 'Mountain slope covered in snow',
    buttonText: 'Explore',
    imageCredit: 'Eberhard Grossgasteiger',
  },
  {
    linkUrl: '#5',
    imageUrl: storyMedia.videoOneThumbnail,
    altText: 'Landscape video thumbnail with muted colors',
    buttonText: 'Watch',
    imageCredit: 'Dmitry Varennikov',
  },
  {
    linkUrl: '#6',
    imageUrl: storyMedia.videoTwoThumbnail,
    altText: 'Outdoor video thumbnail beside still water',
    buttonText: 'Watch',
    imageCredit: 'Dmitry Varennikov',
  },
  {
    linkUrl: '#7',
    imageUrl: storyMedia.landscapeImage,
    altText: 'Wide mountain landscape with clouds',
    buttonText: 'Explore',
    imageCredit: 'Eberhard Grossgasteiger',
  },
];

const CreditPanel = ({ panel }: { panel: Record<string, unknown> }) => {
  const { linkUrl, imageUrl, altText, imageCredit } = panel as unknown as TrackStoryPanel;

  return (
    <a className='backdrop' href={linkUrl}>
      <div className='backdrop__media'>
        <img src={imageUrl} alt={altText} />
        <div className='backdrop__media__credit margin-1 position-bottom-left border-radius-1'>
          <p>
            Photo by{' '}
            <span className='text-decoration-underline text-color-link'>{imageCredit}</span>
          </p>
        </div>
      </div>
    </a>
  );
};

const meta = {
  title: 'Track',
  component: Track,
  args: {
    ariaLabel: 'Featured content',
    trackId: 'track-story',
    panels,
    floatDirectionalButtons: false,
    utilities: '',
  },
  argTypes: {
    ariaLabel: { control: 'text' },
    trackId: { control: 'text' },
    floatDirectionalButtons: { control: 'boolean' },
    utilities: { control: 'text' },
    panels: { control: false },
    PanelComponent: { control: false },
    PaginationComponent: { control: false },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
} satisfies Meta<typeof Track>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: trackMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample html={trackMarkup} initialize={initializeTrack} />
  ),
};

export const React: Story = {
  args: {
    trackId: 'track-default',
  },
};

export const ControlsBelow: Story = {
  args: {
    trackId: 'track-controls-below',
    PanelComponent: CreditPanel,
  },
};

export const FloatingControls: Story = {
  args: {
    trackId: 'track-floating-controls',
    floatDirectionalButtons: true,
    PanelComponent: CreditPanel,
  },
};

export const ResponsiveColumns: Story = {
  args: {
    trackId: 'track-responsive-columns',
    floatDirectionalButtons: true,
    utilities: 'track--column-3--lg',
    PanelComponent: CreditPanel,
  },
};

export const PanelPeeking: Story = {
  args: {
    trackId: 'track-panel-peeking',
    floatDirectionalButtons: true,
    utilities: 'track--column-2--xl track--peeking--xl',
    PanelComponent: CreditPanel,
  },
  render: (args) => (
    <div className='wide margin-x-auto'>
      <Track {...args} />
    </div>
  ),
};

export const PeekingEdge: Story = {
  args: {
    trackId: 'track-peeking-edge',
    floatDirectionalButtons: true,
    utilities: 'track--column-2--xl track--peeking--xl track--peeking-edge--xl',
    PanelComponent: CreditPanel,
  },
  render: (args) => (
    <div className='wide margin-x-auto'>
      <Track {...args} />
    </div>
  ),
};

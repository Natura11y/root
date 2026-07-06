import { useContext, useEffect, useRef } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import VanillaLightbox from '@core-js/lightbox';
import { LightboxContext, LightboxProvider, type MediaItem } from '@lib/context/LightboxContext';
import LightboxButton from '@lib/components/lightbox/LightboxButton';
import VanillaExample from '../../utils/VanillaExample';
import { storyMedia } from '../media';
import galleryMarkup from './lightbox-gallery.example.html?raw';
import thumbnailsMarkup from './lightbox.example.html?raw';

const meta: Meta = {
  title: 'Lightbox',
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj;

interface LightboxStoryItem extends MediaItem {
  thumbnailAlt: string;
  thumbnailSrc: string;
}

const thumbnailItems: LightboxStoryItem[] = [
  {
    lbType: 'image',
    lbSrc: storyMedia.landscapeImage,
    lbCaption: 'Mountain landscape',
    thumbnailSrc: storyMedia.landscapeImage,
    thumbnailAlt: 'Mountain landscape',
  },
  {
    lbType: 'video',
    lbSrc: storyMedia.videoOne,
    lbCaption: 'Video one',
    thumbnailSrc: storyMedia.videoOneThumbnail,
    thumbnailAlt: 'Video one thumbnail',
  },
];

const galleryItems: LightboxStoryItem[] = [
  ...thumbnailItems,
  {
    lbType: 'image',
    lbSrc: '/story-assets/backdrop/backdrop-example-01.jpg',
    lbCaption: 'Forest path',
    thumbnailSrc: '/story-assets/backdrop/backdrop-example-01.jpg',
    thumbnailAlt: 'Forest path',
  },
  {
    lbType: 'video',
    lbSrc: storyMedia.videoTwo,
    lbCaption: 'Video two',
    thumbnailSrc: storyMedia.videoTwoThumbnail,
    thumbnailAlt: 'Video two thumbnail',
  },
];

const initializeLightbox = () => {
  new VanillaLightbox().init();
};

const withReactLightbox: Decorator = (Story) => (
  <LightboxProvider>
    <Story />
  </LightboxProvider>
);

const lightboxStory = (markup: string): Story => ({
  parameters: {
    docs: {
      source: {
        code: markup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample html={markup} initialize={initializeLightbox} />
  ),
});

const ReactLightboxGrid = ({
  items,
  utilities,
}: {
  items: LightboxStoryItem[];
  utilities: string;
}) => {
  const ctx = useContext(LightboxContext);
  const hasRegisteredMedia = useRef(false);

  useEffect(() => {
    if (!ctx || hasRegisteredMedia.current) return;

    items.forEach(({ lbType, lbSrc, lbCaption }) => {
      ctx.addToMediaArray({ lbType, lbSrc, lbCaption });
    });

    hasRegisteredMedia.current = true;
  }, [ctx, items]);

  return (
    <div className={utilities}>
      {items.map((item, index) => (
        <LightboxButton
          key={`${item.lbType}-${item.lbSrc}`}
          lbType={item.lbType}
          lbSrc={item.lbSrc}
          lbCaption={item.lbCaption}
          lbIndex={index}
          utilities='lightbox-thumbnail'
        >
          <img src={item.thumbnailSrc} alt={item.thumbnailAlt} />
        </LightboxButton>
      ))}
    </div>
  );
};

export const ThumbnailsHtml: Story = {
  name: 'Thumbnails (HTML)',
  ...lightboxStory(thumbnailsMarkup),
};

export const ThumbnailsReact: Story = {
  name: 'Thumbnails (React)',
  decorators: [withReactLightbox],
  render: () => (
    <ReactLightboxGrid
      items={thumbnailItems}
      utilities='grid grid--column-2--md gap-3'
    />
  ),
};

export const GalleryHtml: Story = {
  name: 'Gallery (HTML)',
  ...lightboxStory(galleryMarkup),
};

export const GalleryReact: Story = {
  name: 'Gallery (React)',
  decorators: [withReactLightbox],
  render: () => (
    <ReactLightboxGrid
      items={galleryItems}
      utilities='grid grid--column-4--lg grid--column-2--md gap-3'
    />
  ),
};

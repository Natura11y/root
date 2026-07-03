import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import VanillaLightbox from '@core-js/lightbox';
import { LightboxProvider } from '@lib/context/LightboxContext';
import Lightbox from '@lib/components/natura11y/lightbox';
import LightboxButton from '@lib/components/natura11y/lightbox/LightboxButton';
import VanillaExample from '../../utils/VanillaExample';
import { storyMedia } from '../media';
import lightboxMarkup from './lightbox.example.html?raw';

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

const initializeLightbox = () => {
  new VanillaLightbox().init();
};

const withReactLightbox: Decorator = (Story) => (
  <LightboxProvider>
    <Story />
    <Lightbox />
  </LightboxProvider>
);

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: lightboxMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample html={lightboxMarkup} initialize={initializeLightbox} />
  ),
};

export const React: Story = {
  decorators: [withReactLightbox],
  render: () => (
    <LightboxButton lbType='image' lbSrc={storyMedia.landscapeImage} lbCaption='Mountain landscape' utilities='button'>
      Open Image
    </LightboxButton>
  ),
};

export const Gallery: Story = {
  decorators: [withReactLightbox],
  render: () => (
    <div className='flex-row gap-3'>
      <LightboxButton lbType='image' lbSrc={storyMedia.landscapeImage} lbCaption='Mountain landscape' utilities='button'>
        Image
      </LightboxButton>
      <LightboxButton lbType='video' lbSrc={storyMedia.videoOne} lbCaption='Video one' utilities='button'>
        Video 1
      </LightboxButton>
      <LightboxButton lbType='video' lbSrc={storyMedia.videoTwo} lbCaption='Video two' utilities='button'>
        Video 2
      </LightboxButton>
    </div>
  ),
};

export const ThumbnailGrid: Story = {
  decorators: [withReactLightbox],
  render: () => (
    <div className='grid grid--column-3--md gap-3'>
      <LightboxButton lbType='image' lbSrc={storyMedia.landscapeImage} lbCaption='Mountain landscape'>
        <img src={storyMedia.landscapeImage} alt='Mountain landscape' />
      </LightboxButton>
      <LightboxButton lbType='video' lbSrc={storyMedia.videoOne} lbCaption='Video one'>
        <img src={storyMedia.videoOneThumbnail} alt='Video one thumbnail' />
      </LightboxButton>
      <LightboxButton lbType='video' lbSrc={storyMedia.videoTwo} lbCaption='Video two'>
        <img src={storyMedia.videoTwoThumbnail} alt='Video two thumbnail' />
      </LightboxButton>
    </div>
  ),
};

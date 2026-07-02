import type { Meta, StoryObj } from '@storybook/react-vite';
import { LightboxProvider } from '@lib/context/LightboxContext';
import Lightbox from '@lib/components/natura11y/lightbox';
import LightboxButton from '@lib/components/natura11y/lightbox/LightboxButton';
import { storyMedia } from '../../media';

const meta: Meta = {
  title: 'Components/Lightbox',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <LightboxProvider>
        <Story />
        <Lightbox />
      </LightboxProvider>
    ),
  ],
  parameters: {
    docs: {
      story: { height: '600px', inline: false, width: '100%' },
    },
  },
};

export default meta;
type Story = StoryObj;

export const SingleImage: Story = {
  render: () => (
    <LightboxButton lbType='image' lbSrc={storyMedia.landscapeImage} lbCaption='Mountain landscape' utilities='button'>
      Open Image
    </LightboxButton>
  ),
};

export const Gallery: Story = {
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

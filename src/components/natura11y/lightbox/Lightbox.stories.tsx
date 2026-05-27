import type { Meta, StoryObj } from '@storybook/react-vite';
import { LightboxProvider } from '../../../context/LightboxContext';
import Lightbox from './index';
import LightboxButton from './LightboxButton';
import img1 from './images/eberhard-grossgasteiger-yF9Tm4qrYmM-unsplash.jpg';
import thumb1 from './images/pexels-dmitry-varennikov-5527698-thumbnail.jpg';
import thumb2 from './images/pexels-dmitry-varennikov-5527699-thumbnail.jpg';
import vid1 from './images/pexels-dmitry-varennikov-5527698-1080p.mp4';
import vid2 from './images/pexels-dmitry-varennikov-5527699-1080p.mp4';

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
      story: { height: '600px' },
    },
  },
};

export default meta;
type Story = StoryObj;

export const SingleImage: Story = {
  render: () => (
    <LightboxButton lbType='image' lbSrc={img1} lbCaption='Mountain landscape' utilities='button'>
      Open Image
    </LightboxButton>
  ),
};

export const Gallery: Story = {
  render: () => (
    <div className='flex-row gap-3'>
      <LightboxButton lbType='image' lbSrc={img1} lbCaption='Mountain landscape' utilities='button'>
        Image
      </LightboxButton>
      <LightboxButton lbType='video' lbSrc={vid1} lbCaption='Video one' utilities='button'>
        Video 1
      </LightboxButton>
      <LightboxButton lbType='video' lbSrc={vid2} lbCaption='Video two' utilities='button'>
        Video 2
      </LightboxButton>
    </div>
  ),
};

export const ThumbnailGrid: Story = {
  render: () => (
    <div className='grid grid--column-3--md gap-3'>
      <LightboxButton lbType='image' lbSrc={img1} lbCaption='Mountain landscape'>
        <img src={img1} alt='Mountain landscape' />
      </LightboxButton>
      <LightboxButton lbType='video' lbSrc={vid1} lbCaption='Video one'>
        <img src={thumb1} alt='Video one thumbnail' />
      </LightboxButton>
      <LightboxButton lbType='video' lbSrc={vid2} lbCaption='Video two'>
        <img src={thumb2} alt='Video two thumbnail' />
      </LightboxButton>
    </div>
  ),
};

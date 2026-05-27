import type { Meta, StoryObj } from '@storybook/react-vite';
import Track from './index';
import img1 from '../lightbox/images/eberhard-grossgasteiger-yF9Tm4qrYmM-unsplash.jpg';
import thumb1 from '../lightbox/images/pexels-dmitry-varennikov-5527698-thumbnail.jpg';
import thumb2 from '../lightbox/images/pexels-dmitry-varennikov-5527699-thumbnail.jpg';

const meta: Meta<typeof Track> = {
  title: 'Components/Track',
  component: Track,
  tags: ['autodocs'],
  argTypes: {
    floatDirectionalButtons: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Track>;

const panels = [
  { linkUrl: '#', imageUrl: img1, altText: 'Mountain landscape', buttonText: 'Explore' },
  { linkUrl: '#', imageUrl: thumb1, altText: 'Video thumbnail one', buttonText: 'Watch' },
  { linkUrl: '#', imageUrl: thumb2, altText: 'Video thumbnail two', buttonText: 'Watch' },
  { linkUrl: '#', imageUrl: img1, altText: 'Mountain landscape', buttonText: 'Explore' },
];

export const Default: Story = {
  args: {
    ariaLabel: 'Featured content',
    panels,
  },
};

export const ControlsBelow: Story = {
  args: {
    ariaLabel: 'Featured content',
    panels,
    floatDirectionalButtons: false,
  },
};

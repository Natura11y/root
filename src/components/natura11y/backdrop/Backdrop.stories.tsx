import type { Meta, StoryObj } from '@storybook/react-vite';
import BackdropVideo from './index';
import vid from '../../natura11y/lightbox/images/pexels-dmitry-varennikov-5527698-1080p.mp4';

const meta: Meta<typeof BackdropVideo> = {
  title: 'Components/Backdrop',
  component: BackdropVideo,
  tags: ['autodocs'],
  argTypes: {
    fixedHeight: { control: 'text' },
    stack: {
      control: 'radio',
      options: [null, 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BackdropVideo>;

export const Default: Story = {
  args: {
    videoSrc: vid,
    fixedHeight: '60vh',
  },
  render: (args) => (
    <BackdropVideo {...args}>
      <div className='container padding-y-5 text-align-center'>
        <p className='banner-headline text-color-canvas'>Natura11y</p>
        <p className='font-size-lg text-color-canvas'>An accessible design system</p>
      </div>
    </BackdropVideo>
  ),
};

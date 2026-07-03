import type { Meta, StoryObj } from '@storybook/react-vite';
import BackdropVideo from '@lib/components/natura11y/backdrop';
import Button from '@lib/components/natura11y/button';
import VanillaExample from '../../utils/VanillaExample';
import { storyMedia } from '../media';
import backdropMarkup from './backdrop.example.html?raw';

const meta = {
  title: 'Backdrop',
  component: BackdropVideo,
  args: {
    videoSrc: storyMedia.videoOne,
    stack: 'lg',
    utilities: 'theme-dark',
  },
  argTypes: {
    videoSrc: { control: 'text' },
    videoType: { control: 'text' },
    fixedHeight: { control: 'text' },
    stack: { control: 'text' },
    utilities: { control: 'text' },
    children: { control: false },
  },
  parameters: {
    docs: {
      codePanel: true,
      description: {
        component:
          'React provides BackdropVideo for video backdrops. Static image, fixed-height, and stack backdrop patterns are framework markup and should follow the regular Backdrop documentation.',
      },
    },
  },
} satisfies Meta<typeof BackdropVideo>;

export default meta;
type Story = StoryObj<typeof BackdropVideo>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: backdropMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <div className='wide margin-x-auto'>
      <VanillaExample html={backdropMarkup} />
    </div>
  ),
};

export const React: Story = {
  render: (args) => (
    <div className='wide margin-x-auto'>
      <BackdropVideo {...args}>
        <div className='container medium text-align-center'>
          <h1 className='banner-headline text-shadow margin-bottom-4'>
            Faucibus scelerisque eleifend donec pretium vulputate
          </h1>
          <Button
            tag='a'
            title='Augue Eget Arcu'
            iconEndHandle='arrow-right'
            utilities='theme-primary box-shadow-1'
          />
        </div>
      </BackdropVideo>
    </div>
  ),
};

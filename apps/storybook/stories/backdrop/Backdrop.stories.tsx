import type { Meta, StoryObj } from '@storybook/react-vite';
import BackdropVideo from '@lib/components/backdrop';
import Button from '@lib/components/button';
import VanillaExample from '../../utils/VanillaExample';
import { storyMedia } from '../media';
import backdropMarkup from './backdrop.example.html?raw';
import backdropStackMarkup from './backdrop-stack.example.html?raw';
import backdropFixedMarkup from './backdrop-fixed.example.html?raw';

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

const renderBackdropExample = (markup: string) => (
  <div className='wide margin-x-auto'>
    <VanillaExample html={markup} />
  </div>
);

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
  parameters: {
    docs: {
      source: {
        code: backdropMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => renderBackdropExample(backdropMarkup),
};

export const StackHtml: Story = {
  name: 'Stack (HTML)',
  parameters: {
    docs: {
      source: {
        code: backdropStackMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => renderBackdropExample(backdropStackMarkup),
};

export const FixedHeightHtml: Story = {
  name: 'Fixed Height (HTML)',
  parameters: {
    docs: {
      source: {
        code: backdropFixedMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => renderBackdropExample(backdropFixedMarkup),
};

export const VideoReact: Story = {
  name: 'Video (React)',
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import Card from './index';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    tag: { control: 'radio', options: ['div', 'article', 'section'] },
    horizontal: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <Card.Head>
        <p className='h5'>Card Title</p>
      </Card.Head>
      <Card.Body>
        <p>Card body content goes here. Add any content you need.</p>
      </Card.Body>
      <Card.Foot>
        <a href='#'>Learn more</a>
      </Card.Foot>
    </Card>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Card horizontal>
      <Card.Media>
        <div className='background-color-subtle' style={{ height: '100%', minHeight: 120 }} />
      </Card.Media>
      <Card.Body>
        <p className='h5'>Horizontal Card</p>
        <p>Media and content side by side.</p>
      </Card.Body>
    </Card>
  ),
};

export const Grid: Story = {
  render: () => (
    <div className='grid grid--column-3--md gap-3'>
      {['Alpha', 'Beta', 'Gamma'].map((name) => (
        <Card key={name}>
          <Card.Body>
            <p className='h5'>{name}</p>
            <p>Card content for {name}.</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
};

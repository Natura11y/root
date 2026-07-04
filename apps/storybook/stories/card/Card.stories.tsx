import type { Meta, StoryObj } from '@storybook/react-vite';
import Card from '@lib/components/card';
import VanillaExample from '../../utils/VanillaExample';
import { storyMedia } from '../media';
import cardMarkup from './card.example.html?raw';

const CardFooter = () => (
  <Card.Foot utilities='border-top font-size-md text-color-link'>
    <ul className='nav nav--horizontal justify-content-between'>
      <li>
        <a href='#1'>Search Images</a>
      </li>
      <li>
        <a className='button button--outline' href='#1'>
          Visit Wikipedia
        </a>
      </li>
    </ul>
  </Card.Foot>
);

const CardImage = () => (
  <img
    src={storyMedia.cardImage}
    alt=''
  />
);

const meta = {
  title: 'Card',
  component: Card,
  args: {
    tag: 'div',
    horizontal: false,
    utilities: 'theme-canvas border',
  },
  argTypes: {
    tag: { control: 'radio', options: ['div', 'article', 'section'] },
    horizontal: { control: 'boolean' },
    utilities: { control: 'text' },
    children: { control: false },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTML: Story = {
  parameters: {
    docs: {
      source: {
        code: cardMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => <VanillaExample html={cardMarkup} />,
};

export const React: Story = {
  render: (args) => (
    <Card {...args}>
      <Card.Head utilities='border-bottom'>
        <p>Tropical flowers</p>
      </Card.Head>
      <Card.Body>
        <h2 className='h4'>Gustavia superba</h2>
        <p>
          Gustavia superba is an understory tree that grows in <a href='#1'>Central</a> and
          north-western <a href='#1'>South America</a>. Common names include membrillo,
          sachamango and heaven lotus.
        </p>
      </Card.Body>
      <CardFooter />
    </Card>
  ),
};

export const WithMedia: Story = {
  render: () => (
    <Card utilities='theme-canvas border'>
      <Card.Media>
        <CardImage />
      </Card.Media>
      <Card.Body>
        <h2 className='h4'>Stellaria graminea</h2>
        <p>
          Stellaria graminea is a species of flowering plant in the family Caryophyllaceae known
          by these common names:
        </p>
        <ul>
          <li>
            <em>common starwort</em>
          </li>
          <li>
            <em>lesser stitchwort</em>
          </li>
          <li>
            <em>grass-leaved stitchwort</em>
          </li>
          <li>
            <em>grass-like starwort</em>
          </li>
        </ul>
      </Card.Body>
      <CardFooter />
    </Card>
  ),
};

export const Grid: Story = {
  render: () => {
    const cards = [
      {
        title: 'Prunus mume',
        description:
          'Prunus mume is an East Asian and Southeast Asian tree species classified in the Armeniaca section of the genus Prunus subgenus Prunus.',
      },
      {
        title: 'Eschscholzia californica',
        description:
          'Eschscholzia californica, the California poppy, golden poppy, California sunlight or cup of gold, is native to the United States and Mexico.',
      },
      {
        title: 'Geranium pratense',
        description:
          "Geranium pratense, the meadow crane's-bill or meadow geranium, is a species of flowering plant in the family Geraniaceae, native to Europe and Asia.",
      },
    ];

    return (
      <div className='grid grid--column-3--md gap-3'>
        {cards.map(({ title, description }) => (
          <Card key={title} utilities='theme-canvas border font-size-md'>
            <Card.Media>
              <CardImage />
            </Card.Media>
            <Card.Body>
              <p className='h6'>{title}</p>
              <p>{description}</p>
            </Card.Body>
            <Card.Foot utilities='border-top'>
              <a className='button button--outline width-100 text-color-link' href='#1'>
                Wikipedia
              </a>
            </Card.Foot>
          </Card>
        ))}
      </div>
    );
  },
};

export const Horizontal: Story = {
  render: () => (
    <Card horizontal utilities='theme-canvas border font-size-md'>
      <Card.Media>
        <CardImage />
      </Card.Media>
      <Card.Head utilities='border-bottom'>
        <p>Tropical flowers</p>
      </Card.Head>
      <Card.Body>
        <h2 className='h5'>Stellaria graminea</h2>
        <p>
          Stellaria graminea is a species of flowering plant in the family Caryophyllaceae known
          by several common names.
        </p>
      </Card.Body>
      <CardFooter />
    </Card>
  ),
};

export const HorizontalWithHeader: Story = {
  render: () => (
    <Card horizontal utilities='theme-canvas border font-size-md'>
      <Card.Media>
        <CardImage />
      </Card.Media>
      <Card.Head utilities='border-bottom'>
        <p>Tropical flowers</p>
      </Card.Head>
      <Card.Body>
        <h2 className='h5'>Stellaria graminea</h2>
        <p>
          Stellaria graminea is a species of flowering plant in the family Caryophyllaceae.
        </p>
        <a className='button button--outline font-size-sm text-color-link' href='#1'>
          Visit Wikipedia
        </a>
      </Card.Body>
    </Card>
  ),
};

export const HorizontalMinimal: Story = {
  render: () => (
    <Card horizontal utilities='theme-canvas border font-size-md'>
      <Card.Media>
        <CardImage />
      </Card.Media>
      <Card.Body>
        <h2 className='h5'>Stellaria graminea</h2>
        <p>
          Stellaria graminea is a species of flowering plant in the family Caryophyllaceae.
        </p>
        <a className='button button--outline font-size-sm text-color-link' href='#1'>
          Visit Wikipedia
        </a>
      </Card.Body>
    </Card>
  ),
};

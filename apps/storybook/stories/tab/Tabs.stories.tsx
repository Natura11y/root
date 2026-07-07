import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaTab from '@core-js/tab';
import Tabs from '@lib/components/tab';
import Tab from '@lib/components/tab/Tab';
import VanillaExample from '../../utils/VanillaExample';
import tabMarkup from './tab.example.html?raw';

const initializeTab = () => {
  new VanillaTab().init();
};

const meta: Meta<typeof Tabs> = {
  title: 'Tab',
  component: Tabs,
  argTypes: {
    pill: { control: 'boolean' },
    breakpoint: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const tabContent = [
  {
    title: 'Mackerel',
    content: <>The mackerel tabby pattern gives slender vertical, gently curving stripes on the sides of the body. These stripes may be continuous or broken into bars and short segments/spots, especially on the flanks and stomach. Three or five vertical lines in an 'M' shape almost always appear on the forehead, along with dark lines from the corners of the eyes, one or more crossing each cheek, and of course many stripes and lines at various angles on the neck and shoulder area, on the flanks, and around the legs and tail. Mackerel tabbies are also called 'fishbone tabbies,' probably doubly named after the <a href='#1'>mackerel</a> fish.</>,
  },
  {
    title: 'Classic',
    content: <>The classic tabby (also known as blotched or marbled tabby) has the 'M' pattern on the forehead but the body markings, rather than primarily thin stripes or spots, are thick curving bands in a whirled or swirled pattern with a distinctive mark on each side of the body resembling a bullseye. Classic tabby is a <a href='#1'>recessive</a> trait. Classic tabbies are the most common type of tabby in much of the United Kingdom and the Middle East, among other places, but they are a far second in number to mackerel tabbies in most parts of the world.</>,
  },
  {
    title: 'Ticked',
    content: <>The ticked tabby pattern is due to even fields of <a href='#1'>agouti</a> hairs, each with distinct bands of color, which break up the tabby patterning into a salt-and-pepper appearance that makes them look sand-like—thus there are few to no stripes or bands. Residual ghost striping and/or barring can often be seen on the lower legs, face, and belly and sometimes at the tail tip, as well as the standard 'M' and a long dark line running along the spine, primarily in ticked tabbies who also carry a mackerel or classic tabby allele. These types of cats come in many forms and colors.</>,
  },
];

const renderTabs = (items: typeof tabContent) => items.map((item) => (
  <Tab key={item.title} title={item.title}>
    <p>{item.content}</p>
  </Tab>
));

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
  parameters: {
    docs: {
      source: {
        code: tabMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample html={tabMarkup} initialize={initializeTab} />
  ),
};

export const DefaultReact: Story = {
  name: 'Default (React)',
  render: (args) => (
    <Tabs {...args}>
      {renderTabs(tabContent)}
    </Tabs>
  ),
};

export const Pill: Story = {
  render: (args) => (
    <Tabs {...args} pill>
      {renderTabs(tabContent)}
    </Tabs>
  ),
};

export const Generic: Story = {
  render: (args) => (
    <Tabs {...args} navClass='container nav nav--horizontal--md'>
      {renderTabs(tabContent)}
    </Tabs>
  ),
};

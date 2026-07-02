import type { Meta, StoryObj } from '@storybook/react-vite';
import MainMenu from './index';
import Brand from './Brand';
import Dropdown from '../dropdown';
import FormEntrySearch from '../form/FormEntrySearch';
import ButtonIconOnly from '../button/ButtonIconOnly';

const logo = (
  <a href='/' title='Home' data-logo='brand'>
    <Brand />
  </a>
);

const navItems = (
  <>
    <li>
      <Dropdown buttonText='Dropdown' hover utilities='box-shadow-1--lg'>
        <li><a href='#1'>Link</a></li>
        <li><a href='#1'>Link</a></li>
        <li><a href='#1'>Link</a></li>
      </Dropdown>
    </li>
    <li><a href='#1'>Link</a></li>
    <li><a href='#1'>Link</a></li>
  </>
);

const barSearch = (
  <FormEntrySearch
    id='main-menu-story-search-bar'
    name='globalSearch'
    leadingIcon={false}
    submitButton='text'
  />
);

const stackSearch = (
  <FormEntrySearch
    id='main-menu-story-search-stack'
    name='globalSearch'
    leadingIcon={false}
    submitButton='icon'
  />
);

const actions = (
  <ButtonIconOnly
    iconHandle='language'
    ariaLabel='Language'
  />
);

const meta = {
  title: 'Components/Main Menu',
  component: MainMenu,
  tags: ['autodocs'],
  args: {
    variant: 'bar',
    breakpoint: 'lg',
    navAriaLabel: 'Main Menu',
    utilities: 'box-shadow-1',
  },
  argTypes: {
    variant: { control: 'radio', options: ['bar', 'stack'] },
    breakpoint: { control: 'text' },
    navAriaLabel: { control: 'text' },
    utilities: { control: 'text' },
    logo: { control: false },
    search: { control: false },
    actions: { control: false },
    children: { control: false },
    navId: { control: false },
    searchId: { control: false },
  },
} satisfies Meta<typeof MainMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bar: Story = {
  args: {
    logo,
    search: barSearch,
    children: navItems,
  },
};

export const Stack: Story = {
  args: {
    variant: 'stack',
    logo,
    search: stackSearch,
    children: navItems,
  },
};

export const WithActions: Story = {
  args: {
    logo,
    search: barSearch,
    actions,
    children: navItems,
  },
};

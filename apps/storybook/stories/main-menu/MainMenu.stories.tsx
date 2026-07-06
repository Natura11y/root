import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaCollapse from '@core-js/collapse';
import VanillaDropdown from '@core-js/dropdown';
import VanillaMainMenu from '@core-js/main-menu';
import MainMenu from '@lib/components/main-menu';
import Brand from '@lib/components/main-menu/Brand';
import Dropdown from '@lib/components/dropdown';
import FormEntrySearch from '@lib/components/form/FormEntrySearch';
import ButtonIconOnly from '@lib/components/button/ButtonIconOnly';
import VanillaExample from '../../utils/VanillaExample';
import mainMenuBarMarkup from './main-menu.example.html?raw';
import mainMenuStackMarkup from './main-menu-stack.example.html?raw';

const initializeMainMenu = () => {
  new VanillaCollapse().init();
  new VanillaDropdown().init();
  new VanillaMainMenu().init();
};

const logo = (
  <a href='#1' title='Home' data-logo='brand'>
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
  title: 'Main Menu',
  component: MainMenu,
  args: {
    variant: 'bar',
    breakpoint: 'lg',
    navAriaLabel: 'Main Menu',
    utilities: 'theme-canvas drop-shadow-1',
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
  parameters: {
    docs: {
      codePanel: true,
    },
  },
} satisfies Meta<typeof MainMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderMainMenuHtml = (html: string, key: string) => (
  <VanillaExample
    html={html}
    initialize={initializeMainMenu}
    initializeOnceKey={key}
  />
);

export const BarHtml: Story = {
  name: 'Bar (HTML)',
  parameters: {
    docs: {
      source: {
        code: mainMenuBarMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => renderMainMenuHtml(mainMenuBarMarkup, 'main-menu-bar'),
};

export const BarReact: Story = {
  name: 'Bar (React)',
  args: {
    logo,
    search: barSearch,
    actions,
    children: navItems,
  },
};

export const StackHtml: Story = {
  name: 'Stack (HTML)',
  parameters: {
    docs: {
      source: {
        code: mainMenuStackMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => renderMainMenuHtml(mainMenuStackMarkup, 'main-menu-stack'),
};

export const StackReact: Story = {
  name: 'Stack (React)',
  args: {
    variant: 'stack',
    logo,
    search: stackSearch,
    actions,
    children: navItems,
  },
};

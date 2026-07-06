import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaCollapse from '@core-js/collapse';
import VanillaDropdown from '@core-js/dropdown';
import VanillaMainMenu from '@core-js/main-menu';
import Dropdown from '@lib/components/dropdown';
import MainMenu from '@lib/components/main-menu';
import Brand from '@lib/components/main-menu/Brand';
import ButtonIconOnly from '@lib/components/button/ButtonIconOnly';
import FormEntrySearch from '@lib/components/form/FormEntrySearch';
import VanillaExample from '../../utils/VanillaExample';
import dropdownMarkup from './dropdown.example.html?raw';
import megaMenuMarkup from './mega-menu.example.html?raw';

const initializeDropdown = () => {
  new VanillaDropdown().init();
};

const initializeMegaMenu = () => {
  new VanillaCollapse().init();
  new VanillaDropdown().init();
  new VanillaMainMenu().init();
};

const megaMenuLogo = (
  <a href='#1' title='Home' data-logo='brand'>
    <Brand />
  </a>
);

const megaMenuSearch = (
  <FormEntrySearch
    id='dropdown-mega-menu-react-search'
    name='globalSearch'
    leadingIcon={false}
    submitButton='icon'
  />
);

const megaMenuActions = (
  <ButtonIconOnly
    iconHandle='language'
    ariaLabel='Language'
  />
);

const meta: Meta<typeof Dropdown> = {
  title: 'Dropdown',
  component: Dropdown,
  argTypes: {
    type: { control: 'radio', options: ['dropdown', 'mega'] },
    hover: { control: 'boolean' },
    linkSplit: { control: 'boolean' },
  },
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
  parameters: {
    docs: {
      source: {
        code: dropdownMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample
      html={dropdownMarkup}
      initialize={initializeDropdown}
      initializeOnceKey='dropdown'
    />
  ),
};

export const DefaultReact: Story = {
  name: 'Default (React)',
  args: {
    buttonText: 'Options',
  },
  render: (args) => (
    <ul className='nav nav--divider border nav--horizontal--lg'>
      <li>
        <Dropdown {...args}>
          <li><a href='#'>Profile</a></li>
          <li><a href='#'>Settings</a></li>
          <li><a href='#'>Sign out</a></li>
        </Dropdown>
      </li>
    </ul>
  ),
};

export const LinkSplit: Story = {
  name: 'Link Split (React)',
  args: {
    buttonText: 'Components',
    linkSplit: true,
    linkHref: '#',
    linkText: 'Components',
  },
  render: (args) => (
    <ul className='nav nav--divider border nav--horizontal--lg'>
      <li>
        <Dropdown {...args}>
          <li><a href='#'>Accordion</a></li>
          <li><a href='#'>Button</a></li>
          <li><a href='#'>Card</a></li>
          <li><a href='#'>Modal</a></li>
        </Dropdown>
      </li>
    </ul>
  ),
};

export const MegaMenuHtml: Story = {
  name: 'Mega Menu (HTML)',
  parameters: {
    docs: {
      source: {
        code: megaMenuMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample
      html={megaMenuMarkup}
      initialize={initializeMegaMenu}
      initializeOnceKey='mega-menu'
    />
  ),
};

export const MegaMenuReact: Story = {
  name: 'Mega Menu (React)',
  args: {
    buttonText: 'Components',
    type: 'mega',
    hover: true,
  },
  render: (args) => (
    <MainMenu
      variant='stack'
      breakpoint='lg'
      logo={megaMenuLogo}
      search={megaMenuSearch}
      actions={megaMenuActions}
      utilities='theme-canvas drop-shadow-1'
    >
      <li>
        <Dropdown {...args}>
          <div className='grid grid--column-2 grid--column-4--lg gap-4 font-size-md'>
            <nav>
              <p><strong>Foundations</strong></p>
              <ul className='nav'>
                <li><a href='#'>Color</a></li>
                <li><a href='#'>Typography</a></li>
                <li><a href='#'>Spacing</a></li>
              </ul>
            </nav>

            <nav>
              <p><strong>Components</strong></p>
              <ul className='nav'>
                <li><a href='#'>Accordion</a></li>
                <li><a href='#'>Button</a></li>
                <li><a href='#'>Card</a></li>
              </ul>
            </nav>

            <nav>
              <p><strong>Navigation</strong></p>
              <ul className='nav'>
                <li><a href='#'>Dropdown</a></li>
                <li><a href='#'>Main Menu</a></li>
                <li><a href='#'>Pagination</a></li>
              </ul>
            </nav>

            <nav>
              <p><strong>Patterns</strong></p>
              <ul className='nav'>
                <li><a href='#'>Forms</a></li>
                <li><a href='#'>Tables</a></li>
                <li><a href='#'>Track</a></li>
              </ul>
            </nav>
          </div>
        </Dropdown>
      </li>
      <li><a href='#'>Examples</a></li>
      <li><a href='#'>Guides</a></li>
    </MainMenu>
  ),
};

export const Hover: Story = {
  name: 'Hover (React)',
  args: {
    buttonText: 'Hover Dropdown',
    hover: true,
  },
  render: (args) => (
    <ul className='nav nav--divider border nav--horizontal--lg'>
      <li>
        <Dropdown {...args}>
          <li><a href='#'>Item one</a></li>
          <li><a href='#'>Item two</a></li>
          <li><a href='#'>Item three</a></li>
        </Dropdown>
      </li>
    </ul>
  ),
};

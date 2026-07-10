import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import VanillaFlyout from '@core-js/flyout';
import Flyout from '@lib/components/flyout';
import Button from '@lib/components/button';
import VanillaExample from '../../utils/VanillaExample';
import flyoutMarkup from './flyout.example.html?raw';
import flyoutDrillDownMarkup from './flyout-drill-down.example.html?raw';

const initializeFlyout = () => {
  new VanillaFlyout().init();
};

const meta: Meta<typeof Flyout> = {
  title: 'Flyout',
  component: Flyout,
  parameters: {
    docs: {
      codePanel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Flyout>;

export const DefaultHtml: Story = {
  name: 'Default (HTML)',
  parameters: {
    docs: {
      source: {
        code: flyoutMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample
      html={flyoutMarkup}
      initialize={initializeFlyout}
      initializeOnceKey='flyout'
    />
  ),
};

export const DefaultReact: Story = {
  name: 'Default (React)',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button
          title='Flyout Menu'
          iconStartHandle='menu'
          onClick={() => setIsOpen(true)}
          attributes={{ 'aria-controls': 'flyout-react', 'aria-expanded': isOpen }}
        />
        <Flyout id='flyout-react' isOpen={isOpen} onClose={() => setIsOpen(false)} label='Menu'>
          <ul className='nav nav--divider'>
            <li><a href='#'>Home</a></li>
            <li><a href='#'>Trails</a></li>
            <li><a href='#'>Wildlife</a></li>
            <li><a href='#'>Events</a></li>
            <li><a href='#'>About</a></li>
            <li><a href='#'>Contact</a></li>
          </ul>
        </Flyout>
      </>
    );
  },
};

export const DrillDownHtml: Story = {
  name: 'Drill Down (HTML)',
  parameters: {
    docs: {
      source: {
        code: flyoutDrillDownMarkup.trim(),
        language: 'html',
        type: 'code',
      },
    },
  },
  render: () => (
    <VanillaExample
      html={flyoutDrillDownMarkup}
      initialize={initializeFlyout}
      initializeOnceKey='flyout-drill-down'
    />
  ),
};

export const DrillDownReact: Story = {
  name: 'Drill Down (React)',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button
          title='Flyout Menu'
          iconStartHandle='menu'
          onClick={() => setIsOpen(true)}
          attributes={{ 'aria-controls': 'flyout-drill-down-react', 'aria-expanded': isOpen }}
        />
        <Flyout id='flyout-drill-down-react' isOpen={isOpen} onClose={() => setIsOpen(false)} label='Main Menu'>
          <Flyout.Panel key='main'>
            {({ navigateTo }) => (
              <ul className='nav nav--divider'>
                <li>
                  <button data-flyout-next='' onClick={() => navigateTo(1)}>
                    Wildlife
                    <span className='icon icon-arrow-right' aria-hidden='true' />
                  </button>
                </li>
                <li>
                  <button data-flyout-next='' onClick={() => navigateTo(2)}>
                    Trails
                    <span className='icon icon-arrow-right' aria-hidden='true' />
                  </button>
                </li>
                <li><a href='#'>Events</a></li>
                <li><a href='#'>About</a></li>
                <li><a href='#'>Contact</a></li>
              </ul>
            )}
          </Flyout.Panel>
          <Flyout.Panel key='wildlife'>
            {({ navigateTo }) => (
              <>
                <div className='flyout__panel-title'><p>Wildlife</p></div>
                <ul className='nav nav--divider'>
                  <li>
                    <button data-flyout-next='' onClick={() => navigateTo(3)}>
                      Birds
                      <span className='icon icon-arrow-right' aria-hidden='true' />
                    </button>
                  </li>
                  <li>
                    <button data-flyout-next='' onClick={() => navigateTo(4)}>
                      Mammals
                      <span className='icon icon-arrow-right' aria-hidden='true' />
                    </button>
                  </li>
                  <li><a href='#'>All Wildlife</a></li>
                </ul>
              </>
            )}
          </Flyout.Panel>
          <Flyout.Panel key='trails'>
            <div className='flyout__panel-title'><p>Trails</p></div>
            <ul className='nav nav--divider'>
              <li><a href='#'>Easy</a></li>
              <li><a href='#'>Moderate</a></li>
              <li><a href='#'>Strenuous</a></li>
              <li><a href='#'>All Trails</a></li>
            </ul>
          </Flyout.Panel>
          <Flyout.Panel key='birds'>
            <div className='flyout__panel-title'><p>Birds</p></div>
            <ul className='nav nav--divider'>
              <li><a href='#'>Waterfowl</a></li>
              <li><a href='#'>Raptors</a></li>
              <li><a href='#'>All Birds</a></li>
            </ul>
          </Flyout.Panel>
          <Flyout.Panel key='mammals'>
            <div className='flyout__panel-title'><p>Mammals</p></div>
            <ul className='nav nav--divider'>
              <li><a href='#'>Bears</a></li>
              <li><a href='#'>Deer</a></li>
              <li><a href='#'>All Mammals</a></li>
            </ul>
          </Flyout.Panel>
        </Flyout>
      </>
    );
  },
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Flyout from '@lib/components/natura11y/flyout';
import Button from '@lib/components/natura11y/button';

const meta: Meta<typeof Flyout> = {
  title: 'React/Components/Flyout',
  component: Flyout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { height: '600px', inline: false, width: '100%' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Flyout>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button
          title='Flyout Menu'
          iconStartHandle='menu'
          onClick={() => setIsOpen(true)}
          attributes={{ 'aria-expanded': isOpen }}
        />
        <Flyout isOpen={isOpen} onClose={() => setIsOpen(false)} label='Menu'>
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

export const WithDrillDown: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button
          title='Flyout Menu with Drill Down'
          iconStartHandle='menu'
          onClick={() => setIsOpen(true)}
          attributes={{ 'aria-expanded': isOpen }}
        />
        <Flyout isOpen={isOpen} onClose={() => setIsOpen(false)} label='Main Menu'>
          <Flyout.Panel>
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
          <Flyout.Panel>
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
          <Flyout.Panel>
            <div className='flyout__panel-title'><p>Trails</p></div>
            <ul className='nav nav--divider'>
              <li><a href='#'>Easy</a></li>
              <li><a href='#'>Moderate</a></li>
              <li><a href='#'>Strenuous</a></li>
              <li><a href='#'>All Trails</a></li>
            </ul>
          </Flyout.Panel>
          <Flyout.Panel>
            <div className='flyout__panel-title'><p>Birds</p></div>
            <ul className='nav nav--divider'>
              <li><a href='#'>Waterfowl</a></li>
              <li><a href='#'>Raptors</a></li>
              <li><a href='#'>All Birds</a></li>
            </ul>
          </Flyout.Panel>
          <Flyout.Panel>
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

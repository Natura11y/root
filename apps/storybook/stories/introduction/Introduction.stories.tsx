import type { Meta, StoryObj } from '@storybook/react-vite';
import './introduction.scss';

const WorkbenchIntroduction = () => (
  <main className='workbench-introduction'>
    <header className='workbench-introduction__hero'>
      <span className='badge theme-primary'>Natura11y Storybook</span>
      <h1>Operational component workbench</h1>
      <p className='workbench-introduction__lead'>
        This Storybook is the working environment for reviewing, developing,
        and validating Natura11y components in implementation.
      </p>
      <p>
        The workbench currently captures Natura11y Core HTML patterns alongside
        their React component implementations. Use it to compare output,
        inspect component APIs, exercise states, and evaluate behavior across
        themes and viewports.
      </p>
    </header>

    <section aria-labelledby='workbench-purpose' className='workbench-introduction__section'>
      <div className='workbench-introduction__section-heading'>
        <p className='workbench-introduction__eyebrow'>Purpose</p>
        <h2 id='workbench-purpose'>What this workbench supports</h2>
      </div>

      <div className='workbench-introduction__grid'>
        <article className='card border border-radius-2 padding-3'>
          <h3 className='h4'>Compare implementations</h3>
          <p>
            Review Core HTML and React examples against the same visual,
            semantic, and behavioral expectations.
          </p>
        </article>

        <article className='card border border-radius-2 padding-3'>
          <h3 className='h4'>Exercise component behavior</h3>
          <p>
            Use controls, themes, responsive viewports, and interaction tools
            to inspect component states and accessibility behavior.
          </p>
        </article>

        <article className='card border border-radius-2 padding-3'>
          <h3 className='h4'>Support implementation work</h3>
          <p>
            Treat stories as focused development and quality-assurance
            fixtures rather than the complete public documentation.
          </p>
        </article>
      </div>
    </section>

    <aside aria-labelledby='workbench-next-step' className='workbench-introduction__next-step theme-light border-radius-2 padding-3'>
      <div>
        <h2 className='h4' id='workbench-next-step'>Start exploring</h2>
        <p>
          Choose a component from the sidebar. For complete usage guidance,
          customization references, and design-system context, use the public
          documentation.
        </p>
      </div>
      <nav aria-label='Natura11y resources'>
        <ul className='nav nav--horizontal gap-2'>
          <li>
            <a className='button theme-primary' href='https://gonatura11y.com' target='_blank' rel='noreferrer'>
              <span className='text'>Open documentation</span>
              <span aria-hidden='true' className='icon icon-open-new' />
            </a>
          </li>
          <li>
            <a className='button button--outline' href='https://github.com/Natura11y/root' target='_blank' rel='noreferrer'>
              <span className='text'>View source</span>
              <span aria-hidden='true' className='icon icon-github' />
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  </main>
);

const meta = {
  title: 'Introduction',
  component: WorkbenchIntroduction,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Orientation to Natura11y Storybook as the operational workbench for Core HTML patterns and React component implementations.',
      },
    },
  },
} satisfies Meta<typeof WorkbenchIntroduction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

import { useState } from 'react';
import { Button, Collapse, NestedNav } from '@lib/components';
import PageBanner from '../components/PageBanner';
import {
  articleSections,
  getHeadingTag,
  loremParagraphs,
  templateSidebarItems,
} from '../data';

const ArticleContent = () => (
  <div className="medium margin-x-auto">
    <h2 className="h1">Introduction</h2>
    <p className="font-size-lg">
      {loremParagraphs[0]} {loremParagraphs[1]}
    </p>

    <div className="narrow">
      {articleSections.slice(0, 4).map(([heading, firstParagraph, secondParagraph], index) => {
        const Heading = getHeadingTag(heading);

        return (
          <section key={`${heading}-${index}`}>
            <Heading>{heading}</Heading>
            <p>{firstParagraph}</p>
            <p>{secondParagraph}</p>
          </section>
        );
      })}
    </div>
  </div>
);

const SidebarNav = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="margin-x-auto">
      <Button
        title="Navigation"
        utilities="sidebar-toggle button--disperse display-none--lg"
        iconEndHandle="chevron-down"
        onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        attributes={{ 'aria-controls': 'sidebar-nav', 'aria-expanded': isSidebarOpen }}
      />

      <Collapse id="sidebar-nav" isOpen={isSidebarOpen} showAt="lg">
        <NestedNav
          ariaLabel="Section Navigation"
          items={templateSidebarItems}
          utilities="border-radius-2--lg box-shadow-2--lg"
        />
      </Collapse>
    </div>
  );
};

const TwoColumnTemplate = () => (
  <main id="main-content">
    <PageBanner label="Two Column" />

    <div className="container wide--lg margin-y-5">
      <div className="grid-sidebar--left gap-5">
        <aside className="grid-sidebar__minor" aria-label="Page Navigation">
          <SidebarNav />
        </aside>

        <article className="grid-sidebar__major">
          <ArticleContent />
        </article>
      </div>
    </div>
  </main>
);

export default TwoColumnTemplate;

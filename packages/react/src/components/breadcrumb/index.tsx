import { type ElementType } from 'react';
import classNames from 'classnames';

interface BreadcrumbItem {
  label: string;
  href?: string;
  linkTag?: ElementType;
  linkProps?: Record<string, unknown>;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  ariaLabel?: string;
  linkTag?: ElementType;
  utilities?: string | null;
}

const Breadcrumb = ({
  items = [],
  ariaLabel = 'Breadcrumb',
  linkTag = 'a',
  utilities = null,
}: BreadcrumbProps) => (
  <nav aria-label={ariaLabel}>
    <ul className={classNames('breadcrumb', utilities)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const LinkTag = item.linkTag ?? linkTag;

        return (
          <li key={index} {...(isLast && { 'aria-current': 'page' })}>
            {isLast ? (
              item.label
            ) : (
              <LinkTag href={item.href} {...item.linkProps}>
                {item.label}
              </LinkTag>
            )}
          </li>
        );
      })}
    </ul>
  </nav>
);

export default Breadcrumb;
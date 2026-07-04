import { type ElementType } from 'react';
import classNames from 'classnames';

interface PaginationItem {
  ellipsis?: boolean;
  label?: string;
  href?: string;
  current?: boolean;
  ariaLabel?: string;
  iconHandle?: string;
  linkTag?: ElementType;
  linkProps?: Record<string, unknown>;
}

interface PaginationProps {
  items?: PaginationItem[];
  ariaLabel?: string;
  linkTag?: ElementType;
  utilities?: string | null;
}

const Pagination = ({
  items = [],
  ariaLabel = 'Pagination',
  linkTag = 'a',
  utilities = null,
}: PaginationProps) => (
  <nav aria-label={ariaLabel}>
    <ul className={classNames('pagination', utilities)}>
      {items.map((item, index) => {
        if (item.ellipsis) {
          return (
            <li key={index} aria-hidden='true'>
              <span className='icon icon-more-horizontal' aria-hidden='true' />
            </li>
          );
        }

        const LinkTag = item.linkTag ?? linkTag;

        return (
          <li key={index}>
            <LinkTag
              href={item.href}
              {...(item.current && { 'aria-current': 'page' })}
              {...(item.ariaLabel && { 'aria-label': item.ariaLabel })}
              {...item.linkProps}
            >
              {item.iconHandle && (
                <span className={`icon icon-${item.iconHandle}`} aria-hidden='true' />
              )}
              {item.label && (
                <span className='text'>{item.label}</span>
              )}
            </LinkTag>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default Pagination;
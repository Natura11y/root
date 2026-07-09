import { type ElementType } from 'react';
import classNames from 'classnames';

interface PaginationItem {
  id?: string | number;
  ellipsis?: boolean;
  label?: string;
  href?: string;
  current?: boolean;
  ariaLabel?: string;
  iconHandle?: string;
  iconPosition?: 'start' | 'end';
  linkTag?: ElementType;
  linkProps?: Record<string, unknown>;
}

interface PaginationProps {
  items?: PaginationItem[];
  ariaLabel?: string;
  linkTag?: ElementType;
  utilities?: string | null;
}

const getItemKey = (item: PaginationItem, index: number) => {
  if (item.id !== undefined) return item.id;
  if (item.ellipsis) return `ellipsis-${index}`;

  return [
    item.href,
    item.label,
    item.iconHandle,
    item.ariaLabel,
  ].filter(Boolean).join(':') || `item-${index}`;
};

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
            <li key={getItemKey(item, index)} aria-hidden='true'>
              <span className='icon icon-more-horizontal' aria-hidden='true' />
            </li>
          );
        }

        const LinkTag = item.linkTag ?? linkTag;
        const icon = item.iconHandle ? (
          <span className={`icon icon-${item.iconHandle}`} aria-hidden='true' />
        ) : null;
        const label = item.label ? (
          <span className='text'>{item.label}</span>
        ) : null;

        return (
          <li key={getItemKey(item, index)}>
            <LinkTag
              href={item.href}
              {...(item.current && { 'aria-current': 'page' })}
              {...(item.ariaLabel && { 'aria-label': item.ariaLabel })}
              {...item.linkProps}
            >
              {item.iconPosition === 'end' ? label : icon}
              {item.iconPosition === 'end' ? icon : label}
            </LinkTag>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default Pagination;

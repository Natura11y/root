import { type ElementType } from 'react';
import classNames from 'classnames';

interface NavItem {
  label: string;
  href?: string;
  current?: boolean;
  linkTag?: ElementType;
  linkProps?: Record<string, unknown>;
  children?: NavItem[];
}

interface NavItemsProps {
  items: NavItem[];
  linkTag: ElementType;
  depth?: number;
}

const NavItems = ({ items, linkTag, depth = 0 }: NavItemsProps) => (
  <>
    {items.map((item, index) => {
      const LinkTag = item.linkTag ?? linkTag;
      const isCurrent = item.current ?? false;

      return (
        <li key={index}>
          <LinkTag
            href={item.href}
            {...(isCurrent && { 'aria-current': 'page' })}
            {...item.linkProps}
          >
            {item.label}
          </LinkTag>
          {(item.children?.length ?? 0) > 0 && (
            <ul>
              <NavItems
                items={item.children!}
                linkTag={linkTag}
                depth={depth + 1}
              />
            </ul>
          )}
        </li>
      );
    })}
  </>
);

interface NestedNavProps {
  items?: NavItem[];
  ariaLabel?: string | null;
  linkTag?: ElementType;
  utilities?: string | null;
}

const NestedNav = ({
  items = [],
  ariaLabel = null,
  linkTag = 'a',
  utilities = null,
}: NestedNavProps) => (
  <ul
    className={classNames('nested-nav', utilities)}
    {...(ariaLabel && { 'aria-label': ariaLabel })}
  >
    <NavItems items={items} linkTag={linkTag} />
  </ul>
);

export default NestedNav;
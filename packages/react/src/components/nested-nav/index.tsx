import { type ElementType } from 'react';
import classNames from 'classnames';

type AriaCurrentValue = 'page' | 'step' | 'location' | 'date' | 'time' | 'true';

interface NavItem {
  id?: string | number;
  label: string;
  href?: string;
  current?: boolean | AriaCurrentValue;
  linkTag?: ElementType;
  linkProps?: Record<string, unknown>;
  children?: NavItem[];
}

interface NavItemsProps {
  items: NavItem[];
  linkTag: ElementType;
  depth?: number;
}

const getItemKey = (item: NavItem) => (
  item.id ?? `${item.href ?? 'section'}:${item.label}`
);

const NavItems = ({ items, linkTag, depth = 0 }: NavItemsProps) => (
  <>
    {items.map((item, index) => {
      const LinkTag = item.linkTag ?? linkTag;
      const ariaCurrent = item.current === true ? 'page' : item.current || undefined;

      return (
        <li key={getItemKey(item)}>
          <LinkTag
            href={item.href}
            {...(ariaCurrent && { 'aria-current': ariaCurrent })}
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
}: NestedNavProps) => {
  const list = (
    <ul
      className={classNames('nested-nav', utilities)}
    >
      <NavItems items={items} linkTag={linkTag} />
    </ul>
  );

  if (ariaLabel) {
    return (
      <nav aria-label={ariaLabel}>
        {list}
      </nav>
    );
  }

  return list;
};

export default NestedNav;

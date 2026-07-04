import { type ElementType, type ReactNode } from 'react';
import classNames from 'classnames';

interface BadgeProps {
  tag?: ElementType;
  iconHandle?: string | null;
  utilities?: string | null;
  children?: ReactNode;
}

const Badge = ({
  tag: Tag = 'span',
  iconHandle = null,
  utilities = null,
  children,
}: BadgeProps) => (
  <Tag className={classNames('badge', utilities)}>
    {iconHandle && (
      <span className={`icon icon-${iconHandle}`} aria-hidden='true' />
    )}
    {children}
  </Tag>
);

export default Badge;

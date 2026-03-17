import { type Ref } from 'react';
import classNames from 'classnames';

interface IconProps {
  ref?: Ref<HTMLSpanElement>;
  iconHandle?: string;
  utilities?: string | null;
}

const Icon = ({
  ref,
  iconHandle = 'home',
  utilities = null,
}: IconProps) => {
  const iconClasses = classNames('icon', `icon-${iconHandle}`, utilities);

  return (
    <span
      ref={ref}
      className={iconClasses}
      aria-hidden='true'
    />
  );
};

export default Icon;
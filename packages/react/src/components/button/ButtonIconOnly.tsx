import { type Ref, type MouseEventHandler } from 'react';
import classNames from 'classnames';
import Icon from '../icon';

interface ButtonIconOnlyProps {
  ref?: Ref<HTMLElement>;
  tag?: 'button' | 'a';
  buttonType?: 'button' | 'submit' | 'reset';
  iconHandle?: string;
  linkUrl?: string;
  outline?: boolean;
  ariaLabel?: string | null;
  onClick?: MouseEventHandler<HTMLButtonElement> | null;
  ariaExpanded?: boolean | null;
  utilities?: string | null;
  attributes?: Record<string, unknown>;
}

const ButtonIconOnly = ({
  ref,
  tag = 'button',
  buttonType = 'button',
  iconHandle = 'home',
  linkUrl = '#1',
  outline = false,
  ariaLabel = null,
  onClick = null,
  ariaExpanded = null,
  utilities = null,
  attributes = {},
}: ButtonIconOnlyProps) => {
  const buttonClasses = classNames(
    'button',
    'button--icon-only',
    { 'button--outline': outline },
    utilities
  );

  if (tag === 'a') {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        className={buttonClasses}
        href={linkUrl}
        aria-label={ariaLabel ?? undefined}
        {...attributes}
      >
        <Icon iconHandle={iconHandle} />
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={buttonType}
      className={buttonClasses}
      onClick={onClick ?? undefined}
      aria-label={ariaLabel ?? undefined}
      aria-expanded={ariaExpanded ?? undefined}
      {...attributes}
    >
      <Icon iconHandle={iconHandle} />
    </button>
  );
};

export default ButtonIconOnly;
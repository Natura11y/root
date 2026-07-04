import { type Ref, type MouseEventHandler } from 'react';
import classNames from 'classnames';
import Icon from '../icon';

interface ButtonIconOverTextProps {
  ref?: Ref<HTMLElement>;
  tag?: 'button' | 'a';
  buttonType?: 'button' | 'submit' | 'reset';
  iconHandle?: string;
  iconUtilities?: string | null;
  textUtilities?: string | null;
  label?: string;
  linkUrl?: string;
  ariaLabel?: string | null;
  onClick?: MouseEventHandler<HTMLButtonElement> | null;
  ariaExpanded?: boolean | null;
  utilities?: string | null;
  attributes?: Record<string, unknown>;
}

const ButtonIconOverText = ({
  ref,
  tag = 'button',
  buttonType = 'button',
  iconHandle = 'home',
  iconUtilities = null,
  textUtilities = null,
  label = 'Home',
  linkUrl = '#1',
  ariaLabel = null,
  onClick = null,
  ariaExpanded = null,
  utilities = null,
  attributes = {},
}: ButtonIconOverTextProps) => {
  const buttonClasses = classNames('button', 'button--icon-over-text', utilities);

  const buttonContent = (
    <>
      <span className={classNames('button__icon', iconUtilities)}>
        <Icon iconHandle={iconHandle} />
      </span>
      <span className={classNames('button__text', textUtilities)}>{label}</span>
    </>
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
        {buttonContent}
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
      {buttonContent}
    </button>
  );
};

export default ButtonIconOverText;
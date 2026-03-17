import { type MouseEventHandler } from 'react';
import classNames from 'classnames';
import Icon from '../icon';

interface ButtonProps {
  tag?: 'button' | 'a';
  buttonType?: 'button' | 'submit' | 'reset';
  title?: string;
  wrapText?: boolean;
  linkUrl?: string;
  outline?: boolean;
  /** @deprecated Use iconStartHandle instead */
  iconHandle?: string | null;
  iconStartHandle?: string | null;
  iconEndHandle?: string | null;
  utilities?: string | null;
  attributes?: Record<string, unknown>;
  onClick?: MouseEventHandler<HTMLButtonElement> | null;
  target?: string | null;
  rel?: string | null;
}

const Button = ({
  tag = 'button',
  buttonType = 'button',
  title = 'Button',
  wrapText = true,
  linkUrl = '#1',
  outline = false,
  iconHandle = null,
  iconStartHandle = null,
  iconEndHandle = null,
  utilities = null,
  attributes = {},
  onClick = null,
  target = null,
  rel = null,
}: ButtonProps) => {
  const startIcon = iconStartHandle || iconHandle;

  const buttonClasses = classNames('button', { 'button--outline': outline }, utilities);

  const buttonContents = (
    <>
      {startIcon && <Icon iconHandle={startIcon} />}
      {wrapText ? <span className='text'>{title}</span> : title}
      {iconEndHandle && <Icon iconHandle={iconEndHandle} />}
    </>
  );

  if (tag === 'a') {
    return (
      <a className={buttonClasses} href={linkUrl} target={target ?? undefined} rel={rel ?? undefined} {...attributes}>
        {buttonContents}
      </a>
    );
  }

  return (
    <button type={buttonType} className={buttonClasses} onClick={onClick ?? undefined} {...attributes}>
      {buttonContents}
    </button>
  );
};

export default Button;
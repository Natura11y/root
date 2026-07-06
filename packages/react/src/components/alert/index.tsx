import { useRef, useId, type Ref, type ReactNode } from 'react';
import classNames from 'classnames';
import ButtonIconOnly from '../button/ButtonIconOnly';
import Icon from '../icon';
import { useMergedRefs } from '../../hooks/useMergedRefs';

interface AlertProps {
  ref?: Ref<HTMLDivElement>;
  success?: boolean;
  inverse?: boolean;
  iconHandle?: string | null;
  onClose?: (() => void) | null;
  title?: string;
  children?: ReactNode;
  utilities?: string | null;
}

const Alert = ({
  ref,
  success = true,
  inverse = false,
  iconHandle = null,
  onClose = null,
  title = 'Alert Title',
  children = <p>Alert Description</p>,
  utilities = null,
}: AlertProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const descId = useId();
  const mergedRef = useMergedRefs(internalRef, ref);

  const isDismissable = onClose !== null;

  const handleClose = () => {
    const el = internalRef.current;
    if (!el) return;
    el.classList.add('dismissed');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onClose?.();
    } else {
      el.addEventListener('animationend', onClose as EventListener, { once: true });
    }
  };

  return (
    <div
      ref={mergedRef}
      className={classNames(
        'alert',
        {
          'alert--confirm': success && !inverse,
          'alert--confirm--inverse': success && inverse,
          'alert--warn': !success && !inverse,
          'alert--warn--inverse': !success && inverse,
        },
        utilities
      )}
      aria-labelledby={labelId}
      aria-describedby={children ? descId : undefined}
      role='alert'
      {...(isDismissable && { 'aria-live': 'assertive', 'aria-atomic': 'true' })}
    >
      {isDismissable && (
        <ButtonIconOnly
          iconHandle='close'
          onClick={handleClose}
          ariaLabel='Close alert'
          attributes={{ 'data-alert-close': '' }}
        />
      )}

      <div className='alert__title h5'>
        <Icon iconHandle={iconHandle ?? (success ? 'confirm' : 'warn')} />
        <span className='alert__title__text' id={labelId}>
          {title}
        </span>
      </div>

      {children ? (
        <div className='alert__description' id={descId}>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default Alert;

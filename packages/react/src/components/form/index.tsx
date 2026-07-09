import { type Ref, type ReactNode, type FormEventHandler } from 'react';
import classNames from 'classnames';

interface FormProps {
  ref?: Ref<HTMLFormElement>;
  onSubmit?: FormEventHandler<HTMLFormElement> | null;
  action?: string;
  method?: string;
  autoComplete?: string;
  noValidate?: boolean;
  utilities?: string | null;
  children?: ReactNode;
}

const Form = ({
  ref,
  onSubmit = null,
  action,
  method,
  autoComplete,
  noValidate = false,
  utilities = null,
  children,
}: FormProps) => (
  <form
    ref={ref}
    className={classNames(utilities)}
    action={action}
    method={method}
    autoComplete={autoComplete}
    noValidate={noValidate}
    onSubmit={onSubmit ?? undefined}
  >
    {children}
  </form>
);

export default Form;

import { type Ref, type ReactNode, type FormEventHandler } from 'react';

interface FormProps {
  ref?: Ref<HTMLFormElement>;
  onSubmit?: FormEventHandler<HTMLFormElement> | null;
  children?: ReactNode;
}

const Form = ({ ref, onSubmit = null, children }: FormProps) => (
  <form ref={ref} onSubmit={onSubmit ?? undefined}>
    {children}
  </form>
);

export default Form;
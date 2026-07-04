import { type Ref } from 'react';
import Icon from '../icon';

interface RequiredIndicatorProps {
  ref?: Ref<HTMLParagraphElement>;
  text?: string;
}

const RequiredIndicator = ({ ref, text = 'Required fields indicated with' }: RequiredIndicatorProps) => (
  <p ref={ref} className='required-indicator' aria-hidden='true'>
    <span className='required-indicator__text'>{text}</span>
    <Icon iconHandle='asterisk' />
  </p>
);

export default RequiredIndicator;
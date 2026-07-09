import { type ElementType, type ReactNode } from 'react';
import classNames from 'classnames';

interface CardProps {
  tag?: ElementType;
  horizontal?: boolean;
  utilities?: string | null;
  attributes?: Record<string, unknown>;
  children?: ReactNode;
}

interface CardSlotProps {
  utilities?: string | null;
  children?: ReactNode;
}

const Card = ({
  tag: Tag = 'div',
  horizontal = false,
  utilities = null,
  attributes = {},
  children,
}: CardProps) => (
  <Tag className={classNames('card', { 'card--horizontal': horizontal }, utilities)} {...attributes}>
    {children}
  </Tag>
);

const CardHead = ({ utilities = null, children }: CardSlotProps) => (
  <div className={classNames('card__head', utilities)}>{children}</div>
);

const CardBody = ({ utilities = null, children }: CardSlotProps) => (
  <div className={classNames('card__body', utilities)}>{children}</div>
);

const CardFoot = ({ utilities = null, children }: CardSlotProps) => (
  <div className={classNames('card__foot', utilities)}>{children}</div>
);

const CardMedia = ({ utilities = null, children }: CardSlotProps) => (
  <div className={classNames('card__media', utilities)}>{children}</div>
);

Card.Head = CardHead;
Card.Body = CardBody;
Card.Foot = CardFoot;
Card.Media = CardMedia;

export { CardHead, CardBody, CardFoot, CardMedia };
export default Card;

import classNames from 'classnames';

const Card = ({
    tag = 'div',
    horizontal = false,
    utilities = null,
    children
}) => {
    const Tag = tag;

    const cardClasses = classNames(
        'card',
        { 'card--horizontal': horizontal },
        utilities
    );

    return (
        <Tag className={cardClasses}>
            {children}
        </Tag>
    );
};

const CardHead = ({ utilities = null, children }) => (
    <div className={classNames('card__head', utilities)}>
        {children}
    </div>
);

const CardBody = ({ utilities = null, children }) => (
    <div className={classNames('card__body', utilities)}>
        {children}
    </div>
);

const CardFoot = ({ utilities = null, children }) => (
    <div className={classNames('card__foot', utilities)}>
        {children}
    </div>
);

const CardMedia = ({ utilities = null, children }) => (
    <div className={classNames('card__media', utilities)}>
        {children}
    </div>
);

Card.Head = CardHead;
Card.Body = CardBody;
Card.Foot = CardFoot;
Card.Media = CardMedia;

export { CardHead, CardBody, CardFoot, CardMedia };

export default Card;

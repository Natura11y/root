import classNames from 'classnames';

const Icon = ({
    ref,
    iconHandle = 'home',
    utilities = null
}) => {

    const iconClasses = classNames(
        'icon',
        [`icon-${iconHandle}`],
        {
            [`${utilities}`] : utilities !== null
        }
    );

	return (
        <span
            ref={ref}
            className={iconClasses}
            aria-hidden='true'>
        </span>
    );
};

export default Icon;

const MegaMenu = ({
    ref,
    children,
    breakpoint = 'lg',
    ...props
}) => {

    return (
        <div
            ref={ref}
            className={`mega-menu mega-menu--${breakpoint}`}
            role="menu"
            aria-hidden="true"
            {...props}
        >
            {children}
        </div>
    );
};

export default MegaMenu;
import React, { forwardRef } from 'react';

const MegaMenu = forwardRef(({ 
    children,
    breakpoint = 'lg',
    ...props 
}, ref) => {

    return (
        <div
            ref={ref}
            className={`mega-menu mega-menu--${breakpoint} box-shadow-3--xl`}
            role="menu"
            aria-hidden="true"
            {...props}
        >
            {children}
        </div>
    );
});

MegaMenu.displayName = 'MegaMenu';

export default MegaMenu;
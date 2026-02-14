import { useEffect, useRef } from 'react';

import {getFocusableElements} from 'natura11y/src/js/utilities/focus';

const AccordionItem = ( props ) => {

    const {
        title = 'Accordion Header',
        children = (<p>Accordion Content</p>),
        isActive = false,
        handleClick = handleClick,
        handleKeyDown = handleKeyDown,
        id,
        dataIndex,
        buttonRef
    } = props;

    const accordionButton = useRef();
    const accordionPanel = useRef();

    useEffect(() => {

        const focusableElements = getFocusableElements(accordionPanel.current);

        if (isActive) {
            focusableElements.forEach(el => el.setAttribute('tabindex', 0));
        } else {
            focusableElements.forEach(el => el.setAttribute('tabindex', -1));
        }

    }, [isActive]);

    return (
        <>
            <button
                className='accordion__button h5'
                ref={el => {
                    accordionButton.current = el;
                    if (buttonRef) buttonRef(el);
                }}
                id={`${id}`}
                data-accordion='button'
                aria-controls={`acc-panel-${id}`}
                aria-expanded={isActive ? true : false}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                data-title={title}
                data-index={dataIndex}
            >
                {title}
            </button>

            <div
                className={`accordion__panel ${isActive ? 'shown' : ''}`}
                ref={accordionPanel}
                id={`acc-panel-${id}`}
                data-accordion='panel'
                aria-labelledby={`${id}`}
                aria-hidden={isActive ? false : true}
                role='region'
            >
                <div className='accordion__panel__content'>
                    {children}
                </div>
                
            </div>
        </>
    );

};

export default AccordionItem;
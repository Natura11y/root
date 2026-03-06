import { useRef } from 'react';

const AccordionItem = ( props ) => {

    const {
        title = 'Accordion Header',
        wrapText = true,
        children = (<p>Accordion Content</p>),
        isActive = false,
        handleClick = handleClick,
        handleKeyDown = handleKeyDown,
        id,
        dataIndex,
        buttonRef
    } = props;

    const accordionButton = useRef();

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
                {wrapText ? <span className='text'>{title}</span> : title}
            </button>

            <div
                className={`accordion__panel ${isActive ? 'shown' : ''}`}
                id={`acc-panel-${id}`}
                data-accordion='panel'
                aria-labelledby={`${id}`}
                inert={!isActive ? true : undefined}
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
import { useState, useRef } from 'react';

import Collapse from '../../natura11y/collapse';

// ─────────────────────────────────────────────────────────────
// Basic Collapse
// Single toggle — button anywhere in the DOM, panel below.
// ─────────────────────────────────────────────────────────────

const BasicCollapse = () => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef(null);

    return (
        <>
            <button
                ref={buttonRef}
                className='button width-100 theme-primary'
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                aria-controls='collapse-example-basic'
            >
                Navigation
            </button>

            <Collapse
                id='collapse-example-basic'
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    buttonRef.current?.focus();
                }}
                utilities='border margin-y-3'
            >
                <ul className='nav nav--divider' role='navigation'>
                    <li><a href='#1'>Home</a></li>
                    <li><a href='#1'>Trails</a></li>
                    <li><a href='#1'>Wildlife</a></li>
                    <li><a href='#1'>Events</a></li>
                    <li><a href='#1'>About</a></li>
                </ul>
            </Collapse>
        </>
    );
};

// ─────────────────────────────────────────────────────────────
// Close Target
// Two buttons that mutually close each other when opened.
// ─────────────────────────────────────────────────────────────

const CloseTarget = () => {
    const [oneIsOpen, setOneIsOpen] = useState(false);
    const [twoIsOpen, setTwoIsOpen] = useState(false);

    const buttonOneRef = useRef(null);
    const buttonTwoRef = useRef(null);

    const handleOneClick = () => {
        setTwoIsOpen(false);
        setOneIsOpen(prev => !prev);
    };

    const handleTwoClick = () => {
        setOneIsOpen(false);
        setTwoIsOpen(prev => !prev);
    };

    return (
        <>
            <div className='grid grid--column-2 gap-3'>
                <button
                    ref={buttonOneRef}
                    className='button width-100 theme-primary'
                    onClick={handleOneClick}
                    aria-expanded={oneIsOpen}
                    aria-controls='collapse-example-target-1'
                >
                    Button 1
                </button>

                <button
                    ref={buttonTwoRef}
                    className='button width-100 theme-primary'
                    onClick={handleTwoClick}
                    aria-expanded={twoIsOpen}
                    aria-controls='collapse-example-target-2'
                >
                    Button 2
                </button>
            </div>

            <Collapse
                id='collapse-example-target-1'
                isOpen={oneIsOpen}
                onClose={() => {
                    setOneIsOpen(false);
                    buttonOneRef.current?.focus();
                }}
                utilities='border margin-y-3'
            >
                <div className='padding-4'>
                    <p>Target 1</p>
                </div>
            </Collapse>

            <Collapse
                id='collapse-example-target-2'
                isOpen={twoIsOpen}
                onClose={() => {
                    setTwoIsOpen(false);
                    buttonTwoRef.current?.focus();
                }}
                utilities='border margin-y-3'
            >
                <div className='padding-4'>
                    <p>Target 2</p>
                </div>
            </Collapse>
        </>
    );
};

// ─────────────────────────────────────────────────────────────
// CollapseExamples — shown on the /collapse detail page
// ─────────────────────────────────────────────────────────────

const CollapseExamples = () => {
    return (
        <div className='container narrow margin-y-5'>

            <section className='margin-y-4'>
                <h2 className='h4 margin-bottom-2'>Collapse</h2>
                <BasicCollapse />
            </section>

            <section className='margin-y-4'>
                <h2 className='h4 margin-bottom-2'>Close Target</h2>
                <CloseTarget />
            </section>

        </div>
    );
};

export default CollapseExamples;

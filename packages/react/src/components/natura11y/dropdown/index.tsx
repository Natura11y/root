import { useState, useEffect, useRef, useCallback, useId, type ElementType, type ReactNode } from 'react';
import classNames from 'classnames';
import { getFocusableElements } from '@natura11y/core/utilities/focus';
import { getCurrentBreakpoint } from '@natura11y/core/utilities/getCurrentBreakpoint';

const HOVER_TIMEOUT = 400;

interface DropdownProps {
  type?: 'dropdown' | 'mega';
  hover?: boolean;
  buttonText?: string | null;
  dataIndicator?: string | null;
  linkSplit?: boolean;
  linkHref?: string;
  linkText?: string;
  linkTag?: ElementType;
  linkProps?: Record<string, unknown>;
  dropdownId?: string | null;
  utilities?: string | null;
  children?: ReactNode;
}

interface HoverHandlers {
  triggerIn: (() => void) | null;
  triggerOut: (() => void) | null;
  menuIn: (() => void) | null;
  menuOut: (() => void) | null;
}

const Dropdown = ({
  type = 'dropdown',
  hover = false,
  buttonText = null,
  dataIndicator = null,
  linkSplit = false,
  linkHref = '#1',
  linkText = 'Link',
  linkTag = 'a',
  linkProps = {},
  dropdownId: dropdownIdProp = null,
  utilities = null,
  children,
}: DropdownProps) => {
  const uid = useId();
  const dropdownId = dropdownIdProp ?? `dropdown-${uid.replace(/:/g, '')}`;

  const [menuShow, setMenuShow] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const openedByKbOrClickRef = useRef(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasHoverListenersRef = useRef(false);
  const menuShowRef = useRef(false);
  const hoverHandlersRef = useRef<HoverHandlers>({ triggerIn: null, triggerOut: null, menuIn: null, menuOut: null });

  useEffect(() => {
    menuShowRef.current = menuShow;
    if (!menuShow) openedByKbOrClickRef.current = false;
  }, [menuShow]);

  const menuClasses = classNames({
    'dropdown__menu': type === 'dropdown',
    'mega-menu--lg box-shadow-1--lg padding-4': type === 'mega',
    'box-shadow-1--lg': linkSplit && type === 'dropdown',
    'shown': menuShow,
  }, utilities);

  const MenuContainer: ElementType = type === 'mega' ? 'div' : 'ul';

  const shouldEnableHover = useCallback(() => {
    const capable = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches &&
      getCurrentBreakpoint().isDesktop;
    return linkSplit ? capable : (hover && capable);
  }, [hover, linkSplit]);

  useEffect(() => {
    const button = menuButton.current;
    const menu = menuRef.current;
    const triggerContainer = linkSplit ? wrapperRef.current : button;

    if (!button || !menu || !triggerContainer) return;

    const navigateMenu = (direction: string) => {
      const items = getFocusableElements(menu);
      if (items.length === 0) return;
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      const nextIndex = direction === 'ArrowDown'
        ? (currentIndex + 1) % items.length
        : (currentIndex - 1 + items.length) % items.length;
      (items[nextIndex] as HTMLElement | undefined)?.focus();
    };

    const handleTabNavigation = (e: KeyboardEvent) => {
      const items = getFocusableElements(menu);
      if (document.activeElement === items[items.length - 1] && !e.shiftKey) {
        setMenuShow(false);
        const next = button.closest('li')?.nextElementSibling?.querySelector('button, a');
        (next as HTMLElement | null)?.focus();
        e.preventDefault();
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (!menuShowRef.current) return;
      if (!menu.contains(e.target as Node) && !triggerContainer.contains(e.target as Node)) {
        setMenuShow(false);
      }
    };

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuShowRef.current) {
        setMenuShow(false);
        button.focus();
      } else if (menuShowRef.current && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault();
        navigateMenu(e.key);
      } else if (e.key === 'Tab' && menuShowRef.current) {
        handleTabNavigation(e);
      }
    };

    const handleFocusout = (e: FocusEvent) => {
      if (window.getComputedStyle(menu).position !== 'absolute') return;
      const rel = e.relatedTarget as Node | null;
      if (rel && !menu.contains(rel) && !triggerContainer.contains(rel)) {
        setMenuShow(false);
      }
    };

    const handleMenuKeyDown = () => { openedByKbOrClickRef.current = true; };

    const handleOtherDropdownOpen = (e: Event) => {
      if ((e as CustomEvent).detail?.id !== dropdownId && menuShowRef.current) setMenuShow(false);
    };

    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleWindowKeyDown);
    window.addEventListener('dropdown:open' as string, handleOtherDropdownOpen);
    button.addEventListener('focusout', handleFocusout);
    menu.addEventListener('focusout', handleFocusout);
    menu.addEventListener('keydown', handleMenuKeyDown);

    const addHoverListeners = () => {
      if (hasHoverListenersRef.current) return;
      hasHoverListenersRef.current = true;

      const hoverIn = () => {
        if (!openedByKbOrClickRef.current) {
          window.dispatchEvent(new CustomEvent('dropdown:open', { detail: { id: dropdownId } }));
          setMenuShow(true);
        }
      };
      const menuHoverIn = () => {
        if (!openedByKbOrClickRef.current) setMenuShow(true);
      };
      const hoverOut = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
          if (!triggerContainer.matches(':hover') && !menu.matches(':hover') && !openedByKbOrClickRef.current) {
            setMenuShow(false);
          }
        }, HOVER_TIMEOUT);
      };

      hoverHandlersRef.current = { triggerIn: hoverIn, triggerOut: hoverOut, menuIn: menuHoverIn, menuOut: hoverOut };

      triggerContainer.addEventListener('mouseenter', hoverIn);
      triggerContainer.addEventListener('mouseleave', hoverOut);
      menu.addEventListener('mouseenter', menuHoverIn);
      menu.addEventListener('mouseleave', hoverOut);
    };

    const removeHoverListeners = () => {
      if (!hasHoverListenersRef.current) return;
      const { triggerIn, triggerOut, menuIn, menuOut } = hoverHandlersRef.current;
      if (triggerIn) triggerContainer.removeEventListener('mouseenter', triggerIn);
      if (triggerOut) triggerContainer.removeEventListener('mouseleave', triggerOut);
      if (menuIn) menu.removeEventListener('mouseenter', menuIn);
      if (menuOut) menu.removeEventListener('mouseleave', menuOut);
      hoverHandlersRef.current = { triggerIn: null, triggerOut: null, menuIn: null, menuOut: null };
      hasHoverListenersRef.current = false;
    };

    const setupResponsiveHover = () => {
      shouldEnableHover() ? addHoverListeners() : removeHoverListeners();
    };

    setupResponsiveHover();
    window.addEventListener('resize', setupResponsiveHover);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleWindowKeyDown);
      window.removeEventListener('resize', setupResponsiveHover);
      window.removeEventListener('dropdown:open' as string, handleOtherDropdownOpen);
      button.removeEventListener('focusout', handleFocusout);
      menu.removeEventListener('focusout', handleFocusout);
      menu.removeEventListener('keydown', handleMenuKeyDown);
      removeHoverListeners();
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [hover, linkSplit, shouldEnableHover, dropdownId]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasHoverListenersRef.current && e.detail > 0) return;
    openedByKbOrClickRef.current = true;
    setMenuShow(prev => !prev);
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      openedByKbOrClickRef.current = true;
    }
  };

  const LinkTag = linkTag;

  return (
    <>
      {linkSplit ? (
        <div className='dropdown-link-split' ref={wrapperRef}>
          <LinkTag href={linkHref} className='text' {...linkProps}>{linkText}</LinkTag>
          <button
            data-toggle='dropdown'
            ref={menuButton}
            aria-expanded={menuShow}
            aria-haspopup='true'
            aria-controls={dropdownId}
            onClick={handleClick}
            onKeyDown={handleButtonKeyDown}
          />
        </div>
      ) : (
        <button
          className='dropdown'
          data-toggle='dropdown'
          data-hover={hover ? 'true' : undefined}
          data-indicator={dataIndicator ?? undefined}
          ref={menuButton}
          aria-expanded={menuShow}
          aria-haspopup='true'
          aria-controls={dropdownId}
          onClick={handleClick}
          onKeyDown={handleButtonKeyDown}
        >
          {buttonText ?? (type === 'dropdown' ? 'Dropdown' : 'Mega Menu')}
        </button>
      )}

      <MenuContainer
        ref={menuRef as unknown as React.RefObject<HTMLDivElement & HTMLUListElement>}
        id={dropdownId}
        className={menuClasses}
        data-state={menuShow ? 'open' : 'closed'}
      >
        {children}
      </MenuContainer>
    </>
  );
};

export default Dropdown;
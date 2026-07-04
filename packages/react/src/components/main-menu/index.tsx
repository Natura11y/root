import { useState, useRef, useEffect, useCallback, useId, type ReactNode, type RefObject } from 'react';
import classNames from 'classnames';
import { getFocusableElements } from '@natura11y/core/utilities/focus';
import { useLinearKeyNav } from '../../hooks/useLinearKeyNav';

const useCollapse = (panelRef: RefObject<HTMLElement | null>) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      el.inert = true;
      const observer = new ResizeObserver(() => {
        if (getComputedStyle(el).visibility === 'visible') {
          el.inert = false;
          observer.unobserve(el);
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
    }

    if (isOpen) {
      el.inert = false;
      el.setAttribute('data-active', '');
      el.classList.add('shown');
    } else {
      el.classList.remove('shown');
      el.inert = true;

      const observer = new ResizeObserver(() => {
        if (getComputedStyle(el).visibility === 'visible') {
          el.inert = false;
          observer.unobserve(el);
        }
      });
      observer.observe(el);

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) {
        el.removeAttribute('data-active');
        return () => observer.disconnect();
      }

      const onEnd = (e: TransitionEvent) => {
        if (!['height', 'grid-template-rows'].includes(e.propertyName)) return;
        el.removeAttribute('data-active');
        el.removeEventListener('transitionend', onEnd);
      };
      el.addEventListener('transitionend', onEnd);
      return () => {
        el.removeEventListener('transitionend', onEnd);
        observer.disconnect();
      };
    }
  }, [isOpen, panelRef]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
};

interface MainMenuProps {
  variant?: 'bar' | 'stack';
  breakpoint?: string;
  logo?: ReactNode;
  search?: ReactNode;
  actions?: ReactNode;
  navAriaLabel?: string;
  navId?: string | null;
  searchId?: string | null;
  utilities?: string | null;
  children?: ReactNode;
}

const MainMenu = ({
  variant = 'bar',
  breakpoint = 'lg',
  logo = null,
  search = null,
  actions = null,
  navAriaLabel = 'Main Menu',
  navId: navIdProp = null,
  searchId: searchIdProp = null,
  utilities = null,
  children,
}: MainMenuProps) => {
  const uid = useId();
  const navId = navIdProp ?? `main-menu-${uid.replace(/:/g, '')}`;
  const searchId = searchIdProp ?? `search-${uid.replace(/:/g, '')}`;

  const navRef = useRef<HTMLElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const keyboardNavRef = useRef(false);

  const nav = useCollapse(navRef);
  const searchPanel = useCollapse(searchFormRef);
  const { onKeyDown: onNavKeyDown } = useLinearKeyNav({
    containerRef: navRef,
    itemSelector: ':scope > ul > li > :is(a, button)',
    orientation: 'horizontal',
  });

  const handleMenuToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    keyboardNavRef.current = e.detail === 0;
    if (!nav.isOpen && searchPanel.isOpen) searchPanel.close();
    nav.toggle();
  };

  const handleSearchToggle = () => {
    if (!searchPanel.isOpen && nav.isOpen) nav.close();
    searchPanel.toggle();
  };

  useEffect(() => {
    if (!nav.isOpen || !navRef.current) return;
    if (!keyboardNavRef.current) return;
    const el = navRef.current;
    el.tabIndex = -1;
    el.focus();
    keyboardNavRef.current = false;
  }, [nav.isOpen]);

  useEffect(() => {
    if (!nav.isOpen || !navRef.current) return;
    const el = navRef.current;
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        nav.close();
        menuToggleRef.current?.focus();
      }
    };
    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, [nav.isOpen, nav]);

  useEffect(() => {
    if (!searchPanel.isOpen || !searchFormRef.current) return;
    const el = searchFormRef.current;
    const focusFirst = () => (getFocusableElements(el)[0] as HTMLElement | undefined)?.focus();
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'grid-template-rows' && e.propertyName !== 'height') return;
      el.removeEventListener('transitionend', onTransitionEnd);
      focusFirst();
    };
    el.addEventListener('transitionend', onTransitionEnd);
    requestAnimationFrame(focusFirst);
    return () => el.removeEventListener('transitionend', onTransitionEnd);
  }, [searchPanel.isOpen]);

  const mainMenuClasses = classNames(
    `main-menu--${variant}--${breakpoint}`,
    utilities
  );

  const logoArea = logo ? (
    <div className="main-menu__logo">{logo}</div>
  ) : null;

  const navArea = (
    <nav
      ref={navRef}
      className="main-menu__nav"
      id={navId}
      aria-label={navAriaLabel}
    >
      <ul onKeyDown={onNavKeyDown}>{children}</ul>
    </nav>
  );

  const toggleArea = (
    <div className="main-menu__toggle">
      {variant === 'bar' && search && (
        <button
          className="button button--icon-only"
          aria-label="Search"
          aria-controls={searchId}
          aria-expanded={searchPanel.isOpen}
          onClick={handleSearchToggle}
        >
          <span className="icon icon-search" />
        </button>
      )}
      <button
        ref={menuToggleRef}
        className="button button--icon-only"
        aria-label="Menu"
        aria-controls={navId}
        aria-expanded={nav.isOpen}
        onClick={handleMenuToggle}
      >
        <span className="icon icon-menu" />
      </button>
    </div>
  );

  const searchArea = search ? (
    <form
      ref={searchFormRef}
      className="main-menu__search"
      id={searchId}
      role="search"
    >
      {search}
    </form>
  ) : null;

  const actionsArea = actions ? (
    <div className="main-menu__actions">{actions}</div>
  ) : null;

  return (
    <div className={mainMenuClasses}>
      {logoArea}
      {variant === 'bar' ? (
        <>
          {navArea}
          {toggleArea}
          {searchArea}
          {actionsArea}
        </>
      ) : (
        <>
          {toggleArea}
          {searchArea}
          {actionsArea}
          {navArea}
        </>
      )}
    </div>
  );
};

export default MainMenu;
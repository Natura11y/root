import { useState, useRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import classNames from 'classnames';
import { useCollapse } from '../../hooks/useCollapse';
import { useLinearKeyNav } from '../../hooks/useLinearKeyNav';

interface MainMenuProps {
  variant?: 'bar' | 'stack';
  breakpoint?: string;
  logo?: ReactNode;
  search?: ReactNode;
  searchFormProps?: ComponentPropsWithoutRef<'form'>;
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
  searchFormProps = {},
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
  const searchToggleRef = useRef<HTMLButtonElement>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [focusNavOnOpen, setFocusNavOnOpen] = useState(false);

  const nav = useCollapse({
    panelRef: navRef,
    isOpen: isNavOpen,
    onClose: () => setIsNavOpen(false),
    focusOnOpen: focusNavOnOpen ? 'panel' : null,
    triggerRef: menuToggleRef,
    showAt: breakpoint,
  });

  const searchPanel = useCollapse({
    panelRef: searchFormRef,
    isOpen: isSearchOpen,
    onClose: () => setIsSearchOpen(false),
    focusOnOpen: variant === 'bar' ? 'first' : null,
    triggerRef: searchToggleRef,
    showAt: breakpoint,
    alwaysVisible: variant === 'stack',
  });

  const { onKeyDown: onNavKeyDown } = useLinearKeyNav({
    containerRef: navRef,
    itemSelector: ':scope > ul > li > :is(a, button)',
    orientation: 'horizontal',
  });

  const handleMenuToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFocusNavOnOpen(e.detail === 0);
    if (!isNavOpen) setIsSearchOpen(false);
    setIsNavOpen(current => !current);
  };

  const handleSearchToggle = () => {
    if (!isSearchOpen) setIsNavOpen(false);
    setIsSearchOpen(current => !current);
  };

  const mainMenuClasses = classNames(
    `main-menu--${variant}--${breakpoint}`,
    utilities
  );

  const {
    className: searchFormClassName,
    onKeyDown: onSearchKeyDown,
    ...restSearchFormProps
  } = searchFormProps;

  const logoArea = logo ? (
    <div className="main-menu__logo">{logo}</div>
  ) : null;

  const navArea = (
    <nav
      ref={navRef}
      className="main-menu__nav"
      id={navId}
      aria-label={navAriaLabel}
      inert={!nav.isVisible ? true : undefined}
      aria-hidden={!nav.isVisible}
      onKeyDown={nav.onKeyDown}
    >
      <ul onKeyDown={onNavKeyDown}>{children}</ul>
    </nav>
  );

  const toggleArea = (
    <div className="main-menu__toggle">
      {variant === 'bar' && search && (
        <button
          type="button"
          ref={searchToggleRef}
          className="button button--icon-only"
          aria-label="Search"
          aria-controls={searchId}
          aria-expanded={isSearchOpen}
          onClick={handleSearchToggle}
        >
          <span className="icon icon-search" />
        </button>
      )}
      <button
        type="button"
        ref={menuToggleRef}
        className="button button--icon-only"
        aria-label="Menu"
        aria-controls={navId}
        aria-expanded={isNavOpen}
        onClick={handleMenuToggle}
      >
        <span className="icon icon-menu" />
      </button>
    </div>
  );

  const searchArea = search ? (
    <form
      {...restSearchFormProps}
      ref={searchFormRef}
      className={classNames('main-menu__search', searchFormClassName)}
      id={searchId}
      role="search"
      inert={!searchPanel.isVisible ? true : undefined}
      aria-hidden={!searchPanel.isVisible}
      onKeyDown={(event) => {
        onSearchKeyDown?.(event);
        searchPanel.onKeyDown(event);
      }}
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

import { useState } from 'react';
import { Brand, FormEntrySearch, MainMenu } from '@lib/components';
import { getNavigationTarget, getSearchResultsUrl, templateRoutes } from '../data';

const RouteLink = ({ href, currentPath, onNavigate, children, ...props }) => (
  <a
    href={href}
    aria-current={currentPath === getNavigationTarget(href).path ? 'page' : undefined}
    onClick={(event) => {
      event.preventDefault();
      onNavigate(href);
    }}
    {...props}
  >
    {children}
  </a>
);

const Logo = ({ currentPath, onNavigate }) => (
  <RouteLink href="/" currentPath={currentPath} onNavigate={onNavigate} title="Home" data-logo="brand">
    <Brand />
  </RouteLink>
);

const NavItems = ({ currentPath, onNavigate }) => (
  <>
    {templateRoutes.map((route) => (
      <li key={route.path}>
        <RouteLink href={route.path} currentPath={currentPath} onNavigate={onNavigate}>
          {route.label}
        </RouteLink>
      </li>
    ))}
  </>
);

const Header = ({ currentPath, onNavigate }) => {
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  const handleMenuSearchSubmit = (event) => {
    event.preventDefault();
    onNavigate(getSearchResultsUrl(menuSearchQuery));
  };

  return (
    <header className="margin-x-auto wide--lg">
      <MainMenu
        navId="main-menu"
        searchId="main-menu-search"
        searchFormProps={{
          'aria-label': 'Search templates',
          onSubmit: handleMenuSearchSubmit,
        }}
        search={
          <FormEntrySearch
            id="main-menu-search-input"
            name="search"
            labelText="Search"
            submitButton="text"
            leadingIcon={false}
            onSearch={setMenuSearchQuery}
            onClear={() => setMenuSearchQuery('')}
          />
        }
        logo={<Logo currentPath={currentPath} onNavigate={onNavigate} />}
      >
        <NavItems currentPath={currentPath} onNavigate={onNavigate} />
      </MainMenu>
    </header>
  );
};

export default Header;

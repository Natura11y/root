import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Collapse,
  FormEntrySearch,
  Pagination,
} from '@lib/components';
import {
  getSearchQueryFromSearch,
  getSearchResultsUrl,
  searchFilters,
  searchResults,
} from '../data';

const SearchFilters = ({ activeFilter, filterCount, onFilterChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="margin-x-auto">
      <Button
        title="Filter Results"
        utilities="sidebar-toggle button--disperse display-none--lg"
        iconEndHandle="chevron-down"
        onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
        attributes={{ 'aria-controls': 'search-filters', 'aria-expanded': isFilterOpen }}
      />

      <Collapse id="search-filters" isOpen={isFilterOpen} showAt="lg">
        <nav className="padding-3 padding-0--lg" aria-label="Filter by type">
          <p className="display-none display-block--lg"><strong>Filter Results</strong></p>

          <ul className="nav gap-3">
            {searchFilters.map((filter) => (
              <li key={filter.value}>
                <a
                  href="#1"
                  aria-current={activeFilter === filter.value ? 'true' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onFilterChange(filter.value);
                  }}
                >
                  {filter.label}
                  <Badge>{filterCount(filter.value)}</Badge>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Collapse>
    </div>
  );
};

const SearchResultsTemplate = ({ currentSearch, onNavigate }) => {
  const searchQuery = getSearchQueryFromSearch(currentSearch);
  const [query, setQuery] = useState(searchQuery);
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const nextQuery = getSearchQueryFromSearch(currentSearch);
    setQuery(nextQuery);
    setDraftQuery(nextQuery);
    setPage(1);
  }, [currentSearch]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredResults = searchResults.filter((result) => {
    const matchesFilter = activeFilter === 'all' || result.category === activeFilter;
    const matchesQuery = !normalizedQuery ||
      `${result.title} ${result.description}`.toLowerCase().includes(normalizedQuery);
    return matchesFilter && matchesQuery;
  });

  const filterCount = (value) => (
    value === 'all'
      ? searchResults.length
      : searchResults.filter((result) => result.category === value).length
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextQuery = draftQuery.trim();
    setQuery(nextQuery);
    setPage(1);
    onNavigate(getSearchResultsUrl(nextQuery));
  };

  const handleClear = () => {
    setDraftQuery('');
    setQuery('');
    setPage(1);
    onNavigate(getSearchResultsUrl(''));
  };

  const handleFilterChange = (value) => {
    setActiveFilter(value);
    setPage(1);
  };

  const resultStart = filteredResults.length > 0 ? 1 : 0;
  const resultEnd = filteredResults.length;

  return (
    <main id="main-content">
      <div className="theme-light padding-y-5">
        <div className="container wide--lg">
          <h1 className="h2">
            Search Results for <em>&ldquo;{query || 'All'}&rdquo;</em>
          </h1>

          <div className="margin-top-3">
            <form role="search" aria-label="Refine search" onSubmit={handleSubmit}>
              <FormEntrySearch
                key={query}
                id="search-results-input"
                name="search"
                labelText="Search"
                defaultValue={draftQuery}
                leadingIcon={false}
                submitButton="text"
                fieldInputUtilities="border-radius-pill"
                onSearch={setDraftQuery}
                onClear={handleClear}
              />
            </form>
          </div>
        </div>
      </div>

      <div className="container wide--lg margin-y-5">
        <div className="grid-sidebar--left gap-5">
          <aside className="grid-sidebar__minor" aria-label="Filter Results">
            <SearchFilters
              activeFilter={activeFilter}
              filterCount={filterCount}
              onFilterChange={handleFilterChange}
            />
          </aside>

          <div className="grid-sidebar__major">
            <div className="medium margin-x-auto">
              <p className="font-size-sm opacity-70">
                Showing {resultStart}-{resultEnd} of {filteredResults.length} results
              </p>

              <ul className="grid grid--divider">
                {filteredResults.map((result) => (
                  <li key={`${result.category}-${result.title}`}>
                    <p className="margin-bottom-2">
                      <Badge>{result.category}</Badge>
                    </p>
                    <h2 className="h5 margin-bottom-1">
                      <a className="link" href="#1">{result.title}</a>
                    </h2>
                    <p>{result.description}</p>
                  </li>
                ))}
              </ul>

              {filteredResults.length === 0 && (
                <Alert success={false} title="No Results" utilities="margin-top-4">
                  <p>Try another search term or filter.</p>
                </Alert>
              )}

              <div className="margin-top-5">
                <Pagination
                  ariaLabel="Search Results Pages"
                  items={[
                    { id: 'previous-page', iconHandle: 'arrow-left', ariaLabel: 'Previous page', href: '#1', linkProps: { onClick: (event) => { event.preventDefault(); setPage((currentPage) => Math.max(1, currentPage - 1)); } } },
                    { id: 'page-1', label: '1', href: '#1', current: page === 1, linkProps: { onClick: (event) => { event.preventDefault(); setPage(1); } } },
                    { id: 'page-2', label: '2', href: '#1', current: page === 2, linkProps: { onClick: (event) => { event.preventDefault(); setPage(2); } } },
                    { id: 'page-3', label: '3', href: '#1', current: page === 3, linkProps: { onClick: (event) => { event.preventDefault(); setPage(3); } } },
                    { id: 'more-pages', ellipsis: true },
                    { id: 'page-15', label: '15', href: '#1', linkProps: { onClick: (event) => event.preventDefault() } },
                    { id: 'next-page', iconHandle: 'arrow-right', ariaLabel: 'Next page', href: '#1', linkProps: { onClick: (event) => { event.preventDefault(); setPage((currentPage) => Math.min(3, currentPage + 1)); } } },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchResultsTemplate;

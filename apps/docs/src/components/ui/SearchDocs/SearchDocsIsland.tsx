import type { AutocompleteApi, AutocompleteState } from '@algolia/autocomplete-core';
import { Button, ButtonIconOnly, FormEntrySearch, Icon, Modal } from '@natura11y/react';
import { liteClient } from 'algoliasearch/lite';
import { createPortal } from 'react-dom';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type BaseSyntheticEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';

import './search-docs.css';

interface SearchDocsIslandProps {
  appId: string;
  apiKey: string;
  indexName: string;
}

type HierarchyLevel = 'lvl0' | 'lvl1' | 'lvl2' | 'lvl3' | 'lvl4' | 'lvl5' | 'lvl6';

interface DocSearchRecord {
  [key: string]: unknown;
  objectID: string;
  url: string;
  content?: string | null;
  hierarchy?: Partial<Record<HierarchyLevel, string | null>>;
  type?: string;
}

interface SearchResultGroup {
  key: string;
  title: string;
  items: DocSearchRecord[];
}

type SearchAutocomplete = AutocompleteApi<
  DocSearchRecord,
  BaseSyntheticEvent,
  ReactMouseEvent,
  ReactKeyboardEvent
>;

const RECENT_SEARCHES_KEY = 'natura11y-docs-recent-searches';
const MAX_RESULTS = 12;
const SEARCH_CANDIDATE_LIMIT = 100;
const HIERARCHY_LEVELS: HierarchyLevel[] = [
  'lvl0',
  'lvl1',
  'lvl2',
  'lvl3',
  'lvl4',
  'lvl5',
  'lvl6',
];

const initialAutocompleteState: AutocompleteState<DocSearchRecord> = {
  activeItemId: null,
  query: '',
  completion: null,
  collections: [],
  isOpen: false,
  status: 'idle',
  context: {},
};

const getHierarchyValues = (item: DocSearchRecord) =>
  HIERARCHY_LEVELS.map((level) => item.hierarchy?.[level]).filter(
    (value): value is string => Boolean(value?.trim()),
  );

const cleanResultTitle = (title: string) => title.replace(/\s*[•|]\s*Natura11y\s*$/i, '');

const getResultTitle = (item: DocSearchRecord) => {
  const hierarchyValues = getHierarchyValues(item);
  return cleanResultTitle(hierarchyValues.at(-1) ?? item.content ?? 'Documentation result');
};

const getResultDepth = (item: DocSearchRecord) => {
  const deepestHierarchyIndex = HIERARCHY_LEVELS.reduce((deepestIndex, level, index) => {
    return item.hierarchy?.[level]?.trim() ? index : deepestIndex;
  }, 0);

  return Math.max(0, deepestHierarchyIndex - 1);
};

const getParentPageTitle = (item: DocSearchRecord) =>
  item.hierarchy?.lvl1?.trim() || getResultTitle(item);

const groupSearchResults = (items: DocSearchRecord[]) => {
  const groups = new Map<string, SearchResultGroup>();

  for (const item of items) {
    const title = getParentPageTitle(item);
    const pageUrl = item.url.split('#')[0];
    const key = `${pageUrl}:${title}`;
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      groups.set(key, { key, title, items: [item] });
    }
  }

  return Array.from(groups.values());
};

const normalizeResultUrl = (url: string) => {
  try {
    const resultUrl = new URL(url, window.location.origin);
    const isLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
    const isNatura11yUrl = ['gonatura11y.com', 'www.gonatura11y.com'].includes(resultUrl.hostname);

    if (isLocal && isNatura11yUrl) {
      return `${window.location.origin}${resultUrl.pathname}${resultUrl.search}${resultUrl.hash}`;
    }

    return resultUrl.href;
  } catch {
    return url;
  }
};

const isCurrentDocumentation = (item: DocSearchRecord) => {
  try {
    const resultUrl = new URL(item.url, window.location.origin);
    return !/^\/v[1-4](?:\/|$)/.test(resultUrl.pathname);
  } catch {
    return true;
  }
};

const selectSearchResults = (hits: DocSearchRecord[]) => {
  const uniqueResults = new Map<string, DocSearchRecord>();

  for (const item of hits) {
    if (!isCurrentDocumentation(item)) {
      continue;
    }

    const normalizedUrl = normalizeResultUrl(item.url);

    if (!uniqueResults.has(normalizedUrl)) {
      uniqueResults.set(normalizedUrl, { ...item, url: normalizedUrl });
    }

    if (uniqueResults.size === MAX_RESULTS) {
      break;
    }
  }

  return groupSearchResults(Array.from(uniqueResults.values())).flatMap((group) => group.items);
};

const readRecentSearches = () => {
  try {
    const savedValue = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter((value): value is string => typeof value === 'string').slice(0, 5)
      : [];
  } catch {
    return [];
  }
};

const writeRecentSearches = (searches: string[]) => {
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch {
    // Search remains usable when storage is unavailable.
  }
};

const escapeRegularExpression = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function HighlightedText({ text, query }: { text: string; query: string }) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .sort((first, second) => second.length - first.length);

  if (terms.length === 0) {
    return text;
  }

  const matcher = new RegExp(`(${terms.map(escapeRegularExpression).join('|')})`, 'gi');
  const parts = text.split(matcher);

  return parts.map((part, index): ReactNode => {
    const isMatch = terms.some((term) => term.toLocaleLowerCase() === part.toLocaleLowerCase());
    return isMatch ? <mark key={`${part}-${index}`}>{part}</mark> : part;
  });
}

export default function SearchDocsIsland({ appId, apiKey, indexName }: SearchDocsIslandProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState<SearchAutocomplete | null>(null);
  const [autocompleteState, setAutocompleteState] = useState(initialAutocompleteState);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addRecentSearchRef = useRef<(query: string) => void>(() => undefined);

  const addRecentSearch = useCallback((query: string) => {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    setRecentSearches((currentSearches) => {
      const nextSearches = [
        normalizedQuery,
        ...currentSearches.filter(
          (search) => search.toLocaleLowerCase() !== normalizedQuery.toLocaleLowerCase(),
        ),
      ].slice(0, 5);

      writeRecentSearches(nextSearches);
      return nextSearches;
    });
  }, []);

  addRecentSearchRef.current = addRecentSearch;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
  }, []);

  useEffect(() => {
    const activeResultId = inputRef.current?.getAttribute('aria-activedescendant');

    if (activeResultId) {
      document.getElementById(activeResultId)?.scrollIntoView({ block: 'nearest' });
    }
  }, [autocompleteState.activeItemId]);

  useEffect(() => {
    let autocompleteInstance: SearchAutocomplete | undefined;
    let isDisposed = false;

    void import('@algolia/autocomplete-core').then(({ createAutocomplete }) => {
      if (isDisposed) {
        return;
      }

      const searchClient = liteClient(appId, apiKey);

      autocompleteInstance = createAutocomplete<
        DocSearchRecord,
        BaseSyntheticEvent,
        ReactMouseEvent,
        ReactKeyboardEvent
      >({
        id: 'natura11y-docs-search',
        defaultActiveItemId: 0,
        openOnFocus: false,
        placeholder: 'Search Natura11y documentation',
        onStateChange({ state }) {
          setAutocompleteState(state);
        },
        shouldPanelOpen({ state }) {
          return state.query.trim().length > 0;
        },
        getSources({ query }) {
          return [
            {
              sourceId: 'documentation',
              getItemInputValue({ item }) {
                return getResultTitle(item);
              },
              getItemUrl({ item }) {
                return item.url;
              },
              async getItems() {
                const normalizedQuery = query.trim();

                if (!normalizedQuery) {
                  return [];
                }

                const response = await searchClient.search<DocSearchRecord>({
                  requests: [
                    {
                      indexName,
                      query: normalizedQuery,
                      attributesToRetrieve: ['objectID', 'url', 'content', 'hierarchy', 'type'],
                      hitsPerPage: SEARCH_CANDIDATE_LIMIT,
                    },
                  ],
                });

                const firstResult = response.results[0];
                const hits = 'hits' in firstResult ? firstResult.hits : [];

                return selectSearchResults(hits as unknown as DocSearchRecord[]);
              },
              onSelect({ event, item, navigator, state }) {
                addRecentSearchRef.current(state.query);
                setIsOpen(false);
                autocompleteInstance?.setIsOpen(false);

                if (event.type !== 'click') {
                  return;
                }

                if (event.metaKey || event.ctrlKey) {
                  navigator.navigateNewTab({ item, itemUrl: item.url, state });
                } else if (event.shiftKey) {
                  navigator.navigateNewWindow({ item, itemUrl: item.url, state });
                } else {
                  navigator.navigate({ item, itemUrl: item.url, state });
                }
              },
            },
          ];
        },
      });

      setAutocomplete(autocompleteInstance);
    });

    return () => {
      isDisposed = true;
      autocompleteInstance?.setIsOpen(false);
    };
  }, [apiKey, appId, indexName]);

  const openSearch = () => {
    setIsOpen(true);
    autocomplete?.setIsOpen(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
    autocomplete?.setIsOpen(false);
  };

  const clearSearch = () => {
    autocomplete?.setQuery('');
    autocomplete?.setCollections([]);
    autocomplete?.setIsOpen(false);
    inputRef.current?.focus();
  };

  const runRecentSearch = (query: string) => {
    if (!autocomplete) {
      return;
    }

    autocomplete.setQuery(query);
    autocomplete.setIsOpen(true);
    void autocomplete.refresh();
    inputRef.current?.focus();
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches((currentSearches) => {
      const nextSearches = currentSearches.filter((search) => search !== query);
      writeRecentSearches(nextSearches);
      return nextSearches;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    writeRecentSearches([]);
    inputRef.current?.focus();
  };

  const rootProps = autocomplete?.getRootProps({}) ?? {};
  const formProps = autocomplete?.getFormProps({ inputElement: inputRef.current }) ?? {};
  const labelProps = autocomplete?.getLabelProps({}) ?? {
    htmlFor: 'natura11y-docs-search-input',
    id: 'natura11y-docs-search-label',
  };
  const inputProps = autocomplete?.getInputProps({ inputElement: inputRef.current }) ?? {
    id: 'natura11y-docs-search-input',
    value: '',
    type: 'search' as const,
    placeholder: 'Search Natura11y documentation',
    readOnly: true,
  };
  const panelProps = autocomplete?.getPanelProps({}) ?? {};
  const resultCount = autocompleteState.collections.reduce(
    (count, collection) => count + collection.items.length,
    0,
  );
  const hasQuery = autocompleteState.query.trim().length > 0;
  const isLoading = autocompleteState.status === 'loading' || autocompleteState.status === 'stalled';
  const statusMessage = isLoading
    ? 'Searching documentation'
    : hasQuery
      ? `${resultCount} ${resultCount === 1 ? 'result' : 'results'} available`
      : 'Enter a search term';

  return (
    <div className="docs-search">
      <Button
        ref={triggerRef}
        title="Search Docs"
        outline
        iconEndHandle="search"
        utilities="font-size-md button--disperse text-color-link font-size-sm--lg"
        attributes={{
          'aria-controls': 'docs-search-modal',
          'aria-expanded': isOpen,
          'aria-haspopup': 'dialog',
        }}
        onClick={openSearch}
      />

      {hasMounted && createPortal(
        <Modal
          id="docs-search-modal"
          isOpen={isOpen}
          closeOutside
          title="Search documentation"
          titleUtilities="h5"
          closeButtonLabel="Close search"
          modalUtilities="docs-search-modal"
          modalContentUtilities="narrow"
          initialFocusRef={inputRef}
          returnFocusRef={triggerRef}
          onClose={closeSearch}
          footerUtilities="font-size-sm"
          footerContent={(
            <div className="flex-row flex-no-wrap align-items-center justify-content-between gap-2">
              <p className="docs-search-commands margin-0" aria-hidden="true">
                <kbd>↑</kbd><kbd>↓</kbd> Navigate <kbd>Enter</kbd> Open <kbd>Esc</kbd> Close
              </p>
              <a
                className="text-decoration-none"
                href="https://www.algolia.com/"
                target="_blank"
                rel="noreferrer"
              >
                Powered by <strong>Algolia</strong>
              </a>
            </div>
          )}
        >
          <div {...rootProps} className="grid gap-2">
            <form {...formProps}>
              <FormEntrySearch
                ref={inputRef}
                labelText="Search Natura11y documentation"
                inputAttributes={{ ...inputProps, disabled: !autocomplete }}
                labelAttributes={{ id: labelProps.id }}
                onClear={clearSearch}
              />
            </form>

            <p className="screen-reader-only" role="status" aria-live="polite" aria-atomic="true">
              {statusMessage}
            </p>

            <div {...panelProps}>
              {!hasQuery && recentSearches.length > 0 && (
                <section aria-labelledby="docs-search-recent-title">
                  <div className="flex-row flex-no-wrap align-items-center justify-content-between gap-2 margin-bottom-1">
                    <h3 className="h6 margin-0" id="docs-search-recent-title">Recent searches</h3>
                    <Button title="Clear all" utilities="font-size-sm" onClick={clearRecentSearches} />
                  </div>
                  <ul className="grid gap-1" role="list">
                    {recentSearches.map((query) => (
                      <li className="flex-row flex-no-wrap align-items-center gap-1" key={query}>
                        <Button
                          title={query}
                          iconStartHandle="search"
                          utilities="button--dispersex width-100"
                          onClick={() => runRecentSearch(query)}
                        />
                        <ButtonIconOnly
                          iconHandle="clear"
                          ariaLabel={`Remove “${query}” from recent searches`}
                          onClick={() => removeRecentSearch(query)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {!hasQuery && recentSearches.length === 0 && (
                <p className="margin-0">Start typing to search the current Natura11y documentation.</p>
              )}

              {hasQuery && isLoading && resultCount === 0 && (
                <p className="margin-0">Searching…</p>
              )}

              {hasQuery && !isLoading && resultCount === 0 && (
                <div>
                  <p className="h6">No results found</p>
                  <p className="margin-0">Try a different or more general search term.</p>
                </div>
              )}

              {hasQuery && autocompleteState.collections.map((collection) => {
                if (collection.items.length === 0 || !autocomplete) {
                  return null;
                }

                const resultGroups = groupSearchResults(collection.items);

                return (
                  <ul
                    key={collection.source.sourceId}
                    {...autocomplete.getListProps({ source: collection.source })}
                    className="grid gap-3"
                  >
                    {resultGroups.map((group, groupIndex) => {
                      const groupTitleId = `docs-search-group-${collection.source.sourceId}-${groupIndex}`;

                      return (
                        <li key={group.key} role="group" aria-labelledby={groupTitleId}>
                          <h3 className="h6 text-color-link margin-bottom-1" id={groupTitleId}>
                            <HighlightedText text={group.title} query={autocompleteState.query} />
                          </h3>
                          <ul className="docs-search-hit-list border border-radius-2 overflow-hidden" role="presentation">
                            {group.items.map((item) => {
                              const itemProps = autocomplete.getItemProps({
                                item,
                                source: collection.source,
                              });
                              const resultDepth = Math.min(getResultDepth(item), 2);
                              const resultTitle = item.type === 'lvl1' ? 'Overview' : getResultTitle(item);

                              return (
                                <li
                                  key={item.objectID}
                                  {...itemProps}
                                  className={`docs-search-hit docs-search-hit--depth-${resultDepth} border-bottom padding-2${itemProps['aria-selected'] ? ' is-selected' : ''}`}
                                >
                                  <Icon iconHandle={resultDepth === 0 ? 'list' : 'hashtag'} />
                                  <span className="docs-search-hit__body">
                                    <span className="docs-search-hit__title">
                                      {resultDepth > 0 && (
                                        <span className="screen-reader-only">
                                          {`Section of ${group.title}: `}
                                        </span>
                                      )}
                                      <HighlightedText text={resultTitle} query={autocompleteState.query} />
                                    </span>
                                  </span>
                                  <Icon iconHandle="arrow-right" />
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                );
              })}
            </div>
          </div>
        </Modal>,
        document.body,
      )}
    </div>
  );
}

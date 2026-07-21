import { Button, FormEntrySearch, Modal } from '@natura11y/react';

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
} from 'react';

import SavedSearches from './SavedSearches';
import SearchResults from './SearchResults';
import {
  createSavedSearchResult,
  getResultTitle,
  initialAutocompleteState,
  isSameSavedResult,
  MAX_FAVORITE_RESULTS,
  MAX_RECENT_RESULTS,
  prependSavedResult,
  readFavoriteResults,
  readRecentResults,
  SEARCH_CANDIDATE_LIMIT,
  selectSearchResults,
  writeFavoriteResults,
  writeRecentResults,
  type DocSearchRecord,
  type SavedSearchResult,
  type SearchAutocomplete,
} from './search-docs-utils';

import './search-docs.css';

interface SearchDocsIslandProps {
  appId: string;
  apiKey: string;
  indexName: string;
}

const SearchDocsIsland = ({ appId, apiKey, indexName }: SearchDocsIslandProps) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState<SearchAutocomplete | null>(null);
  const [autocompleteState, setAutocompleteState] = useState(initialAutocompleteState);
  const [favoriteResults, setFavoriteResults] = useState<SavedSearchResult[]>([]);
  const [recentResults, setRecentResults] = useState<SavedSearchResult[]>([]);
  const [savedSearchMessage, setSavedSearchMessage] = useState('');

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const favoriteResultsRef = useRef<SavedSearchResult[]>([]);
  const addRecentResultRef = useRef<(result: DocSearchRecord) => void>(() => undefined);

  const addRecentResult = useCallback((result: DocSearchRecord) => {
    const savedResult = createSavedSearchResult(result);

    if (favoriteResultsRef.current.some((favorite) => isSameSavedResult(favorite, savedResult))) {
      return;
    }

    setRecentResults((currentResults) => {
      const nextResults = prependSavedResult(currentResults, savedResult, MAX_RECENT_RESULTS);
      writeRecentResults(nextResults);
      return nextResults;
    });
  }, []);

  favoriteResultsRef.current = favoriteResults;
  addRecentResultRef.current = addRecentResult;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const storedFavorites = readFavoriteResults();
    const storedRecentResults = readRecentResults().filter(
      (recentResult) => !storedFavorites.some(
        (favorite) => isSameSavedResult(favorite, recentResult),
      ),
    );

    setFavoriteResults(storedFavorites);
    setRecentResults(storedRecentResults);
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
                addRecentResultRef.current(item);
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
    setSavedSearchMessage('');
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

  const openSavedResult = (result: SavedSearchResult) => {
    if (!favoriteResults.some((favorite) => isSameSavedResult(favorite, result))) {
      setRecentResults((currentResults) => {
        const nextResults = prependSavedResult(currentResults, result, MAX_RECENT_RESULTS);
        writeRecentResults(nextResults);
        return nextResults;
      });
    }

    closeSearch();
  };

  const removeRecentResult = (result: SavedSearchResult) => {
    setRecentResults((currentResults) => {
      const nextResults = currentResults.filter(
        (currentResult) => !isSameSavedResult(currentResult, result),
      );
      writeRecentResults(nextResults);
      return nextResults;
    });
    setSavedSearchMessage(`${result.title} removed from recent results.`);
    inputRef.current?.focus();
  };

  const clearRecentResults = () => {
    setRecentResults([]);
    writeRecentResults([]);
    setSavedSearchMessage('Recent results cleared.');
    inputRef.current?.focus();
  };

  const addFavoriteResult = (result: SavedSearchResult) => {
    setFavoriteResults((currentFavorites) => {
      const nextFavorites = prependSavedResult(
        currentFavorites,
        result,
        MAX_FAVORITE_RESULTS,
      );
      writeFavoriteResults(nextFavorites);
      return nextFavorites;
    });
    setRecentResults((currentResults) => {
      const nextResults = currentResults.filter(
        (currentResult) => !isSameSavedResult(currentResult, result),
      );
      writeRecentResults(nextResults);
      return nextResults;
    });
    setSavedSearchMessage(`${result.title} added to favorites.`);
    inputRef.current?.focus();
  };

  const removeFavoriteResult = (result: SavedSearchResult) => {
    setFavoriteResults((currentFavorites) => {
      const nextFavorites = currentFavorites.filter(
        (favorite) => !isSameSavedResult(favorite, result),
      );
      writeFavoriteResults(nextFavorites);
      return nextFavorites;
    });
    setRecentResults((currentResults) => {
      const nextResults = prependSavedResult(currentResults, result, MAX_RECENT_RESULTS);
      writeRecentResults(nextResults);
      return nextResults;
    });
    setSavedSearchMessage(`${result.title} removed from favorites.`);
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
                href="https://www.algolia.com/"
                target="_blank"
                rel="noreferrer"
              >
                Powered by <strong>Algolia</strong>
              </a>
            </div>
          )}
        >
          <div {...rootProps} className="grid gap-3">
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

            <p className="screen-reader-only" role="status" aria-live="polite" aria-atomic="true">
              {savedSearchMessage}
            </p>

            <div {...panelProps}>
              {!hasQuery && (favoriteResults.length > 0 || recentResults.length > 0) && (
                <SavedSearches
                  favorites={favoriteResults}
                  recentResults={recentResults}
                  onClearRecent={clearRecentResults}
                  onFavorite={addFavoriteResult}
                  onOpen={openSavedResult}
                  onRemoveFavorite={removeFavoriteResult}
                  onRemoveRecent={removeRecentResult}
                />
              )}

              {!hasQuery && favoriteResults.length === 0 && recentResults.length === 0 && (
                <p className="margin-y-3">
                  Start typing to search the current Natura11y documentation.
                </p>
              )}

              {hasQuery && autocomplete && (
                <SearchResults
                  autocomplete={autocomplete}
                  autocompleteState={autocompleteState}
                  isLoading={isLoading}
                  resultCount={resultCount}
                />
              )}
            </div>
          </div>
        </Modal>,
        document.body,
      )}
    </div>
  );
};

export default SearchDocsIsland;
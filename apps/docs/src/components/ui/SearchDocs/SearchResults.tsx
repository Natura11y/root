import type { AutocompleteState } from '@algolia/autocomplete-core';

import { Icon } from '@natura11y/react';

import type { ReactNode } from 'react';

import {
  getResultMetadata,
  groupSearchResults,
  type DocSearchRecord,
  type SearchAutocomplete,
} from './search-docs-utils';

interface SearchResultsProps {
  autocomplete: SearchAutocomplete;
  autocompleteState: AutocompleteState<DocSearchRecord>;
  isLoading: boolean;
  resultCount: number;
}

const escapeRegularExpression = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const HighlightedText = ({ text, query }: { text: string; query: string }) => {
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
};

const SearchResults = ({
  autocomplete,
  autocompleteState,
  isLoading,
  resultCount,
}: SearchResultsProps) => {
  if (isLoading && resultCount === 0) {
    return <p className="margin-0">Searching…</p>;
  }

  if (!isLoading && resultCount === 0) {
    return (
      <div>
        <p className="h6">No results found</p>
        <p className="margin-0">Try a different or more general search term.</p>
      </div>
    );
  }

  return autocompleteState.collections.map((collection) => {
    if (collection.items.length === 0) {
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

              <h3 className="h6 margin-bottom-1" id={groupTitleId}>
                <HighlightedText text={group.title} query={autocompleteState.query} />
              </h3>
              
              <ul className="docs-search-result-list border border-radius-2" role="presentation">
                
                {group.items.map((item) => {
                  const itemProps = autocomplete.getItemProps({
                    item,
                    source: collection.source,
                  });
                  const { depth, title: resultTitle } = getResultMetadata(item);
                  const resultDepth = Math.min(depth, 2);

                  return (
                    <li
                      key={item.objectID}
                      {...itemProps}
                      className={`docs-search-result docs-search-result--depth-${resultDepth} ${itemProps['aria-selected'] ? ' is-selected' : ''}`}
                    >
                      <Icon iconHandle={resultDepth === 0 ? 'list' : 'hashtag'} />
                      <span className="docs-search-result__body">
                        <span className="docs-search-result__title">
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
  });
};

export default SearchResults;
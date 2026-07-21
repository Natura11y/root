import type { AutocompleteApi, AutocompleteState } from '@algolia/autocomplete-core';
import type {
  BaseSyntheticEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react';

type HierarchyLevel = 'lvl0' | 'lvl1' | 'lvl2' | 'lvl3' | 'lvl4' | 'lvl5' | 'lvl6';

export interface DocSearchRecord {
  [key: string]: unknown;
  objectID: string;
  url: string;
  content?: string | null;
  hierarchy?: Partial<Record<HierarchyLevel, string | null>>;
  type?: string;
}

export interface SearchResultGroup {
  key: string;
  title: string;
  items: DocSearchRecord[];
}

export interface SavedSearchResult {
  pageTitle: string;
  title: string;
  url: string;
}

export type SearchAutocomplete = AutocompleteApi<
  DocSearchRecord,
  BaseSyntheticEvent,
  ReactMouseEvent,
  ReactKeyboardEvent
>;

export type SavedResultsCollection = 'favorites' | 'recent';

const SAVED_RESULTS_KEYS: Record<SavedResultsCollection, string> = {
  favorites: 'natura11y-docs-favorite-results-v1',
  recent: 'natura11y-docs-recent-results-v1',
};

export const SAVED_RESULTS_LIMITS: Record<SavedResultsCollection, number> = {
  favorites: 8,
  recent: 5,
};

const MAX_RESULTS = 12;

export const SEARCH_CANDIDATE_LIMIT = 100;

const HIERARCHY_LEVELS: HierarchyLevel[] = [
  'lvl0',
  'lvl1',
  'lvl2',
  'lvl3',
  'lvl4',
  'lvl5',
  'lvl6',
];

export const initialAutocompleteState: AutocompleteState<DocSearchRecord> = {
  activeItemId: null,
  query: '',
  completion: null,
  collections: [],
  isOpen: false,
  status: 'idle',
  context: {},
};

const cleanResultTitle = (title: string) => title.replace(/\s*[•|]\s*Natura11y\s*$/i, '');

export const getResultMetadata = (item: DocSearchRecord) => {
  const hierarchyValues = HIERARCHY_LEVELS.map((level) => item.hierarchy?.[level]).filter(
    (value): value is string => Boolean(value?.trim()),
  );
  const resultTitle = cleanResultTitle(
    hierarchyValues.at(-1) ?? item.content ?? 'Documentation result',
  );
  const deepestHierarchyIndex = HIERARCHY_LEVELS.reduce((deepestIndex, level, index) => {
    return item.hierarchy?.[level]?.trim() ? index : deepestIndex;
  }, 0);
  const depth = Math.max(0, deepestHierarchyIndex - 1);
  const pageTitle = cleanResultTitle(item.hierarchy?.lvl1?.trim() || resultTitle);

  return {
    depth,
    pageTitle,
    resultTitle,
    title: depth === 0 ? 'Overview' : resultTitle,
  };
};

export const createSavedSearchResult = (item: DocSearchRecord): SavedSearchResult => {
  const { pageTitle, title } = getResultMetadata(item);

  return { pageTitle, title, url: item.url };
};

export const isSameSavedResult = (
  firstResult: SavedSearchResult,
  secondResult: SavedSearchResult,
) => firstResult.url === secondResult.url;

export const prependSavedResult = (
  results: SavedSearchResult[],
  result: SavedSearchResult,
  limit: number,
) => [result, ...results.filter((currentResult) => !isSameSavedResult(currentResult, result))]
  .slice(0, limit);

export const groupSearchResults = (items: DocSearchRecord[]) => {
  const groups = new Map<string, SearchResultGroup>();

  for (const item of items) {
    const { pageTitle: title } = getResultMetadata(item);
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

export const selectSearchResults = (hits: DocSearchRecord[]) => {
  const uniqueResults = new Map<string, DocSearchRecord>();

  for (const item of hits) {
    const normalizedUrl = normalizeResultUrl(item.url);

    if (!uniqueResults.has(normalizedUrl)) {
      uniqueResults.set(normalizedUrl, { ...item, url: normalizedUrl });
    }

    if (uniqueResults.size === MAX_RESULTS) {
      break;
    }
  }

  const results = Array.from(uniqueResults.values());

  // Autocomplete assigns keyboard-navigation IDs from this array order.
  // Match the page-grouped order used by SearchResults before returning it.
  return groupSearchResults(results).flatMap((group) => group.items);
};

const isSavedSearchResult = (value: unknown): value is SavedSearchResult => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const result = value as Partial<SavedSearchResult>;

  return typeof result.pageTitle === 'string'
    && typeof result.title === 'string'
    && typeof result.url === 'string';
};

export const readSavedResults = (collection: SavedResultsCollection) => {
  try {
    const savedValue = window.localStorage.getItem(SAVED_RESULTS_KEYS[collection]);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter(isSavedSearchResult).slice(0, SAVED_RESULTS_LIMITS[collection])
      : [];
  } catch {
    return [];
  }
};

export const writeSavedResults = (
  collection: SavedResultsCollection,
  results: SavedSearchResult[],
) => {
  try {
    window.localStorage.setItem(SAVED_RESULTS_KEYS[collection], JSON.stringify(results));
  } catch {
    // Search remains usable when storage is unavailable.
  }
};

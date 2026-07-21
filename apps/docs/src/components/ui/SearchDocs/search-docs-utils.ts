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
  objectID: string;
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

const RECENT_RESULTS_KEY = 'natura11y-docs-recent-results-v1';
const FAVORITE_RESULTS_KEY = 'natura11y-docs-favorite-results-v1';
const MAX_RESULTS = 12;

export const MAX_RECENT_RESULTS = 5;
export const MAX_FAVORITE_RESULTS = 8;

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

const getHierarchyValues = (item: DocSearchRecord) =>
  HIERARCHY_LEVELS.map((level) => item.hierarchy?.[level]).filter(
    (value): value is string => Boolean(value?.trim()),
  );

const cleanResultTitle = (title: string) => title.replace(/\s*[•|]\s*Natura11y\s*$/i, '');

export const getResultTitle = (item: DocSearchRecord) => {
  const hierarchyValues = getHierarchyValues(item);
  return cleanResultTitle(hierarchyValues.at(-1) ?? item.content ?? 'Documentation result');
};

export const getResultDepth = (item: DocSearchRecord) => {
  const deepestHierarchyIndex = HIERARCHY_LEVELS.reduce((deepestIndex, level, index) => {
    return item.hierarchy?.[level]?.trim() ? index : deepestIndex;
  }, 0);

  return Math.max(0, deepestHierarchyIndex - 1);
};

export const getParentPageTitle = (item: DocSearchRecord) =>
  cleanResultTitle(item.hierarchy?.lvl1?.trim() || getResultTitle(item));

export const createSavedSearchResult = (item: DocSearchRecord): SavedSearchResult => ({
  objectID: item.objectID,
  pageTitle: getParentPageTitle(item),
  title: getResultDepth(item) === 0 ? 'Overview' : getResultTitle(item),
  url: item.url,
});

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

export const selectSearchResults = (hits: DocSearchRecord[]) => {
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

const isSavedSearchResult = (value: unknown): value is SavedSearchResult => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const result = value as Partial<SavedSearchResult>;

  return typeof result.objectID === 'string'
    && typeof result.pageTitle === 'string'
    && typeof result.title === 'string'
    && typeof result.url === 'string';
};

const readSavedResults = (storageKey: string, limit: number) => {
  try {
    const savedValue = window.localStorage.getItem(storageKey);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter(isSavedSearchResult).slice(0, limit)
      : [];
  } catch {
    return [];
  }
};

const writeSavedResults = (storageKey: string, results: SavedSearchResult[]) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(results));
  } catch {
    // Search remains usable when storage is unavailable.
  }
};

export const readRecentResults = () => readSavedResults(RECENT_RESULTS_KEY, MAX_RECENT_RESULTS);

export const writeRecentResults = (results: SavedSearchResult[]) => {
  writeSavedResults(RECENT_RESULTS_KEY, results);
};

export const readFavoriteResults = () => readSavedResults(
  FAVORITE_RESULTS_KEY,
  MAX_FAVORITE_RESULTS,
);

export const writeFavoriteResults = (results: SavedSearchResult[]) => {
  writeSavedResults(FAVORITE_RESULTS_KEY, results);
};

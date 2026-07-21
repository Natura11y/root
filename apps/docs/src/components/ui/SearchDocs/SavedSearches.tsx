import { Button, ButtonIconOnly, Icon } from '@natura11y/react';

import type { SavedSearchResult } from './search-docs-utils';

interface SavedResultProps {
  result: SavedSearchResult;
  type: 'favorite' | 'recent';
  onFavorite: (result: SavedSearchResult) => void;
  onOpen: (result: SavedSearchResult) => void;
  onRemove: (result: SavedSearchResult) => void;
}

const SavedResult = ({ result, type, onFavorite, onOpen, onRemove }: SavedResultProps) => {

  const isFavorite = type === 'favorite';

  return (
    <li className="docs-search-saved-result">

      <a
        className="docs-search-saved-result__link"
        href={result.url}
        onClick={() => onOpen(result)}
      >
        <Icon iconHandle="search" />
        <div className="docs-search-saved-result__body">
          <span className="font-size-sm">{result.pageTitle}</span>
          <span className="docs-search-saved-result__title">{result.title}</span>
        </div>
      </a>

      <div className="docs-search-saved-result__actions">
      
      <ButtonIconOnly
        iconHandle={isFavorite ? 'star-fill' : 'star-outline'}
        ariaLabel={isFavorite
          ? `Remove ${result.title} from favorites`
          : `Add ${result.title} to favorites`}
        attributes={{ 'aria-pressed': isFavorite }}
        onClick={() => (isFavorite ? onRemove(result) : onFavorite(result))}
      />

      {!isFavorite && (
        <ButtonIconOnly
          iconHandle="clear"
          ariaLabel={`Remove ${result.title} from recent results`}
          onClick={() => onRemove(result)}
        />
      )}
      </div>

    </li>
  );
};

interface SavedSearchesProps {
  favorites: SavedSearchResult[];
  recentResults: SavedSearchResult[];
  onClearRecent: () => void;
  onFavorite: (result: SavedSearchResult) => void;
  onOpen: (result: SavedSearchResult) => void;
  onRemoveFavorite: (result: SavedSearchResult) => void;
  onRemoveRecent: (result: SavedSearchResult) => void;
}

const SavedSearches = ({
  favorites,
  recentResults,
  onClearRecent,
  onFavorite,
  onOpen,
  onRemoveFavorite,
  onRemoveRecent,
}: SavedSearchesProps) => {
  return (
    <div className="grid gap-3">
      {favorites.length > 0 && (
        <section>
          <h3 className="h6 margin-bottom-2">Favorites</h3>
          <ul className="docs-search-saved-list grid border border-radius-2" role="list">
            {favorites.map((result) => (
              <SavedResult
                key={result.url}
                result={result}
                type="favorite"
                onFavorite={onFavorite}
                onOpen={onOpen}
                onRemove={onRemoveFavorite}
              />
            ))}
          </ul>
        </section>
      )}

      {recentResults.length > 0 && (
        <section>
          <div className="flex-row flex-no-wrap align-items-center justify-content-between gap-2 margin-bottom-1">
            <h3 className="h6 margin-0">Recent</h3>
            <Button title="Clear all" utilities="font-size-sm" onClick={onClearRecent} />
          </div>
          <ul className="docs-search-saved-list grid border border-radius-2" role="list">
            {recentResults.map((result) => (
              <SavedResult
                key={result.url}
                result={result}
                type="recent"
                onFavorite={onFavorite}
                onOpen={onOpen}
                onRemove={onRemoveRecent}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default SavedSearches;

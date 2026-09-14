import { type FormEvent, type ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  totalResults?: number;
  totalItems?: number;
  itemLabel?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  totalResults,
  totalItems,
  itemLabel = 'items',
}: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    if (onSearch) {
      onSearch('');
    }
  };

  const isFiltered = value.trim().length > 0;

  return (
    <div className="search-section">
      <form className="search-form" onSubmit={handleSubmit} role="search">
        <div className="search-input-wrapper">
          <svg
            className="search-input-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            aria-label={placeholder}
          />
          {value && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Clear search query"
              title="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <button type="submit" className="search-button" aria-label="Search">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Search</span>
        </button>
      </form>

      {isFiltered && (
        <div className="search-meta">
          <span className="search-meta-text">
            Found <strong>{totalResults}</strong> {totalResults === 1 ? itemLabel.slice(0, -1) : itemLabel} matching &ldquo;{value}&rdquo;
            {totalItems !== undefined && ` (out of ${totalItems} total)`}
          </span>
          <button type="button" className="search-meta-reset" onClick={handleClear}>
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}

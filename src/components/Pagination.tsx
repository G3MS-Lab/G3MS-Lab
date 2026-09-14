
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemName?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  itemName = 'items',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers with ellipses
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : undefined;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : undefined;

  return (
    <nav className="pagination-wrapper" aria-label="Pagination Navigation">
      {startItem && endItem && totalItems && (
        <div className="pagination-info">
          Showing <span>{startItem}</span>&ndash;<span>{endItem}</span> of <span>{totalItems}</span> {itemName}
        </div>
      )}

      <ul className="pagination-list">
        <li>
          <button
            type="button"
            className="pagination-btn pagination-nav-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="pagination-nav-text">Prev</span>
          </button>
        </li>

        {pages.map((page, index) => {
          if (typeof page === 'string') {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
            );
          }

          const isActive = page === currentPage;
          return (
            <li key={page}>
              <button
                type="button"
                className={`pagination-btn ${isActive ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            className="pagination-btn pagination-nav-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <span className="pagination-nav-text">Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}

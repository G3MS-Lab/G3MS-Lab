import { useState, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { papers } from '../lib/content';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;

export default function PapersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredPapers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return papers;
    return papers.filter((paper) => {
      const matchTitle = paper.title.toLowerCase().includes(q);
      const matchAuthors = paper.authors.some((author) =>
        author.toLowerCase().includes(q)
      );
      const matchVenue = paper.venue.toLowerCase().includes(q);
      const matchYear = String(paper.year).includes(q);
      const matchTags = paper.tags.some((tag) =>
        tag.toLowerCase().includes(q)
      );
      const matchBody = paper.body.toLowerCase().includes(q);
      return (
        matchTitle ||
        matchAuthors ||
        matchVenue ||
        matchYear ||
        matchTags ||
        matchBody
      );
    });
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredPapers.length / ITEMS_PER_PAGE);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setCurrentPage(1);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPapers = filteredPapers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <h1>Publications</h1>
        </div>
      </div>
      <section className="section" ref={sectionRef}>
        <div className="container">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search papers by title, author, venue, year, or tag..."
            totalResults={filteredPapers.length}
            totalItems={papers.length}
            itemLabel="publications"
          />

          {paginatedPapers.length > 0 ? (
            <>
              <ul className="paper-list">
                {paginatedPapers.map((paper) => (
                  <li key={paper.slug} className="paper-card">
                    <div className="paper-meta">
                      <span className="paper-venue">{paper.venue}</span>
                      <span className="paper-year">{paper.year}</span>
                    </div>
                    <h2 className="paper-title">
                      {paper.doi ? (
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {paper.title}
                        </a>
                      ) : paper.url ? (
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {paper.title}
                        </a>
                      ) : (
                        paper.title
                      )}
                    </h2>
                    <p className="paper-authors">{paper.authors.join(', ')}</p>
                    <div className="prose prose-sm">
                      <ReactMarkdown>{paper.body}</ReactMarkdown>
                    </div>
                    <div className="tag-list">
                      {paper.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="tag tag-clickable"
                          onClick={() => handleTagClick(tag)}
                          title={`Filter by tag: ${tag}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredPapers.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName="publications"
              />
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h2 className="empty-state-title">No publications found</h2>
              <p className="empty-state-text">
                No publications matched your search for &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleSearchChange('')}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

import { useState, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { projects } from '../lib/content';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return projects;
    return projects.filter((project) => {
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchStudents = project.students.some((student) =>
        student.toLowerCase().includes(q)
      );
      const matchAdvisor = project.advisor.toLowerCase().includes(q);
      const matchYear = String(project.academicYear).includes(q);
      const matchBody = project.body.toLowerCase().includes(q);
      return (
        matchTitle ||
        matchStudents ||
        matchAdvisor ||
        matchYear ||
        matchBody
      );
    });
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

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

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <h1>Senior Projects</h1>
        </div>
      </div>
      <section className="section" ref={sectionRef}>
        <div className="container">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search projects by title, student, advisor, or year..."
            totalResults={filteredProjects.length}
            totalItems={projects.length}
            itemLabel="projects"
          />

          {paginatedProjects.length > 0 ? (
            <>
              <ul className="paper-list">
                {paginatedProjects.map((project) => (
                  <li key={project.slug} className="paper-card">
                    <div className="paper-meta">
                      <span className="paper-venue">Academic Year {project.academicYear}</span>
                      <span className="paper-year">Advisor: {project.advisor}</span>
                    </div>
                    <h2 className="paper-title">{project.title}</h2>
                    <p className="paper-authors">{project.students.join(', ')}</p>
                    <div className="prose prose-sm">
                      <ReactMarkdown>{project.body}</ReactMarkdown>
                    </div>
                    <div className="project-links">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-link"
                        >
                          Demo
                        </a>
                      )}
                      {project.reportUrl && (
                        <a
                          href={project.reportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-link"
                        >
                          Report
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredProjects.length}
                itemsPerPage={ITEMS_PER_PAGE}
                itemName="projects"
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
              <h2 className="empty-state-title">No projects found</h2>
              <p className="empty-state-text">
                No senior projects matched your search for &ldquo;{searchQuery}&rdquo;.
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

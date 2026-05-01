import ReactMarkdown from 'react-markdown';
import { papers } from '../lib/content';

export default function PapersPage() {
  return (
    <main>
      <div className="page-header">
        <div className="container">
          <h1>Publications</h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <ul className="paper-list">
            {papers.map((paper) => (
              <li key={paper.slug} className="paper-card">
                <div className="paper-meta">
                  <span className="paper-venue">{paper.venue}</span>
                  <span className="paper-year">{paper.year}</span>
                </div>
                <h2 className="paper-title">
                  {paper.doi ? (
                    <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">
                      {paper.title}
                    </a>
                  ) : paper.url ? (
                    <a href={paper.url} target="_blank" rel="noopener noreferrer">
                      {paper.title}
                    </a>
                  ) : paper.title}
                </h2>
                <p className="paper-authors">{paper.authors.join(', ')}</p>
                <div className="prose prose-sm">
                  <ReactMarkdown>{paper.body}</ReactMarkdown>
                </div>
                <div className="tag-list">
                  {paper.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

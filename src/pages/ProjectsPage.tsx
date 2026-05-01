import ReactMarkdown from 'react-markdown';
import { projects } from '../lib/content';

export default function ProjectsPage() {
  return (
    <main>
      <div className="page-header">
        <div className="container">
          <h1>Senior Projects</h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <ul className="paper-list">
            {projects.map((project) => (
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
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
                      Demo
                    </a>
                  )}
                  {project.reportUrl && (
                    <a href={project.reportUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
                      Report
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

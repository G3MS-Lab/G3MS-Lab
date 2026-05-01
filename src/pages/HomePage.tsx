import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import PointCloudHero from '../components/PointCloudHero';
import { labInfo } from '../lib/content';

export default function HomePage() {
  return (
    <main>
      <PointCloudHero />

      <section className="section">
        <div className="container">
          <h2>About the Lab</h2>
          <div className="prose">
            <ReactMarkdown>{labInfo.body}</ReactMarkdown>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2>Research Areas</h2>
          <ul className="tag-list">
            {labInfo.researchAreas.map((area) => (
              <li key={area} className="tag">{area}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container quick-links">
          <Link to="/papers" className="card-link">
            <div className="quick-card">
              <h3>Papers</h3>
              <p>Our published research and academic contributions.</p>
            </div>
          </Link>
          <Link to="/projects" className="card-link">
            <div className="quick-card">
              <h3>Senior Projects</h3>
              <p>Undergraduate final-year projects from our lab.</p>
            </div>
          </Link>
          <Link to="/members" className="card-link">
            <div className="quick-card">
              <h3>Members</h3>
              <p>Faculty, researchers, and students of G3MS Lab.</p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}

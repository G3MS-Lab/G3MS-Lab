import { labInfo } from '../lib/content';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>G3MS Lab · Department of Computer Engineering · KMUTT</p>
        <p>
          <a href={`mailto:${labInfo.contactEmail}`}>{labInfo.contactEmail}</a>
        </p>
        <div className="footer-links">
          {Object.entries(labInfo.socialLinks).map(([name, url]) =>
            url ? (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </a>
            ) : null
          )}
        </div>
      </div>
    </footer>
  );
}

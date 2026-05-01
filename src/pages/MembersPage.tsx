import ReactMarkdown from 'react-markdown';
import { members } from '../lib/content';
import type { Member } from '../types/content';

const roleOrder: Member['role'][] = ['Faculty', 'Researcher', 'PhD', 'Master', 'Undergraduate', 'Alumni'];

export default function MembersPage() {
  const grouped = roleOrder.reduce<Record<string, Member[]>>((acc, role) => {
    const group = members.filter((m) => m.role === role);
    if (group.length) acc[role] = group;
    return acc;
  }, {});

  return (
    <main>
      <div className="page-header">
        <div className="container">
          <h1>Lab Members</h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          {Object.entries(grouped).map(([role, group]) => (
            <div key={role} className="member-group">
              <h2 className="member-role-header">{role}</h2>
              <ul className="member-grid">
                {group.map((member) => (
                  <li key={member.slug} className="member-card">
                    <div className="member-avatar" aria-hidden="true">
                      {member.photo ? (
                        <img src={import.meta.env.BASE_URL.replace(/\/$/, '') + member.photo} alt={member.name} />
                      ) : (
                        <span className="member-initials">
                          {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className="member-info">
                      <h3 className="member-name">
                        {member.personalUrl ? (
                          <a href={member.personalUrl} target="_blank" rel="noopener noreferrer">
                            {member.name}
                          </a>
                        ) : member.name}
                      </h3>
                      <p className="member-role-label">{member.role}</p>
                      {member.researchInterests.length > 0 && (
                        <div className="tag-list">
                          {member.researchInterests.map((interest) => (
                            <span key={interest} className="tag">{interest}</span>
                          ))}
                        </div>
                      )}
                      {member.body && (
                        <div className="prose prose-sm member-bio">
                          <ReactMarkdown>{member.body}</ReactMarkdown>
                        </div>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="member-email">
                          {member.email}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

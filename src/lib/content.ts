import type { Paper, SeniorProject, Member, LabInfo } from '../types/content';

function stripQuotes(s: string) {
  return s.replace(/^["']|["']$/g, '').trim();
}

function coerce(val: string): string | number | boolean {
  if (val === 'true') return true;
  if (val === 'false') return false;
  const n = Number(val);
  if (!isNaN(n) && val.trim() !== '') return n;
  return stripQuotes(val);
}

// Parses YAML frontmatter without any Node.js deps.
// Supports: top-level scalars, lists (- item), nested objects (key: value).
function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };

  const lines = match[1].split('\n');
  const body = match[2].trim();
  const data: Record<string, unknown> = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const topKV = line.match(/^([a-zA-Z][a-zA-Z0-9_]*): ?(.*)$/);

    if (!topKV) { i++; continue; }

    const key = topKV[1];
    const val = topKV[2].trim();

    if (val !== '') {
      data[key] = coerce(val);
      i++;
      continue;
    }

    // Empty value — collect indented children
    i++;
    const listItems: string[] = [];
    const objEntries: Record<string, string> = {};

    while (i < lines.length && lines[i].startsWith('  ')) {
      const child = lines[i];
      const listMatch = child.match(/^  - (.*)$/);
      const kvMatch = child.match(/^  ([a-zA-Z][a-zA-Z0-9_]*): ?(.*)$/);
      if (listMatch) listItems.push(stripQuotes(listMatch[1]));
      else if (kvMatch) objEntries[kvMatch[1]] = stripQuotes(kvMatch[2]);
      i++;
    }

    if (listItems.length > 0) data[key] = listItems;
    else if (Object.keys(objEntries).length > 0) data[key] = objEntries;
    else data[key] = '';
  }

  return { data, body };
}

function parse<T>(raw: string): { data: T; body: string } {
  const { data, body } = parseFrontmatter(raw);
  return { data: data as T, body };
}

function slug(path: string) {
  return path.split('/').pop()?.replace('.md', '') ?? '';
}

const paperFiles = import.meta.glob<string>('../content/papers/*.md', {
  query: '?raw', import: 'default', eager: true,
});

const projectFiles = import.meta.glob<string>('../content/projects/*.md', {
  query: '?raw', import: 'default', eager: true,
});

const memberFiles = import.meta.glob<string>('../content/members/*.md', {
  query: '?raw', import: 'default', eager: true,
});

const aboutFile = import.meta.glob<string>('../content/about/index.md', {
  query: '?raw', import: 'default', eager: true,
});

export const papers: Paper[] = Object.entries(paperFiles)
  .map(([path, raw]) => {
    const { data, body } = parse<Omit<Paper, 'body' | 'slug'>>(raw);
    return { ...data, body, slug: slug(path) };
  })
  .sort((a, b) => b.year - a.year);

export const projects: SeniorProject[] = Object.entries(projectFiles)
  .map(([path, raw]) => {
    const { data, body } = parse<Omit<SeniorProject, 'body' | 'slug'>>(raw);
    return { ...data, body, slug: slug(path) };
  })
  .sort((a, b) => b.academicYear - a.academicYear);

const roleOrder: Member['role'][] = ['Faculty', 'Researcher', 'PhD', 'Master', 'Undergraduate', 'Alumni'];

export const members: Member[] = Object.entries(memberFiles)
  .map(([path, raw]) => {
    const { data, body } = parse<Omit<Member, 'body' | 'slug'>>(raw);
    return { ...data, body, slug: slug(path) };
  })
  .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

const aboutRaw = Object.values(aboutFile)[0] ?? '';
const { data: aboutData, body: aboutBody } = parse<Omit<LabInfo, 'body'>>(aboutRaw);
export const labInfo: LabInfo = { ...aboutData, body: aboutBody };

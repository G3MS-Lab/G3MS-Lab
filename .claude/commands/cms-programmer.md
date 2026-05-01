# CMS Programmer

You are acting as the **CMS Programmer** for the G3MS Lab website.

The "CMS" for this project is **file-based**: all content lives as Markdown files with YAML frontmatter under `content/`. Non-technical lab members edit these files to update the site; no database or external CMS service is used.

## Tech stack

- **React** (Vite)
- **gray-matter** — parse YAML frontmatter from `.md` files
- **react-markdown** / **remark** — render Markdown body in components
- TypeScript types mirror the frontmatter schemas

## Content directory layout

```
content/
  about/index.md
  papers/YEAR-slug.md
  projects/YEAR-slug.md
  members/firstname-lastname.md
```

## Frontmatter schemas (authoritative)

```ts
type Paper = {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  url?: string;
  tags: string[];
  // body: Markdown string (abstract)
};

type SeniorProject = {
  title: string;
  academicYear: number;
  students: string[];
  advisor: string;
  demoUrl?: string;
  reportUrl?: string;
  // body: Markdown string (description)
};

type Member = {
  name: string;
  role: 'Faculty' | 'Researcher' | 'PhD' | 'Master' | 'Undergraduate' | 'Alumni';
  researchInterests: string[];
  email?: string;
  photo?: string;
  personalUrl?: string;
  // body: Markdown string (bio, optional)
};

type LabInfo = {
  researchAreas: string[];
  contactEmail: string;
  address: string;
  socialLinks: Record<string, string>;
  // body: Markdown string (lab description)
};
```

## Content loading utilities

Implement reusable loaders (e.g. `src/lib/content.ts`) that:
1. Import all `.md` files in a directory using `import.meta.glob` (Vite).
2. Parse each file with `gray-matter`.
3. Return typed arrays matching the schemas above.

Example pattern:
```ts
import matter from 'gray-matter';

const files = import.meta.glob('/content/papers/*.md', { as: 'raw', eager: true });

export const papers: Paper[] = Object.values(files).map((raw) => {
  const { data, content } = matter(raw as string);
  return { ...(data as Paper), body: content };
});
```

## Schema change rules

- Adding an optional field: safe — add it to the TypeScript type and update components as needed.
- Adding a required field: write a migration script that adds the field (with a sensible default) to every existing `.md` file, then update the type.
- Renaming a field: treat as breaking — migrate all files and update all consumers atomically.
- Never remove a field without first checking that no existing `.md` file uses it.

## What to do with `$ARGUMENTS`

- Schema change request → implement with backward compatibility; write migration if needed.
- New content type → scaffold directory, TypeScript type, loader utility, and an example `.md` file.
- Existing loader/utility to review → check type safety, error handling for malformed frontmatter, and consistency with schemas above.

$ARGUMENTS

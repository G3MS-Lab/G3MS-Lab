# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official website for **G3MS Lab** (Geometric, Game and Graphics Modeling and Simulation Laboratory) at the Department of Computer Engineering (CPE), KMUTT. The site presents the lab's identity, research output, and members to the public.

The lab's primary research theme is **point cloud processing** — 3D data represented as sets of points in space. This theme must be visually reflected throughout the site.

### Main Page Visual Identity

The homepage hero section features an **interactive point cloud animation** — a real-time 3D visualization of floating/moving points that embodies the lab's research identity. This is a core design element, not decorative. Use WebGL-based rendering (Three.js or a raw WebGL shader) for performance. The animation should:
- Render a dynamic point cloud that moves or rotates in 3D space
- Be lightweight enough not to block page interaction
- Degrade gracefully (static fallback image) if WebGL is unavailable

### Main Content Areas

- **About the Lab** — mission, vision, and research focus areas (point cloud, geometry, graphics, simulation)
- **Papers** — published research and academic publications
- **Senior Projects** — undergraduate final-year projects supervised by the lab
- **Lab Members** — faculty, researchers, and students

---

## Tech Stack

- **Framework:** React (Vite or Create React App)
- **Content:** Markdown files with YAML frontmatter — all site content is authored as `.md` files and rendered in React components
- **3D / WebGL:** Three.js for the point cloud hero animation
- **Routing:** React Router (one route per content section)

### Common Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview production build locally
```

---

## Content Architecture

All content lives as Markdown files under `src/content/` (or a top-level `content/`), organised by entity type:

```
content/
  about/
    index.md          # lab description, research areas
  papers/
    2024-paper-title.md
  projects/
    2567-project-title.md
  members/
    firstname-lastname.md
```

Each file uses **YAML frontmatter** for structured fields, and the Markdown body for long-form prose (abstract, description, biography, etc.). React components parse the frontmatter with a library such as `gray-matter` or `vite-plugin-md` and render the body with `react-markdown` or `remark`.

### Frontmatter Schemas

**Paper** (`content/papers/*.md`)
```yaml
---
title: ""
authors: []
venue: ""
year: 2024
doi: ""          # optional
url: ""          # optional
tags: []
---
Abstract or summary goes here in Markdown body.
```

**Senior Project** (`content/projects/*.md`)
```yaml
---
title: ""
academicYear: 2567
students: []
advisor: ""
demoUrl: ""      # optional
reportUrl: ""    # optional
---
Project description goes here in Markdown body.
```

**Member** (`content/members/*.md`)
```yaml
---
name: ""
role: Faculty     # Faculty | Researcher | PhD | Master | Undergraduate | Alumni
researchInterests: []
email: ""         # optional
photo: ""         # optional, path relative to public/
personalUrl: ""   # optional
---
Short bio goes here in Markdown body (optional).
```

**Lab Info** (`content/about/index.md`)
```yaml
---
researchAreas: []
contactEmail: ""
address: ""
socialLinks:
  github: ""
  facebook: ""
---
Lab description in Markdown body.
```

---

## Roles & Responsibilities

This project is maintained by contributors in three distinct roles. Claude should identify which role applies to the current task and behave accordingly. Each role has a corresponding slash command (`.claude/commands/`).

### 1. Content Creator — `/content-creator`

Responsible for writing and editing all human-readable text on the site.

- Author `.md` files following the frontmatter schemas above.
- Write in clear, academic-yet-approachable English (or Thai where applicable).
- Paper entries require all frontmatter fields; `doi`/`url` are optional but encouraged.

### 2. Web Developer (Frontend) — `/web-developer`

Responsible for UI, layout, styling, and client-side interactivity.

- Prioritize responsive design — the site must work well on both desktop and mobile.
- Keep UI clean and academic; point cloud visual motifs (scattered dots, depth cues) may appear as subtle accents.
- Component boundaries follow the content model: each section (About, Papers, Projects, Members) is its own route and page component.
- Parse Markdown content using `gray-matter` (frontmatter) and `react-markdown` (body rendering).
- Accessibility (semantic HTML, alt text, keyboard navigation) is required on all pages.

### 3. CMS Programmer — `/cms-programmer`

Responsible for the content pipeline that turns `.md` files into data consumed by React.

- Build and maintain the utilities that read, parse, and expose Markdown content to components.
- Any schema change to frontmatter must be reflected in the TypeScript types and in the corresponding React components.
- Schema changes must be backward-compatible or accompanied by a migration script that updates existing `.md` files.
- If a build-time content pipeline is added (e.g. Vite plugin, custom loader), document it here.

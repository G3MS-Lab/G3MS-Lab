export interface Paper {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  doi?: string;
  url?: string;
  tags: string[];
  body: string;
  slug: string;
}

export interface SeniorProject {
  title: string;
  academicYear: number;
  students: string[];
  advisor: string;
  demoUrl?: string;
  reportUrl?: string;
  body: string;
  slug: string;
}

export interface Member {
  name: string;
  role: 'Faculty' | 'Researcher' | 'PhD' | 'Master' | 'Undergraduate' | 'Alumni';
  researchInterests: string[];
  email?: string;
  photo?: string;
  personalUrl?: string;
  body: string;
  slug: string;
}

export interface LabInfo {
  researchAreas: string[];
  contactEmail: string;
  address: string;
  socialLinks: Record<string, string>;
  body: string;
}

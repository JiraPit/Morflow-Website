import { getEntry } from 'astro:content';

export interface Benefit {
  num: string;
  active: boolean;
  image: string;
  title: string;
  desc: string;
}

export interface Feature {
  step: number;
  label: string;
  desc: string;
  mock: string;
  srcset: string;
}

export interface Link {
  href: string;
  label: string;
  dropdown?: Link[];
}

export interface FooterColumn {
  title: string;
  links: Link[];
}

/** Typed accessor for one content group. Throws if the group is missing. */
export async function group<T>(id: string): Promise<T[]> {
  const entry = await getEntry('content', id);
  if (!entry) throw new Error(`content group "${id}" not found in src/content/content.json`);
  return entry.data.items as T[];
}

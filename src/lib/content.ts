import { getEntry } from 'astro:content';

export function withBase(path: string): string {
  if (!path) return path;
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('//') ||
    path.startsWith('#') ||
    path.startsWith('mailto:')
  ) {
    return path;
  }
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export function withBaseSrcset(srcset: string): string {
  if (!srcset) return srcset;
  return srcset
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      const [url, desc] = trimmed.split(/\s+/);
      const prefixed = withBase(url);
      return desc ? `${prefixed} ${desc}` : prefixed;
    })
    .join(', ');
}

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
  const items = entry.data.items as any[];
  return items.map((item) => {
    const res = { ...item };
    if (res.image) res.image = withBase(res.image);
    if (res.mock) res.mock = withBase(res.mock);
    if (res.srcset) res.srcset = withBaseSrcset(res.srcset);
    if (res.href) res.href = withBase(res.href);
    if (res.links) {
      res.links = res.links.map((l: any) => ({ ...l, href: withBase(l.href) }));
    }
    return res;
  }) as T[];
}

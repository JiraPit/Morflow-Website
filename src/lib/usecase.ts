import { withBase } from './content';
import { useCasePath, type UseCase } from '../content/usecases';

export interface Faq {
  q: string;
  a: string;
}

/**
 * The JSON-LD a use case page carries: the article itself, its breadcrumb
 * trail, and its questions and answers. Search engines and AI assistants use
 * these to understand what the page answers.
 */
export function useCaseJsonLd(meta: UseCase, site: URL, faq: Faq[], about: string[]): object[] {
  const url = new URL(withBase(useCasePath(meta.slug)), site).href;
  const org = { '@type': 'Organization', name: 'Morflow', url: site.href };
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: meta.title,
      description: meta.summary,
      url,
      datePublished: meta.published,
      dateModified: meta.updated,
      author: org,
      publisher: org,
      about,
      proficiencyLevel: 'Beginner',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: new URL(withBase('/'), site).href },
        { '@type': 'ListItem', position: 2, name: 'Use Cases', item: new URL(withBase('/usecases'), site).href },
        { '@type': 'ListItem', position: 3, name: meta.title, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ];
}

/** "November 21, 2026" for an ISO date. */
export const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

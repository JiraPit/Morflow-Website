/**
 * Every use case on /usecases. The index page lists them in this order, the
 * sitemap includes them, and each article reads its own entry for its title,
 * description and dates. Add a new use case here and as a page in
 * src/pages/usecases/<slug>.astro.
 */
export interface UseCase {
  /** URL segment: /usecases/<slug>. Never change it once published. */
  slug: string;
  /** The article's headline. */
  title: string;
  /** The shorter title search results show (about 60 characters with " | Morflow"). */
  seoTitle: string;
  /** One or two sentences for the card and the meta description (≤ 160 chars reads best). */
  summary: string;
  /** Short labels shown on the card: languages, frameworks, data. */
  tags: string[];
  /** Roughly how long the article takes to read. */
  minutes: number;
  /** ISO dates. */
  published: string;
  updated: string;
}

export const useCases: UseCase[] = [
  {
    slug: 'train-in-python-run-in-flutter',
    title: 'Train an Image Model in Python and Run It in a Flutter App With the Same Preprocessing',
    seoTitle: 'Train in Python, Run in Flutter With the Same Preprocessing',
    summary:
      'Preprocess images with one Morflow pipeline while you train a PyTorch model and in your Flutter app, so the model sees the same numbers in both places.',
    tags: ['Python', 'PyTorch', 'Flutter', 'ONNX', 'Images'],
    minutes: 12,
    published: '2026-11-21',
    updated: '2026-11-21',
  },
  {
    slug: 'image-processing-flutter-react-native-on-device',
    title: 'On-Device Image Processing in Flutter and React Native, Without a Server',
    seoTitle: 'On-Device Image Processing in Flutter and React Native',
    summary:
      'Resize, enhance and sharpen photos inside your Flutter or React Native app with one Morflow pipeline, so photos never have to go to a server first.',
    tags: ['Flutter', 'React Native', 'Images', 'On-device', 'Offline'],
    minutes: 9,
    published: '2026-11-21',
    updated: '2026-11-21',
  },
  {
    slug: 'audio-processing-nodejs',
    title: 'High-Performance Audio Processing in Node.js',
    seoTitle: 'High-Performance Audio Processing in Node.js',
    summary:
      'Remove hum and background noise, even out the volume and resample WAV files in Node.js with one Morflow pipeline, in a batch script and an Express endpoint.',
    tags: ['Node.js', 'Audio', 'Express', 'WAV', 'Batch processing'],
    minutes: 10,
    published: '2026-11-21',
    updated: '2026-11-21',
  },
];

export const useCasePath = (slug: string) => `/usecases/${slug}/`;

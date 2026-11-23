/**
 * Every language and framework Morflow runs in. The /languages page lists
 * them all, and the homepage shows the `featured` ones. `doc` is the anchor of
 * the language's section on /doc.
 */
export interface Language {
  name: string;
  /** File name in public/assets/languages. */
  image: string;
  /** What it's for, in one or two sentences. */
  summary: string;
  /** Kinds of projects it suits. */
  tags: string[];
  /** Where it runs. */
  platforms: string;
  /** How to add Morflow. */
  install: string;
  doc: string;
  featured: boolean;
}

export const languages: Language[] = [
  {
    name: 'Python',
    image: 'python.png',
    summary:
      'Prepare training data and serve models with the same pipelines. Pass NumPy arrays and raw bytes straight in, and pipelines run with the GIL released.',
    tags: ['AI/ML', 'Data Science', 'Servers'],
    platforms: 'Windows, macOS, Linux',
    install: 'pip install morflow',
    doc: 'exec-python',
    featured: true,
  },
  {
    name: 'Node.js',
    image: 'nodejs.png',
    summary:
      'Process images, audio and tensors in servers and scripts. Pipelines run on native threads, so the event loop stays free.',
    tags: ['Servers', 'Scripts'],
    platforms: 'Windows, macOS, Linux',
    install: 'npm install morflow',
    doc: 'exec-js',
    featured: true,
  },
  {
    name: 'Java',
    image: 'java.png',
    summary: 'Run pipelines from Java and other JVM languages, in backend services and desktop apps.',
    tags: ['Servers', 'Desktop Apps'],
    platforms: 'Windows, macOS, Linux',
    install: 'org.morflow:morflow:0.3.5',
    doc: 'exec-java',
    featured: false,
  },
  {
    name: 'Rust',
    image: 'rust.png',
    summary: 'Use the engine directly, with no bindings in between, in services, tools and desktop apps.',
    tags: ['Servers', 'Desktop Apps', 'CLI Tools'],
    platforms: 'Windows, macOS, Linux',
    install: 'cargo add morflow',
    doc: 'exec-rust',
    featured: true,
  },
  {
    name: 'Go',
    image: 'go.png',
    summary:
      'Run pipelines in services, command-line tools and desktop programs, with no cgo. CGO_ENABLED=0 builds and cross-compiling just work.',
    tags: ['Servers', 'CLI Tools', 'Desktop Apps'],
    platforms: 'Windows, macOS, Linux',
    install: 'go get github.com/JiraPit/Morflow/bindings/go',
    doc: 'exec-go',
    featured: false,
  },
  {
    name: 'Flutter',
    image: 'flutter.png',
    summary:
      'Ship pipelines inside mobile and desktop apps. Everything they need is bundled into the app, so they run on the device, offline.',
    tags: ['Mobile Apps', 'Desktop Apps'],
    platforms: 'Android, iOS, Windows, macOS, Linux',
    install: 'flutter pub add morflow',
    doc: 'exec-flutter',
    featured: true,
  },
  {
    name: 'React Native',
    image: 'react-native.png',
    summary:
      'Run pipelines in Android and iOS apps, including Expo development builds, with the same API as the Node.js package.',
    tags: ['Mobile Apps'],
    platforms: 'Android, iOS',
    install: 'npm install react-native-morflow',
    doc: 'exec-react-native',
    featured: true,
  },
  {
    name: 'Unity',
    image: 'unity.png',
    summary:
      'Use pipelines in games and apps, from the Editor to every build. Your .morf files are assets, and the engine ships inside the game.',
    tags: ['Games', 'Mobile Apps', 'Desktop Apps'],
    platforms: 'Android, iOS, Windows, macOS, Linux',
    install: 'https://github.com/JiraPit/Morflow.git?path=bindings/unity',
    doc: 'exec-unity',
    featured: true,
  },
];

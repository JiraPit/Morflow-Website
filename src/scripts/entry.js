import { init as nav } from './nav.js';
import { init as mobileNav } from './mobile-nav.js';
import { init as hero } from './hero.js';
import { init as whycards } from './why-cards.js';
import { init as delegation } from './delegation.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
nav(reduced);
mobileNav(reduced);
hero(reduced);
whycards(reduced);
delegation(reduced);

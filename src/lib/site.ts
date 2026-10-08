// Site model: loads the editable content (src/content) and the UI strings (src/i18n),
// and maps every page id to its URL in both languages.
import uiStrings from '../i18n/ui.json';
import settings from '../content/settings.json';

export type Lang = 'ar' | 'en';
export type Bi = { ar: string; en: string };
export const LANGS: Lang[] = ['ar', 'en'];

export interface SubPage { slug: string; title: Bi; icon: string; description: Bi; template: string }
export interface Section { id: string; order: number; title: Bi; icon: string; intro: Bi; photo: 'kafd' | 'kafdDusk' | 'riyadhDusk' | 'riyadhSkyline' | 'kafdSunset' | 'kafdTowers' | 'kingdom' | 'street'; pages: SubPage[]; blocks?: { title: Bi; text: Bi }[]; stats?: { value: string; label: Bi }[]; steps?: { title: Bi; text: Bi }[]; highlightsTitle?: Bi; highlights?: Bi[]; closing?: Bi }

const sectionFiles = import.meta.glob<Section>('../content/sections/*.json', { eager: true, import: 'default' });
export const SECTIONS: Section[] = Object.values(sectionFiles).sort((a, b) => a.order - b.order);
export const sectionById = (id: string) => SECTIONS.find((s) => s.id === id);

const serviceFiles = import.meta.glob<any>('../content/services/*.json', { eager: true, import: 'default' });
export const SERVICES: Record<string, any> = Object.fromEntries(Object.values(serviceFiles).map((s: any) => [s.id, s]));

export { settings };

/** Localized value of a {ar,en} field (falls back to Arabic). */
export const L = (v: any, lang: Lang): string => (v == null ? '' : typeof v === 'string' ? v : v[lang] || v.ar || '');

const ui: any = uiStrings;
/** UI string by key, with {t} substitution. */
export const t = (lang: Lang, key: string, vars: Record<string, string> = {}): any => {
  const v = ui[key]?.[lang];
  if (v === undefined) throw new Error(`Missing UI string: ${key}`);
  return typeof v === 'string' ? v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '') : v;
};

/** Extra (non-section) pages: id -> [path, section it belongs to]. */
const EXTRA: Record<string, [string, string | null]> = {
  services: ['services', null],
  contact: ['contact', null],
  'events-register': ['events/register', 'events'],
  'training-register': ['training/register', 'training'],
  thanks: ['thanks', null],
  privacy: ['privacy', null],
  terms: ['terms', null],
};

export interface Route {
  id: string;
  kind: 'home' | 'section' | 'page' | 'extra';
  path: string; // without language prefix, no leading/trailing slash ('' = intro)
  section?: Section;
  page?: SubPage;
}

export function allRoutes(): Route[] {
  const r: Route[] = [{ id: 'home', kind: 'home', path: 'home' }];
  for (const s of SECTIONS) {
    r.push({ id: s.id, kind: 'section', path: s.id, section: s });
    for (const p of s.pages) r.push({ id: `${s.id}-${p.slug}`, kind: 'page', path: `${s.id}/${p.slug}`, section: s, page: p });
  }
  for (const [id, [path, sec]] of Object.entries(EXTRA)) r.push({ id, kind: 'extra', path, section: sec ? sectionById(sec) : undefined });
  return r;
}
const ROUTES = allRoutes();
export const routeById = (id: string) => ROUTES.find((r) => r.id === id);

/** URL of a page id in a language. 'intro' is the opening page at the root. */
export function href(lang: Lang, id: string): string {
  const prefix = lang === 'en' ? '/en' : '';
  if (id === 'intro') return `${prefix}/`;
  const r = routeById(id);
  if (!r) throw new Error(`Unknown page id: ${id}`);
  return `${prefix}/${r.path}/`;
}

export const otherLang = (lang: Lang): Lang => (lang === 'ar' ? 'en' : 'ar');
export const dirOf = (lang: Lang) => (lang === 'ar' ? 'rtl' : 'ltr');
/** Arrow that points "forward" in the reading direction. */
export const arrowIcon = (lang: Lang) => (lang === 'ar' ? 'arrow-left' : 'arrow-right');

export const PHOTO_POS: Record<string, string> = { kafd: '50% 66%', kafdDusk: '30% 92%', riyadhDusk: '50% 40%', riyadhSkyline: '50% 45%', kafdSunset: '50% 25%', kafdTowers: '50% 60%', kingdom: '50% 78%', street: '50% 50%' };

/** Title + description for a route (used for <title>, meta and Open Graph). */
export function routeMeta(lang: Lang, r: Route): { title: string; description: string } {
  if (r.kind === 'section') return { title: L(r.section!.title, lang), description: L(r.section!.intro, lang) };
  if (r.kind === 'page') return { title: L(r.page!.title, lang), description: L(r.page!.description, lang) };
  switch (r.id) {
    case 'services': return { title: t(lang, 'services'), description: t(lang, 'servicesDesc') };
    case 'contact': return { title: t(lang, 'contact'), description: t(lang, 'contactDesc') };
    case 'events-register': return { title: t(lang, 'eventReg'), description: t(lang, 'eventRegDesc') };
    case 'training-register': return { title: t(lang, 'programReg'), description: t(lang, 'programRegDesc') };
    case 'thanks': return { title: t(lang, 'thanks'), description: t(lang, 'thanksDesc') };
    case 'privacy': return { title: t(lang, 'privacy'), description: L(settings.privacy, lang) };
    case 'terms': return { title: t(lang, 'terms'), description: L(settings.terms, lang) };
  }
  return { title: t(lang, 'home'), description: '' };
}

/** "05" + month name for event date chips. */
export function dateChip(lang: Lang, iso: string) {
  const [, m, d] = iso.split('-');
  return { day: d.padStart(2, '0'), month: t(lang, 'monthsShort')[Number(m) - 1] as string };
}

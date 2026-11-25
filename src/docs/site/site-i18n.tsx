import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { LocaleProvider, directionOf, localeNames } from '@/lib/i18n';
import type { ShippedLocale } from '@/lib/i18n';

/**
 * The docs site's own language layer. It sits on the library's
 * `LocaleProvider` (so every component on every page speaks the chosen
 * language) and adds the site's chrome words on top. The reference prose
 * — the Component Book, the props tables, the FAQs — stays English: it is
 * the source of truth, and a machine-translated spec is a second spec.
 * `lang` and `dir` are written on <html>, so the whole document mirrors.
 */

interface SiteStrings {
  introduction: string;
  foundations: string;
  components: string;
  blocks: string;
  templates: string;
  playground: string;
  aiReady: string;
  roadmap: string;
  all: string;
  dark: string;
  light: string;
  search: string;
  language: string;
  loadingPage: string;
  designSystem: string;
  proseNote: string;
}

const site: Record<ShippedLocale, SiteStrings> = {
  en: {
    introduction: 'Introduction',
    foundations: 'Foundations',
    components: 'Components',
    blocks: 'Blocks',
    templates: 'Templates',
    playground: 'Playground',
    aiReady: 'AI-ready',
    roadmap: 'Roadmap',
    all: 'ALL',
    dark: 'DARK',
    light: 'LIGHT',
    search: 'SEARCH',
    language: 'Language',
    loadingPage: 'Loading the page…',
    designSystem: 'Design System',
    proseNote: '',
  },
  fr: {
    introduction: 'Introduction',
    foundations: 'Fondations',
    components: 'Composants',
    blocks: 'Blocs',
    templates: 'Modèles',
    playground: 'Atelier',
    aiReady: 'Pour l’IA',
    roadmap: 'Feuille de route',
    all: 'TOUS',
    dark: 'SOMBRE',
    light: 'CLAIR',
    search: 'RECHERCHER',
    language: 'Langue',
    loadingPage: 'Chargement de la page…',
    designSystem: 'Système de design',
    proseNote: 'La documentation de référence reste en anglais, langue source. Les composants et l’interface sont traduits.',
  },
  ar: {
    introduction: 'مقدمة',
    foundations: 'الأسس',
    components: 'المكونات',
    blocks: 'الكتل',
    templates: 'القوالب',
    playground: 'منصة التجربة',
    aiReady: 'جاهز للذكاء الاصطناعي',
    roadmap: 'خارطة الطريق',
    all: 'الكل',
    dark: 'داكن',
    light: 'فاتح',
    search: 'بحث',
    language: 'اللغة',
    loadingPage: 'جارٍ تحميل الصفحة…',
    designSystem: 'نظام التصميم',
    proseNote: 'يبقى التوثيق المرجعي باللغة الإنجليزية، لغة المصدر. المكونات والواجهة مترجمة.',
  },
  so: {
    introduction: 'Hordhac',
    foundations: 'Aasaaska',
    components: 'Qaybaha',
    blocks: 'Baloogyada',
    templates: 'Qaababka',
    playground: 'Goobta tijaabada',
    aiReady: 'Diyaar u ah AI',
    roadmap: 'Khariidadda',
    all: 'DHAMMAAN',
    dark: 'MUGDI',
    light: 'IFTIIN',
    search: 'RAADI',
    language: 'Luqadda',
    loadingPage: 'Bogga waa la soo rarayaa…',
    designSystem: 'Nidaamka naqshadda',
    proseNote: 'Dukumentiyada tixraaca waxay ku qoran yihiin Ingiriis, luqadda asalka ah. Qaybaha iyo interface-ka waa la turjumay.',
  },
};

interface SiteLocaleValue {
  locale: ShippedLocale;
  setLocale: (l: ShippedLocale) => void;
  s: SiteStrings;
}

const Ctx = createContext<SiteLocaleValue>({ locale: 'en', setLocale: () => {}, s: site.en });

export const siteLocales = Object.keys(localeNames) as ShippedLocale[];

function initial(): ShippedLocale {
  try {
    const saved = localStorage.getItem('sv-locale') as ShippedLocale | null;
    if (saved && saved in site) return saved;
  } catch {
    /* storage blocked: fall through to the default */
  }
  return 'en';
}

export function SiteLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<ShippedLocale>(initial);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = directionOf(locale);
    try {
      localStorage.setItem('sv-locale', locale);
    } catch {
      /* a preference that cannot persist still applies for the session */
    }
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, s: site[locale] }), [locale]);
  return (
    <Ctx.Provider value={value}>
      <LocaleProvider locale={locale} wrap={false}>
        {children}
      </LocaleProvider>
    </Ctx.Provider>
  );
}

export function useSiteLocale() {
  return useContext(Ctx);
}

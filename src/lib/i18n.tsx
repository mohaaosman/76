import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

/**
 * 76° · the language layer (v0.10).
 *
 * The system has always had copy rules (A3) and never had a way to say them
 * in more than one language. Every component carried its built-in words as
 * English literals — "Clear all", "Close Purchase order", "Digit 3 of 6" —
 * so a Somali or Arabic product either forked the component or shipped an
 * English control on a translated page. This module is the one place those
 * words live.
 *
 * **Three rules, and they are the whole design.**
 *
 * 1. **No provider, no change.** Without a `<LocaleProvider>` every component
 *    renders exactly the English it rendered before. Adoption is opt-in and
 *    nothing breaks on upgrade — the same posture `data-mode` and
 *    `data-motion` take.
 * 2. **The component still never formats a figure (C9).** Translation covers
 *    the system's OWN words. The caller's numbers, dates and currency are the
 *    caller's — `useFormat()` below is a caller-layer helper, and no
 *    component calls it.
 * 3. **Direction follows language, at the nearest declaration.** The
 *    provider writes `lang` and `dir` on its wrapper, and every component
 *    stylesheet uses logical properties, so an Arabic subtree mirrors without
 *    a single component branching on direction. Arrow-key handlers read
 *    `useDirection()` so ← still means "back" when "back" is on the right.
 *
 * Shipped catalogs: English (`en`, the source), French (`fr`), Arabic (`ar`,
 * RTL) and Somali (`so`). Pass `messages` to override any key, or to bring a
 * whole catalog of your own — the type makes a missing key a compile error.
 * Machine-drafted catalogs should be reviewed by a native speaker before a
 * product ships them; the English is the source of truth.
 */

export type Direction = 'ltr' | 'rtl';

export interface SvMessages {
  /* chrome */
  skipToContent: string;
  menu: string;
  primaryNav: string;
  sectionNav: string;
  footerNav: string;
  /* generic verbs */
  working: string;
  close: (name: string) => string;
  dismiss: (name: string) => string;
  clear: string;
  clearAll: string;
  clearField: (label: string) => string;
  copy: string;
  copied: string;
  copiedAnnounce: string;
  remove: (name: string) => string;
  /* search & choice */
  search: string;
  searchEllipsis: string;
  results: string;
  typeToSearch: string;
  noMatches: string;
  noActions: string;
  moreWaysTo: (label: string) => string;
  continueWith: string;
  filters: string;
  /* table */
  previous: string;
  next: string;
  rangeOf: (from: number, to: number, of: number) => string;
  rowUnsaved: string;
  rowSaving: string;
  rowFailed: string;
  /* lifecycle words (C5 — every coloured dot says itself in words) */
  toneDone: string;
  tonePending: string;
  toneBad: string;
  stepDone: string;
  stepCurrent: string;
  stepUpcoming: string;
  stepOf: (i: number, n: number) => string;
  /* forms */
  fieldsNeedAttention: (n: number) => string;
  dropFiles: string;
  dropFile: string;
  chooseFiles: string;
  chooseFile: string;
  uploading: (name: string) => string;
  increase: (label: string) => string;
  decrease: (label: string) => string;
  presets: (label: string) => string;
  startDate: (label: string) => string;
  endDate: (label: string) => string;
  rangeInverted: string;
  digitOf: (i: number, n: number) => string;
  characterOf: (i: number, n: number) => string;
  /* display */
  more: (n: number) => string;
  /** "3 invoices selected". `noun` is already in the right number form. */
  nSelected: (n: number, noun?: string) => string;
  selectAll: string;
  selectRow: (label: string) => string;
  notifications: string;
  chartColumns: string;
  codeLabel: (label?: string) => string;
  loading: string;
  total: string;
  noValue: string;
  closeWord: string;
  removeWord: string;
  uploaded: string;
  noResultsFor: (q: string) => string;
  daySpan: (n: number, endsToday: boolean, end: string) => string;
  /* 0.7 – 0.9 widgets */
  scanReady: string;
  scanOk: string;
  scanBad: string;
  scanPending: string;
  posting: string;
  scanResolved: (id: string) => string;
  post: (n: number) => string;
  jobRunning: string;
  jobDone: string;
  jobFailed: string;
  jobQueued: string;
  openResult: string;
  expand: (label: string) => string;
  collapse: (label: string) => string;
  inbound: string;
  outbound: string;
  internalNote: string;
  messageSending: string;
  messageFailed: string;
  savedViewDrift: (name: string) => string;
  saveView: string;
  resetView: string;
  against: (baseline: string) => string;
  up: string;
  down: string;
}

const en: SvMessages = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  primaryNav: 'Primary',
  sectionNav: 'Section',
  footerNav: 'Footer',
  working: 'Working…',
  close: (name) => `Close ${name}`,
  dismiss: (name) => `Dismiss: ${name}`,
  clear: 'Clear',
  clearAll: 'Clear all',
  clearField: (label) => `Clear ${label}`,
  copy: 'Copy',
  copied: 'Copied',
  copiedAnnounce: 'Copied to clipboard',
  remove: (name) => `Remove ${name}`,
  search: 'Search',
  searchEllipsis: 'Search…',
  results: 'Results',
  typeToSearch: 'Type to search',
  noMatches: 'No matching options.',
  noActions: 'No actions available.',
  moreWaysTo: (label) => `More ways to ${label.toLowerCase()}`,
  continueWith: 'Continue with',
  filters: 'Filters',
  previous: 'Previous',
  next: 'Next',
  rangeOf: (from, to, of) => `${from}–${to} OF ${of}`,
  rowUnsaved: 'Not saved',
  rowSaving: 'Saving',
  rowFailed: 'Not saved — retry',
  toneDone: 'Completed',
  tonePending: 'Not started',
  toneBad: 'Failed',
  stepDone: 'completed',
  stepCurrent: 'current step',
  stepUpcoming: 'not started',
  stepOf: (i, n) => `Step ${i} of ${n}`,
  fieldsNeedAttention: (n) => (n === 1 ? '1 field needs attention' : `${n} fields need attention`),
  dropFiles: 'Drop files here, or choose them from your computer.',
  dropFile: 'Drop a file here, or choose one from your computer.',
  chooseFiles: 'Choose files',
  chooseFile: 'Choose file',
  uploading: (name) => `Uploading ${name}`,
  increase: (label) => `Increase ${label.toLowerCase()}`,
  decrease: (label) => `Decrease ${label.toLowerCase()}`,
  presets: (label) => `${label} presets`,
  startDate: (label) => `${label}, start date`,
  endDate: (label) => `${label}, end date`,
  rangeInverted: 'The start date is after the end date. Move the start date back.',
  digitOf: (i, n) => `Digit ${i} of ${n}`,
  characterOf: (i, n) => `Character ${i} of ${n}`,
  more: (n) => `${n} more`,
  nSelected: (n, noun) => (noun ? `${n} ${noun} selected` : `${n} selected`),
  selectAll: 'Select all rows',
  selectRow: (label) => `Select ${label}`,
  notifications: 'Notifications',
  chartColumns: 'Chart columns',
  codeLabel: (label) => (label ? `Code, ${label}` : 'Code'),
  loading: 'Loading…',
  total: 'Total',
  noValue: 'No value',
  closeWord: 'Close',
  removeWord: 'Remove',
  uploaded: 'Uploaded',
  noResultsFor: (q) => `No results for “${q}”. Try a component or page name.`,
  daySpan: (n, today, end) => `${n} ${n === 1 ? 'day' : 'days'} · ends ${today ? 'today' : end}`,
  scanReady: 'Ready to scan',
  scanOk: 'Matched',
  scanBad: 'Not matched',
  scanPending: 'Checking',
  posting: 'Posting…',
  scanResolved: (id) => `Last scan: ${id}`,
  post: (n) => (n === 1 ? 'Post 1 line' : `Post ${n} lines`),
  jobRunning: 'Running',
  jobDone: 'Finished',
  jobFailed: 'Failed',
  jobQueued: 'Queued',
  openResult: 'Open result',
  expand: (label) => `Expand ${label}`,
  collapse: (label) => `Collapse ${label}`,
  inbound: 'Received',
  outbound: 'Sent',
  internalNote: 'Internal note',
  messageSending: 'Sending',
  messageFailed: 'Not sent',
  savedViewDrift: (name) => `Changed from the saved view “${name}”`,
  saveView: 'Save view',
  resetView: 'Reset',
  against: (baseline) => `vs ${baseline}`,
  up: 'up',
  down: 'down',
};

const fr: SvMessages = {
  skipToContent: 'Aller au contenu',
  menu: 'Menu',
  primaryNav: 'Principale',
  sectionNav: 'Section',
  footerNav: 'Pied de page',
  working: 'En cours…',
  close: (name) => `Fermer ${name}`,
  dismiss: (name) => `Ignorer : ${name}`,
  clear: 'Effacer',
  clearAll: 'Tout effacer',
  clearField: (label) => `Effacer ${label}`,
  copy: 'Copier',
  copied: 'Copié',
  copiedAnnounce: 'Copié dans le presse-papiers',
  remove: (name) => `Retirer ${name}`,
  search: 'Rechercher',
  searchEllipsis: 'Rechercher…',
  results: 'Résultats',
  typeToSearch: 'Saisir pour rechercher',
  noMatches: 'Aucune option correspondante.',
  noActions: 'Aucune action disponible.',
  moreWaysTo: (label) => `Autres façons de ${label.toLowerCase()}`,
  continueWith: 'Continuer avec',
  filters: 'Filtres',
  previous: 'Précédent',
  next: 'Suivant',
  rangeOf: (from, to, of) => `${from}–${to} SUR ${of}`,
  rowUnsaved: 'Non enregistré',
  rowSaving: 'Enregistrement',
  rowFailed: 'Non enregistré — réessayer',
  toneDone: 'Terminé',
  tonePending: 'Non commencé',
  toneBad: 'Échoué',
  stepDone: 'terminée',
  stepCurrent: 'étape en cours',
  stepUpcoming: 'non commencée',
  stepOf: (i, n) => `Étape ${i} sur ${n}`,
  fieldsNeedAttention: (n) =>
    n === 1 ? '1 champ à corriger' : `${n} champs à corriger`,
  dropFiles: 'Déposez des fichiers ici, ou choisissez-les sur votre ordinateur.',
  dropFile: 'Déposez un fichier ici, ou choisissez-en un sur votre ordinateur.',
  chooseFiles: 'Choisir des fichiers',
  chooseFile: 'Choisir un fichier',
  uploading: (name) => `Envoi de ${name}`,
  increase: (label) => `Augmenter ${label.toLowerCase()}`,
  decrease: (label) => `Diminuer ${label.toLowerCase()}`,
  presets: (label) => `${label}, préréglages`,
  startDate: (label) => `${label}, date de début`,
  endDate: (label) => `${label}, date de fin`,
  rangeInverted: 'La date de début est après la date de fin. Avancez la date de début.',
  digitOf: (i, n) => `Chiffre ${i} sur ${n}`,
  characterOf: (i, n) => `Caractère ${i} sur ${n}`,
  more: (n) => `${n} de plus`,
  nSelected: (n, noun) => (noun ? `${n} ${noun} sélectionné(e)s` : `${n} sélectionné(e)s`),
  selectAll: 'Sélectionner toutes les lignes',
  selectRow: (label) => `Sélectionner ${label}`,
  notifications: 'Notifications',
  chartColumns: 'Colonnes du graphique',
  codeLabel: (label) => (label ? `Code, ${label}` : 'Code'),
  loading: 'Chargement…',
  total: 'Total',
  noValue: 'Aucune valeur',
  closeWord: 'Fermer',
  removeWord: 'Retirer',
  uploaded: 'Envoyé',
  noResultsFor: (q) => `Aucun résultat pour « ${q} ». Essayez un nom de composant ou de page.`,
  daySpan: (n, today, end) => `${n} ${n === 1 ? 'jour' : 'jours'} · se termine ${today ? 'aujourd’hui' : `le ${end}`}`,
  scanReady: 'Prêt à scanner',
  scanOk: 'Reconnu',
  scanBad: 'Non reconnu',
  scanPending: 'Vérification',
  posting: 'Validation…',
  scanResolved: (id) => `Dernier scan : ${id}`,
  post: (n) => (n === 1 ? 'Valider 1 ligne' : `Valider ${n} lignes`),
  jobRunning: 'En cours',
  jobDone: 'Terminé',
  jobFailed: 'Échoué',
  jobQueued: 'En attente',
  openResult: 'Ouvrir le résultat',
  expand: (label) => `Déplier ${label}`,
  collapse: (label) => `Replier ${label}`,
  inbound: 'Reçu',
  outbound: 'Envoyé',
  internalNote: 'Note interne',
  messageSending: 'Envoi',
  messageFailed: 'Non envoyé',
  savedViewDrift: (name) => `Modifiée par rapport à la vue « ${name} »`,
  saveView: 'Enregistrer la vue',
  resetView: 'Réinitialiser',
  against: (baseline) => `par rapport à ${baseline}`,
  up: 'en hausse de',
  down: 'en baisse de',
};

/* Arabic plurals have six CLDR categories; the counting strings below use
   Intl.PluralRules rather than an English-shaped `n === 1` test. */
const arPlural = new Intl.PluralRules('ar');
function arCount(n: number, forms: Record<Intl.LDMLPluralRule, string>) {
  return forms[arPlural.select(n)].replace('#', String(n));
}

const ar: SvMessages = {
  skipToContent: 'انتقل إلى المحتوى',
  menu: 'القائمة',
  primaryNav: 'الرئيسية',
  sectionNav: 'القسم',
  footerNav: 'التذييل',
  working: 'جارٍ التنفيذ…',
  close: (name) => `إغلاق ${name}`,
  dismiss: (name) => `تجاهل: ${name}`,
  clear: 'مسح',
  clearAll: 'مسح الكل',
  clearField: (label) => `مسح ${label}`,
  copy: 'نسخ',
  copied: 'تم النسخ',
  copiedAnnounce: 'تم النسخ إلى الحافظة',
  remove: (name) => `إزالة ${name}`,
  search: 'بحث',
  searchEllipsis: 'بحث…',
  results: 'النتائج',
  typeToSearch: 'اكتب للبحث',
  noMatches: 'لا توجد خيارات مطابقة.',
  noActions: 'لا توجد إجراءات متاحة.',
  moreWaysTo: (label) => `طرق أخرى لـ${label}`,
  continueWith: 'المتابعة باستخدام',
  filters: 'عوامل التصفية',
  previous: 'السابق',
  next: 'التالي',
  rangeOf: (from, to, of) => `${from}–${to} من ${of}`,
  rowUnsaved: 'غير محفوظ',
  rowSaving: 'جارٍ الحفظ',
  rowFailed: 'لم يُحفظ — أعد المحاولة',
  toneDone: 'مكتمل',
  tonePending: 'لم يبدأ',
  toneBad: 'فشل',
  stepDone: 'مكتملة',
  stepCurrent: 'الخطوة الحالية',
  stepUpcoming: 'لم تبدأ',
  stepOf: (i, n) => `الخطوة ${i} من ${n}`,
  fieldsNeedAttention: (n) =>
    arCount(n, {
      zero: 'لا توجد حقول تحتاج إلى تصحيح',
      one: 'حقل واحد يحتاج إلى تصحيح',
      two: 'حقلان يحتاجان إلى تصحيح',
      few: '# حقول تحتاج إلى تصحيح',
      many: '# حقلًا تحتاج إلى تصحيح',
      other: '# حقل تحتاج إلى تصحيح',
    }),
  dropFiles: 'أفلت الملفات هنا، أو اخترها من جهازك.',
  dropFile: 'أفلت ملفًا هنا، أو اختر ملفًا من جهازك.',
  chooseFiles: 'اختيار ملفات',
  chooseFile: 'اختيار ملف',
  uploading: (name) => `جارٍ رفع ${name}`,
  increase: (label) => `زيادة ${label}`,
  decrease: (label) => `إنقاص ${label}`,
  presets: (label) => `${label}، فترات جاهزة`,
  startDate: (label) => `${label}، تاريخ البدء`,
  endDate: (label) => `${label}، تاريخ الانتهاء`,
  rangeInverted: 'تاريخ البدء بعد تاريخ الانتهاء. قدّم تاريخ البدء.',
  digitOf: (i, n) => `الرقم ${i} من ${n}`,
  characterOf: (i, n) => `الحرف ${i} من ${n}`,
  more: (n) => `${n} آخرون`,
  nSelected: (n, noun) => (noun ? `تم تحديد ${n} ${noun}` : `تم تحديد ${n}`),
  selectAll: 'تحديد كل الصفوف',
  selectRow: (label) => `تحديد ${label}`,
  notifications: 'الإشعارات',
  chartColumns: 'أعمدة الرسم البياني',
  codeLabel: (label) => (label ? `شيفرة، ${label}` : 'شيفرة'),
  loading: 'جارٍ التحميل…',
  total: 'الإجمالي',
  noValue: 'لا توجد قيمة',
  closeWord: 'إغلاق',
  removeWord: 'إزالة',
  uploaded: 'تم الرفع',
  noResultsFor: (q) => `لا توجد نتائج لـ «${q}». جرّب اسم مكوّن أو صفحة.`,
  daySpan: (n, today, end) => `${n} يوم · ينتهي ${today ? 'اليوم' : end}`,
  scanReady: 'جاهز للمسح',
  scanOk: 'مطابق',
  scanBad: 'غير مطابق',
  scanPending: 'جارٍ التحقق',
  posting: 'جارٍ الترحيل…',
  scanResolved: (id) => `آخر مسح: ${id}`,
  post: (n) =>
    arCount(n, {
      zero: 'ترحيل',
      one: 'ترحيل سطر واحد',
      two: 'ترحيل سطرين',
      few: 'ترحيل # أسطر',
      many: 'ترحيل # سطرًا',
      other: 'ترحيل # سطر',
    }),
  jobRunning: 'قيد التشغيل',
  jobDone: 'انتهى',
  jobFailed: 'فشل',
  jobQueued: 'في الانتظار',
  openResult: 'فتح النتيجة',
  expand: (label) => `توسيع ${label}`,
  collapse: (label) => `طي ${label}`,
  inbound: 'مستلَمة',
  outbound: 'مرسَلة',
  internalNote: 'ملاحظة داخلية',
  messageSending: 'جارٍ الإرسال',
  messageFailed: 'لم يُرسَل',
  savedViewDrift: (name) => `تغيّر عن العرض المحفوظ «${name}»`,
  saveView: 'حفظ العرض',
  resetView: 'إعادة تعيين',
  against: (baseline) => `مقابل ${baseline}`,
  up: 'ارتفاع',
  down: 'انخفاض',
};

const so: SvMessages = {
  skipToContent: 'U gudub nuxurka',
  menu: 'Liiska',
  primaryNav: 'Ugu muhiimsan',
  sectionNav: 'Qaybta',
  footerNav: 'Cagta bogga',
  working: 'Waa la shaqeynayaa…',
  close: (name) => `Xir ${name}`,
  dismiss: (name) => `Iska dhaaf: ${name}`,
  clear: 'Tirtir',
  clearAll: 'Tirtir dhammaan',
  clearField: (label) => `Tirtir ${label}`,
  copy: 'Koobiyee',
  copied: 'Waa la koobiyeeyay',
  copiedAnnounce: 'Waxaa lagu koobiyeeyay sabuuradda',
  remove: (name) => `Ka saar ${name}`,
  search: 'Raadi',
  searchEllipsis: 'Raadi…',
  results: 'Natiijooyinka',
  typeToSearch: 'Qor si aad u raadiso',
  noMatches: 'Ma jiraan doorashooyin ku habboon.',
  noActions: 'Ma jiraan fal la heli karo.',
  moreWaysTo: (label) => `Habab kale oo loo ${label.toLowerCase()}`,
  continueWith: 'Ku sii wad',
  filters: 'Shaandheyaal',
  previous: 'Hore',
  next: 'Xiga',
  rangeOf: (from, to, of) => `${from}–${to} KA MID AH ${of}`,
  rowUnsaved: 'Lama kaydin',
  rowSaving: 'Waa la kaydinayaa',
  rowFailed: 'Lama kaydin — isku day mar kale',
  toneDone: 'La dhammeeyay',
  tonePending: 'Lama bilaabin',
  toneBad: 'Wuu fashilmay',
  stepDone: 'la dhammeeyay',
  stepCurrent: 'tallaabada hadda',
  stepUpcoming: 'lama bilaabin',
  stepOf: (i, n) => `Tallaabada ${i} ee ${n}`,
  fieldsNeedAttention: (n) =>
    n === 1 ? '1 goob ayaa u baahan sixid' : `${n} goobood ayaa u baahan sixid`,
  dropFiles: 'Halkan ku rid faylasha, ama ka dooro kombiyuutarkaaga.',
  dropFile: 'Halkan ku rid fayl, ama mid ka dooro kombiyuutarkaaga.',
  chooseFiles: 'Dooro faylal',
  chooseFile: 'Dooro fayl',
  uploading: (name) => `Waa la soo gelinayaa ${name}`,
  increase: (label) => `Kordhi ${label.toLowerCase()}`,
  decrease: (label) => `Yaree ${label.toLowerCase()}`,
  presets: (label) => `${label}, xilliyo diyaarsan`,
  startDate: (label) => `${label}, taariikhda bilowga`,
  endDate: (label) => `${label}, taariikhda dhammaadka`,
  rangeInverted: 'Taariikhda bilowgu waxay ka dambaysaa taariikhda dhammaadka. Hore u celi taariikhda bilowga.',
  digitOf: (i, n) => `Lambarka ${i} ee ${n}`,
  characterOf: (i, n) => `Xarafka ${i} ee ${n}`,
  more: (n) => `${n} kale`,
  nSelected: (n, noun) => (noun ? `${n} ${noun} ayaa la doortay` : `${n} ayaa la doortay`),
  selectAll: 'Dooro dhammaan safafka',
  selectRow: (label) => `Dooro ${label}`,
  notifications: 'Ogeysiisyada',
  chartColumns: 'Tiirarka jaantuska',
  codeLabel: (label) => (label ? `Kood, ${label}` : 'Kood'),
  loading: 'Waa la soo rarayaa…',
  total: 'Wadarta',
  noValue: 'Qiime ma leh',
  closeWord: 'Xir',
  removeWord: 'Ka saar',
  uploaded: 'Waa la soo geliyay',
  noResultsFor: (q) => `Natiijo looma helin “${q}”. Isku day magac qayb ama bog.`,
  daySpan: (n, today, end) => `${n} maalmood · wuxuu dhammaanayaa ${today ? 'maanta' : end}`,
  scanReady: 'Diyaar u ah iskaanka',
  scanOk: 'Waa la helay',
  scanBad: 'Lama helin',
  scanPending: 'Waa la hubinayaa',
  posting: 'Waa la gudbinayaa…',
  scanResolved: (id) => `Iskaankii ugu dambeeyay: ${id}`,
  post: (n) => (n === 1 ? 'Gudbi 1 saf' : `Gudbi ${n} saf`),
  jobRunning: 'Socda',
  jobDone: 'Dhammaaday',
  jobFailed: 'Fashilmay',
  jobQueued: 'Safka ku jira',
  openResult: 'Fur natiijada',
  expand: (label) => `Fidi ${label}`,
  collapse: (label) => `Isku duub ${label}`,
  inbound: 'La helay',
  outbound: 'La diray',
  internalNote: 'Qoraal gudaha ah',
  messageSending: 'Waa la dirayaa',
  messageFailed: 'Lama dirin',
  savedViewDrift: (name) => `Waa ka duwan yahay muuqaalka la kaydiyay “${name}”`,
  saveView: 'Kaydi muuqaalka',
  resetView: 'Dib u celi',
  against: (baseline) => `marka loo eego ${baseline}`,
  up: 'kor u kac',
  down: 'hoos u dhac',
};

export const catalogs = { en, fr, ar, so } as const;
export type ShippedLocale = keyof typeof catalogs;

/** Endonyms — a language is named in itself, so a reader who cannot read
    the current one can still find their own. */
export const localeNames: Record<ShippedLocale, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  so: 'Soomaali',
};

const RTL = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'ckb', 'yi', 'dv', 'sd', 'ug']);

/** The direction a BCP-47 tag is written in. Script subtags win: `ku-Arab` is RTL. */
export function directionOf(locale: string): Direction {
  const [lang, ...rest] = locale.toLowerCase().split('-');
  if (rest.includes('arab') || rest.includes('hebr')) return 'rtl';
  if (rest.includes('latn') || rest.includes('cyrl')) return 'ltr';
  return RTL.has(lang) ? 'rtl' : 'ltr';
}

function baseCatalog(locale: string): SvMessages {
  const lang = locale.toLowerCase().split('-')[0] as ShippedLocale;
  return catalogs[lang] ?? en;
}

interface LocaleValue {
  locale: string;
  dir: Direction;
  t: SvMessages;
}

const DEFAULT: LocaleValue = { locale: 'en', dir: 'ltr', t: en };
const LocaleContext = createContext<LocaleValue>(DEFAULT);

export interface LocaleProviderProps {
  /** A BCP-47 tag: "en", "fr-CA", "ar-EG", "so-SO". */
  locale: string;
  /** Overrides for any built-in string — or a full catalog for a locale 76° does not ship. */
  messages?: Partial<SvMessages>;
  /** Defaults to the language's own direction. Override only for a mixed-script product. */
  dir?: Direction;
  /**
   * The wrapper carries `lang` and `dir` so screen readers switch voice and
   * the browser mirrors layout. `display: contents`, so it adds no box. Pass
   * `false` when the provider sits under an element that already declares
   * both (the docs site sets them on <html>).
   */
  wrap?: boolean;
  children: ReactNode;
}

export function LocaleProvider({ locale, messages, dir, wrap = true, children }: LocaleProviderProps) {
  const value = useMemo<LocaleValue>(
    () => ({
      locale,
      dir: dir ?? directionOf(locale),
      t: messages ? { ...baseCatalog(locale), ...messages } : baseCatalog(locale),
    }),
    [locale, dir, messages],
  );
  return (
    <LocaleContext.Provider value={value}>
      {wrap ? (
        <div lang={locale} dir={value.dir} className="sv-locale">
          {children}
        </div>
      ) : (
        children
      )}
    </LocaleContext.Provider>
  );
}

/** The built-in words for the nearest locale. English with no provider. */
export function useStrings(): SvMessages {
  return useContext(LocaleContext).t;
}

export function useLocale(): { locale: string; dir: Direction } {
  const { locale, dir } = useContext(LocaleContext);
  return { locale, dir };
}

/**
 * Pick the noun form for a count in the nearest locale: `one` when the
 * language's plural rules say so, else `other`. Never `noun + 's'` — that
 * printed "statuss" for v0.4–v0.9.
 */
export function useNounFor(): (n: number, one: string, other?: string) => string {
  const { locale } = useContext(LocaleContext);
  return useMemo(() => {
    const rules = new Intl.PluralRules(locale);
    return (n, one, other) => (rules.select(n) === 'one' ? one : (other ?? one));
  }, [locale]);
}

/** 'rtl' or 'ltr' — for arrow-key handlers, never for styling (CSS uses logical properties). */
export function useDirection(): Direction {
  return useContext(LocaleContext).dir;
}

/**
 * Map a physical arrow key to a logical step: +1 forward, −1 back, 0 neither.
 * In RTL the reading order runs right-to-left, so ArrowLeft moves FORWARD.
 */
export function inlineStep(key: string, dir: Direction): -1 | 0 | 1 {
  if (key === 'ArrowRight') return dir === 'rtl' ? -1 : 1;
  if (key === 'ArrowLeft') return dir === 'rtl' ? 1 : -1;
  return 0;
}

/* ---------------------------------------------------------------------
   Caller-layer formatting. C9 stands: no component calls these. They exist
   so the CALLER can produce the pre-formatted strings components take, in
   the reader's locale, without every product re-deriving Intl options.
   --------------------------------------------------------------------- */

export interface Formatters {
  number: (n: number, digits?: number) => string;
  money: (n: number, currency: string, digits?: number) => string;
  percent: (ratio: number, digits?: number) => string;
  /** A signed change with the true minus sign (U+2212), never a hyphen. */
  delta: (ratio: number, digits?: number) => string;
  date: (d: Date | string, style?: 'short' | 'medium' | 'long') => string;
  dateTime: (d: Date | string) => string;
  time: (d: Date | string) => string;
  list: (items: string[]) => string;
}

const cache = new Map<string, Formatters>();

export function createFormatters(locale: string): Formatters {
  const hit = cache.get(locale);
  if (hit) return hit;
  const asDate = (d: Date | string) => (typeof d === 'string' ? new Date(d) : d);
  const nf = (o: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, o);
  const f: Formatters = {
    number: (n, digits = 0) => nf({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n),
    money: (n, currency, digits = 2) =>
      nf({ style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n),
    percent: (ratio, digits = 1) =>
      nf({ style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(ratio),
    delta: (ratio, digits = 1) =>
      nf({ style: 'percent', signDisplay: 'exceptZero', minimumFractionDigits: digits, maximumFractionDigits: digits })
        .format(ratio)
        .replace('-', '−'),
    date: (d, style = 'medium') => new Intl.DateTimeFormat(locale, { dateStyle: style }).format(asDate(d)),
    dateTime: (d) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(asDate(d)),
    time: (d) => new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(asDate(d)),
    list: (items) => new Intl.ListFormat(locale, { type: 'conjunction' }).format(items),
  };
  cache.set(locale, f);
  return f;
}

/** Formatters for the nearest locale — call it in the screen, pass strings down. */
export function useFormat(): Formatters {
  return createFormatters(useContext(LocaleContext).locale);
}

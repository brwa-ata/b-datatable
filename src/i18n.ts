// ============================================
// Built-in translations + text direction
// ============================================
// Kept dependency-free on purpose: a host app may run vue-i18n, its own
// solution, or nothing, and the table must not pull a second i18n runtime in.
//
// Resolution order for every component (BDatatable, BTable and the filters):
//   1. its own `locale` / `dir` / `messages` props
//   2. the nearest parent b-datatable component (BDatatable -> BTable -> filters)
//   3. the options given to `app.use(BDatatablePlugin, { locale, dir, messages })`
//   4. English, left-to-right

import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue'

const en = {
  refresh: 'Refresh',
  search: 'Search',
  print: 'Print',
  exportToExcel: 'Export to Excel',
  toggleColumns: 'Toggle Columns',
  restoreDefault: 'Restore Default',
  records: '{count} records',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  rowsPerPage: 'Rows per page',
  searchPlaceholder: 'Search...',
  noResults: 'No results found',
  noOptions: 'No options',
  clear: 'Clear',
  filter: 'Filter',
  filterType: 'Filter type',
  selected: '{count} selected',
  in: 'In',
  notIn: 'Not In',
  startWith: 'Start with',
  endWith: 'End with',
  contains: 'Contains',
  exact: 'Exact',
  except: 'Except',
  commaSeparate: 'Comma separate',
  equal: 'Equal',
  greaterThan: 'Greater than',
  greaterThanOrEqual: 'Greater than or Equal',
  lessThan: 'Less than',
  lessThanOrEqual: 'Less than or Equal',
  notEqual: 'Not Equal',
  datePlaceholder: 'Date...',
  expandRow: 'Expand row',
  selectAll: 'Select all',
  selectRow: 'Select row',
}

export type BMessageKey = keyof typeof en
export type BMessages = Record<BMessageKey, string>

// Kurdish (Sorani, Central Kurdish -- ISO 639-3 `ckb`)
const ckb: BMessages = {
  refresh: 'نوێکردنەوە',
  search: 'گەڕان',
  print: 'چاپکردن',
  exportToExcel: 'هەناردە بۆ ئێکسڵ',
  toggleColumns: 'پیشاندان/شاردنەوەی ستوونەکان',
  restoreDefault: 'گەڕاندنەوەی بنەڕەت',
  records: '{count} تۆمار',
  previousPage: 'پەڕەی پێشوو',
  nextPage: 'پەڕەی دواتر',
  rowsPerPage: 'ڕیز لە هەر پەڕەیەک',
  searchPlaceholder: 'گەڕان...',
  noResults: 'هیچ ئەنجامێک نەدۆزرایەوە',
  noOptions: 'هیچ هەڵبژاردەیەک نییە',
  clear: 'پاککردنەوە',
  filter: 'فلتەر',
  filterType: 'جۆری فلتەر',
  selected: '{count} هەڵبژێردراو',
  in: 'لەناو',
  notIn: 'لەناودا نەبێت',
  startWith: 'دەست پێدەکات بە',
  endWith: 'کۆتایی دێت بە',
  contains: 'لەخۆدەگرێت',
  exact: 'وەک خۆی',
  except: 'جگە لە',
  commaSeparate: 'جیاکراوە بە فاریزە',
  equal: 'یەکسان',
  greaterThan: 'گەورەتر لە',
  greaterThanOrEqual: 'گەورەتر یان یەکسان',
  lessThan: 'بچووکتر لە',
  lessThanOrEqual: 'بچووکتر یان یەکسان',
  notEqual: 'یەکسان نییە',
  datePlaceholder: 'بەروار...',
  expandRow: 'فراوانکردنی ڕیز',
  selectAll: 'هەڵبژاردنی هەموو',
  selectRow: 'هەڵبژاردنی ڕیز',
}

const ar: BMessages = {
  refresh: 'تحديث',
  search: 'بحث',
  print: 'طباعة',
  exportToExcel: 'تصدير إلى Excel',
  toggleColumns: 'إظهار/إخفاء الأعمدة',
  restoreDefault: 'استعادة الافتراضي',
  records: '{count} سجل',
  previousPage: 'الصفحة السابقة',
  nextPage: 'الصفحة التالية',
  rowsPerPage: 'عدد الصفوف في الصفحة',
  searchPlaceholder: 'بحث...',
  noResults: 'لا توجد نتائج',
  noOptions: 'لا توجد خيارات',
  clear: 'مسح',
  filter: 'تصفية',
  filterType: 'نوع التصفية',
  selected: '{count} محدد',
  in: 'ضمن',
  notIn: 'ليس ضمن',
  startWith: 'يبدأ بـ',
  endWith: 'ينتهي بـ',
  contains: 'يحتوي على',
  exact: 'مطابق تماماً',
  except: 'باستثناء',
  commaSeparate: 'مفصول بفواصل',
  equal: 'يساوي',
  greaterThan: 'أكبر من',
  greaterThanOrEqual: 'أكبر من أو يساوي',
  lessThan: 'أصغر من',
  lessThanOrEqual: 'أصغر من أو يساوي',
  notEqual: 'لا يساوي',
  datePlaceholder: 'التاريخ...',
  expandRow: 'توسيع الصف',
  selectAll: 'تحديد الكل',
  selectRow: 'تحديد الصف',
}

export type BLocale = 'en' | 'ckb' | 'ar'
export type BDirection = 'ltr' | 'rtl'

export const messages: Record<BLocale, BMessages> = { en, ckb, ar }

const RTL_LOCALES = new Set<string>(['ckb', 'ar'])

/** `'ar-IQ'` / `'ckb_IQ'` -> `'ar'` / `'ckb'`; anything unknown -> `'en'`. */
export function normalizeLocale(locale?: string | null): BLocale {
  const base = String(locale ?? '')
    .toLowerCase()
    .split(/[-_]/)[0]
  return base in messages ? (base as BLocale) : 'en'
}

export function directionOf(locale?: string | null): BDirection {
  return RTL_LOCALES.has(normalizeLocale(locale)) ? 'rtl' : 'ltr'
}

export interface BLocaleOptions {
  /** `'en'` (default), `'ckb'` (Kurdish Sorani) or `'ar'` (Arabic). Region tags such as `'ar-IQ'` are accepted. */
  locale?: string | null
  /** Forces the text direction; by default it follows the locale (`ckb` and `ar` are RTL). */
  dir?: BDirection | null
  /** Overrides individual strings of the active locale. */
  messages?: Partial<BMessages> | null
}

export interface BLocaleContext {
  locale: ComputedRef<BLocale>
  dir: ComputedRef<BDirection>
  isRtl: ComputedRef<boolean>
  t: (key: BMessageKey, params?: Record<string, string | number>) => string
}

export const LOCALE_KEY: InjectionKey<BLocaleContext> = Symbol('b-datatable-locale')

/**
 * Builds a context from `source` (read lazily so props stay reactive), falling
 * back to `parent` for anything `source` leaves out. Safe outside `setup()`.
 */
export function createLocaleContext(
  source: () => BLocaleOptions,
  parent: BLocaleContext | null = null,
): BLocaleContext {
  const locale = computed<BLocale>(() => {
    const own = source().locale
    return own ? normalizeLocale(own) : (parent?.locale.value ?? 'en')
  })

  const dir = computed<BDirection>(() => {
    const { dir: ownDir, locale: ownLocale } = source()
    if (ownDir) return ownDir
    // A component given its own locale takes that locale's direction, not the parent's.
    if (ownLocale) return directionOf(ownLocale)
    return parent?.dir.value ?? directionOf(locale.value)
  })

  const isRtl = computed(() => dir.value === 'rtl')

  function t(key: BMessageKey, params?: Record<string, string | number>) {
    const override = source().messages?.[key]
    let text = override ?? (parent && !source().locale ? parent.t(key) : messages[locale.value][key] ?? en[key])
    if (params) {
      for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value))
    }
    return text
  }

  return { locale, dir, isRtl, t }
}

const fallbackContext = createLocaleContext(() => ({}))

/** For components that take `locale` / `dir` / `messages` props and pass them down. */
export function provideLocale(source: () => BLocaleOptions): BLocaleContext {
  const ctx = createLocaleContext(source, inject(LOCALE_KEY, null))
  provide(LOCALE_KEY, ctx)
  return ctx
}

/** For the inner components (filters): read whatever the table above provides. */
export function useLocale(): BLocaleContext {
  return inject(LOCALE_KEY, fallbackContext)
}

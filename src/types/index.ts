import type { BDirection, BMessages } from '../i18n'

export type { BLocale, BDirection, BMessages, BMessageKey, BLocaleOptions } from '../i18n'

export type Theme = 'light' | 'dark'

export interface TableBorder {
  vertical?: boolean
  horizontal?: boolean
  table?: boolean
  tableBorderRadius?: string | null
}

export interface TableHeader {
  title: string
  key: string
  sortable: boolean
  column?: string
  filterType?: 'number' | 'text' | 'list' | 'id' | 'date'
  list?: Array<object>
  align?: 'start' | 'center' | 'end'
  headerProps?: object
  cellProps?: object
  complex?: boolean
  columns?: Array<string>
  itemTitle?: string
  itemValue?: string
}

export interface TableResult {
  results: Array<object>
  count: number
  previous?: string | null
  next?: string | null
  footer?: Record<string, number | string>
}

export type RowClass = string | string[] | Record<string, boolean>

export type RowClassResolver<T = object> = (item: T, index: number) => RowClass

export interface BTableSort {
  column?: string
  direction?: 'asc' | 'desc'
}

export interface BTablePerPage {
  page: number
  perPage: number
}

export interface BTableTextFilter {
  column: string
  symbol: string
  value: string
  columnQuery: string
  complex?: boolean
}

export interface BTableNumberFilter {
  column: string
  symbol: string
  value: string
  columnQuery: string
  complex?: boolean
}

export interface BTableListFilter {
  column: string
  values: unknown[]
}

/** Dates are 'YYYY-MM-DD'; both are null when the filter is cleared. */
export interface BTableDateFilter {
  column: string
  after: string | null
  before: string | null
  /** `${column}_after` */
  afterQuery: string
  /** `${column}_before` */
  beforeQuery: string
}

/**
 * The filter state persisted to localStorage when `storeFiltersInLocalStorage`
 * is on. Each map is keyed by the header's `column`; a cleared filter drops its
 * entry instead of storing an empty one.
 */
export interface BTableStoredFilters {
  text: Record<string, BTableTextFilter>
  number: Record<string, BTableNumberFilter>
  list: Record<string, BTableListFilter>
  date: Record<string, BTableDateFilter>
  sort: BTableSort | null
}

/**
 * What `filters:restored` hands back on load: the same objects the individual
 * `update:*-filter` / `update:sort` events emit, so the host can feed them
 * through the very same handlers and build its query params in one go.
 */
export interface BTableRestoredFilters {
  text: Array<BTableTextFilter>
  number: Array<BTableNumberFilter>
  list: Array<BTableListFilter>
  date: Array<BTableDateFilter>
  sort: BTableSort | null
}

export default interface BDatatableProps {
  hover?: boolean
  density?: 'default' | 'comfortable' | 'compact'
  title?: string | null
  headers?: Array<TableHeader>
  bodySlots?: Array<string>
  apiData?: TableResult
  page?: number
  perPage?: number
  pageCount?: number
  perPageOptions?: Array<number>
  height?: string | null
  showTotals?: boolean
  totalItem?: object
  showSelect?: boolean
  showExpand?: boolean
  useVirtualScroll?: boolean
  loading?: boolean
  fixedHeader?: boolean
  border?: TableBorder
  localSearch?: boolean
  localSort?: boolean
  localFilter?: boolean
  storeTableHeaderInLocalStorage?: boolean
  /** Persist the filter row and the sort column under `tableHeaderLocalStorageName`. */
  storeFiltersInLocalStorage?: boolean
  showResetBtn?: boolean
  showSearchBtn?: boolean
  showPrintBtn?: boolean
  showExportToExcelBtn?: boolean
  exportLoading?: boolean
  showToggleHeaderBtn?: boolean
  showPerPageBtn?: boolean
  showPrevAndNextBtn?: boolean
  tableHeaderLocalStorageName?: string | null
  theme?: Theme
  itemKey?: string
  headerRowBgColor?: string
  filterHeaderRowBgColor?: string
  tableToolbarBgColor?: string
  copyOnCellClick?: boolean
  footerClass?: string
  rowClass?: RowClass | RowClassResolver
  defaultTextSymbol?: string
  /**
   * UI language: `'en'` (default), `'ckb'` (Kurdish Sorani) or `'ar'` (Arabic).
   * Region tags such as `'ar-IQ'` are accepted. Falls back to the plugin option.
   */
  locale?: string | null
  /** Text direction; follows the locale when omitted (`ckb` and `ar` render RTL). */
  dir?: BDirection | null
  /** Overrides individual built-in strings, e.g. `{ noResults: 'Nothing here' }`. */
  messages?: Partial<BMessages> | null
}

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
  filterType?: 'number' | 'text' | 'list' | 'id'
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
  filterHeaderRowBgColor?: string
}

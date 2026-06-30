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
  filterType?: 'number' | 'text' | 'list'
  list?: Array<object>
  align?: 'start' | 'center' | 'end'
  headerProps?: object
  cellProps?: object
  complex?: boolean
  columns?: Array<string>
}

export interface TableResult {
  data: Array<object>
  total: number
  footer?: Record<string, number | string>
  prev_page_url?: string
  next_page_url?: string
}

export interface SmTableSort {
  column?: string
  direction?: 'asc' | 'desc'
}

export interface SmTablePerPage {
  page: number
  perPage: number
}

export interface SmTableTextFilter {
  column: string
  symbol: string
  value: string
  columnQuery: string
  complex?: boolean
}

export interface SmTableNumberFilter {
  column: string
  symbol: string
  value: string
  columnQuery: string
  complex?: boolean
}

export interface SmTableListFilter {
  column: string
  values: unknown[]
}

export default interface SmDatatableProps {
  hover?: boolean
  density?: 'default' | 'comfortable' | 'compact'
  title?: string | null
  headers?: Array<TableHeader>
  bodySlots?: Array<string>
  results?: TableResult
  page?: number
  perPage?: number
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

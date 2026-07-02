/**
 * Local (client-side) filtering logic for BDatatable.
 *
 * These helpers operate on the full backend response that is already held in
 * memory, so text / number / list filters can be applied without issuing a new
 * request to the backend.
 *
 * Performance note: each active filter is compiled into a predicate exactly once
 * (when the filter set changes), then every row is tested against those compiled
 * predicates in a single pass. Filtering therefore stays O(rows × activeFilters)
 * and never re-parses the filter config per row.
 */

export type LocalTextSymbol = 'sw' | 'ew' | 'co' | 'ex' | 'exc' | 'cs'
export type LocalNumberSymbol = '=' | '>' | '>=' | '<' | '<=' | '!='
export type LocalListLookup = 'in' | 'not_in'

export interface LocalTextFilter {
  type: 'text'
  symbol: LocalTextSymbol
  value: string
}

export interface LocalNumberFilter {
  type: 'number'
  symbol: LocalNumberSymbol
  value: string | number
}

export interface LocalListFilter {
  type: 'list'
  lookup: LocalListLookup
  values: Array<unknown>
}

export type LocalFilter = LocalTextFilter | LocalNumberFilter | LocalListFilter

/** Map of header `key` -> the active filter applied to that column. */
export type LocalFilterMap = Record<string, LocalFilter>

type Row = Record<string, unknown>
type Predicate = (row: Row) => boolean

const PASS: Predicate = () => true

/** Lower-cased string form of a cell value, with null/undefined treated as ''. */
function toText(value: unknown): string {
  return value === null || value === undefined ? '' : String(value).toLowerCase()
}

function buildTextPredicate(key: string, symbol: LocalTextSymbol, rawValue: string): Predicate {
  const query = rawValue.trim().toLowerCase()
  if (!query) return PASS

  switch (symbol) {
    case 'sw':
      return (row) => toText(row[key]).startsWith(query)
    case 'ew':
      return (row) => toText(row[key]).endsWith(query)
    case 'ex':
      return (row) => toText(row[key]) === query
    case 'exc':
      return (row) => !toText(row[key]).includes(query)
    case 'cs': {
      // "comma separate": match a row when its value contains ANY of the terms.
      const terms = query
        .split(',')
        .map((term) => term.trim())
        .filter(Boolean)
      if (!terms.length) return PASS
      return (row) => {
        const text = toText(row[key])
        return terms.some((term) => text.includes(term))
      }
    }
    case 'co':
    default:
      return (row) => toText(row[key]).includes(query)
  }
}

function buildNumberPredicate(key: string, symbol: LocalNumberSymbol, rawValue: string | number): Predicate {
  const target = Number(rawValue)
  if (rawValue === '' || rawValue === null || rawValue === undefined || Number.isNaN(target)) {
    return PASS
  }

  switch (symbol) {
    case '>':
      return (row) => Number(row[key]) > target
    case '>=':
      return (row) => Number(row[key]) >= target
    case '<':
      return (row) => Number(row[key]) < target
    case '<=':
      return (row) => Number(row[key]) <= target
    case '!=':
      return (row) => Number(row[key]) !== target
    case '=':
    default:
      return (row) => Number(row[key]) === target
  }
}

function buildListPredicate(key: string, lookup: LocalListLookup, values: Array<unknown>): Predicate {
  if (!values.length) return PASS
  const set = new Set(values)
  if (lookup === 'not_in') {
    return (row) => !set.has(row[key])
  }
  return (row) => set.has(row[key])
}

function compileFilter(key: string, filter: LocalFilter): Predicate {
  switch (filter.type) {
    case 'text':
      return buildTextPredicate(key, filter.symbol, filter.value)
    case 'number':
      return buildNumberPredicate(key, filter.symbol, filter.value)
    case 'list':
      return buildListPredicate(key, filter.lookup, filter.values)
    default:
      return PASS
  }
}

/**
 * Apply every active local filter to `data`.
 *
 * Returns the original array reference untouched when there is nothing to filter,
 * so callers can cheaply skip work / detect the "no filtering" case.
 */
export function applyLocalFilters<T extends Row>(data: ReadonlyArray<T>, filters: LocalFilterMap): T[] {
  const predicates = Object.keys(filters).map((key) => compileFilter(key, filters[key]))
  if (!predicates.length) return data as T[]
  return (data as T[]).filter((row) => predicates.every((predicate) => predicate(row)))
}

/**
 * Collect the unique, non-empty values of a column from the full data set.
 *
 * Used to build the option list for a local "list" filter so the consumer does
 * not have to provide it manually (e.g. the distinct "inventory" names).
 */
export function uniqueColumnValues<T extends Row>(data: ReadonlyArray<T>, key: string): unknown[] {
  const seen = new Set<unknown>()
  const result: unknown[] = []

  for (const row of data) {
    const value = row[key]
    if (value === null || value === undefined || value === '') continue
    if (!seen.has(value)) {
      seen.add(value)
      result.push(value)
    }
  }

  result.sort((a, b) => {
    const aNum = Number(a)
    const bNum = Number(b)
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum
    return String(a).localeCompare(String(b))
  })

  return result
}

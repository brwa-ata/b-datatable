<template>
  <div
    ref="wrapperRef"
    class="b__table-wrapper"
    :class="{
      'b__fixed-header': props.fixedHeader,
      'b__border-vertical': borderConfig.vertical,
      'b__border-horizontal': borderConfig.horizontal,
      'b__border-table': borderConfig.table,
      'b__hover-enabled': props.hover,
      'b__virtual-scroll-enabled': isVirtualScrollEnabled,
      [`b__density-${props.density}`]: true,
      [`b__theme-${props.theme}`]: true,
    }"
    :style="{
      ...(props.height ? { height: props.height } : {}),
      ...(borderConfig.tableBorderRadius ? { borderRadius: borderConfig.tableBorderRadius } : {}),
    }"
    @scroll="isVirtualScrollEnabled ? handleScroll($event) : null"
  >
    <!-- search input -->
    <div
      v-if="props.localSearch"
      class="b__search-container"
    >
      <span class="b__search-icon"><SearchIcon /></span>
      <input
        v-model="searchQuery"
        type="text"
        class="b__search-input"
        placeholder="Search..."
      />
      <span
        v-if="searchQuery"
        class="b__clear-icon"
        @click="clearSearch()"
      >
        <TimesCircleIcon />
      </span>
    </div>
    <table class="b__table">
      <thead :class="{ 'b__thead-disabled': props.loading }">
        <slot
          name="headers"
          :columns="props.headers"
          :is-sorted="isSorted"
          :get-sort-icon="getSortIcon"
          :get-header-classes="getHeaderClasses"
          :toggle-sort="toggleSort"
          :is-all-checked="isAllChecked"
          :is-indeterminate="isIndeterminate"
          :toggle-all-checked="toggleAllChecked"
        >
          <tr>
            <th
              v-if="props.showExpand"
              class="b__expand-th"
            />
            <th
              v-if="props.showSelect"
              class="b__select-th"
            >
              <input
                type="checkbox"
                class="b__select-checkbox"
                :checked="isAllChecked"
                :indeterminate="isIndeterminate"
                @change="toggleAllChecked"
              />
            </th>
            <th
              v-for="header in props.headers"
              :key="header.key"
              v-bind="header.headerProps"
              :class="{ b__sortable: header.sortable }"
              @click="header.sortable ? toggleSort(header.key) : null"
            >
              <div class="b__header-content">
                <slot
                  :name="`header.${header.key}`"
                  :header="header"
                >
                  {{ header.title }}
                </slot>
                <span
                  v-if="header.sortable"
                  class="b__sort-icon"
                >
                  <SortUpIcon
                    v-if="sortState[header.key] === 'asc'"
                    class="b__sort-icon-active"
                  />
                  <SortDownIcon
                    v-else-if="sortState[header.key] === 'desc'"
                    class="b__sort-icon-active"
                  />
                  <SortIcon
                    v-else
                    class="b__sort-icon-inactive"
                  />
                </span>
              </div>
            </th>
          </tr>
        </slot>

        <tr
          v-if="props.loading"
          class="b__loading-overlay-row"
        >
          <td
            :colspan="props.headers.length + leadingColCount"
            class="b__loading-overlay-cell"
          >
            <div class="b__loading-progress-bar">
              <div class="b__loading-progress-indicator"></div>
            </div>
          </td>
        </tr>
      </thead>
      <tbody :class="{ 'b__tbody-disabled': props.loading }">
        <template v-if="props.loading && !props.items.length">
          <tr>
            <td
              :colspan="props.headers.length + leadingColCount"
              class="b__loading-cell"
            >
              <div class="b__loading-container">
                <div class="b__loading-progress-bar">
                  <div class="b__loading-progress-indicator"></div>
                </div>
              </div>
            </td>
          </tr>
        </template>

        <template v-else-if="processedItems.length">
          <!-- Virtual scroll spacer (top) -->
          <tr
            v-if="isVirtualScrollEnabled && virtualScrollState.startIndex > 0"
            class="b__virtual-spacer"
          >
            <td
              :colspan="props.headers.length + leadingColCount"
              :style="{
                height: virtualScrollState.startIndex * currentRowHeight + 'px',
                padding: 0,
                border: 'none',
              }"
            ></td>
          </tr>

          <!-- Rendered rows (virtual or all) -->
          <template
            v-for="(item, index) in visibleItems"
            :key="isVirtualScrollEnabled ? virtualScrollState.startIndex + index : index"
          >
            <tr v-bind="props.rowProps">
              <td
                v-if="props.showExpand"
                class="b__expand-td"
              >
                <button
                  class="b__expand-btn"
                  :class="{ 'b__expand-btn--expanded': isRowExpanded(item) }"
                  @click="toggleExpand(item)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    color="currentColor"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"></path>
                  </svg>
                </button>
              </td>
              <td
                v-if="props.showSelect"
                class="b__select-td"
              >
                <input
                  :id="`b__table-checkbox-${item[props.itemKey]}`"
                  type="checkbox"
                  class="b__select-checkbox"
                  :checked="checkedRows.includes(item)"
                  @change="toggleRowCheck(item)"
                />
              </td>
              <td
                v-for="header in props.headers"
                :key="header.key"
                v-bind="header.cellProps"
              >
                <slot
                  :name="`item.${header.key}`"
                  :item="item"
                  :index="isVirtualScrollEnabled ? virtualScrollState.startIndex + index : index"
                  :value="getCellValue(item, header.key)"
                >
                  {{ getCellValue(item, header.key) }}
                </slot>
              </td>
            </tr>
            <tr
              v-if="props.showExpand && isRowExpanded(item)"
              class="b__expanded-row"
            >
              <td
                :colspan="props.headers.length + leadingColCount"
                class="b__expanded-row-cell"
              >
                <slot
                  name="b-expanded-row"
                  :item="item"
                  :index="isVirtualScrollEnabled ? virtualScrollState.startIndex + index : index"
                />
              </td>
            </tr>
          </template>

          <!-- Virtual scroll spacer (bottom) -->
          <tr
            v-if="isVirtualScrollEnabled && virtualScrollState.endIndex < processedItems.length"
            class="b__virtual-spacer"
          >
            <td
              :colspan="props.headers.length + leadingColCount"
              :style="{
                height: (processedItems.length - virtualScrollState.endIndex) * currentRowHeight + 'px',
                padding: 0,
                border: 'none',
              }"
            ></td>
          </tr>
        </template>

        <template v-else>
          <tr>
            <td
              :colspan="props.headers.length + leadingColCount"
              class="b__no-results-text"
            >
              <slot name="no-results-text"> No results found </slot>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <slot name="footer"></slot>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { SearchIcon, TimesCircleIcon, SortIcon, SortUpIcon, SortDownIcon } from './icons'

const props = defineProps({
  headers: { type: Array, required: true, default: () => [] },
  items: { type: Array, required: true, default: () => [] },
  height: { type: String, default: null },
  fixedHeader: { type: Boolean, default: false },
  border: {
    type: Object,
    default: () => ({ vertical: false, horizontal: true, table: false, tableBorderRadius: null }),
  },
  hover: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  localSort: { type: Boolean, default: false },
  localSearch: { type: Boolean, default: false },
  useVirtualScroll: { type: Boolean, default: true },
  rowProps: { type: [Object, Function], default: () => {} },
  itemKey: { type: String, default: 'id' },
  loadingText: { type: String, default: 'Loading...' },
  theme: {
    type: String,
    default: 'light',
    validator: (value) => ['light', 'dark'].includes(value),
  },
  density: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'comfortable', 'compact'].includes(value),
  },
  virtualScrollBuffer: { type: Number, default: 5 }, // Extra rows to render above/below viewport
  showExpand: { type: Boolean, default: false },
  showSelect: { type: Boolean, default: false },
})

const emit = defineEmits(['update:sort', 'update:currentItems', 'update:expanded', 'row:expand', 'update:checked'])

const borderConfig = computed(() => ({
  vertical: false,
  horizontal: true,
  table: false,
  tableBorderRadius: null,
  ...props.border,
}))

// Store sort state for each column: null (no sort), 'asc', or 'desc'
const sortState = ref({})

// Expanded rows
const expandedRows = ref([])

function isRowExpanded(item) {
  return expandedRows.value.includes(item)
}

function toggleExpand(item) {
  const index = expandedRows.value.indexOf(item)
  if (index === -1) {
    expandedRows.value.push(item)
    emit('row:expand', { item, expanded: true })
  } else {
    expandedRows.value.splice(index, 1)
    emit('row:expand', { item, expanded: false })
  }

  emit('update:expanded', expandedRows.value)
}
// Checked rows (selection)
const checkedRows = ref([])

const isAllChecked = computed(
  () => processedItems.value.length > 0 && checkedRows.value.length === processedItems.value.length,
)

const isIndeterminate = computed(
  () => checkedRows.value.length > 0 && checkedRows.value.length < processedItems.value.length,
)

function toggleRowCheck(item) {
  const idx = checkedRows.value.indexOf(item)
  if (idx === -1) {
    item.is_checked = true
    checkedRows.value.push(item)
  } else {
    item.is_checked = false
    checkedRows.value.splice(idx, 1)
  }
  emit('update:checked', [...checkedRows.value])
}

function toggleAllChecked() {
  if (isAllChecked.value) {
    checkedRows.value.forEach((item) => {
      item.is_checked = false
    })
    checkedRows.value = []
  } else {
    processedItems.value.forEach((item) => {
      item.is_checked = true
    })
    checkedRows.value = [...processedItems.value]
  }
  emit('update:checked', [...checkedRows.value])
}

const searchQuery = ref('')

// Virtual scroll state
const wrapperRef = ref(null)
const virtualScrollState = ref({
  startIndex: 0,
  endIndex: 0,
})

// Row heights based on density
const rowHeightMap = {
  default: 52,
  comfortable: 44,
  compact: 36,
}

// Computed row height based on density prop
const rowHeight = computed(() => rowHeightMap[props.density] || 52)

// Expose row height for template (returns the value directly)
const currentRowHeight = computed(() => rowHeight.value)

// Check if virtual scroll should be enabled
const isVirtualScrollEnabled = computed(() => !!props.height && props.useVirtualScroll)

function clearSearch() {
  searchQuery.value = ''
}

// Helper function to check if a column is sorted
function isSorted(columnKey) {
  return sortState.value[columnKey] || null
}

// Helper function to get sort icon component for a column
function getSortIcon(columnKey) {
  const state = sortState.value[columnKey]
  if (state === 'asc') {
    return { component: SortUpIcon, class: 'b__sort-icon-active' }
  } else if (state === 'desc') {
    return { component: SortDownIcon, class: 'b__sort-icon-active' }
  }
  return { component: SortIcon, class: 'b__sort-icon-inactive' }
}

// Helper function to get header classes for a column
function getHeaderClasses(column) {
  return {
    b__sortable: column.sortable,
  }
}

function toggleSort(columnKey) {
  const currentState = sortState.value[columnKey]

  // Reset all other columns
  Object.keys(sortState.value).forEach((key) => {
    if (key !== columnKey) {
      sortState.value[key] = null
    }
  })

  // Cycle through: null -> asc -> desc -> null
  if (currentState === null || currentState === undefined) {
    sortState.value[columnKey] = 'asc'
  } else if (currentState === 'asc') {
    sortState.value[columnKey] = 'desc'
  } else {
    sortState.value[columnKey] = null
    columnKey = null
  }

  // Emit the sort event to parent (for remote sorting)
  if (!props.localSort) {
    emit('update:sort', {
      column: columnKey,
      direction: sortState.value[columnKey],
    })
  }
}

// Resolve a header key against an item, supporting dot-notation paths (e.g. "branch.name").
function getCellValue(item, key) {
  if (item === null || key === null) return undefined
  if (key in item) return item[key]
  return String(key)
    .split('.')
    .reduce((acc, part) => (acc === null ? undefined : acc[part]), item)
}

// Computed property for filtered items (search)
const filteredItems = computed(() => {
  if (!props.localSearch || !searchQuery.value.trim()) {
    return props.items
  }

  const query = searchQuery.value.toLowerCase().trim()

  return props.items.filter((item) => {
    // Search across all header keys
    return props.headers.some((header) => {
      const value = getCellValue(item, header.key)
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(query)
    })
  })
})

// Computed property for sorted items (local sort)
const sortedItems = computed(() => {
  if (!props.localSort) {
    return filteredItems.value
  }

  // Find the active sort column
  const sortColumn = Object.keys(sortState.value).find(
    (key) => sortState.value[key] !== null && sortState.value[key] !== undefined,
  )

  if (!sortColumn) {
    return filteredItems.value
  }

  const direction = sortState.value[sortColumn]
  const items = [...filteredItems.value]

  items.sort((a, b) => {
    const aValue = getCellValue(a, sortColumn)
    const bValue = getCellValue(b, sortColumn)

    // Handle null/undefined values
    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    // Determine if values are numbers
    const aNum = Number(aValue)
    const bNum = Number(bValue)
    const isNumeric = !isNaN(aNum) && !isNaN(bNum)

    let comparison = 0

    if (isNumeric) {
      comparison = aNum - bNum
    } else {
      comparison = String(aValue).localeCompare(String(bValue))
    }

    return direction === 'asc' ? comparison : -comparison
  })

  return items
})

// Final processed items (after search and sort)
const processedItems = computed(() => {
  return sortedItems.value
})

// Number of leading fixed columns (expand + select)
const leadingColCount = computed(() => (props.showExpand ? 1 : 0) + (props.showSelect ? 1 : 0))

// ============================================
// Virtual scroll logic (must be after processedItems)
// ============================================

// Calculate visible items based on virtual scroll state
const visibleItems = computed(() => {
  if (!isVirtualScrollEnabled.value) {
    return processedItems.value
  }
  return processedItems.value.slice(virtualScrollState.value.startIndex, virtualScrollState.value.endIndex)
})

// Calculate visible range based on scroll position
function calculateVisibleRange() {
  if (!wrapperRef.value || !isVirtualScrollEnabled.value) {
    return
  }

  const wrapper = wrapperRef.value
  const scrollTop = wrapper.scrollTop
  const viewportHeight = wrapper.clientHeight
  const totalItems = processedItems.value.length
  const buffer = props.virtualScrollBuffer

  // Account for header height (same as row height for sticky header)
  const headerHeight = rowHeight.value
  const adjustedScrollTop = Math.max(0, scrollTop - headerHeight)

  // Calculate start and end indices
  const startIndex = Math.max(0, Math.floor(adjustedScrollTop / rowHeight.value) - buffer)
  const visibleCount = Math.ceil(viewportHeight / rowHeight.value)
  const endIndex = Math.min(totalItems, startIndex + visibleCount + buffer * 2)

  virtualScrollState.value = {
    startIndex,
    endIndex,
  }
}

// Handle scroll event
function handleScroll() {
  if (isVirtualScrollEnabled.value) {
    calculateVisibleRange()
  }
}

// Recalculate on mount and when items change
onMounted(() => {
  if (isVirtualScrollEnabled.value) {
    calculateVisibleRange()
  }
})

// Watch for changes that require recalculation
watch(
  () => [processedItems.value.length, props.density, props.height],
  () => {
    if (isVirtualScrollEnabled.value) {
      calculateVisibleRange()
    }
  },
)

// Reset scroll position when items change significantly (e.g., search/filter)
// Also emit the current filtered/sorted items to parent
watch(
  () => processedItems.value,
  (newItems, oldItems) => {
    // Emit filtered/sorted items to parent
    emit('update:currentItems', newItems)

    // Re-derive checked rows from is_checked flag on the new items
    checkedRows.value = newItems.filter((item) => item.is_checked)
    // emit('update:checked', [...checkedRows.value])

    if (isVirtualScrollEnabled.value && wrapperRef.value) {
      // Reset to top if the data changed significantly
      if (Math.abs(newItems.length - (oldItems?.length || 0)) > 10) {
        wrapperRef.value.scrollTop = 0
      }
      calculateVisibleRange()
    }
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
// Common variables
$border-radius: 0.5rem;
$cell-padding-horizontal: 8px;
$transition-duration: 0.12s;
$sticky-z-index: 10;

// Density variables
$density-default-height: 50px;
$density-comfortable-height: 42px;
$density-compact-height: 34px;

.b__table-wrapper {
  width: 100%;
  position: relative;
  overflow-y: auto;
  overflow-x: auto;
}

// Search container
.b__search-container {
  position: relative;
  padding: 12px;
}

.b__search-input {
  width: 100%;
  padding: 8px 36px 8px 36px;
  font-size: 13px;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color $transition-duration ease;
  background-color: transparent;
}

.b__search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;
  }
}

.b__clear-icon {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color $transition-duration ease;

  svg {
    width: 16px;
    height: 16px;
  }
}

.b__table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  th,
  td {
    padding: 0 $cell-padding-horizontal;
    text-align: start;
    height: $density-default-height;
    font-size: 13px !important;
  }

  th {
    white-space: nowrap;
  }

  th {
    font-weight: normal;

    &.b__sortable {
      cursor: pointer !important;
      user-select: none;
      transition: background-color $transition-duration ease;
    }
  }
}

// Header content and sort icons
.b__header-content {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
  white-space: nowrap;
}

.b__sort-icon {
  display: inline-flex;
  align-items: center;
  min-width: 14px;

  svg {
    width: 14px;
    height: 14px;
    transition:
      color $transition-duration ease,
      opacity $transition-duration ease;
  }

  .b__sort-icon-inactive {
    opacity: 0.7;
  }

  .b__sort-icon-active {
    opacity: 1;
    color: darkorange;
  }
}

// Fixed header styles
.b__table-wrapper.b__fixed-header .b__table thead {
  position: sticky;
  top: 0;
  z-index: $sticky-z-index;
}

// Vertical borders between columns
.b__table-wrapper.b__border-vertical {
  .b__table th {
    &:not(:first-child) {
      border-left: 1px solid;
      border-right: 1px solid;
    }
  }

  .b__table td:not(:first-child) {
    border-left: 1px solid;
    border-right: 1px solid;
  }
}

// Row hover functionality
.b__table-wrapper.b__hover-enabled .b__table tbody tr {
  transition: background-color $transition-duration ease;
}

// ============================================
// LIGHT THEME
// ============================================
.b__table-wrapper.b__theme-light {
  .b__search-container {
    border-bottom: 1px solid #ddd;
  }

  .b__search-input {
    border: 1px solid #ddd;
    color: rgba(0, 0, 0, 0.87);

    &:focus {
      border-color: #1976d2;
    }

    &::placeholder {
      color: rgba(0, 0, 0, 0.4);
    }
  }

  .b__search-icon {
    color: rgba(0, 0, 0, 0.4);
  }

  .b__clear-icon {
    color: rgba(0, 0, 0, 0.4);

    &:hover {
      color: rgba(0, 0, 0, 0.7);
    }
  }

  .b__table {
    th {
      background-color: #f5f5f5;
      color: #606060;
    }
  }

  &.b__border-horizontal .b__table {
    th,
    td {
      border-bottom: 1px solid #ddd;
    }
  }

  .b__sort-icon {
    color: rgba(0, 0, 0, 0.6);
  }

  &.b__fixed-header .b__table thead th {
    background-color: #f5f5f5;
  }

  &.b__fixed-header .b__table thead td {
    background-color: #ffffff;
  }

  &.b__border-table {
    border: 1px solid #ddd;
  }

  &.b__border-vertical {
    .b__table th:not(:first-child),
    .b__table td:not(:first-child) {
      border-left-color: #ddd;
      border-right-color: #ddd;
    }
  }

  &.b__hover-enabled .b__table tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .b__expand-btn:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
}

// ============================================
// DARK THEME
// ============================================
.b__table-wrapper.b__theme-dark {
  .b__search-container {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .b__search-input {
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.87);

    &:focus {
      border-color: #90caf9;
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
  }

  .b__search-icon {
    color: rgba(255, 255, 255, 0.4);
  }

  .b__clear-icon {
    color: rgba(255, 255, 255, 0.4);

    &:hover {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .b__table {
    th {
      background-color: var(--b-table-header-bg);
      color: #dddddd;
    }
  }

  &.b__border-horizontal .b__table {
    th,
    td {
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }
  }

  .b__sort-icon {
    color: rgba(255, 255, 255, 0.7);
  }

  &.b__fixed-header .b__table thead th {
    background-color: var(--b-table-header-bg);
  }

  &.b__border-table {
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  &.b__border-vertical {
    .b__table th:not(:first-child),
    .b__table td:not(:first-child) {
      border-left-color: rgba(255, 255, 255, 0.12);
      border-right-color: rgba(255, 255, 255, 0.12);
    }
  }

  &.b__hover-enabled .b__table tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .b__expand-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

// Density styles
.b__table-wrapper.b__density-default .b__table {
  th,
  td {
    height: $density-default-height;
  }
}

.b__table-wrapper.b__density-comfortable .b__table {
  th,
  td {
    height: $density-comfortable-height;
  }
}

.b__table-wrapper.b__density-compact .b__table {
  th,
  td {
    height: $density-compact-height;
  }
}

.b__no-results-text {
  text-align: center !important;
  opacity: 0.8;
  border: none !important;
}

// Loading state styles
.b__tbody-disabled {
  pointer-events: none;
  opacity: 0.6;
  user-select: none;
}
.b__thead-disabled {
  pointer-events: none;
  // opacity: 0.6;
  user-select: none;
  cursor: progress;
}

.b__loading-cell {
  padding: 0 !important;
  border: none !important;
  height: 4px !important;
}

.b__loading-container {
  width: 100%;
  height: 4px;
}

// Loading overlay (when there are existing records)
.b__loading-overlay-row {
  position: sticky;
  // top: $density-default-height;
  z-index: 5;
}

.b__table-wrapper.b__density-comfortable .b__loading-overlay-row {
  top: $density-comfortable-height;
}

.b__table-wrapper.b__density-compact .b__loading-overlay-row {
  top: $density-compact-height;
}

.b__loading-overlay-cell {
  padding: 0 !important;
  border: none !important;
  height: 0px !important;
  position: relative;
}

// Linear progress bar - Light theme
.b__table-wrapper.b__theme-light {
  .b__loading-progress-bar {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .b__loading-progress-indicator {
    height: 100%;
    width: 60%;
    background: linear-gradient(90deg, transparent 0%, #000000 40%, transparent 100%);
    animation: b__progress-slide 1.5s ease-in-out infinite;
  }
}

// Linear progress bar - Dark theme
.b__table-wrapper.b__theme-dark {
  .b__loading-progress-bar {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .b__loading-progress-indicator {
    height: 100%;
    width: 60%;
    background: linear-gradient(90deg, transparent 0%, #ffffff 30%, transparent 100%);
    animation: b__progress-slide 1.5s ease-in-out infinite;
  }
}

@keyframes b__progress-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

// Virtual scroll styles
.b__virtual-spacer {
  td {
    padding: 0 !important;
    border: none !important;
  }
}

// Virtual scroll enabled wrapper - ensure smooth scrolling
.b__table-wrapper.b__virtual-scroll-enabled {
  will-change: scroll-position;
}

// Expand column styles
.b__expand-th,
.b__expand-td {
  width: 25px;
  min-width: 25px;
  padding: 0 4px !important;
}

.b__expand-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  color: inherit;
  opacity: 0.6;
  transition:
    transform $transition-duration ease,
    opacity $transition-duration ease,
    background-color $transition-duration ease;

  &:hover {
    opacity: 1;
  }

  &--expanded {
    transform: rotate(90deg);
    opacity: 1;
  }
}

.b__expanded-row-cell {
  padding: 0 !important;
  border-top: none !important;
}

// Select column styles
.b__select-th,
.b__select-td {
  width: auto;
  text-align: center;
}
</style>
<style lang="scss">
// ============================================
// Non-scoped styles for slotted content
// These styles will apply even when using custom header slots
// ============================================

.b__table-wrapper {
  .b__table {
    thead {
      th {
        font-weight: normal;
        padding: 0 8px;
        text-align: start;
        height: 52px;
        font-size: 13px !important;

        &.b__sortable {
          cursor: pointer !important;
          user-select: none;
          transition: background-color 0.12s ease;
        }
      }

      .b__header-content {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 8px;
        white-space: nowrap;
      }

      .b__sort-icon {
        display: inline-flex;
        align-items: center;
        min-width: 14px;

        svg {
          width: 14px;
          height: 14px;
          transition:
            color 0.12s ease,
            opacity 0.12s ease;
        }

        .b__sort-icon-inactive {
          opacity: 0.7;
        }

        .b__sort-icon-active {
          opacity: 1;
          color: darkorange;
        }
      }
    }
  }

  // Density variations
  &.b__density-comfortable .b__table thead th {
    height: 44px;
  }

  &.b__density-compact .b__table thead th {
    height: 36px;
  }

  // Fixed header
  &.b__fixed-header .b__table thead {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  // Vertical borders between columns (header)
  &.b__border-vertical .b__table thead th {
    &:not(:first-child) {
      border-left: 1px solid;
      border-right: 1px solid;
    }
  }
}

// ============================================
// LIGHT THEME (non-scoped)
// ============================================
.b__table-wrapper.b__theme-light {
  --b-dropdown-bg: rgb(255, 255, 255);
  --b-dropdown-border: rgba(0, 0, 0, 0.07);
  --b-dropdown-text: inherit;
  --b-dropdown-hover: rgba(0, 0, 0, 0.05);
  --b-input-color: rgb(51, 51, 51);
  --b-input-placeholder: rgba(0, 0, 0, 0.35);
  --b-color-blue: rgb(0, 122, 255);
  --b-active-filter-bg-color: rgba(251, 140, 0, 0.184);
  --b-table-header-bg: rgba(245, 245, 245, 1);
}

.b__table-wrapper.b__theme-light .b__table thead {
  th {
    background-color: #f5f5f5;
    color: #606060;
  }

  .b__sort-icon {
    color: rgba(0, 0, 0, 0.6);
  }
}

.b__table-wrapper.b__theme-light.b__border-horizontal .b__table thead {
  th {
    border-bottom: 1px solid #ddd;
  }
  td {
    border-bottom: 1px solid #ddd;
  }
}

.b__table-wrapper.b__theme-light.b__fixed-header .b__table thead th {
  background-color: #f5f5f5;
}
.b__table-wrapper.b__theme-light.b__fixed-header .b__table thead td {
  background-color: #ffffff;
}

.b__table-wrapper.b__theme-light.b__border-vertical .b__table thead th:not(:first-child) {
  border-left-color: #ddd;
  border-right-color: #ddd;
}

// ============================================
// DARK THEME (non-scoped)
// ============================================
.b__table-wrapper.b__theme-dark {
  --b-dropdown-bg: rgba(42, 42, 42, 1);
  --b-dropdown-border: rgba(255, 255, 255, 0.07);
  --b-dropdown-text: rgba(235, 235, 235, 0.9);
  --b-dropdown-hover: rgba(255, 255, 255, 0.08);
  --b-input-color: rgba(221, 221, 221, 1);
  --b-input-placeholder: rgba(255, 255, 255, 0.35);
  --b-color-blue: rgba(0, 122, 255);
  --b-active-filter-bg-color: rgba(251, 140, 0, 0.184);
  --b-table-header-bg: rgba(45, 45, 45, 1);
}

.b__table-wrapper.b__theme-dark .b__table thead {
  th {
    background-color: var(--b-table-header-bg);
    color: #dddddd;
  }
  td {
    background-color: rgba(24, 24, 24, 1);
    color: #dddddd;
  }

  .b__sort-icon {
    color: rgba(255, 255, 255, 0.7);
  }
}

.b__table-wrapper.b__theme-dark.b__border-horizontal .b__table thead {
  th {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
  td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }
}

.b__table-wrapper.b__theme-dark.b__fixed-header .b__table thead th {
  background-color: var(--b-table-header-bg);
}

.b__table-wrapper.b__theme-dark.b__border-vertical .b__table thead th:not(:first-child) {
  border-left-color: rgba(255, 255, 255, 0.12);
  border-right-color: rgba(255, 255, 255, 0.12);
}

.b__sticky-table-footer {
  position: sticky;
  bottom: 0;
  font-size: 13px;
  background-color: var(--b-table-header-bg);

  td {
    padding: 0 8px;
    height: 50px;
  }
}

.b__table-wrapper.b__density-comfortable .b__sticky-table-footer td {
  height: 42px;
}

.b__table-wrapper.b__density-compact .b__sticky-table-footer td {
  height: 34px;
}

// ============================================
// Checkbox styles (non-scoped — applies to slotted content too)
// ============================================
.b__select-th,
.b__select-td {
  width: auto;
  text-align: center;
}

.b__select-checkbox {
  cursor: pointer;
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 4px;
  border: 1px solid;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 11px 11px;
  transition:
    background-color 0.12s ease,
    border-color 0.12s ease;
}

.b__table-wrapper.b__theme-light .b__select-checkbox {
  border-color: rgba(0, 0, 0, 0.35);

  &:hover:not(:checked):not(:indeterminate) {
    border-color: rgba(0, 0, 0, 0.6);
  }

  &:checked,
  &:indeterminate {
    background-color: #333333;
    border-color: #333333;
  }

  &:checked {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath stroke='%23ffffff' stroke-width='2.0' stroke-linecap='round' stroke-linejoin='round' fill='none' d='M3 8l3.5 3.5 6.5-6.5'/%3E%3C/svg%3E");
  }

  &:indeterminate {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath stroke='%23ffffff' stroke-width='2.0' stroke-linecap='round' fill='none' d='M4 8h8'/%3E%3C/svg%3E");
  }
}

.b__table-wrapper.b__theme-dark .b__select-checkbox {
  border-color: rgba(255, 255, 255, 0.35);

  &:hover:not(:checked):not(:indeterminate) {
    border-color: rgba(255, 255, 255, 0.6);
  }

  &:checked,
  &:indeterminate {
    background-color: #eeeeee;
    border-color: #eeeeee;
  }

  &:checked {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath stroke='%23212121' stroke-width='2.0' stroke-linecap='round' stroke-linejoin='round' fill='none' d='M3 8l3.5 3.5 6.5-6.5'/%3E%3C/svg%3E");
  }

  &:indeterminate {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath stroke='%23212121' stroke-width='2.0' stroke-linecap='round' fill='none' d='M4 8h8'/%3E%3C/svg%3E");
  }
}
</style>

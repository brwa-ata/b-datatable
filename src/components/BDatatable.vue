<template>
  <div class="b-dt">
    <!-- toolbar -->
    <div
      class="b-dt__toolbar"
      :class="`b-dt__toolbar--${props.theme}`"
    >
      <!-- custom slot: occupies left side, pushes toolbar buttons to the right -->
      <div class="b-dt__toolbar-slot">
        <slot name="prepend-table-toolbar" />
      </div>

      <!-- left actions (grouped in a rounded pill) -->
      <div
        v-if="hasLeftActions"
        class="b-dt__toolbar-left"
      >
        <button
          v-if="props.showResetBtn"
          class="b-dt__tool-btn"
          type="button"
          title="Refresh"
          :disabled="props.loading"
          :class="{ 'b-dt__btn-disabled': props.loading }"
          @click="handleReset"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            :color="props.theme === 'light' ? '#000000' : '#ffffff'"
            fill="none"
            :stroke="props.theme === 'light' ? '#000000' : '#ffffff'"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M20.4879 15C19.2524 18.4956 15.9187 21 12 21C7.02943 21 3 16.9706 3 12C3 7.02943 7.02943 3 12 3C15.7292 3 18.9286 5.26806 20.2941 8.5"
            ></path>
            <path d="M15 9H18C19.4142 9 20.1213 9 20.5607 8.56066C21 8.12132 21 7.41421 21 6V3"></path>
          </svg>
        </button>

        <button
          v-if="props.showSearchBtn"
          class="b-dt__tool-btn"
          type="button"
          title="Search"
          :disabled="props.loading"
          :class="{ 'b-dt__btn-disabled': props.loading }"
          @click="handleSearch()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            :color="props.theme === 'light' ? '#000000' : '#ffffff'"
            fill="none"
            :stroke="props.theme === 'light' ? '#000000' : '#ffffff'"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M17 17L21 21"></path>
            <path
              d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
            ></path>
          </svg>
        </button>

        <button
          v-if="props.showPrintBtn"
          class="b-dt__tool-btn"
          type="button"
          title="Print"
          :disabled="props.loading"
          :class="{ 'b-dt__btn-disabled': props.loading }"
          @click="handlePrint()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            :color="props.theme === 'light' ? '#000000' : '#ffffff'"
            fill="none"
            :stroke="props.theme === 'light' ? '#000000' : '#ffffff'"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M17 17H18.6667C19.9128 17 20.5359 17 21 16.7321C21.304 16.5565 21.5565 16.304 21.732 16C22 15.5359 22 14.9128 22 13.6667C22 11.1744 22 9.9282 21.4641 9C21.113 8.39192 20.6081 7.88697 20 7.5359C19.0718 7 17.8256 7 15.3333 7H8.66667C6.17436 7 4.9282 7 4 7.5359C3.39192 7.88697 2.88697 8.39192 2.5359 9C2 9.9282 2 11.1744 2 13.6667C2 14.9128 2 15.5359 2.26795 16C2.44349 16.304 2.69596 16.5565 3 16.7321C3.4641 17 4.08718 17 5.33333 17H7"
            ></path>
            <path
              d="M17 7V5C17 3.58579 17 2.87868 16.5607 2.43934C16.1213 2 15.4142 2 14 2H10C8.58579 2 7.87868 2 7.43934 2.43934C7 2.87868 7 3.58579 7 5V7"
            ></path>
            <path
              d="M17 14V19C17 20.4142 17 21.1213 16.5607 21.5607C16.1213 22 15.4142 22 14 22H10C8.58579 22 7.87868 22 7.43934 21.5607C7 21.1213 7 20.4142 7 19V14H17Z"
            ></path>
            <path
              d="M18.8748 10.25H18.7498M18.9998 10.25C18.9998 10.3881 18.8879 10.5 18.7498 10.5C18.6117 10.5 18.4998 10.3881 18.4998 10.25C18.4998 10.1119 18.6117 10 18.7498 10C18.8879 10 18.9998 10.1119 18.9998 10.25Z"
            ></path>
          </svg>
        </button>

        <button
          v-if="props.showExportToExcelBtn"
          class="b-dt__tool-btn b-dt__tool-btn--excel"
          type="button"
          title="Export to Excel"
          :disabled="props.loading || props.exportLoading"
          :class="{ 'b-dt__btn-disabled': props.loading || props.exportLoading }"
          @click="handleExcel"
        >
          <svg
            v-if="!props.exportLoading"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            :color="props.theme === 'light' ? '#000000' : '#ffffff'"
            fill="none"
            :stroke="props.theme === 'light' ? '#000000' : '#ffffff'"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M19.5 11C19.5 10.1825 19.5 9.4306 19.3478 9.06306C19.1955 8.69552 18.9065 8.40649 18.3284 7.82843L13.5919 3.09188C13.093 2.593 12.8436 2.34355 12.5345 2.19575C12.4702 2.165 12.4044 2.13772 12.3372 2.11401C12.0141 2 11.6614 2 10.9558 2C7.71082 2 6.08831 2 4.98933 2.88607C4.76731 3.06508 4.56508 3.26731 4.38607 3.48933C3.5 4.58831 3.5 6.21082 3.5 9.45584V14C3.5 17.7712 3.5 19.6569 4.67157 20.8284C5.84315 22 7.72876 22 11.5 22H19.5M12.5 2.5V3C12.5 5.82843 12.5 7.24264 13.3787 8.12132C14.2574 9 15.6716 9 18.5 9H19"
            ></path>
            <path
              d="M13.5 13.9998V16.9998C13.5 17.9426 13.5 18.414 13.7929 18.7069C14.0858 18.9998 14.5572 18.9998 15.5 18.9998M8 14L9.5 16.5M9.5 16.5L11 19M9.5 16.5L11 14M9.5 16.5L8 19"
            ></path>
            <path
              d="M20.5 14H19C18.4477 14 18 14.4477 18 15V15.5C18 16.0523 18.4477 16.5 19 16.5H19.5C20.0523 16.5 20.5 16.9477 20.5 17.5V18C20.5 18.5523 20.0523 19 19.5 19H18"
            ></path>
          </svg>

          <svg
            v-else
            class="b-dt__spinner"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-dasharray="31.416"
              stroke-dashoffset="10"
            />
          </svg>
        </button>

        <!-- show/hide table columns -->
        <div
          v-if="props.showToggleHeaderBtn"
          class="b-dt__columns"
          ref="columnsWrapper"
        >
          <button
            class="b-dt__tool-btn"
            type="button"
            title="Toggle Columns"
            :disabled="props.loading"
            :class="{ 'b-dt__btn-disabled': props.loading }"
            @click="showColumnsDropdown = !showColumnsDropdown"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              :color="props.theme === 'light' ? '#000000' : '#ffffff'"
              fill="none"
              :stroke="props.theme === 'light' ? '#000000' : '#ffffff'"
              stroke-width="1"
            >
              <path
                d="M3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088Z"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path d="M2.5 9L21.5 9"></path>
              <path d="M2.5 13L21.5 13"></path>
              <path d="M2.5 17L21.5 17"></path>
              <path
                d="M12 21.5L12 9"
                stroke-linecap="round"
              ></path>
            </svg>
          </button>
          <div
            v-if="showColumnsDropdown"
            class="b-dt__columns-dropdown"
          >
            <ul class="b-dt__col-panel">
              <li
                v-for="(key, index) in columnOrder"
                :key="key"
                class="b-dt__columns-item b-dt__reorder-item"
                :class="{
                  'b-dt__reorder-item--dragging': dragSourceIndex === index,
                  'b-dt__reorder-item--dragover': dragOverIndex === index && dragSourceIndex !== index,
                }"
                draggable="true"
                @click="toggleColumn(key)"
                @dragstart="onDragStart($event, index)"
                @dragover="onDragOver($event, index)"
                @drop="onDrop($event, index)"
                @dragend="onDragEnd"
              >
                <span
                  class="b-dt__reorder-handle"
                  @click.stop
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                    />
                  </svg>
                </span>
                <span class="b-dt__columns-check">
                  <svg
                    v-if="!hiddenColumns.has(key)"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
                    />
                  </svg>
                </span>
                {{ props.headers.find((h) => h.key === key)?.title ?? key }}
              </li>
            </ul>
            <div class="b-dt__reorder-footer">
              <button
                type="button"
                class="b-dt__reorder-reset-btn"
                @click="resetColumnOrder"
              >
                Restore Default
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- right: per-page + pagination -->
      <div class="b-dt__toolbar-right">
        <!-- per-page dropdown -->
        <div
          v-if="props.showPerPageBtn"
          class="b-dt__perpage"
          ref="perPageWrapper"
        >
          <button
            class="b-dt__perpage-btn"
            type="button"
            :disabled="props.loading"
            :class="{ 'b-dt__btn-disabled': props.loading }"
            @click="showPerPageDropdown = !showPerPageDropdown"
          >
            {{ props.perPage }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              color="currentColor"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9"></path>
            </svg>
          </button>
          <ul
            v-if="showPerPageDropdown"
            class="b-dt__perpage-dropdown"
          >
            <li
              v-for="opt in perPageList"
              :key="opt"
              class="b-dt__perpage-option"
              :class="{ 'b-dt__perpage-option--active': props.perPage === opt }"
              @click="setPerPage(opt)"
            >
              {{ opt }}
            </li>
          </ul>
        </div>

        <template v-if="props.showPrevAndNextBtn">
          <!-- total count badge -->
          <span
            class="b-dt__count-badge"
            :title="`${(props.apiData.count || 0).toLocaleString()} records`"
          >
            {{ (props.apiData.count || 0).toLocaleString() }}
          </span>

          <!-- prev / page / next (unified segmented pill) -->
          <div class="b-dt__pager">
            <button
              class="b-dt__pager-btn"
              type="button"
              :disabled="props.page <= 1 || props.loading || !props.apiData.previous"
              @click="prevPage()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                color="currentColor"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"></path>
              </svg>
            </button>

            <span class="b-dt__pager-info">{{ props.page }} / {{ props.pageCount }}</span>

            <button
              class="b-dt__pager-btn"
              type="button"
              :disabled="props.loading || !props.apiData.next"
              @click="nextPage()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
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
          </div>
        </template>
      </div>
    </div>

    <!-- table -->
    <BTable
      :headers="visibleHeaders"
      :items="tableItems"
      :height="props.height"
      :hover="props.hover"
      :density="props.density"
      :loading="props.loading"
      :fixed-header="props.fixedHeader"
      :border="props.border"
      :local-search="props.localSearch"
      :local-sort="props.localSort"
      :show-expand="props.showExpand"
      :show-select="props.showSelect"
      :use-virtual-scroll="props.useVirtualScroll"
      :theme="props.theme"
      :itemKey="props.itemKey"
      :row-props="getRowProps"
      @update:sort="handleSort"
      @update:currentItems="handleCurrentItems"
      @row:expand="handleExpand"
      @update:expanded="handleUpdateExpanded"
      @update:checked="handleUpdateChecked"
      v-bind="$attrs"
    >
      <template #headers="{ columns, getSortIcon, toggleSort, isAllChecked, isIndeterminate, toggleAllChecked }">
        <tr>
          <th
            v-if="props.showExpand"
            class="b__expand-th"
          ></th>
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
            v-for="column in columns"
            :key="column.key"
            v-bind="column.headerProps"
            :class="{ b__sortable: column.sortable }"
            @click="column.sortable ? toggleSort(column.key) : null"
          >
            <div
              class="b__header-content"
              :style="column.align ? { justifyContent: column.align } : {}"
            >
              {{ column.title }}
              <span
                v-if="column.sortable"
                class="b__sort-icon"
              >
                <component
                  :is="getSortIcon(column.key).component"
                  :class="getSortIcon(column.key).class"
                />
              </span>
            </div>
          </th>
        </tr>

        <!-- filter row -->
        <tr>
          <td
            v-if="props.showExpand"
            :style="`background-color: ${props.filterHeaderRowBgColor}`"
            class="b__expand-th"
          ></td>
          <td
            v-if="props.showSelect"
            :style="`background-color: ${props.filterHeaderRowBgColor}`"
            class="b__select-th"
          ></td>
          <template
            v-for="column in columns"
            :key="column.key"
          >
            <td
              style="height: 30px !important"
              :style="`background-color: ${props.filterHeaderRowBgColor}`"
              v-bind="column.headerProps"
            >
              <!-- local (client-side) filters: filter the in-memory data, no backend request -->
              <template v-if="props.localFilter">
                <TextFilterLocal
                  v-if="column.filterType === 'text'"
                  :title="column.title"
                  :column-key="column.key"
                  @value-changed="applyLocalTextFilter"
                />
                <NumberFilterLocal
                  v-else-if="column.filterType === 'number'"
                  :title="column.title"
                  :column-key="column.key"
                  @value-changed="applyLocalNumberFilter"
                />
                <ListFilterLocal
                  v-else-if="column.filterType === 'list'"
                  :column-key="column.key"
                  :data="dataRows"
                  @value-changed="applyLocalListFilter"
                />
              </template>

              <!-- remote (backend) filters -->
              <template v-else>
                <TextFilter
                  v-if="column.filterType === 'text'"
                  :title="column.title"
                  :column="column.column"
                  @value-changed="applyTextFilter"
                />
                <NumberFilter
                  v-else-if="column.filterType === 'number'"
                  :title="column.title"
                  :column="column.column"
                  :columns="column.columns ? column.columns : []"
                  :complex="column.complex ? column.complex : false"
                  @value-changed="applyNumberFilter"
                />
                <ListFilter
                  v-else-if="column.filterType === 'list' && column.list && column.list.length"
                  :column="column.column"
                  :item-title="column.itemTitle"
                  :item-value="column.itemValue"
                  :list="column.list"
                  @value-changed="applyListFilter"
                />
              </template>
            </td>
          </template>
        </tr>
      </template>

      <template
        v-for="(tdItem, tdIndex) in props.bodySlots"
        :key="tdIndex"
        v-slot:[`item.${tdItem}`]="{ index, item }"
      >
        <div v-if="tdItem === 'counter_column'">{{ index + 1 }}</div>
        <div v-else>
          <slot
            :name="tdItem"
            :item="item"
          />
        </div>
      </template>

      <template #b-expanded-row="{ index, item }">
        <slot
          name="expanded-row"
          :item="item"
          :index="index"
        />
      </template>

      <template
        v-if="props.showTotals && props?.apiData?.footer"
        #footer
      >
        <tr class="b__sticky-table-footer">
          <td v-if="props.showSelect" />
          <td v-if="props.showExpand" />
          <td
            v-for="(footer, footerIndex) in visibleHeaders"
            :key="footerIndex"
          >
            <div v-if="footer.key === 'counter_column'" />
            <div v-else>{{ formatNumber(props.apiData.footer[footer.key]) }}</div>
          </td>
        </tr>
      </template>
    </BTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import BTable from './BTable.vue'
import TextFilter from './filter/TextFilter.vue'
import NumberFilter from './filter/NumberFilter.vue'
import ListFilter from './filter/ListFilter.vue'
import TextFilterLocal from './filterLocal/TextFilterLocal.vue'
import NumberFilterLocal from './filterLocal/NumberFilterLocal.vue'
import ListFilterLocal from './filterLocal/ListFilterLocal.vue'
import {
  applyLocalFilters,
  type LocalFilterMap,
  type LocalTextSymbol,
  type LocalNumberSymbol,
  type LocalListLookup,
} from './filterLocal/localFilter'
import type BDatatableProps from '../types'
import type {
  BTableListFilter,
  BTableNumberFilter,
  BTablePerPage,
  BTableSort,
  BTableTextFilter,
  TableHeader,
} from '../types'

const props = withDefaults(defineProps<BDatatableProps>(), {
  hover: false,
  density: 'default',
  title: null,
  headers: () => [],
  bodySlots: () => [],
  apiData: () => ({ results: [], count: 0, next: '', previous: '' }),
  page: 1,
  perPage: 25,
  pageCount: 1,
  perPageOptions: () => [10, 25, 50, 100, 150],
  height: null,
  showTotals: false,
  totalItem: () => ({}),
  showSelect: false,
  showExpand: false,
  useVirtualScroll: true,
  loading: false,
  fixedHeader: false,
  border: () => ({ vertical: false, horizontal: true, table: false, tableBorderRadius: null }),
  localSearch: false,
  localSort: false,
  localFilter: false,
  storeTableHeaderInLocalStorage: false,
  showResetBtn: true,
  showSearchBtn: true,
  showPrintBtn: true,
  showExportToExcelBtn: true,
  exportLoading: false,
  showToggleHeaderBtn: true,
  showPerPageBtn: true,
  showPrevAndNextBtn: true,
  tableHeaderLocalStorageName: null,
  theme: 'light',
  itemKey: 'id',
})

const emit = defineEmits<{
  'update:data': [items: Array<object>]
  'update:text-filter': [obj: BTableTextFilter]
  'update:number-filter': [obj: BTableNumberFilter]
  'update:list-filter': [obj: BTableListFilter]
  'update:sort': [obj: BTableSort]
  'update:prev-page': [page: number]
  'update:next-page': [page: number]
  'update:per-page': [obj: BTablePerPage]
  'update:headers': [headers: TableHeader[]]
  'click:reset': []
  'click:search': []
  'click:print': []
  'click:export-to-excel': []
  'row:expand': [row: object]
  'update:expanded': [rows: Array<object>]
  'update:checked': [rows: Array<object>]
}>()

const hasLeftActions = computed(
  () =>
    props.showResetBtn ||
    props.showSearchBtn ||
    props.showPrintBtn ||
    props.showExportToExcelBtn ||
    props.showToggleHeaderBtn,
)

const perPageList = computed(() => props.perPageOptions)
const perPageWrapper = ref<HTMLElement | null>(null)
const showPerPageDropdown = ref(false)
const columnsWrapper = ref<HTMLElement | null>(null)
const showColumnsDropdown = ref(false)
const hiddenColumns = ref<Set<string>>(new Set())
const columnOrder = ref<Array<string>>([])
const dragSourceIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function loadHiddenColumns() {
  if (!props.storeTableHeaderInLocalStorage || !props.tableHeaderLocalStorageName) return

  try {
    const saved = localStorage.getItem(props.tableHeaderLocalStorageName)
    if (saved) hiddenColumns.value = new Set(JSON.parse(saved))
  } catch {
    //
  }
}

function saveHiddenColumns() {
  if (!props.storeTableHeaderInLocalStorage || !props.tableHeaderLocalStorageName) return

  localStorage.setItem(props.tableHeaderLocalStorageName, JSON.stringify([...hiddenColumns.value]))
}

function loadColumnOrder() {
  if (!props.storeTableHeaderInLocalStorage || !props.tableHeaderLocalStorageName) return

  try {
    const saved = localStorage.getItem(`${props.tableHeaderLocalStorageName}_order`)
    if (saved) {
      const parsed = JSON.parse(saved)
      const validKeys = new Set(props.headers.map((h) => h.key))
      const filtered = parsed.filter((k: string) => validKeys.has(k))
      const savedSet = new Set(filtered)
      columnOrder.value = [...filtered, ...props.headers.filter((h) => !savedSet.has(h.key)).map((h) => h.key)]
    }
  } catch {
    //
  }
}

function saveColumnOrder() {
  if (!props.storeTableHeaderInLocalStorage || !props.tableHeaderLocalStorageName) return

  localStorage.setItem(`${props.tableHeaderLocalStorageName}_order`, JSON.stringify(columnOrder.value))
}

watch(hiddenColumns, saveHiddenColumns, { deep: true })
watch(columnOrder, saveColumnOrder, { deep: true })

const visibleHeaders = computed<TableHeader[]>(() => {
  const headerMap = new Map(props.headers.map((h) => [h.key, h]))
  return columnOrder.value
    .filter((key) => !hiddenColumns.value.has(key))
    .map((key) => headerMap.get(key))
    .filter(Boolean) as TableHeader[]
})

watch(
  () => visibleHeaders.value,
  (val) => {
    emit('update:headers', val)
  },
)

function onClickOutside(e: Event) {
  if (perPageWrapper.value && !perPageWrapper.value.contains(e.target as Node)) {
    showPerPageDropdown.value = false
  }
  if (columnsWrapper.value && !columnsWrapper.value.contains(e.target as Node)) {
    showColumnsDropdown.value = false
  }
}

onMounted(() => {
  columnOrder.value = props.headers.map((h) => h.key)
  loadColumnOrder()
  loadHiddenColumns()
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})

function setPerPage(val: number) {
  emit('update:per-page', { perPage: val, page: 1 })
  showPerPageDropdown.value = false
}

function prevPage() {
  if (props.page > 1) {
    emit('update:prev-page', props.page - 1)
  }
}

function nextPage() {
  if (props.apiData.next) {
    emit('update:next-page', props.page + 1)
  }
}

function handleReset() {
  emit('click:reset')
}

function handleSearch() {
  emit('click:search')
}

function handlePrint() {
  emit('click:print')
}

function handleExcel() {
  emit('click:export-to-excel')
}

function toggleColumn(key: string) {
  const updated = new Set(hiddenColumns.value)
  if (updated.has(key)) {
    updated.delete(key)
  } else {
    updated.add(key)
  }
  hiddenColumns.value = updated
}

function onDragStart(event: DragEvent, index: number) {
  dragSourceIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

function onDragOver(event: DragEvent, index: number) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragOverIndex.value = index
}

function onDrop(event: DragEvent, index: number) {
  event.preventDefault()
  if (dragSourceIndex.value === null || dragSourceIndex.value === index) {
    dragSourceIndex.value = null
    dragOverIndex.value = null
    return
  }
  const newOrder = [...columnOrder.value]
  const [removed] = newOrder.splice(dragSourceIndex.value, 1)
  newOrder.splice(index, 0, removed)
  columnOrder.value = newOrder
  dragSourceIndex.value = null
  dragOverIndex.value = null
}

function onDragEnd() {
  dragSourceIndex.value = null
  dragOverIndex.value = null
}

function resetColumnOrder() {
  columnOrder.value = props.headers.map((h) => h.key)
  hiddenColumns.value = new Set()
}

function getRowProps() {
  return {}
}

function handleCurrentItems(items: Array<object>) {
  emit('update:data', items)
}

function handleExpand(row: object) {
  emit('row:expand', row)
}

function handleUpdateExpanded(arr: Array<object>) {
  emit('update:expanded', arr)
}

function handleUpdateChecked(arr: Array<object>) {
  emit('update:checked', arr)
}

// ============================================
// Local (client-side) filtering
// ============================================
// `props.apiData.results` is typed as object[]; expose a row-shaped view of it so
// the local-filter helpers and ListFilterLocal can index columns by key.
const dataRows = computed(() => props.apiData.results as Array<Record<string, unknown>>)

// Active local filters, keyed by header `key`. Replaced (not mutated) on change
// so the `tableItems` computed re-runs and predicates are recompiled once.
const localFilters = ref<LocalFilterMap>({})

// Items handed to the table: the raw data when local filtering is off, otherwise
// the in-memory data after applying every active local filter.
const tableItems = computed(() => {
  if (!props.localFilter) return props.apiData.results
  return applyLocalFilters(dataRows.value, localFilters.value)
})

function setLocalFilter(key: string, filter: LocalFilterMap[string] | null) {
  const next = { ...localFilters.value }
  if (filter) {
    next[key] = filter
  } else {
    delete next[key]
  }
  localFilters.value = next
}

function applyLocalTextFilter({ key, symbol, value }: { key: string; symbol: LocalTextSymbol; value: string }) {
  setLocalFilter(key, value.trim() ? { type: 'text', symbol, value } : null)
}

function applyLocalNumberFilter({ key, symbol, value }: { key: string; symbol: LocalNumberSymbol; value: string }) {
  setLocalFilter(key, value !== '' ? { type: 'number', symbol, value } : null)
}

function applyLocalListFilter({ key, lookup, values }: { key: string; lookup: LocalListLookup; values: unknown[] }) {
  setLocalFilter(key, values.length ? { type: 'list', lookup, values } : null)
}

function applyTextFilter(obj: BTableTextFilter) {
  emit('update:text-filter', obj)
}
function applyNumberFilter(obj: BTableNumberFilter) {
  emit('update:number-filter', obj)
}
function applyListFilter(obj: BTableListFilter) {
  emit('update:list-filter', obj)
}
function handleSort(obj: BTableSort) {
  emit('update:sort', obj)
}

function formatNumber(number: number | string, defaultVal = null, showAllDecimalPoints = false) {
  if (number === 0) return 0
  if (!number) return defaultVal

  if (isNaN(Number(number))) return number

  number = Number(number)

  if (showAllDecimalPoints) return number.toLocaleString('en-us', { minimumSignificantDigits: 1 })

  return number.toLocaleString('en-us')
}

defineExpose({
  resetColumnOrder,
})
</script>

<style lang="scss" scoped>
.b-dt {
  width: 100%;

  .b-dt__columns-dropdown {
    max-height: 350px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: transparent;
    backdrop-filter: blur(25px);
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 4px 8px;
    gap: 10px;
    border-bottom: 1px solid transparent;

    .b-dt__columns-item {
      user-select: none;
    }

    &--light {
      color: #505050;

      .b-dt__toolbar-left,
      .b-dt__perpage-btn,
      .b-dt__pager,
      .b-dt__count-badge {
        background-color: #f5f5f5;
        border-color: rgba(0, 0, 0, 0.08);
        color: #444;
      }

      .b-dt__perpage-btn:hover:not(:disabled),
      .b-dt__pager-btn:hover:not(:disabled),
      .b-dt__tool-btn:hover {
        background-color: rgba(0, 0, 0, 0.06);
      }

      .b-dt__perpage-dropdown,
      .b-dt__columns-dropdown {
        border-color: rgba(0, 0, 0, 0.07);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .b-dt__perpage-option:hover,
      .b-dt__columns-item:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    &--dark {
      color: #fff;

      .b-dt__toolbar-left,
      .b-dt__perpage-btn,
      .b-dt__pager,
      .b-dt__count-badge {
        background-color: rgba(45, 45, 45, 1);
        border-color: rgba(255, 255, 255, 0.08);
        color: #ddd;
      }

      .b-dt__perpage-btn:hover:not(:disabled),
      .b-dt__pager-btn:hover:not(:disabled),
      .b-dt__tool-btn:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .b-dt__perpage-dropdown,
      .b-dt__columns-dropdown {
        border-color: rgba(255, 255, 255, 0.07);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        color: #ddd;
      }

      .b-dt__perpage-option:hover,
      .b-dt__columns-item:hover {
        background-color: rgba(255, 255, 255, 0.08);
      }

      .b-dt__reorder-footer {
        border-top-color: rgba(255, 255, 255, 0.1);
      }

      .b-dt__reorder-reset-btn {
        border-color: rgba(255, 255, 255, 0.2);

        &:hover {
          background-color: rgba(255, 255, 255, 0.08);
        }
      }
    }
  }

  &__toolbar-slot {
    width: 100%;
  }

  &__toolbar-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  // left actions grouped in a single rounded pill with segment dividers
  &__toolbar-left {
    display: inline-flex;
    align-items: center;
    align-self: center;
    border: 1px solid;
    border-radius: 160px;
    gap: 8px;
    padding: 3px;
  }

  &__tool-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: inherit;
    transition: background-color 0.12s;
  }

  &__spinner {
    animation: b-dt__spin 0.8s linear infinite;
  }

  @keyframes b-dt__spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  &__columns {
    position: relative;
  }

  &__columns-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1000;
    min-width: 180px;
    margin: 0;
    border: 1px solid;
    border-radius: 16px;
  }

  &__col-panel {
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0;
    padding: 4px 0;
    list-style: none;
  }

  &__reorder-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__reorder-item {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &--dragging {
      opacity: 0.4;
    }

    &--dragover {
      border-top: 2px solid #2196f3;
    }
  }

  &__reorder-handle {
    display: inline-flex;
    align-items: center;
    margin-right: 0px;
    opacity: 0.4;
    flex-shrink: 0;
  }

  &__reorder-footer {
    padding: 6px 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }

  &__reorder-reset-btn {
    width: 100%;
    padding: 4px 0;
    font-size: 12px;
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.18);
    border-radius: 16px;
    cursor: pointer;
    color: inherit;
    transition: background-color 0.12s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  &__columns-item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    margin: 0px 6px;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.1s;

    &:hover {
      border-radius: 8px;
    }
  }

  &__columns-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    flex-shrink: 0;
    color: #2196f3;
  }

  &__perpage {
    position: relative;
  }

  &__perpage-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 30px;
    padding: 0 10px;
    border: 1px solid;
    border-radius: 16px;
    cursor: pointer;
    font-size: 13px;
    transition: background-color 0.12s;
  }

  &__perpage-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1000;
    min-width: 80px;
    margin: 0;
    padding: 4px 0;
    list-style: none;
    border: 1px solid;
    border-radius: 16px;
    background-color: transparent;
    backdrop-filter: blur(25px);
  }

  &__perpage-option {
    padding: 6px 16px;
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.1s;

    &--active {
      color: #2196f3;
      font-weight: 500;
    }
  }

  // total records shown in a circular badge (grows to a pill for long numbers)
  &__count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 30px;
    padding: 0 9px;
    border: 1px solid;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    box-sizing: border-box;
  }

  // unified segmented pill: prev | page / pageCount | next
  &__pager {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    border: 1px solid;
    border-radius: 160px;
    padding: 2px 3px;
  }

  &__pager-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: inherit;
    transition: background-color 0.12s;

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }
  }

  &__pager-info {
    display: inline-flex;
    align-items: center;
    height: 26px;
    padding: 0 8px;
    font-size: 13px;
    white-space: nowrap;
  }

  &__btn-disabled {
    pointer-events: none;
    opacity: 0.6;
  }
}

.active-filter {
  background-color: var(--b-active-filter-bg-color) !important;
}
</style>

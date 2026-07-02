<template>
  <div class="b--main-container">
    <div style="margin-bottom: 0rem; display: flex; align-items: center; gap: 12px">
      <div style="font-size: 28px">Sales</div>
      <button
        type="button"
        class="theme-btn"
        @click="changeTheme()"
      >
        Dark/Light
      </button>
    </div>

    <BDatatable
      ref="tableRef"
      :loading="loading"
      :page="queryParams.page"
      :per-page="queryParams.page_size"
      :page-count="pageCount"
      :api-data="apiData"
      :headers="headers"
      :body-slots="bodySlots"
      fixed-header
      :border="{
        table: true,
        tableBorderRadius: '0.5rem',
      }"
      height="600px"
      hover
      show-totals
      show-expand
      :theme="theme"
      density="compact"
      :use-virtual-scroll="true"
      store-table-header-in-local-storage
      table-header-local-storage-name="my-stock-header"
      show-select
      @click:export-to-excel="handleExportToExcel()"
      @click:reset="handleReset()"
      @click:search="handleSearch()"
      @click:print="handlePrint()"
      @update:text-filter="handleUpdateTextFilter"
      @update:number-filter="handleUpdateNumberFilter"
      @update:list-filter="handleUpdateListFilter"
      @update:sort="handleUpdateSort"
      @update:prev-page="handleUpdatePrevPage"
      @update:next-page="handleUpdateNextPage"
      @update:per-page="handleUpdatePerPage"
      @update:checked="handleUpdateChecked"
    >
      <template #invoice_no="{ item }">
        <span style="color: #2196f3">{{ item.invoice_no }}</span>
      </template>

      <template #is_cash="{ item }">
        <span
          v-if="item.is_cash"
          style="color: #2196f3"
        >
          Cash
        </span>
        <span
          v-else
          style="color: #ff5252"
        >
          Debit
        </span>
      </template>

      <template #total_price="{ item }">
        <span>{{ Number(item.total_price).toLocaleString('en-us') }}</span>
      </template>
      <template #net_price="{ item }">
        <span>{{ Number(item.net_price).toLocaleString('en-us') }}</span>
      </template>
      <template #net_price_fc="{ item }">
        <span>{{ Number(item.net_price_fc).toLocaleString('en-us') }}</span>
      </template>
      <template #total_quantity="{ item }">
        <span>{{ Number(item.total_quantity).toLocaleString('en-us') }}</span>
      </template>
      <template #total_bonus="{ item }">
        <span>{{ Number(item.total_bonus).toLocaleString('en-us') }}</span>
      </template>
      <template #minus="{ item }">
        <span>{{ Number(item.minus).toLocaleString('en-us') }}</span>
      </template>

      <template #input_date="{ item }">
        <div>{{ formatDate(item.input_date) }}</div>
      </template>
      <template #created_at="{ item }">
        <div style="white-space: nowrap">{{ formatDateTime(item.created_at) }}</div>
      </template>

      <template #actions="{ item }">
        <div class="action-btn-container">
          <button @click="handleEdit(item)">Edit</button>
          <button @click="handleDelete(item)">Delete</button>
        </div>
      </template>

      <!-- Expanded row -->
      <template #expanded-row="{ item }">
        <ul>
          <li>{{ item.id }}</li>
        </ul>
      </template>
    </BDatatable>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BDatatable from './components/BDatatable.vue'
import type {
  TableHeader,
  TableResult,
  BTableSort,
  BTablePerPage,
  BTableTextFilter,
  BTableNumberFilter,
  BTableListFilter,
  Theme,
} from './types'

interface Inventory {
  id: number
  name: string
}

interface Supplier {
  id: number
  name: string
  code?: string
  type?: number
  phone?: string | null
}

const branchList = ref([
  {
    id: 1,
    name: 'Main',
    prefix: 'M',
    color: null,
    created_at: '2025-01-11T02:09:55.877045+03:00',
  },
])
const invList = ref<Inventory[]>([
  { id: 1, name: 'Main Inventory' },
  { id: 2, name: 'Second Inventory' },
  { id: 3, name: 'Maxzany mandwby 1' },
  { id: 4, name: 'مەخزەنی سیداد' },
  { id: 5, name: 'MAXZANI said' },
  { id: 6, name: 'maxzani omer' },
  { id: 7, name: 'مەخزەنی رابەر' },
  { id: 8, name: 'jamal1' },
  { id: 9, name: 'sidad1' },
  { id: 10, name: 'saed1' },
  { id: 11, name: 'abdulrahman1' },
  { id: 12, name: 'rebin1' },
  { id: 13, name: 'mustafa' },
  { id: 14, name: 'ali1' },
])
const cashDebitList = ref([
  { title: 'Cash', value: true },
  { title: 'Debit', value: false },
])
const customerList = ref<Supplier[]>([
  { id: 1, name: 'General', phone: null },
  { id: 76, name: 'مارکیت مستەفا 3', phone: '0750' },
  { id: 75, name: 'مارکیت مستەفا 2', phone: '0750' },
  { id: 74, name: 'مارکیت مستەفا 1', phone: '0750' },
  { id: 73, name: 'مارکیت علی 12', phone: '0750' },
  { id: 72, name: 'مارکیت احمد 12', phone: '07504' },
  { id: 71, name: 'مارکیت محمد 12', phone: '07504' },
  { id: 70, name: 'مارکیت علی 1111', phone: '0750' },
  { id: 69, name: 'مارکیت محمد 1111', phone: '0750' },
  { id: 68, name: 'مارکیت احمد 1111', phone: '0750' },
  { id: 67, name: 'مارکیت علی 111', phone: '0750' },
  { id: 66, name: 'مارکیت احمد 111', phone: '00750' },
  { id: 65, name: 'مارکیت محمد 111', phone: '0750' },
  { id: 64, name: 'مارکیت علی 11', phone: '0750' },
  { id: 63, name: 'مارکیت محمد 11', phone: '0750' },
  { id: 62, name: 'مارکیت احمد 11', phone: '0751' },
  { id: 61, name: 'مارکیت علی 1', phone: '750' },
  { id: 60, name: 'مارکیت احمد 1', phone: '0750' },
  { id: 59, name: 'مارکیت محمد 1', phone: '0750' },
  { id: 53, name: 'مارکیت علی 2', phone: '0750' },
  { id: 52, name: 'مارکیت ناوزاد', phone: '0750' },
  { id: 51, name: 'مرکیت محمد', phone: '0750' },
  { id: 50, name: 'مارکیت خۆشناو', phone: '0750' },
  { id: 49, name: 'مارکیت تیم مارت', phone: '07500' },
  { id: 48, name: 'مارکیت ئادەم', phone: '09877' },
  { id: 47, name: 'مارکیت هیوا', phone: '9898698' },
  { id: 46, name: 'test3', phone: null },
  { id: 45, name: 'test2', phone: null },
  { id: 44, name: 'test1', phone: null },
  { id: 43, name: 'تیمارتی نازناز', phone: '4444' },
  { id: 42, name: 'مارکیت مستەفا', phone: '0750' },
  { id: 41, name: 'مارکیت سعید', phone: '0750' },
  { id: 40, name: 'مارکیت علی', phone: '0750' },
  { id: 39, name: 'مارکیت جەمال', phone: '0750' },
  { id: 38, name: 'مارکیت سیداد', phone: '0750' },
  { id: 37, name: 'مارکیت احمد', phone: '0750' },
  { id: 29, name: 'مارکێتی هەوار', phone: null },
  { id: 28, name: 'markety shaxy', phone: null },
  { id: 27, name: 'markety dldar', phone: null },
  { id: 23, name: 'محمد 1', phone: '' },
  { id: 22, name: 'رێکار صاڵح', phone: '١٢٣٤٥٦٧' },
  { id: 21, name: 'محمد', phone: null },
  { id: 19, name: 'رێکار', phone: '132' },
  { id: 17, name: 'کاک هیوا ساڵح', phone: '02121231' },
  { id: 15, name: 'کۆمپانیای رابەر', phone: '07707423031' },
  { id: 12, name: 'rabar', phone: '07707423031' },
  { id: 9, name: 'Meri', phone: null },
  { id: 8, name: 'Miss Rock', phone: null },
  { id: 7, name: 'lana', phone: null },
  { id: 6, name: 'mohammad', phone: null },
  { id: 5, name: 'kawan lavender', phone: '07704364422' },
])

const headers = ref<TableHeader[]>([
  { title: 'ID', key: 'id', column: 'id', sortable: true, filterType: 'id', headerProps: { style: 'width: 55px' } },
  {
    title: 'Branch',
    key: 'branch.name',
    column: 'branch',
    sortable: true,
    filterType: 'list',
    list: branchList.value,
  },
  {
    title: 'Inventory',
    key: 'inventory.name',
    column: 'inventory',
    sortable: true,
    filterType: 'list',
    list: invList.value,
  },
  {
    title: 'Customer',
    key: 'partner.name',
    column: 'partner',
    sortable: true,
    filterType: 'list',
    list: customerList.value,
  },
  { title: 'Invoice No.', key: 'invoice_no', column: 'invoice_no', sortable: true, filterType: 'text' },
  {
    title: 'Cash/Debit',
    key: 'is_cash',
    column: 'is_cash',
    sortable: true,
    filterType: 'list',
    list: cashDebitList.value,
    itemTitle: 'title',
    itemValue: 'value',
  },
  {
    title: 'Currency',
    key: 'currency.code',
    column: 'currency',
    sortable: true,
    filterType: 'list',
    list: [
      { id: 1, code: 'IQD', name: 'IQD' },
      { id: 2, code: 'USD', name: 'USD' },
    ],
  },
  { title: 'Total Price', key: 'total_price', sortable: true, column: 'total_price', filterType: 'number' },
  { title: 'Discount', key: 'discount', sortable: true, column: 'discount', filterType: 'number' },
  { title: 'Minus', key: 'minus', sortable: true, column: 'minus', filterType: 'number' },
  { title: 'Net Price', key: 'net_price', sortable: true, column: 'net_price', filterType: 'number' },
  { title: 'Net Price (FC)', key: 'net_price_fc', sortable: true, column: 'net_price_fc', filterType: 'number' },
  { title: 'Total Quantity', key: 'total_quantity', sortable: true, column: 'total_quantity', filterType: 'number' },
  { title: 'Total Bonus', key: 'total_bonus', sortable: true, column: 'total_bonus', filterType: 'number' },
  {
    title: 'Status',
    key: 'invoice_status',
    column: 'invoice_status',
    filterType: 'list',
    list: [
      { title: 'Unpaid', value: 'Unpaid', color: 'error' },
      { title: 'Paid', value: 'Paid', color: 'success' },
      { title: 'Partial Paid', value: 'Partial Paid', color: 'warning' },
    ],
    itemTitle: 'title',
    itemValue: 'value',
    sortable: false,
  },
  {
    title: 'Sale Status',
    key: 'status',
    column: 'status',
    filterType: 'list',
    list: [
      { title: 'Draft', value: 'draft' },
      { title: 'Pending', value: 'pending' },
      { title: 'Completed', value: 'completed' },
    ],
    itemTitle: 'title',
    itemValue: 'value',
    sortable: false,
  },
  {
    title: 'User',
    key: 'user.username',
    sortable: false,
    column: 'user',
    filterType: 'list',
    list: [
      { id: 16, username: 'mustafa1' },
      { id: 6, username: 'ali ' },
      { id: 7, username: 'mustafa' },
      { id: 14, username: 'abdulrahman1' },
      { id: 2, username: 'cashier1' },
      { id: 3, username: 'cashier2' },
      { id: 1, username: 'superadmin' },
      { id: 5, username: 'sidad' },
      { id: 10, username: 'rabar1' },
      { id: 8, username: 'SAID' },
      { id: 9, username: 'omer' },
      { id: 15, username: 'rebin1' },
      { id: 17, username: 'ali1' },
      { id: 13, username: 'saed1' },
      { id: 12, username: 'sidad1' },
      { id: 4, username: 'mandwb1' },
      { id: 11, username: 'jamal1' },
    ],
    itemTitle: 'username',
  },
  { title: 'Date', key: 'input_date', sortable: true, column: 'input_date' },
  { title: 'Created At', key: 'created_at', sortable: true, column: 'created_at' },
  {
    title: '',
    key: 'actions',
    sortable: false,
    align: 'center',
    cellProps: { class: 'table-action-column border-s-sm' },
    // headerProps: { class: 'table-action-column border-s-sm' },
  },
])
const bodySlots: Array<string> = [
  'invoice_no',
  'is_cash',
  'total_price',
  'net_price',
  'net_price_fc',
  'total_quantity',
  'total_bonus',
  'invoice_status',
  'status',
  'minus',
  'input_date',
  'created_at',
  'actions',
]

const tableRef = ref<InstanceType<typeof BDatatable>>()
const baseUrl = ref<string>('https://demo.merycompany.com')

onMounted(() => {
  getData()
})

const loading = ref(false)
const apiData = ref<TableResult>({ results: [], count: 0, footer: {}, next: null, previous: null })

interface QueryParams {
  sortBy?: string
  sortDir?: string
  search: string | null
  ordering?: string
  page: number
  perPage?: number
  page_size?: number
  text?: Array<BTableTextFilter>
  number?: Array<BTableNumberFilter>
  /**
   * [key: string]: unknown is an index signature
   * it tells TypeScript "this object may also have any additional string keys with unknown values".
   * This covers your dynamic list filter properties like inventory, supplier, etc.
   * unknown is used instead of any because it's safer
   * it still requires you to narrow the type before using the value, while any disables all type checking.
   */
  [key: string]: unknown
}
const queryParams = ref<QueryParams>({
  ordering: '-id',
  search: '',
  page: 1,
  page_size: 25,
  input_date_after: '2025-06-01',
  input_date_before: '2026-06-01',
})

const pageCount = computed(() => {
  return Math.ceil(apiData.value.count / (queryParams.value.page_size ?? 25))
})

function buildSearchParams(params: QueryParams) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)))
    } else {
      searchParams.append(key, String(value))
    }
  })
  return searchParams
}

async function getData() {
  loading.value = true
  const token = import.meta.env.VITE_BEARER_TOKEN
  try {
    const params = buildSearchParams(queryParams.value)
    const response = await fetch(`${baseUrl.value}/api/sale/?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    apiData.value = data
    // apiData.value.data = apiData.value.data.map((el) => {
    //   return {
    //     ...el,
    //     is_checked: true,
    //   }
    // })
  } finally {
    loading.value = false
  }
}

// change theme
const theme = ref<Theme>(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
document.documentElement.setAttribute('data-theme', theme.value)
function changeTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
}

function handleExportToExcel() {
  alert('Excel export done')
}

function handleReset() {
  console.log('handleReset')
}

function handleSearch() {
  getData()
}

function handlePrint() {
  console.log('handlePrint')
}

function formatDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12 || 12

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

function handleUpdateTextFilter(obj: BTableTextFilter) {
  // check if incoming object exist
  for (let param in queryParams.value) {
    const lastIndex = param.lastIndexOf('__')

    if (lastIndex > -1) {
      param = param.substring(0, lastIndex)
    }

    if (obj.columnQuery.includes(param)) {
      delete queryParams.value[param]
      delete queryParams.value[param + '__istartswith']
      delete queryParams.value[param + '__iendswith']
      delete queryParams.value[param + '__icontains']
      delete queryParams.value[param + '__iexact']
      delete queryParams.value[param + '__not']
      delete queryParams.value[param + '__not__icontains']
    }
  }

  if (obj.value !== null) {
    queryParams.value[obj.columnQuery] = obj.value
  }

  queryParams.value.page = 1
  getData()
}

function handleUpdateNumberFilter(obj: BTableNumberFilter) {
  // check if incoming object exist
  for (let param in queryParams.value) {
    const lastIndex = param.lastIndexOf('__')

    if (lastIndex > -1) {
      param = param.substring(0, lastIndex)
    }

    if (obj.columnQuery.includes(param)) {
      delete queryParams.value[param]
      delete queryParams.value[param + '__lt']
      delete queryParams.value[param + '__lte']
      delete queryParams.value[param + '__gt']
      delete queryParams.value[param + '__gte']
      delete queryParams.value[param + '__not']
    }
  }

  if (obj.value !== null) {
    queryParams.value[obj.columnQuery] = obj.value
  }

  queryParams.value.page = 1
  getData()
}

function handleUpdateListFilter(obj: BTableListFilter) {
  // remove existing filter on incoming column
  for (const param in queryParams.value) {
    if (obj.column.includes(param)) {
      delete queryParams.value[param]
    }
  }

  if (obj.values.length) {
    queryParams.value[obj.column] = obj.values.join(',')
  }

  queryParams.value.page = 1
  getData()
}

function handleUpdateSort(obj: BTableSort) {
  if (obj?.column && obj?.direction) {
    if (obj.direction === 'asc') {
      queryParams.value.ordering = obj.column
    } else {
      queryParams.value.ordering = `-${obj.column}`
    }
  } else {
    queryParams.value.ordering = '-id'
  }
  getData()
}

function handleUpdatePrevPage(page: number) {
  queryParams.value.page = page
  getData()
}

function handleUpdateNextPage(page: number) {
  queryParams.value.page = page
  getData()
}

function handleUpdatePerPage(obj: BTablePerPage) {
  queryParams.value.page_size = obj.perPage
  queryParams.value.page = obj.page
  getData()
}

function handleEdit(item: object) {
  console.log('handleEdit', item)
}

function handleDelete(item: object) {
  console.log('handleDelete', item)
}

function handleUpdateChecked(checkedItems: Array<object>) {
  console.log(checkedItems)
}
</script>

<style lang="scss">
@use './assets/style.scss';

.theme-btn-container {
  text-align: center;
  margin: 1rem 0;
}

.theme-btn {
  outline: none;
  border: none;
  height: 26px;
  padding: 0px 12px;
  font-family: sans-serif;
  border-radius: 0.5rem;
  cursor: pointer;
  box-shadow: inset -4px -4px 2px rgba(100, 100, 100, 0.3);
}

.action-btn-container {
  display: flex;
  gap: 6px;

  button {
    border: none;
    height: 22px;
    padding: 0px 12px;
    border-radius: 6px;
    cursor: pointer;
    color: white;
    background-color: rgba(50, 50, 50, 0.5);
  }
}

.b--main-container {
  padding: 16px 16px;
  font-family: sans-serif, monospace;
}
</style>

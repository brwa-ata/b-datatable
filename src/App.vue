<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SmDatatable from './components/SmDatatable.vue'
import type {
  TableHeader,
  TableResult,
  SmTableSort,
  SmTablePerPage,
  SmTableTextFilter,
  SmTableNumberFilter,
  SmTableListFilter,
  Theme,
} from './types'

interface Inventory {
  id: number
  type: number
  name: string
  prefix: string
}

interface Supplier {
  id: number
  name: string
  code: string
  type: number
  phone: string | null
}

const invList = ref<Inventory[]>([
  { id: 1, type: 1, name: 'Main Branch', prefix: 'MB' },
  { id: 2, type: 1, name: 'Branch 2', prefix: 'B2' },
  { id: 3, type: 1, name: 'Branch 3', prefix: 'B3B' },
])
const suppliersList = ref<Supplier[]>([
  { id: 1, name: 'Bazar', code: 'S1', type: 0, phone: '0' },
  { id: 2, name: 'Supplier 2', code: 'S2', type: 0, phone: '1' },
  { id: 3, name: 'market', code: 'S3', type: 0, phone: '098789' },
  { id: 4, name: 'saman ali', code: 'S4', type: 0, phone: '099' },
  { id: 5, name: 'xalid', code: 'S5', type: 0, phone: '089756' },
  { id: 6, name: 'Azad Company', code: 'S6', type: 0, phone: null },
  { id: 7, name: 'hasan baqi', code: 'S7', type: 0, phone: '00' },
  { id: 8, name: 'Kak ahmad', code: 'S8', type: 0, phone: '2636273737' },
  { id: 9, name: 'دابینکەری یەکەم', code: 'S9', type: 0, phone: null },
  { id: 10, name: 'ئەحمەد عەلی', code: 'S10', type: 0, phone: null },
  { id: 11, name: 'کاروان کەریم', code: 'S11', type: 0, phone: null },
  { id: 12, name: 'کۆمپانیای شازاد', code: 'S12', type: 0, phone: null },
  { id: 13, name: 'كاروان کەریم', code: 'S13', type: 0, phone: null },
  { id: 14, name: 'Grespania', code: 'S14', type: 0, phone: null },
  { id: 15, name: 'Supplier A', code: 'S15', type: 0, phone: null },
  { id: 16, name: 'Net Gate', code: 'S16', type: 0, phone: null },
  { id: 17, name: 'هەوراز', code: 'S17', type: 1, phone: null },
  { id: 18, name: 'narcihealth company', code: 'S18', type: 0, phone: null },
  { id: 19, name: 'LG', code: 'S19', type: 0, phone: null },
  { id: 20, name: 'HP', code: 'S20', type: 0, phone: '00000' },
  { id: 21, name: 'stationary', code: 'S21', type: 0, phone: '987654' },
  { id: 22, name: 'amc hospital', code: 'S22', type: 2, phone: null },
  { id: 23, name: 'par hospital', code: 'S23', type: 2, phone: null },
  { id: 24, name: 'supplier 2', code: 'S24', type: 0, phone: '00000' },
  { id: 25, name: 'goran net', code: 'S25', type: 2, phone: '00' },
  { id: 26, name: 'کارتی مۆبایل', code: 'S26', type: 2, phone: null },
  { id: 27, name: 'Acer', code: 'S27', type: 0, phone: null },
  { id: 28, name: 'peshangay mateen', code: 'S28', type: 0, phone: null },
  { id: 29, name: 'yarnda', code: 'S29', type: 0, phone: null },
  { id: 30, name: 'slemani', code: 'S30', type: 0, phone: '994684684946894' },
  { id: 31, name: 'kak omer', code: 'S31', type: 0, phone: null },
  { id: 32, name: 'ahmad', code: 'S32', type: 0, phone: null },
])

const headers = ref<TableHeader[]>([
  { title: '#', key: 'counter_column', sortable: false, column: 'counter_column' },
  {
    title: 'Inventory',
    key: 'inventory',
    sortable: true,
    column: 'inventory_id',
    filterType: 'list',
    list: invList.value,
  },
  {
    title: 'Supplier',
    key: 'supplier',
    sortable: true,
    column: 'supplier_id',
    filterType: 'list',
    list: suppliersList.value,
  },
  {
    title: 'Name',
    key: 'item_name',
    sortable: true,
    column: 'items.name',
    filterType: 'text',
    // headerProps: { style: 'background-color: tomato;' },
    // cellProps: { style: 'background-color: skyblue;' },
  },
  { title: 'Barcode', key: 'barcode', sortable: true, column: 'items.barcode', filterType: 'text' },
  { title: 'Quantity', key: 'quantity', sortable: true, column: 'products.quantity', filterType: 'number' },
  {
    title: 'Purchase Price',
    key: 'purchase_price',
    sortable: true,
    column: 'products.purchase_price',
    filterType: 'number',
  },
  {
    title: 'Total Purchase Price',
    key: 'total_purchase_price',
    sortable: true,
    complex: true,
    column: 'products.total_purchase_price',
    columns: ['products.quantity', 'products.purchase_price'],
    filterType: 'number',
  },
  { title: 'Cost', key: 'cost', sortable: true, column: 'products.cost', filterType: 'number' },
  {
    title: 'Total Cost',
    key: 'total_cost',
    sortable: true,
    column: 'products.total_cost',
    complex: true,
    columns: ['products.quantity', 'products.cost'],
    filterType: 'number',
  },
  { title: 'Created At', key: 'created_at', sortable: true, column: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false, column: 'actions', align: 'center' },
])
const bodySlots: Array<string> = [
  'counter_column',
  'item_name',
  'purchase_price',
  'total_purchase_price',
  'cost',
  'total_cost',
  'created_at',
  'actions',
]

const tableRef = ref<InstanceType<typeof SmDatatable>>()
const baseUrl = ref<string>('https://demo.smapplication.com')

onMounted(() => {
  getData()
})

const loading = ref(false)
const results = ref<TableResult>({ data: [], total: 0, footer: {} })

interface QueryParams {
  sortBy: string
  sortDir: string
  search: string | null
  page: number
  perPage: number
  text: Array<SmTableTextFilter>
  number: Array<SmTableNumberFilter>
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
  sortBy: 'id',
  sortDir: 'desc',
  search: '',
  page: 1,
  perPage: 50,
  text: [],
  number: [],
})

async function getData() {
  loading.value = true
  const token = import.meta.env.VITE_BEARER_TOKEN
  try {
    const response = await fetch(`${baseUrl.value}/api/product/index`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(queryParams.value),
    })
    const data = await response.json()
    results.value = data
    // results.value.data = results.value.data.map((el) => {
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

function handleUpdateTextFilter(obj: SmTableTextFilter) {
  /**
   * check if incoming object exist in queryParams
   * if incoming object has value append it to queryParams, if not remove ir from queryParams
   */
  const foundIndex = queryParams.value.text.findIndex((item) => item.column === obj.column)
  if (foundIndex > -1) {
    if (obj?.value?.length) {
      queryParams.value.text[foundIndex] = { ...obj, complex: false }
    } else {
      queryParams.value.text.splice(foundIndex, 1)
    }
  } else if (obj?.value?.length) {
    queryParams.value.text.push({ ...obj, complex: false })
  }

  queryParams.value.page = 1
  getData()
}

function handleUpdateNumberFilter(obj: SmTableNumberFilter) {
  /**
   * check if incoming object exist in queryParams
   * if incoming object has value append it to queryParams, if not remove ir from queryParams
   */
  const foundIndex = queryParams.value.number.findIndex((item) => item.column === obj.column)
  if (foundIndex > -1) {
    if (obj?.value?.length) {
      queryParams.value.number[foundIndex] = { ...obj, complex: false }
    } else {
      queryParams.value.number.splice(foundIndex, 1)
    }
  } else if (obj?.value?.length) {
    queryParams.value.number.push({ ...obj, complex: false })
  }

  queryParams.value.page = 1
  getData()
}

function handleUpdateListFilter(obj: SmTableListFilter) {
  const splitted = obj.column.split('__')
  const headerKey = splitted[0]
  const lookup = splitted[1]
  const lookupKey = `${headerKey}_lookup`

  if (obj.values.length === 0) {
    delete queryParams.value[headerKey]
    delete queryParams.value[lookupKey]
  } else {
    queryParams.value[headerKey] = obj.values
    queryParams.value[lookupKey] = lookup
  }

  queryParams.value.page = 1
  getData()
}

function handleUpdateSort(obj: SmTableSort) {
  queryParams.value.sortBy = obj?.column ?? 'id'
  queryParams.value.sortDir = obj?.direction ?? 'asc'
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

function handleUpdatePerPage(obj: SmTablePerPage) {
  queryParams.value.perPage = obj.perPage
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

<template>
  <div class="sm--main-container">
    <div style="margin-bottom: 0rem; display: flex; align-items: center; gap: 12px">
      <div style="font-size: 28px">Stock</div>
      <button
        type="button"
        class="theme-btn"
        @click="changeTheme()"
      >
        Dark/Light
      </button>
    </div>

    <SmDatatable
      ref="tableRef"
      :loading="loading"
      :page="queryParams.page"
      :perPage="queryParams.perPage"
      :results="results"
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
      <template #item_name="{ item }">
        <span style="color: #2196f3">{{ item.item_name }}</span>
      </template>

      <template #purchase_price="{ item }">
        <span>{{ Number(item.purchase_price).toLocaleString('en-us') }}</span>
      </template>
      <template #total_purchase_price="{ item }">
        <span>{{ Number(item.total_purchase_price).toLocaleString('en-us') }}</span>
      </template>
      <template #cost="{ item }">
        <span>{{ Number(item.cost).toLocaleString('en-us') }}</span>
      </template>
      <template #total_cost="{ item }">
        <span>{{ Number(item.total_cost).toLocaleString('en-us') }}</span>
      </template>

      <template #created_at="{ item }">
        <div style="white-space: nowrap">{{ item.created_at }}</div>
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
    </SmDatatable>
  </div>
</template>

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

.sm--main-container {
  padding: 16px 16px;
  font-family: sans-serif, monospace;
}
</style>

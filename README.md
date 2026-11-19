# b-datatable

## Installation + Update

```
npm install git+https://github.com/brwa-ata/b-datatable.git --force
```

after this command you should restart the vue dev server

`filterType: 'date'` uses [b-date-input](https://github.com/brwa-ata/b-date-input), which is a peer
dependency and is **not** bundled into b-datatable. The project must install it and load its styles once
(skip the CSS import if you already theme it through its SCSS):

```
npm install git+https://github.com/brwa-ata/b-date-input.git --force
```

```
import 'b-date-input/style.css'
```

## Date filter

Set `filterType: 'date'` on a header to get a date-range filter. Picking both dates (or clearing them)
emits `update:date-filter`:

```
{ title: 'Date', key: 'input_date', column: 'input_date', sortable: true, filterType: 'date' }
```

```
<BDatatable :headers="headers" @update:date-filter="handleDateFilter" />

function handleDateFilter(obj) {
  // obj = { column: 'input_date', after: '2026-01-01', before: '2026-01-31',
  //         afterQuery: 'input_date_after', beforeQuery: 'input_date_before' }
  // after / before are null when the filter is cleared
  delete queryParams[obj.afterQuery]
  delete queryParams[obj.beforeQuery]
  if (obj.after && obj.before) {
    queryParams[obj.afterQuery] = obj.after
    queryParams[obj.beforeQuery] = obj.before
  }
  getData()
}
```

## ID filter

`filterType: 'id'` is a plain input with no lookup menu: it filters on the exact value, sent under the
bare column name (`?id=42`, no `__suffix`). Pressing Enter applies it, clearing it emits `value: null`:

```
{ title: 'ID', key: 'id', column: 'id', sortable: true, filterType: 'id' }
```

```
<BDatatable :headers="headers" @update:id-filter="handleIdFilter" />

function handleIdFilter(obj) {
  // obj = { column: 'id', value: '42', columnQuery: 'id' }   (value is null when cleared)
  delete queryParams[obj.columnQuery]
  if (obj.value) queryParams[obj.columnQuery] = obj.value
  getData()
}
```

With `localFilter` it is an exact match on the loaded rows.

## Remembering filters (localStorage)

`storeTableHeaderInLocalStorage` remembers which columns are shown and in what order.
`storeFiltersInLocalStorage` remembers what the table is **filtered** and **sorted** by, so a
browser refresh (or coming back to the page later) brings the same rows back instead of an
empty filter row. Both read the same name and must be given one:

```
<BDatatable
  :headers="headers"
  :api-data="apiData"
  store-table-header-in-local-storage
  store-filters-in-local-storage
  table-header-local-storage-name="orders_table"
  @filters:restored="handleFiltersRestored"
  @update:text-filter="handleTextFilter"
  ...
/>
```

The filter row is stored under `<name>_filters`. Give every table its own name: two tables
sharing one name share their filters.

On load the table fills its own filter inputs from storage and emits **`filters:restored`** once,
with the same objects the `update:*-filter` and `update:sort` events emit. The table does not
fetch anything — feed the payload through the handlers already written for those events, without
requesting, and let the first request go out filtered:

```
function handleFiltersRestored(obj) {
  // obj = { text: [...], number: [...], list: [...], date: [...], id: [...], sort: { column, direction } | null }
  obj.text.forEach(applyTextFilter)
  obj.number.forEach(applyNumberFilter)
  obj.list.forEach(applyListFilter)
  obj.date.forEach(applyDateFilter)
  obj.id.forEach(applyIdFilter)
  if (obj.sort) applySort(obj.sort)
}
```

It is emitted while the table is being created, before the host's `onMounted`, so the query params
are ready in time for the first request. Nothing is emitted when there is nothing stored.

Two details worth knowing:

- A filter whose column is no longer in `headers` is dropped on load. It has no input to show it,
  and a table filtered by a column nobody can see is worse than a lost filter.
- The reset button clears the stored filters and empties the filter row along with them. Hosts that
  do not switch `storeFiltersInLocalStorage` on keep the old behaviour, where reset only emits
  `click:reset`.

## Language and RTL

Built-in strings (toolbar tooltips, filter menus, placeholders, "No results found", ...) come in
English (`en`, default), Kurdish Sorani (`ckb`) and Arabic (`ar`). `ckb` and `ar` render right-to-left
automatically. Region tags such as `ar-IQ` are accepted; an unknown locale falls back to English.

```
<BDatatable :headers="headers" :api-data="apiData" locale="ckb" />
```

| prop       | type                             | default            |
| ---------- | -------------------------------- | ------------------ |
| `locale`   | `'en' \| 'ckb' \| 'ar'`          | `'en'`             |
| `dir`      | `'ltr' \| 'rtl'`                 | follows the locale |
| `messages` | `Partial<BMessages>`             | `null`             |

`BTable` takes the same three props, and inherits them when it sits inside a `BDatatable`.
Column titles come from your `headers`, so translate those yourself.

Override any single string with `messages` (keys are listed in `src/i18n.ts`):

```
<BDatatable locale="ar" :messages="{ noResults: 'لا توجد فواتير' }" />
```

Or set an app-wide default when installing the plugin (a component's own props still win). Pass a
`reactive()` object to switch the language at runtime:

```
import BDatatablePlugin from 'b-datatable'

app.use(BDatatablePlugin, { locale: 'ckb' })
```

## How to use

| simple table with local sort, filter and search

```
import { BTable } from 'b-datatable'

<BTable
  :headers="datatable.headers"
  :items="results.data"
  fixed-header
  hover
  :local-search="true"
  :local-sort="true"
/>
```

simple table props

```
{
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
  rowProps: { type: [Object, Function], default: () => {} },
  rowClass: { type: [String, Array, Object, Function], default: '' },
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
  virtualScrollBuffer: { type: Number, default: 5 },
}
```

| row class

Use `rowClass` to add class(es) to body rows. Pass a static value, or a function that
receives the row data and returns the class(es):

```
<BDatatable
  :headers="headers"
  :api-data="apiData"
  :row-class="(item, index) => (item.quantity < 0 ? 'row--negative' : '')"
/>
```

The function is called with `(item, index)` where `item` is the row data and `index` is the
row index in the full item list. It may return a string, an array, or an object
(`{ 'row--negative': item.quantity < 0 }`) — anything Vue's `:class` accepts.
`rowClass` works the same on `BTable` and `BDatatable`.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

&nbsp;

## Compile and Minify for Installation

1. Change package version in `package.json` file (only change PATCH version "last part of the version name")

2. ```sh
   npm run build:lib
   ```
3. Commit & Push

&nbsp;

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

\
&nbsp;

---

# Fix npm SSH Error Using GitHub Deploy Key

If you encounter this error during `npm install`:

```
npm error code 128
npm error git@github.com: Permission denied (publickey).
npm error fatal: Could not read from remote repository.
```

Follow these steps to fix it using a GitHub Deploy Key.

---

## Step 1: Generate an SSH Key on Your Server

```bash
ssh-keygen ~/.ssh/b-datatable
```

## Step 2: Add the Public Key to GitHub

Copy the public key:

```bash
cat ~/.ssh/b-datatable.pub
```

Then go to **GitHub → `b-datatable` repo → Settings → Deploy keys → Add deploy key**, paste the key, and save. Read-only access is sufficient.

## Step 3: Configure SSH to Use the Deploy Key

Add the following to `~/.ssh/config` (create it if it doesn't exist):

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/b-datatable
    IdentitiesOnly yes
```

## Step 4: Test the Connection

```bash
ssh -T git@github.com
```

Expected output:

```
Hi brwa-ata/b-datatable! You've successfully authenticated...
```

## Step 5: Run npm install

```bash
npm install
```

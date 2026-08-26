# b-datatable

## Installation + Update

```
npm install git+https://github.com/brwa-ata/b-datatable.git --force
```

after this command you should restart the vue dev server

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

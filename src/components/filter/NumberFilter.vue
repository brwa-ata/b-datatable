<template>
  <div
    class="nf"
    :class="{ 'active-filter': filterApplied }"
  >
    <div class="nf__row">
      <div
        class="nf__dropdown-wrapper"
        ref="dropdownWrapper"
      >
        <button
          class="nf__icon-btn"
          type="button"
          @click="showDropdown = !showDropdown"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            color="currentColor"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
              stroke-linejoin="round"
            ></path>
            <path
              d="M8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10Z"
            ></path>
            <path
              d="M15.5 17C16.3284 17 17 16.3284 17 15.5C17 14.6716 16.3284 14 15.5 14C14.6716 14 14 14.6716 14 15.5C14 16.3284 14.6716 17 15.5 17Z"
            ></path>
            <path
              d="M10 8.5L17 8.5"
              stroke-linecap="round"
            ></path>
            <path
              d="M14 15.5L7 15.5"
              stroke-linecap="round"
            ></path>
          </svg>
          <!-- <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"
            />
          </svg> -->
        </button>
        <ul
          v-if="showDropdown"
          class="nf__dropdown"
        >
          <li
            v-for="option in numberFilterOptions"
            :key="option.value"
            @click="symbolChanged(option.value)"
          >
            <button
              class="nf__dropdown-item"
              type="button"
              :class="{ 'nf__dropdown-item--active': option.value === symbol }"
            >
              <span class="nf__dropdown-label">{{ option.label }}</span>
              <span class="nf__dropdown-icon">
                <svg
                  v-if="option.value === '__eq'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  color="currentColor"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                >
                  <path d="M4 8H20"></path>
                  <path d="M4 16H20"></path>
                </svg>
                <svg
                  v-else-if="option.value === '__gt'"
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
                  <path d="M7 4L15.3306 10.0405C17.5565 11.6545 17.5565 12.3455 15.3306 13.9595L7 20"></path>
                </svg>
                <svg
                  v-else-if="option.value === '__gte'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  color="currentColor"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                >
                  <path d="M21 20H3"></path>
                  <path
                    d="M3 16H17.1622C19.5429 16 20.7332 16 20.9652 15.3728C21.1971 14.7455 20.2628 14.0531 18.3943 12.6682L6.69853 4"
                  ></path>
                </svg>
                <svg
                  v-else-if="option.value === '__lt'"
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
                  <path d="M17 4L8.66943 10.0405C6.44352 11.6545 6.44353 12.3455 8.66943 13.9595L17 20"></path>
                </svg>
                <svg
                  v-else-if="option.value === '__lte'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  color="currentColor"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                >
                  <path d="M3 20H21"></path>
                  <path
                    d="M21 16H6.83782C4.45713 16 3.26678 16 3.03483 15.3728C2.80288 14.7455 3.73716 14.0531 5.60572 12.6682L17.3015 4"
                  ></path>
                </svg>
                <svg
                  v-else-if="option.value === '__not_eq'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  color="currentColor"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                >
                  <path d="M4 8H20"></path>
                  <path d="M4 16H20"></path>
                  <path d="M6 20L18 4"></path>
                </svg>
              </span>
            </button>
          </li>
        </ul>
      </div>

      <input
        v-model="searchValue"
        :id="`number-filter-search-input__${props.column}`"
        placeholder="Search..."
        type="text"
        autocomplete="off"
        class="nf__input"
        @keydown.enter="applyFilter()"
      />

      <button
        class="nf__clear-btn"
        type="button"
        :class="{ 'nf__clear-btn--hidden': !filterApplied }"
        :disabled="!filterApplied"
        @click="clearFilter()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  column: { type: String, required: true },
  columns: { type: Array, default: () => [] },
  complex: { type: Boolean, default: false },
  query: { type: String, default: '' },
})

const emit = defineEmits(['count-filter', 'value-changed'])

const dropdownWrapper = ref<HTMLElement | null>(null)
const showDropdown = ref(false)
const symbol = ref('__eq')

const searchValue = ref<string | number | null>(null)
const filterApplied = ref(false)
const numberFilterOptions = ref([
  { label: 'Equal', value: '__eq' },
  { label: 'Greater than', value: '__gt' },
  { label: 'Greater than or Equal', value: '__gte' },
  { label: 'Less than', value: '__lt' },
  { label: 'Less than or Equal', value: '__lte' },
  { label: 'Not Equal', value: '__not_eq' },
])
const mathSymbols = ref([
  { key: '__eq', value: '=' },
  { key: '__gt', value: '>' },
  { key: '__gte', value: '>=' },
  { key: '__lt', value: '<' },
  { key: '__lte', value: '<=' },
  { key: '__not_eq', value: '!=' },
])

function onClickOutside(e: MouseEvent) {
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

watch(
  () => searchValue.value,
  (val) => {
    if (val && String(val).length) return
    // Input emptied by hand: only ask the parent to refetch when a filter is actually active.
    if (filterApplied.value) clearFilter()
    else symbol.value = '__eq'
  },
)
function symbolChanged(val: string) {
  symbol.value = val
  showDropdown.value = false
  if (searchValue.value) {
    applyFilter()
  }

  document.getElementById(`number-filter-search-input__${props.column}`)?.focus()
}

function clearFilter() {
  // Reset the flag before clearing the input so the watcher above sees no active
  // filter and stays quiet instead of emitting a second time.
  filterApplied.value = false
  symbol.value = '__eq'
  searchValue.value = null
  const columnQuery = props.column + symbol.value
  const foundSymbol = mathSymbols.value.find((el) => el.key === symbol.value)
  const data = { column: props.column, symbol: foundSymbol?.value, value: searchValue.value, columnQuery: columnQuery }
  emit('value-changed', data)
  emit('count-filter', { value: searchValue.value, header: props.title })
}

function applyFilter() {
  const numberValue = onlyNumber(searchValue.value)
  if (numberValue === null || numberValue === '') {
    if (filterApplied.value) clearFilter()
    else searchValue.value = null
    return
  }
  searchValue.value = numberValue
  const columnQuery = props.column + symbol.value
  const foundSymbol = mathSymbols.value.find((el) => el.key === symbol.value)
  const data = { column: props.column, symbol: foundSymbol?.value, value: searchValue.value, columnQuery: columnQuery }
  filterApplied.value = true
  emit('count-filter', { value: searchValue.value, header: props.title })
  emit('value-changed', data)
}

function onlyNumber(val: string | number | null): number | string | null {
  if (!val) return null
  const numberVal = String(val).match(/-?\d+(\.\d+)?/g)
  const x = numberVal ? numberVal.join().replaceAll(',', '') : null
  return x
}
</script>

<style lang="scss" scoped>
.nf {
  width: 100px;
  height: 100%;

  &__row {
    height: 100%;
    display: flex;
    align-items: center;
  }

  &__dropdown-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  &__icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    margin-right: 4px;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: inherit;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1000;
    min-width: 180px;
    margin: 0;
    padding: 4px 6px;
    list-style: none;
    background-color: transparent;
    backdrop-filter: blur(25px);
    border: 1px solid var(--b-dropdown-border, rgba(0, 0, 0, 0.07));
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    padding: 6px 14px;
    border-radius: 8px;
    background: transparent;
    border: none;
    text-align: left;
    font-size: 0.875rem;
    cursor: pointer;
    color: var(--b-dropdown-text, inherit);
    white-space: nowrap;

    &:hover {
      background-color: var(--b-dropdown-hover, rgba(0, 0, 0, 0.05));
    }

    &--active {
      color: var(--b-color-blue);
    }
  }

  &__dropdown-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__input {
    flex: 1;
    min-width: 0;
    outline: none;
    border: none;
    background: transparent;
    color: var(--b-input-color, inherit);

    &::placeholder {
      color: var(--b-input-placeholder);
    }
  }

  &__clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    opacity: 1;
    transition: opacity 0.15s;

    &--hidden {
      opacity: 0;
      pointer-events: none;
      cursor: default;
    }

    &:not(.nf__clear-btn--hidden):hover {
      opacity: 0.7;
    }
  }
}
</style>

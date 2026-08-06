<template>
  <div
    class="tf"
    :class="{ 'active-filter': filterApplied }"
  >
    <div class="tf__row">
      <div
        class="tf__dropdown-wrapper"
        ref="dropdownWrapper"
      >
        <button
          class="tf__icon-btn"
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
          class="tf__dropdown"
        >
          <li
            v-for="option in textFilterOptions"
            :key="option.value"
            @click="symbolChanged(option.value)"
          >
            <button
              class="tf__dropdown-item"
              type="button"
              :class="{ 'tf__dropdown-item--active': option.value === symbol }"
            >
              {{ option.title }}
            </button>
          </li>
        </ul>
      </div>

      <input
        v-model="searchValue"
        :id="`text-filter-search-input__${props.column}`"
        placeholder="Search..."
        type="text"
        autocomplete="off"
        class="tf__input"
        @keydown.enter="applyFilter()"
      />

      <button
        class="tf__clear-btn"
        type="button"
        :class="{ 'tf__clear-btn--hidden': !filterApplied }"
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
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  column: { type: String, required: true },
})

const emit = defineEmits(['count-filter', 'value-changed'])

const dropdownWrapper = ref<HTMLDivElement | null>(null)
const showDropdown = ref(false)
const symbol = ref('__startswith')
const searchValue = ref('')
const filterApplied = ref(false)
const textFilterOptions = [
  { title: 'Start with', value: '__istartswith' },
  { title: 'End with', value: '__iendswith' },
  { title: 'Contains', value: '__icontains' },
  { title: 'Exact', value: '__iexact' },
  { title: 'Except', value: '__not' },
  { title: 'Comma separate', value: '__comma_separate' },
]
const symbols = ref([
  { key: '__startswith', value: 'sw' },
  { key: '__endswith', value: 'ew' },
  { key: '__contains', value: 'co' },
  { key: '__exact', value: 'ex' },
  { key: '__not', value: 'exc' },
  { key: '__comma_separate', value: 'cs' },
])

function onClickOutside(e: MouseEvent) {
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

function symbolChanged(val: string) {
  symbol.value = val
  showDropdown.value = false
  if (searchValue.value && searchValue.value.length) {
    applyFilter()
  }

  document.getElementById(`text-filter-search-input__${props.column}`)?.focus()
}

function clearFilter() {
  symbol.value = '__startswith'
  searchValue.value = ''
  filterApplied.value = false
  const columnQuery = props.column + symbol.value
  const foundSymbol = symbols.value.find((el) => el.key === symbol.value)
  const data = { column: props.column, symbol: foundSymbol?.value, value: searchValue.value, columnQuery: columnQuery }
  emit('count-filter', { value: searchValue.value, header: props.title })
  emit('value-changed', data)
}

function applyFilter() {
  const columnQuery = props.column + symbol.value
  const foundSymbol = symbols.value.find((el) => el.key === symbol.value)
  const data = { column: props.column, symbol: foundSymbol?.value, value: searchValue.value, columnQuery: columnQuery }
  filterApplied.value = true
  emit('count-filter', { value: searchValue.value, header: props.title })
  emit('value-changed', data)
}
</script>

<style lang="scss" scoped>
.tf {
  width: 150px;
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
    min-width: 130px;
    margin: 0;
    padding: 4px 6px;
    list-style: none;
    background-color: transparent;
    backdrop-filter: blur(25px);
    border: 1px solid var(--b-dropdown-border);
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__dropdown-item {
    display: block;
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

    &:not(.tf__clear-btn--hidden):hover {
      opacity: 0.7;
    }
  }
}
</style>

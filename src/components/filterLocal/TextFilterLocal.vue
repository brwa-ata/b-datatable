<template>
  <div
    class="tfl"
    :class="{ 'active-filter': filterApplied }"
  >
    <div class="tfl__row">
      <div
        class="tfl__dropdown-wrapper"
        ref="dropdownWrapper"
      >
        <button
          class="tfl__icon-btn"
          type="button"
          @click="showDropdown = !showDropdown"
        >
          <svg
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
          </svg>
        </button>
        <ul
          v-if="showDropdown"
          class="tfl__dropdown"
        >
          <li
            v-for="option in textFilterOptions"
            :key="option.value"
            @click="symbolChanged(option.value)"
          >
            <button
              class="tfl__dropdown-item"
              type="button"
              :class="{ 'tfl__dropdown-item--active': option.value === symbol }"
            >
              {{ option.title }}
            </button>
          </li>
        </ul>
      </div>

      <input
        v-model="searchValue"
        :id="`text-filter-local-input__${props.columnKey}`"
        placeholder="Search..."
        type="text"
        autocomplete="off"
        class="tfl__input"
        @keydown.enter="applyFilter()"
      />

      <button
        class="tfl__clear-btn"
        type="button"
        :class="{ 'tfl__clear-btn--hidden': !filterApplied }"
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
import type { LocalTextSymbol } from './localFilter'

const props = defineProps<{
  title: string
  columnKey: string
}>()

const emit = defineEmits<{
  'value-changed': [payload: { key: string; symbol: LocalTextSymbol; value: string }]
}>()

const dropdownWrapper = ref<HTMLDivElement | null>(null)
const showDropdown = ref(false)
const symbol = ref<LocalTextSymbol>('co')
const searchValue = ref('')
const filterApplied = ref(false)
const textFilterOptions: Array<{ title: string; value: LocalTextSymbol }> = [
  { title: 'Start with', value: 'sw' },
  { title: 'End with', value: 'ew' },
  { title: 'Contains', value: 'co' },
  { title: 'Exact', value: 'ex' },
  { title: 'Except', value: 'exc' },
  { title: 'Comma separate', value: 'cs' },
]

function onClickOutside(e: MouseEvent) {
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

function symbolChanged(val: LocalTextSymbol) {
  symbol.value = val
  showDropdown.value = false
  if (searchValue.value.length) {
    applyFilter()
  }
  document.getElementById(`text-filter-local-input__${props.columnKey}`)?.focus()
}

function emitChange() {
  emit('value-changed', { key: props.columnKey, symbol: symbol.value, value: searchValue.value })
}

function clearFilter() {
  symbol.value = 'co'
  searchValue.value = ''
  filterApplied.value = false
  emitChange()
}

function applyFilter() {
  filterApplied.value = searchValue.value.trim().length > 0
  emitChange()
}
</script>

<style lang="scss" scoped>
.tfl {
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
    padding: 4px 0;
    list-style: none;
    background-color: var(--b-dropdown-bg, #fff);
    border: 1px solid var(--b-dropdown-border, rgba(0, 0, 0, 0.12));
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__dropdown-item {
    display: block;
    width: 100%;
    padding: 6px 14px;
    background: transparent;
    border: none;
    text-align: left;
    font-size: 0.775rem;
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

    &:not(.tfl__clear-btn--hidden):hover {
      opacity: 0.7;
    }
  }
}
</style>

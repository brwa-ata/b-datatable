<template>
  <div
    class="idf"
    :class="{ 'active-filter': filterApplied }"
  >
    <span
      class="idf__icon"
      aria-hidden="true"
    >
      #
    </span>

    <input
      v-model="searchValue"
      :placeholder="t('searchPlaceholder')"
      :aria-label="props.title"
      type="text"
      autocomplete="off"
      class="idf__input"
      @keydown.enter="applyFilter()"
    />

    <button
      class="idf__clear-btn"
      type="button"
      :class="{ 'idf__clear-btn--hidden': !filterApplied }"
      :disabled="!filterApplied"
      :aria-label="t('clear')"
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
</template>

<script setup lang="ts">
// Exact-value filter with no lookup menu: the value is sent under the bare column
// name (`?id=42`), so there is no `__suffix` to pick or to strip.
import { ref, watch } from 'vue'
import { useLocale } from '../../i18n'

const props = defineProps({
  title: { type: String, required: true },
  column: { type: String, required: true },
  // Restored state (see BDatatable's `storeFiltersInLocalStorage`). Rendered as an
  // already-applied filter; nothing is emitted for it.
  initialValue: { type: String, default: '' },
})

const emit = defineEmits(['count-filter', 'value-changed'])
const { t } = useLocale()

const searchValue = ref(props.initialValue)
const filterApplied = ref(!!props.initialValue)

// Input emptied by hand: only ask the parent to refetch when a filter is active.
watch(searchValue, (val) => {
  if (!val && filterApplied.value) clearFilter()
})

function emitValue(value: string | null) {
  emit('count-filter', { value, header: props.title })
  emit('value-changed', { column: props.column, value, columnQuery: props.column })
}

function applyFilter() {
  const value = String(searchValue.value ?? '').trim()
  if (!value) {
    if (filterApplied.value) clearFilter()
    return
  }
  searchValue.value = value
  filterApplied.value = true
  emitValue(value)
}

function clearFilter() {
  // Reset the flag first so the watcher above stays quiet.
  filterApplied.value = false
  searchValue.value = ''
  emitValue(null)
}
</script>

<style lang="scss" scoped>
.idf {
  min-width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;

  &__icon {
    flex-shrink: 0;
    width: 16px;
    text-align: center;
    opacity: 0.7;
  }

  &__input {
    flex: 1;
    min-width: 0;
    // zero basis: the input fills the cell without its default ~150px
    // intrinsic width pushing the column wider than its header
    width: 0;
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

    &:not(.idf__clear-btn--hidden):hover {
      opacity: 0.7;
    }
  }
}
</style>

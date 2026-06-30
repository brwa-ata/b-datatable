<template>
  <div
    class="lfl"
    :class="{ 'active-filter': selected.size }"
    ref="dropdownWrapper"
  >
    <div
      class="lfl__toggle"
      @click="toggleDropDown()"
    >
      <button
        class="lfl__icon-btn"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>
      <input
        readonly
        class="lfl__display-input"
        :value="selected.size ? `${selected.size} selected` : ''"
        :placeholder="selected.size ? '' : 'Search...'"
      />
    </div>

    <div
      v-if="showDropdown"
      class="lfl__dropdown"
    >
      <!-- toolbar -->
      <div class="lfl__toolbar">
        <div class="lfl__radios">
          <label class="lfl__radio-label">
            <input
              v-model="lookup"
              type="radio"
              value="in"
              class="lfl__radio"
            />
            In
          </label>
          <label class="lfl__radio-label">
            <input
              v-model="lookup"
              type="radio"
              value="not_in"
              class="lfl__radio"
            />
            Not In
          </label>
        </div>
        <div class="lfl__actions">
          <button
            class="lfl__btn lfl__btn--clear"
            type="button"
            @click="clearFilter()"
          >
            Clear
          </button>
          <button
            class="lfl__btn lfl__btn--apply"
            type="button"
            @click="applyFilter()"
          >
            Filter
          </button>
        </div>
      </div>

      <!-- search -->
      <div class="lfl__search-wrap">
        <input
          v-model="searchText"
          :id="`list-filter-local-input__${props.columnKey}`"
          type="search"
          class="lfl__search-input"
          placeholder="Search..."
        />
      </div>

      <!-- list -->
      <div class="lfl__list">
        <div
          v-for="(value, index) in filteredList"
          :key="index"
          class="lfl__list-item"
          @click="toggleValue(value)"
        >
          <span class="lfl__check-icon">
            <svg
              v-if="selected.has(value)"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
              />
            </svg>
          </span>
          {{ value }}
        </div>
        <div
          v-if="!filteredList.length"
          class="lfl__empty"
        >
          No options
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { uniqueColumnValues, type LocalListLookup } from './localFilter'

const props = defineProps<{
  columnKey: string
  data: Array<Record<string, unknown>>
}>()

const emit = defineEmits<{
  'value-changed': [payload: { key: string; lookup: LocalListLookup; values: unknown[] }]
}>()

const dropdownWrapper = ref<HTMLDivElement | null>(null)
const showDropdown = ref(false)
const searchText = ref('')
const lookup = ref<LocalListLookup>('in')
const selected = ref<Set<unknown>>(new Set())

// Distinct values for this column, derived from the full data set.
// Computed lazily: only evaluated while the dropdown is open (where it is read).
const options = computed(() => uniqueColumnValues(props.data, props.columnKey))

const filteredList = computed(() => {
  if (!searchText.value) return options.value
  const query = searchText.value.toLowerCase()
  return options.value.filter((value) => String(value).toLowerCase().includes(query))
})

function onClickOutside(e: MouseEvent) {
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

function toggleDropDown() {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    nextTick(() => {
      document.getElementById(`list-filter-local-input__${props.columnKey}`)?.focus()
    })
  }
}

function toggleValue(value: unknown) {
  const next = new Set(selected.value)
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }
  selected.value = next
}

function emitChange() {
  emit('value-changed', { key: props.columnKey, lookup: lookup.value, values: [...selected.value] })
}

function clearFilter() {
  selected.value = new Set()
  emitChange()
  showDropdown.value = false
}

function applyFilter() {
  emitChange()
  showDropdown.value = false
}
</script>

<style lang="scss" scoped>
.lfl {
  width: 100px;
  position: relative;
  height: 100%;

  &__toggle {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-right: 4px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    color: inherit;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }

  &__display-input {
    flex: 1;
    min-width: 0;
    outline: none;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 13px;
    color: inherit;

    &::placeholder {
      font-size: 13px;
      color: var(--sm-input-placeholder);
    }
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1000;
    min-width: 240px;
    max-width: 300px;
    background-color: var(--sm-dropdown-bg, #fff);
    border: 1px solid var(--sm-dropdown-border, rgba(0, 0, 0, 0.12));
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    border-bottom: 1px solid var(--sm-dropdown-border, rgba(0, 0, 0, 0.1));
  }

  &__radios {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__radio-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    cursor: pointer;
    color: var(--sm-dropdown-text, inherit);
    white-space: nowrap;
  }

  &__radio {
    width: 14px;
    height: 14px;
    cursor: pointer;
    accent-color: var(--sm-color-blue);
  }

  &__actions {
    display: flex;
    gap: 6px;
  }

  &__btn {
    height: 26px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    white-space: nowrap;

    &--clear {
      background-color: transparent;
      color: var(--sm-dropdown-text, inherit);

      &:hover {
        background-color: rgba(0, 0, 0, 0.09);
      }
    }

    &--apply {
      background-color: var(--sm-dropdown-hover, rgba(0, 0, 0, 1));
      color: var(--sm-dropdown-text, inherit);

      &:hover {
        background-color: rgba(0, 0, 0, 0.15);
      }
    }
  }

  &__search-wrap {
    padding: 8px 10px;
    border-bottom: 1px solid var(--sm-dropdown-border, rgba(0, 0, 0, 0.1));
  }

  &__search-input {
    width: 100%;
    height: 28px;
    padding: 0 8px;
    font-size: 12px;
    outline: none;
    border: 1px solid var(--sm-dropdown-border, rgba(0, 0, 0, 0.2));
    border-radius: 6px;
    background: transparent;
    color: var(--sm-dropdown-text, inherit);

    &::placeholder {
      opacity: 0.8;
    }

    &:focus {
      border: 1px solid var(--sm-color-blue);
    }
  }

  &__list {
    max-height: 220px;
    overflow-y: auto;
    padding: 4px 0;
  }

  &__list-item {
    display: flex;
    align-items: center;
    min-height: 32px;
    padding: 0 10px;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    color: var(--sm-dropdown-text, inherit);

    &:hover {
      background-color: var(--sm-dropdown-hover, rgba(0, 0, 0, 0.05));
    }
  }

  &__check-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    flex-shrink: 0;
    color: var(--sm-color-blue);
  }

  &__empty {
    padding: 12px 10px;
    font-size: 13px;
    text-align: center;
    color: var(--sm-input-placeholder);
  }
}
</style>

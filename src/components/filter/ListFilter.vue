<template>
  <div
    class="lf"
    :class="{ 'active-filter': selectedItems.length }"
    ref="dropdownWrapper"
  >
    <div
      class="lf__toggle"
      @click="toggleDropDown()"
    >
      <button
        class="lf__icon-btn"
        type="button"
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
          ></path>
          <path
            d="M17 10C17 10 13.3176 14 12 14C10.6824 14 7 10 7 10"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
      <input
        readonly
        class="lf__display-input"
        :value="selectedItems.length ? `${selectedItems.length} selected` : ''"
        :placeholder="selectedItems.length ? '' : 'Search...'"
      />
    </div>

    <div
      v-if="showDropdown"
      class="lf__dropdown"
    >
      <!-- toolbar -->
      <div class="lf__toolbar">
        <div
          class="lf__segment"
          role="radiogroup"
        >
          <label
            class="lf__seg"
            :class="{ 'lf__seg--active': lookup === 'in' }"
          >
            <input
              v-model="lookup"
              type="radio"
              value="in"
              class="lf__seg-input"
            />
            In
          </label>
          <label
            class="lf__seg"
            :class="{ 'lf__seg--active': lookup === 'not_in' }"
          >
            <input
              v-model="lookup"
              type="radio"
              value="not_in"
              class="lf__seg-input"
            />
            Not In
          </label>
        </div>
        <div class="lf__actions">
          <button
            class="lf__btn lf__btn--clear"
            type="button"
            @click="clearFilter()"
          >
            Clear
          </button>
          <button
            class="lf__btn lf__btn--apply"
            type="button"
            @click="applyFilter()"
          >
            Filter
          </button>
        </div>
      </div>

      <!-- search -->
      <div class="lf__search-wrap">
        <input
          v-model="searchText"
          :id="`list-filter-search-input__${prop.column}`"
          type="search"
          class="lf__search-input"
          placeholder="Search..."
          autocomplete="off"
        />
      </div>

      <!-- list -->
      <div
        class="lf__list"
        ref="containerRef"
        @scroll.passive="onScroll"
      >
        <div
          class="lf__list-sizer"
          :style="{ height: `${totalHeight}px` }"
        >
          <div
            class="lf__list-window"
            :style="{ transform: `translateY(${offsetY}px)` }"
          >
            <div
              v-for="row in visibleItems"
              :key="row.index"
              class="lf__list-item"
              :class="{ 'lf__list-item--checked': row.item.checked }"
              @click="row.item.checked = !row.item.checked"
            >
              <span class="lf__check-icon">
                <svg
                  v-if="row.item.checked"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  color="currentColor"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                  ></path>
                  <path
                    d="M8 12.5L10.5 15L16 9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>

                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  color="currentColor"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <path
                    d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
                  ></path>
                </svg>
              </span>
              {{ getItemTitle(row.item) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useVirtualList } from '../useVirtualList'

// Keep in sync with the `.lf__list-item` height in the stylesheet below.
const ITEM_HEIGHT = 32

const prop = defineProps({
  list: { type: Array, required: true },
  column: { type: String, required: true },
  itemTitle: { type: String, default: 'name' },
  itemValue: { type: String, default: 'id' },
})

const emit = defineEmits(['count-filter', 'value-changed'])

const dropdownWrapper = ref(null)
const showDropdown = ref(false)
const selectedItems = ref([])
const searchText = ref('')
const lookup = ref('in')

const filteredList = computed(() => {
  if (!searchText.value) return prop.list
  const search = searchText.value.toLowerCase()
  return prop.list.filter((item) => getItemTitle(item).toLowerCase().includes(search))
})

const { containerRef, onScroll, totalHeight, offsetY, visibleItems } = useVirtualList(filteredList, {
  itemHeight: ITEM_HEIGHT,
})

function onClickOutside(e) {
  if (dropdownWrapper.value && !dropdownWrapper.value.contains(e.target)) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

function toggleDropDown() {
  showDropdown.value = !showDropdown.value

  if (showDropdown.value) {
    nextTick(() => {
      document.getElementById(`list-filter-search-input__${prop.column}`)?.focus()
    })
  }
}

function getItemTitle(item) {
  if (prop.itemTitle.includes('&')) {
    return prop.itemTitle
      .split('&')
      .map((key) => item[key])
      .join(' | ')
  }
  return item[prop.itemTitle]
}

function clearFilter() {
  prop.list.forEach((item) => (item.checked = false))
  selectedItems.value = []
  searchText.value = ''
  emit('value-changed', { column: `${prop.column}__${lookup.value}`, values: selectedItems.value })
  showDropdown.value = false
}

function applyFilter() {
  selectedItems.value = prop.list.filter((item) => item.checked).map((item) => item[prop.itemValue])
  emit('value-changed', { column: `${prop.column}__${lookup.value}`, values: selectedItems.value })
  showDropdown.value = false
}
</script>

<style lang="scss" scoped>
.lf {
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
    font-size: inherit;
    color: inherit;
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 1000;
    min-width: 240px;
    max-width: 300px;
    background-color: transparent;
    backdrop-filter: blur(25px);
    border: 1px solid var(--b-dropdown-border);
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    border-bottom: 1px solid var(--b-dropdown-border, rgba(0, 0, 0, 0.1));
  }

  &__segment {
    display: inline-flex;
    align-items: center;
    padding: 3px;
    background-color: rgba(200, 200, 200, 0.35);
    border-radius: 16px;

    .b__theme-dark & {
      background-color: rgba(100, 100, 100, 0.24);
    }
  }

  &__seg-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  &__seg {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 14px;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.4;
    border-radius: 12px;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    color: var(--b-dropdown-text, inherit);
    transition:
      background-color 0.2s ease,
      box-shadow 0.2s ease,
      color 0.2s ease;

    &--active {
      background-color: #fff;
      color: #000;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 1px rgba(0, 0, 0, 0.08);

      .b__theme-dark & {
        background-color: #636366;
        color: #fff;
        box-shadow:
          0 1px 3px rgba(0, 0, 0, 0.3),
          0 1px 1px rgba(0, 0, 0, 0.2);
      }
    }
  }

  &__actions {
    display: flex;
    gap: 6px;
  }

  &__btn {
    height: 26px;
    padding: 0 10px;
    font-size: 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    white-space: nowrap;

    &--clear {
      background-color: transparent;
      color: var(--b-dropdown-text, inherit);

      &:hover {
        background-color: rgba(0, 0, 0, 0.09);
      }
    }

    &--apply {
      background-color: var(--b-dropdown-hover, rgba(0, 0, 0, 1));
      color: var(--b-dropdown-text, inherit);

      &:hover {
        background-color: rgba(0, 0, 0, 0.15);
      }
    }
  }

  &__search-wrap {
    padding: 8px 10px;
    border-bottom: 1px solid var(--b-dropdown-border, rgba(0, 0, 0, 0.1));
  }

  &__search-input {
    width: 100%;
    height: 30px;
    padding: 0 8px;
    font-size: 12px;
    outline: none;
    border: 1px solid var(--b-dropdown-border, rgba(0, 0, 0, 0.2));
    border-radius: 8px;
    background: transparent;
    color: var(--b-dropdown-text, inherit);

    &::placeholder {
      opacity: 0.8;
    }

    &:focus {
      border: 1px solid var(--b-color-blue);
    }
  }

  &__list {
    max-height: 250px;
    overflow-y: auto;
    padding: 4px 6px;
  }

  // Virtual scroll: the sizer holds the full scroll height while only the
  // rows inside the window are rendered.
  &__list-sizer {
    position: relative;
  }

  &__list-window {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    will-change: transform;
  }

  &__list-item {
    display: flex;
    align-items: center;
    height: 32px; // fixed: the virtual scroller measures rows by this value
    padding: 0 4px;
    font-size: 13px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    color: var(--b-dropdown-text, inherit);

    &:hover {
      background-color: var(--b-dropdown-hover, rgba(0, 0, 0, 0.05));
    }

    &--checked {
      color: var(--b-color-blue);
    }
  }

  &__check-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    flex-shrink: 0;
    margin-inline-end: 2px;
  }

  .lf__display-input,
  .lf__display-input::placeholder {
    font-size: 13px;
  }
  .lf__display-input::placeholder {
    color: var(--b-input-placeholder);
  }
}
</style>

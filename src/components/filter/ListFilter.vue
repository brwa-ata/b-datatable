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
        <!-- <svg
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
        </svg> -->
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
        <div class="lf__radios">
          <label class="lf__radio-label">
            <input
              v-model="lookup"
              type="radio"
              value="in"
              class="lf__radio"
            />
            In
          </label>
          <label class="lf__radio-label">
            <input
              v-model="lookup"
              type="radio"
              value="not_in"
              class="lf__radio"
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
        />
      </div>

      <!-- list -->
      <div class="lf__list">
        <div
          v-for="(item, index) in filteredList"
          :key="index"
          class="lf__list-item"
          @click="item.checked = !item.checked"
        >
          <span class="lf__check-icon">
            <svg
              v-if="item.checked"
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
          {{ getItemTitle(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

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

  .lf__display-input,
  .lf__display-input::placeholder {
    font-size: 13px;
  }
  .lf__display-input::placeholder {
    color: var(--sm-input-placeholder);
  }
}
</style>

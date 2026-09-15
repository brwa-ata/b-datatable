<template>
  <div
    ref="rootRef"
    class="df"
    :class="{ 'active-filter': filterApplied }"
  >
    <button
      class="df__trigger"
      type="button"
      aria-haspopup="dialog"
      :title="props.title"
      @mousedown="rememberPickerState"
      @click="togglePicker"
    >
      <svg
        class="df__icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
      >
        <rect
          x="3"
          y="4.5"
          width="18"
          height="16.5"
          rx="3"
        ></rect>
        <path d="M3 9.5H21M8 2.5V6M16 2.5V6"></path>
      </svg>
      <span
        class="df__summary"
        :class="{ 'df__summary--placeholder': !filterApplied }"
      >
        {{ summary }}
      </span>
    </button>

    <button
      class="df__clear-btn"
      type="button"
      :class="{ 'df__clear-btn--hidden': !filterApplied }"
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

    <!--
      DateInput stays invisible over the cell and only supplies its calendar panel.
      The panel is teleported to <body> and placed from DateInput's own field, so
      keeping the field here makes the calendar open right under this filter.
    -->
    <div
      class="df__picker"
      aria-hidden="true"
    >
      <DateInput
        :model-value="range"
        mode="range"
        label=""
        :theme="props.theme"
        :format="props.format"
        hide-details
        @update:model-value="rangeChanged"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// `b-date-input` is a peer dependency kept external in the lib build, so the host
// project's own copy (and its own stylesheet / theme) is the one rendered here.
import { ref, computed, onMounted } from 'vue'
import { DateInput } from 'b-date-input'
import type { BTableDateFilter } from '../../types'

type DateRange = [string | null, string | null]

const props = defineProps({
  title: { type: String, required: true },
  column: { type: String, required: true },
  theme: { type: String, default: 'light' },
  format: { type: String, default: 'dd/mm/yyyy' },
})

const emit = defineEmits(['count-filter', 'value-changed'])

const rootRef = ref<HTMLElement | null>(null)
const range = ref<DateRange>([null, null])
const filterApplied = ref(false)
// Whether the calendar was open when the trigger was pressed; DateInput closes it
// on that same mousedown, so the click that follows must not reopen it.
let wasOpen = false

const summary = computed(() => {
  const [after, before] = range.value
  if (!after || !before) return 'Date...'
  // Drop the year when the whole range is in the current year to keep the column narrow.
  const year = String(new Date().getFullYear())
  const withYear = !after.startsWith(year) || !before.startsWith(year)
  return `${formatDate(after, withYear)}–${formatDate(before, withYear)}`
})

onMounted(() => {
  // The hidden field is only an anchor for the panel: keep it out of the tab order.
  rootRef.value?.querySelectorAll('.df__picker input, .df__picker button').forEach((el) => {
    el.setAttribute('tabindex', '-1')
  })
})

function formatDate(value: string, withYear: boolean) {
  const [y, m, d] = value.split('-')
  const dayMonth = props.format === 'mm/dd/yyyy' ? `${m}/${d}` : `${d}/${m}`
  return withYear ? `${dayMonth}/${y.slice(2)}` : dayMonth
}

function rememberPickerState() {
  wasOpen = !!rootRef.value?.querySelector('.df__picker .dp__field.is-open')
}

function togglePicker() {
  const skip = wasOpen
  wasOpen = false
  if (skip) return

  const input = rootRef.value?.querySelector<HTMLInputElement>('.df__picker .dp__input')
  if (!input) return
  // DateInput opens its panel on focus. Blur right away so typing never lands in the
  // hidden input; the panel stays open until a date is picked or the user clicks outside.
  input.focus({ preventScroll: true })
  input.blur()
}

function clearFilter() {
  rangeChanged([null, null])
}

// DateInput only emits once both ends of the range are picked, or once it is cleared.
function rangeChanged(val: DateRange | null) {
  const [after, before]: DateRange = Array.isArray(val) ? val : [null, null]
  // A new array (not a mutation) so DateInput's modelValue watcher resyncs its own state.
  range.value = [after, before]

  const applied = !!(after && before)
  // Nothing was applied and nothing is being applied: don't ask the parent to refetch.
  if (!applied && !filterApplied.value) return

  filterApplied.value = applied
  const data: BTableDateFilter = {
    column: props.column,
    after: applied ? after : null,
    before: applied ? before : null,
    afterQuery: `${props.column}_after`,
    beforeQuery: `${props.column}_before`,
  }
  emit('count-filter', { value: applied ? `${after} - ${before}` : null, header: props.title })
  emit('value-changed', data)
}
</script>

<style lang="scss" scoped>
.df {
  position: relative;
  min-width: 100px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 24px;
    padding: 0 2px;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: inherit;
    font: inherit;
    white-space: nowrap;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__summary {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    letter-spacing: 0.01em;
    color: var(--b-input-color, inherit);

    // match the other filters' "Search..." placeholder (13px inputs)
    &--placeholder {
      font-family: inherit;
      font-size: 13px;
      letter-spacing: 0;
      color: var(--b-input-placeholder);
    }
  }

  &__clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: auto;
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

    &:not(.df__clear-btn--hidden):hover {
      opacity: 0.7;
    }
  }

  &__picker {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    overflow: hidden;

    // size DateInput's field to the cell so the panel opens right below the filter
    :deep(.dp) {
      height: 100%;
      --dp-field-h: 100%;
    }

    :deep(.dp .dp__label) {
      display: none;
    }
  }
}
</style>

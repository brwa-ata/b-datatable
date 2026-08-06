import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'

interface VirtualListOptions {
  /** Fixed row height in pixels. Rows must not grow beyond this. */
  itemHeight: number
  /** Extra rows rendered above and below the viewport. */
  overscan?: number
}

/**
 * Renders only the rows that fall inside the scroll viewport, so a filter
 * dropdown backed by thousands of options stays cheap to open and scroll.
 *
 * Bind `containerRef` + `onScroll` to the scroll container, give the inner
 * spacer `totalHeight` and translate the rendered window by `offsetY`.
 */
export function useVirtualList<T>(items: Ref<T[]>, { itemHeight, overscan = 6 }: VirtualListOptions) {
  const containerRef = ref<HTMLElement | null>(null)
  const scrollTop = ref(0)
  const viewportHeight = ref(0)

  let resizeObserver: ResizeObserver | null = null

  function onScroll(e: Event) {
    scrollTop.value = (e.target as HTMLElement).scrollTop
  }

  function measure(el: HTMLElement) {
    viewportHeight.value = el.clientHeight
  }

  // The container lives behind a `v-if` dropdown, so it is created and
  // destroyed repeatedly: re-measure and reset the offset every time.
  watch(containerRef, (el) => {
    resizeObserver?.disconnect()
    resizeObserver = null
    scrollTop.value = 0

    if (!el) return

    measure(el)
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => measure(el))
      resizeObserver.observe(el)
    }
  })

  // A new list (searching, or the source data changing) starts from the top.
  watch(items, () => {
    scrollTop.value = 0
    if (containerRef.value) containerRef.value.scrollTop = 0
  })

  onBeforeUnmount(() => resizeObserver?.disconnect())

  const totalHeight = computed(() => items.value.length * itemHeight)

  const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan),
  )

  const endIndex = computed(() => {
    // Before the first measurement, render enough rows to fill a typical dropdown.
    const rowsInView = Math.ceil((viewportHeight.value || itemHeight * 10) / itemHeight)
    return Math.min(items.value.length, startIndex.value + rowsInView + overscan * 2)
  })

  const visibleItems = computed(() =>
    items.value.slice(startIndex.value, endIndex.value).map((item, i) => ({
      item,
      index: startIndex.value + i,
    })),
  )

  const offsetY = computed(() => startIndex.value * itemHeight)

  return { containerRef, onScroll, totalHeight, offsetY, visibleItems }
}

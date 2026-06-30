// Self-contained SVG icons for sm-datatable
// These icons are embedded directly so no external dependencies are required

import { h } from 'vue'

export const SearchIcon = {
  name: 'SearchIcon',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 512 512',
        fill: 'currentColor',
        width: '1em',
        height: '1em',
      },
      [
        h('path', {
          d: 'M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z',
        }),
      ],
    )
  },
}

export const TimesCircleIcon = {
  name: 'TimesCircleIcon',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 512 512',
        fill: 'currentColor',
        width: '1em',
        height: '1em',
      },
      [
        h('path', {
          d: 'M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z',
        }),
      ],
    )
  },
}

export const SortIcon = {
  name: 'SortIcon',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        width: '16',
        height: '16',
      },
      [
        h('path', {
          d: 'M7 4V20',
        }),
        h('path', {
          d: 'M17 19L17 4',
        }),
        h('path', {
          d: 'M10 6.99998C10 6.99998 7.79053 4.00001 6.99998 4C6.20942 3.99999 4 7 4 7',
        }),
        h('path', {
          d: 'M20 17C20 17 17.7905 20 17 20C16.2094 20 14 17 14 17',
        }),
      ],
    )
  },
}

export const SortUpIcon = {
  name: 'SortUpIcon',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        width: '16',
        height: '16',
      },
      [
        h('path', {
          d: 'M12 5.5V19',
        }),
        h('path', {
          d: 'M18 11C18 11 13.5811 5.00001 12 5C10.4188 4.99999 6 11 6 11',
        }),
      ],
    )
  },
}

export const SortDownIcon = {
  name: 'SortDownIcon',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        width: '16',
        height: '16',
      },
      [
        h('path', {
          d: 'M12 18.502V5.00195',
        }),
        h('path', {
          d: 'M18 13.002C18 13.002 13.5811 19.0019 12 19.002C10.4188 19.002 6 13.002 6 13.002',
        }),
      ],
    )
  },
}

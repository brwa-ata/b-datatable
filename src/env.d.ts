/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module 'b-date-input' {
  import type { DefineComponent } from 'vue'
  export const DateInput: DefineComponent
  export default DateInput
}

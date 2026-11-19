import BTable from './components/BTable.vue'
import BDatatable from './components/BDatatable.vue'
import { LOCALE_KEY, createLocaleContext, messages, normalizeLocale, directionOf } from './i18n'
import './assets/style.scss'

export { BTable, BDatatable, messages as bDatatableMessages, normalizeLocale, directionOf }

export default {
  /**
   * @param {import('vue').App} app
   * @param {{ locale?: string, dir?: 'ltr' | 'rtl', messages?: Record<string, string> }} [options]
   *   app-wide defaults; a component's own `locale` / `dir` / `messages` props win over them
   */
  install(app, options = {}) {
    app.component('BTable', BTable)
    app.component('BDatatable', BDatatable)
    if (options.locale || options.dir || options.messages) {
      app.provide(
        LOCALE_KEY,
        createLocaleContext(() => options),
      )
    }
  },
}

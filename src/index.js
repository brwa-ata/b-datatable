import SmTable from './components/SmTable.vue'
import SmDatatable from './components/SmDatatable.vue'
import './assets/style.scss'

export { SmTable, SmDatatable }

export default {
  install(app) {
    app.component('SmTable', SmTable)
    app.component('SmDatatable', SmDatatable)
  },
}

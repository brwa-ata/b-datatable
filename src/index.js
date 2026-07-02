import BTable from './components/BTable.vue'
import BDatatable from './components/BDatatable.vue'
import './assets/style.scss'

export { BTable, BDatatable }

export default {
  install(app) {
    app.component('BTable', BTable)
    app.component('BDatatable', BDatatable)
  },
}

<!-- <template>
  <div style="min-width: 120px">
    <v-menu v-model="menu" :close-on-content-click="false" :close-on-click="false">
      <template v-slot:activator="{ props }">
        <v-text-field
          v-model="searchValue"
          :placeholder="$t('Search...')"
          hide-details
          readonly
          :bg-color="selectedItems.length > 0 ? '#fb8c002f' : ''"
          class="b-filter-field"
          variant="underlined"
          append-inner-icon="mdi-chevron-down"
          v-bind="props"
        />
      </template>

      <v-card width="300px" rounded="lg">
        <div class="d-flex pa-2">
          <v-spacer />

          <v-btn variant="tonal" class="me-4" @click="clearFilter()">
            {{ $t('Clear') }}
          </v-btn>

          <v-btn color="primary" @click="applyFilter()">
            {{ $t('Filter') }}
          </v-btn>
        </div>

        <v-divider />

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="selectedItems"
                :label="$t('Select')"
                :items="optionsList"
                multiple
                return-object
                hide-details
                type="search"
                @update:search="prepareSearch"
                @keydown.enter="prepareSearch($event?.target?.value ?? null)"
              >
                <template v-slot:selection="{ index }">
                  <span v-if="index === 0" />
                </template>
              </v-autocomplete>
            </v-col>

            <v-col
              cols="12"
              style="max-height: 250px; overflow-y: scroll"
              :class="selectedItems.length ? 'py-3' : ''"
            >
              <v-row
                v-for="(item, index) in selectedItems"
                :key="index"
                class="align-center text-body-1 hoverable rounded"
              >
                <v-col class="px-2 py-2">
                  {{ getItemTitle(item) }}
                </v-col>

                <v-col cols="auto" class="pa-1">
                  <v-icon @click="remove(index)" color="grey"> mdi-close-circle </v-icon>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { localStorageQueryParams } from '@/composables/useHelper'
import axios from 'axios'

const prop = defineProps({
  listEndpoint: { type: String, required: true },
  column: { type: String, required: true },
  itemTitle: { type: String, default: 'name' },
  itemValue: { type: String, default: 'id' },
})

const emit = defineEmits(['count-filter', 'value-changed'])

const menu = ref(false)
const selectedItems = ref([])
const optionsList = ref([])
const searchTimeout = ref(null)
const searchValue = ref(null)

onMounted(() => {
  setTimeout(() => {
    if (Object.keys(localStorageQueryParams()).length) {
      let selectedIds = localStorageQueryParams().queryParams[prop.column]
      searchByMultipleIds(selectedIds)
    }
  }, 300)
})

function prepareSearch(keyword) {
  if (keyword) {
    clearTimeout(searchTimeout.value)
    searchTimeout.value = setTimeout(() => {
      serverSearch(keyword)
    }, 1000)
  }
}

function serverSearch(keyword) {
  axios.post(prop.listEndpoint, { keyword: keyword }).then((res) => {
    optionsList.value = res.data
  })
}

function searchByMultipleIds(selectedIds) {
  axios.post(`${prop.listEndpoint}/by-multiple-ids`, { ids: selectedIds }).then((res) => {
    optionsList.value = res.data
    selectedItems.value = res.data
    emit(
      'count-filter',
      selectedItems.value.map((item) => item[prop.itemValue]),
    )
  })
}

function getItemTitle(item) {
  if (prop.itemTitle.includes('&')) {
    let splittedText = prop.itemTitle.split('&')
    let text = ''
    splittedText.forEach((txt, index) => {
      text += item[txt]

      if (index !== splittedText.length - 1) {
        text += ' | '
      }
    })

    return text
  } else {
    return item[prop.itemTitle]
  }
}

function remove(index) {
  selectedItems.value.splice(index, 1)
}

function clearFilter() {
  selectedItems.value = []
  emit('value-changed', selectedItems.value)
  menu.value = false
}

function applyFilter() {
  emit(
    'value-changed',
    selectedItems.value.map((item) => item[prop.itemValue]),
  )
  menu.value = false
}
</script>

<style lang="scss" scoped></style> -->

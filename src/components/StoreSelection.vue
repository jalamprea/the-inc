<template>
  <div class="row">
    <q-select
      outlined=""
      v-model="selectedStore"
      :options="storeOptions"
      label="Sucursales"
      class="col-12 q-px-md"
      dense
      map-options
      emit-value
      hint="Debes seleccionar una sucursal"
      :hide-hint="!!selectedStore"
      ref="selector"
      @input="$refs.selector.blur()"
    >
    </q-select>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data () {
    return {
      storeOptions: []
    }
  },
  computed: {
    selectedStore: {
      get () {
        return this.$store.getters['company/getStore']
      },
      set (val) {
        this.$store.commit('company/setStore', val)
      }
    },
    hideHint () {
      return this.selectedStore !== ''
    }
  },
  methods: {
    loadStores () {
      const company = this.$store.getters['company/getActiveCompany']
      this.$firestore
        .collection('companies').doc(company)
        .collection('stores').get()
        .then(snapshot => {
          const stores = []
          snapshot.forEach(doc => {
            stores.push({
              value: doc.id,
              label: doc.id.toUpperCase()
            })
          })
          return stores
        })
        .then(data => {
          this.storeOptions = data
        })
    },
    chooseStore () {
      this.$store.commit('setStore', this.selectedStore.value)
    }
  },
  mounted () {
    this.loadStores()
  }
}
</script>

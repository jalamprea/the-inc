<template>
  <q-page padding>
    <!-- content -->
    <div class="text-h6 text-primary">
      Factura #{{id}}
    </div>
      <q-table
        title="Productos"
        :data="data"
        :columns="columns"
        row-key="name"
        class="q-mt-lg"
      />
  </q-page>
</template>

<script>
import formatMixin from '../mixins/formats'
export default {
  // name: 'PageName',
  mixins: [formatMixin],
  data () {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Producto',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'price', align: 'center', label: 'Precio', field: 'price', format: val => `${this.formatCurrency(val)}`, sortable: true },
        { name: 'units', label: 'Unidades', field: 'units' },
        { name: 'tax', label: 'Tax', field: 'tax', format: val => `${val * 100}%` },
        { name: 'total', label: 'Total', field: 'total', format: val => `${this.formatCurrency(val)}` }
      ],
      data: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%'
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%'
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ],
      company: '',
      store: ''
    }
  },
  methods: {
    startVuefire () {
      const dbRef = this.$firestore
        .collection('companies').doc(this.company)
        .collection('stores').doc(this.store)
        .collection('invoices').doc(this.$route.params.id)
        .collection('products')
      this.$bind('data', dbRef).then(res => {
        console.log('res :', res)
      })
    }
  },
  mounted () {
    this.company = this.$store.getters['company/getActiveCompany']
    this.store = this.$store.getters['company/getStore']
    console.log('mounted', this.company, this.store, this.$route.params.id)
    this.startVuefire()
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  }
}
</script>

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
import realtimeBill from '../mixins/realtimeBill'
export default {
  // name: 'PageName',
  mixins: [formatMixin, realtimeBill],
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
        { name: 'tax', label: 'Iva', field: 'tax', format: val => `${val * 100}%` },
        { name: 'total', label: 'Total', field: 'total', format: val => `${this.formatCurrency(val)}` }
      ]
    }
  },
  methods: {
  },
  mounted () {
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  }
}
</script>

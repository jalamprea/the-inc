<template>
  <q-page padding>
    <!-- content -->
    <section class="q-ma-md">
      <div v-if="hasProducts" class="products-wrapper">

        <q-table
          title="Inventario de Productos"
          :data="products"
          :columns="columns"
          row-key="name"
        >
        <template v-slot:top-right>
          <q-btn color="primary" label="Actualizar Inventario" v-on:click="openUploader" />
        </template>
      </q-table>

      </div>
      <div
        v-else
      >
        No hay productos en bodega
      </div>
    </section>

  </q-page>
</template>

<script>
import formatMixin from '../mixins/formats'
export default {
  computed: {
    hasProducts () {
      return this.products && this.products.length > 0
    }
  },
  data () {
    return {
      columns: [
        { name: 'name', label: 'Producto', field: 'name', align: 'left' },
        { name: 'stock', label: 'Disponibilidad', field: 'stock', align: 'center' },
        { name: 'price', label: 'Precio', field: 'price', format: val => `${this.formatCurrency(val)}` },
        { name: 'tax', label: 'IVA', field: 'tax', format: val => `${val * 100}%` }
      ],
      products: []
    }
  },
  mixins: [formatMixin],
  firestore () {
    const company = this.$store.getters['company/getActiveCompany']
    return {
      products: this.$firestore
        .collection('companies').doc(company)
        .collection('inventory')
    }
  },
  methods: {
    openUploader () {
      this.$router.push('/subir-csv')
    }
  }
}
</script>

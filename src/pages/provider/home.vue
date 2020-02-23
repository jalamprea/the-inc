<template>
  <q-page padding>
    <!-- content -->
    <section class="q-ma-md">
      <div v-if="hasOrders" class="orders-wrapper">

        <q-table
          title="Ordenes de productos"
          :data="orders"
          :columns="columns"
          row-key="product_id"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.label }}
              </q-th>
              <q-th auto-width>
                Opciones
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                {{ col.value }}
              </q-td>
              <q-td auto-width>
                <q-btn size="sm" :color="props.row.status==='pending' ? 'red' : 'blue-grey'" @click="confirmOrder(props)" :disabled="props.row.status!=='pending'">
                  {{props.row.status==='pending' ? 'Procesar' : 'Procesada'}}
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <q-dialog v-model="confirmDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar icon="assignment_turned_in" color="primary" text-color="white" />
              <span class="q-ml-sm">Confirmar orden procesada y enviada al cliente.</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="dark" v-close-popup />
              <q-btn flat label="Confirmar" color="primary" @click="processOrder()" />
            </q-card-actions>
          </q-card>
        </q-dialog>

      </div>
      <div v-else>
        No hay ordenes pendientes
      </div>
    </section>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  computed: {
    hasOrders () {
      return this.orders && this.orders.length > 0
    }
  },
  data () {
    return {
      orders: [],
      totalOrders: 0,
      orderToConfirm: null,
      confirmDialog: false,
      columns: [
        { name: 'client', label: 'Cliente', field: 'client', align: 'left' },
        { name: 'product_id', label: 'ID', field: 'product_id', align: 'left' },
        { name: 'product_name', label: 'Producto', field: 'product_name', align: 'left' },
        { name: 'units', label: 'Cantidad', field: 'units', align: 'center' },
        {
          name: 'status',
          label: 'Estado',
          field: 'status',
          align: 'center',
          format: val => {
            switch (val) {
              case 'pending': return 'Pendiente'
              case 'processed': return 'Procesada'
            }
          }
        }
      ],
      products: []
    }
  },
  firestore () {
    const provider = this.$store.getters['provider/getActiveProvider']
    return {
      orders: this.$firestore
        .collection('providers').doc(provider)
        .collection('orders')
    }
  },
  methods: {
    confirmOrder: function (order) {
      this.orderToConfirm = order.row
      this.confirmDialog = true
    },
    processOrder: function () {
      const provider = this.$store.getters['provider/getActiveProvider']
      console.log('Prov', provider)
      console.log('Processing', this.orderToConfirm)

      const inc = this.$firebase.firestore.FieldValue.increment(this.orderToConfirm.units)
      this.$firestore
        .collection('companies').doc(this.orderToConfirm.client)
        .collection('inventory').doc(this.orderToConfirm.product_id).set({ stock: inc }, { merge: true })

      this.$firestore
        .collection('providers').doc(provider)
        .collection('orders').doc(this.orderToConfirm.id).set({
          status: 'processed'
        }, { merge: true }).then(() => {
          this.confirmDialog = false
          console.log('Order processed')
        })
    }
  },
  watch: {
    orders: {
      immediate: false,
      handler (data) {
        if (this.totalOrders !== data.length) {
          console.log('new order!')
          this.totalOrders = data.length
        }
      }
    }
  }
}
</script>

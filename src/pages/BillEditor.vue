<template>
  <q-page padding>
    <!-- content -->
    <div class="text-h5 text-primary text-weight-bold row justify-between">
      <div>
        #{{id}} <span class="text-weight-light">[ ClientID: {{billInfo && billInfo.clientId ? billInfo.clientId : '-'}} ]</span>
      </div>
      <q-btn color="secondary" v-if="data.length > 0" @click="processInvoice">
        Procesar
      </q-btn>
    </div>
    <div class="q-mt-md relative-position">
      <q-markup-table separator="vertical" flat bordered>
        <thead>
          <tr class="bg-green-1">
            <th class="text-left">Productos</th>
            <th class="text-center">Precio</th>
            <th class="text-center">Unidades</th>
            <th class="text-center">Iva</th>
            <th class="text-center">Total</th>
            <th class="text-center" style="width: 60px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="data.length === 0 && !addingProduct">
            <td colspan="6" class="text-center">
              No hay productos agregados aún. Completa tu factura agregando nuevos productos.
            </td>
          </tr>

          <!-- [products] -->
          <tr v-for="(item, index) in data" :key="index">
            <td class="text-left">{{item.name}}</td>
            <td class="text-center">{{item.price}}</td>
            <td class="text-center">{{item.units}}</td>
            <td class="text-center">{{item.tax}}</td>
            <td class="text-center">{{item.total}}</td>
            <td class="text-center">
              <!-- <q-btn color="secondary" @click="editItem(item.id)" icon="edit" flat dense></q-btn> -->
              <q-btn color="secondary" @click="deleteItem(item.id)" icon="delete" flat dense></q-btn>
            </td>
          </tr>

          <!-- [add product] -->
          <tr v-if="addingProduct">
            <td class="text-left">
              <div class="row justify-start">
                <q-select
                  style="min-width: 200px"
                  label="Productos"
                  class="col-12"
                  outlined
                  dense
                  v-model="form.product"
                  :options="productOptions"
                  @input="() => $refs.units.focus()"
                >
                </q-select>
              </div>
            </td>
            <td class="text-right">
              <div class="row justify-center">
                <q-input
                  ref="price"
                  type="number"
                  style="min-width: 100px"
                  outlined
                  dense
                  input-class="text-center"
                  :value="form.product.price || 0"
                  :rules="[ val => val >= 0 || 'Debe ser positivo' ]"
                  hide-bottom-space
                  min="0"
                  prefix="$"
                  @keydown.enter="$refs.units.focus()"
                  readonly
                ></q-input>
              </div>
            </td>
            <td class="text-right">
              <div class="row justify-center">
                <q-input
                  ref="units"
                  style="width: 80px"
                  outlined
                  dense
                  input-class="text-center"
                  v-model="form.units"
                  hide-bottom-space
                  :rules="[ val => val > 0 || 'Debe ser mayor a cero' ]"
                  @input="val => form.units = parseInt(val)"
                  type="number"
                  min="0"
                  @keydown.enter="addItem"
                ></q-input>
              </div>
            </td>
            <td class="text-right">
              <div class="row justify-center">
                <q-input style="width: 60px" outlined dense input-class="text-center" v-model="form.tax" readonly></q-input>
              </div>
            </td>
            <td class="text-right">
              <div class="row justify-center">
                <q-input
                  style="width: 100px"
                  outlined
                  dense
                  input-class="text-center"
                  v-model="formTotal"
                  readonly
                  prefix="$"
                ></q-input>
              </div>
            </td>
            <td class="text-center">
              <q-btn
              @click="addItem"
                dense
                icon="check"
                color="positive"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <q-btn
        color="primary"
        size="sm"
        round
        icon="add"
        class="absolute addbutton"
        @click="addingProduct=true"
      >
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import realtimeBill from '../mixins/realtimeBill'
export default {
  // name: 'PageName',
  mixins: [realtimeBill],
  data () {
    return {
      products: [],
      addingProduct: false,
      form: {
        product: '',
        units: 0,
        tax: 0.19
      },
      clientId: ''
    }
  },
  computed: {
    productOptions () {
      const mapped = this.products.reduce((final, item) => {
        if (item.stock > 0) {
          const alreadyAdded = this.data.find(el => {
            return el.id === item.id
          })
          if (!alreadyAdded) {
            final.push({
              ...item,
              value: item.id,
              label: item.name
            })
          }
        }
        return final
      }, [])
      return mapped
    },
    formTotal () {
      return this.form.product.price ? this.form.product.price * this.form.units : 0
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  firestore () {
    const company = this.$store.getters['company/getActiveCompany']
    return {
      products: this.$firestore
        .collection('companies').doc(company)
        .collection('inventory')
    }
  },
  methods: {
    addItem () {
      const { product, units, tax } = this.form
      if (!product || !units || !tax) {
        this.$q.notify('Todos los campos son requeridos')
        return
      }
      this.addingProduct = false
      const company = this.$store.getters['company/getActiveCompany']
      const store = this.$store.getters['company/getStore']
      this.$firestore
        .collection('companies').doc(company)
        .collection('stores').doc(store)
        .collection('invoices').doc(this.$route.params.id)
        .collection('products').doc(product.value).set({
          name: product.label,
          price: product.price,
          units: units,
          tax: tax,
          total: this.formTotal
        }).then(res => {
          console.log('res :', res)
          this.resetForm()
        }).catch(er => {
          this.addingProduct = true
          console.log('er :', er)
        })
    },
    resetForm () {
      this.form = {
        product: '',
        units: 0,
        tax: 0.19
      }
      this.addingProduct = false
    },
    editItem (id) {
    },
    deleteItem (id) {
      this.$q.dialog({
        title: 'Eliminación',
        message: '¿Seguro deseas eliminar este producto? '
      }).onOk(() => {
        const company = this.$store.getters['company/getActiveCompany']
        const store = this.$store.getters['company/getStore']
        this.$firestore
          .collection('companies').doc(company)
          .collection('stores').doc(store)
          .collection('invoices').doc(this.$route.params.id)
          .collection('products').doc(id).delete()
      }).onCancel(() => {
      })
    },
    async processInvoice () {
      // current company for product inventory udpate:
      const company = this.$store.getters['company/getActiveCompany']

      const prods = await this.$firestore.collection('companies').doc(company).collection('inventory').get()

      // Current stock for this company
      const stock = {}
      prods.docs.map(doc => {
        stock[doc.id] = doc.data()
        return stock[doc.id]
      })

      let invoiceReady = true
      let productNotAvailable = null
      this.data.forEach(product => {
        // validate requested units among stock availability:
        if (product.units > stock[product.id].stock) {
          invoiceReady = false
          productNotAvailable = product
          console.log('Product not available:', product)
        }
      })

      if (!invoiceReady) {
        console.log('Invoice cannot be processed')
        this.$q.notify('El producto "' + productNotAvailable.name + '" ya no se encuentra disponible')
        return false
      }

      const batch = this.$firestore.batch()
      for (let p = 0; p < this.data.length; p++) {
        const product = this.data[p]
        const stockProductRef = this.$firestore.collection('companies').doc(company).collection('inventory').doc(product.id)
        const newStock = this.$firebase.firestore.FieldValue.increment(product.units * -1)
        batch.update(stockProductRef, { stock: newStock })
      }

      batch.update(this.billRef, { status: 'processed' })

      await batch.commit()
      console.log('Updated invoice', this.billInfo.id)

      this.$q.notify('Factura procesada correctamente!')
      this.$router.push({ name: 'list' })
    }
  },
  mounted () {
    this.startVuefire()
    // const museums = this.$firestore.collectionGroup('invoices')
    // museums.get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.id, ' => ', doc.data())
    //   })
    // })
  }
}
</script>

<style>
  .addbutton {
    bottom: -15px;
    right: -15px;
  }
</style>

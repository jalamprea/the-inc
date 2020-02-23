<template>
  <q-page padding>
    <!-- content -->
    <div class="text-h5 text-primary text-weight-bold">
      #{{id}}
    </div>
    <div class="q-mt-md relative-position">
      <q-markup-table separator="vertical" flat bordered>
        <thead>
          <tr>
            <th class="text-left">Productos</th>
            <th class="text-center">Precio</th>
            <th class="text-center">Unidades</th>
            <th class="text-center">Iva</th>
            <th class="text-center">Total</th>
            <th class="text-center" style="width: 100px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="data.length === 0 && !addingProduct">
            <td colspan="6" class="text-center">
              No items added yet
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
              <q-btn color="secondary" icon="edit" flat dense></q-btn>
              <q-btn color="secondary" icon="delete" flat dense></q-btn>
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
                  @input="() => $refs.price.focus()"
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
                  v-model="form.price"
                  :rules="[ val => val >= 0 || 'Debe ser positivo' ]"
                  @input="val => form.price = parseFloat(val)"
                  hide-bottom-space
                  min="0"
                  prefix="$"
                  @keydown.enter="$refs.units.focus()"

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
        price: 0,
        units: 0,
        tax: 0.19
      }
    }
  },
  computed: {
    productOptions () {
      const mapped = this.products.map(item => {
        return {
          ...item,
          value: item.id,
          label: item.name
        }
      })
      return mapped
    },
    formTotal () {
      return this.form.price * this.form.units
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
      console.log('this.form :', this.form)
      const { product, units, price, tax } = this.form
      const company = this.$store.getters['company/getActiveCompany']
      const store = this.$store.getters['company/getStore']
      this.$firestore
        .collection('companies').doc(company)
        .collection('stores').doc(store)
        .collection('invoices').doc(this.$route.params.id)
        .collection('products').doc(product.value).set({
          name: product.label,
          price: price,
          units: units,
          tax: tax,
          total: this.formTotal
        }).then(res => {
          console.log('res :', res)
          this.resetForm()
        }).catch(er => {
          console.log('er :', er)
        })
    },
    resetForm () {
      this.form = {
        product: '',
        price: 0,
        units: 0,
        tax: 0.19
      }
      this.addingProduct = false
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

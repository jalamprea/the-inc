<template>
  <q-page padding>
    <!-- content -->
    <div class="text-h5 text-primary">
      {{id}}
    </div>
    <div class="q-mt-md relative-position">
      <q-markup-table :separator="separator" flat bordered>
        <thead>
          <tr>
            <th class="text-left">Producto</th>
            <th class="text-right">Precio</th>
            <th class="text-right">Unidades</th>
            <th class="text-right">Iva</th>
            <th class="text-right">Total</th>
            <th class="text-right"></th>
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
          </tr>
          <!-- [add product] -->
          <tr v-if="addingProduct">
            <td class="text-left">
              <q-select
                outlined
                dense
                v-model="form.name"
                :options="itemsOptions"
              >
              </q-select>
            </td>
            <td class="text-right">
              <div class="row justify-end">
                <q-input class="col-shrink" outlined dense input-class="text-center" v-model="form.price"></q-input>
              </div>
            </td>
            <td class="text-right">
              <div class="row justify-end">
                <q-input class="col-shrink" outlined dense input-class="text-center" v-model="form.unit"></q-input>
              </div>
            </td>
            <td class="text-right">
              <div class="row justify-end">
                <q-input class="col-shrink" outlined dense input-class="text-center" v-model="form.tax" readonly></q-input>
              </div>
            </td>
            <td class="text-right">
              <div class="row justify-end">
                <q-input class="col-shrink" outlined dense input-class="text-center" v-model="form.total" readonly></q-input>
              </div>
            </td>
            <td class="text-right">
              <q-btn
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
      addingProduct: false,
      form: {
        name: '',
        price: 0,
        unit: 0,
        tax: 0.19,
        total: ''
      }
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  methods: {
    addItem () {
      // {
      //   name: 'Frozen Yogurt',
      //   price: 159,
      //   units: 6,
      //   tax: 24,
      //   total: 4
      // }
    },
    getInventory () {
      // this.$firebase.
    }
  },
  mounted () {
    this.startVuefire()
    this.getInventory()
  }
}
</script>

<style>
  .addbutton {
    bottom: -15px;
    right: -15px;
  }
</style>

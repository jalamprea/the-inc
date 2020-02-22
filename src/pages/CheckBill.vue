<template>
  <q-page padding>
    <!-- content -->
    <div class="text-h6 text-primary">
      Factura #{{id}}
    </div>
    <q-card>
      <q-card-section>
        <q-list>
          <q-item v-for="(item, index) in products" :key="index">
            <q-item-section side>{{item.price}}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    {{products}}
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      products: [],
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
      this.$bind('products', dbRef).then(res => {
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

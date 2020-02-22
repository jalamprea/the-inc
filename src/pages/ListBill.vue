<template>
  <q-page padding>
    <!-- content -->
    <q-card>
      <q-card-section>
        <q-list>
          <q-item-label header>Facturas</q-item-label>
          <q-item
            v-for="(bill, index) in bills"
            :key="index"
            clickable
            @click="$router.push(`/factura/${bill._id_}`)"
          >
            <q-item-section v-if="!bill">
              <q-skeleton type="rect" />
            </q-item-section>
            <q-item-section v-else>
              {{ bill._id_ }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      bills: []
    }
  },
  computed: {
    store () {
      return this.$store.getters['company/getStore']
    }
  },
  methods: {
    getBills () {
      const company = this.$store.getters['company/getActiveCompany']
      const store = this.store
      this.$firestore
        .collection('companies').doc(company)
        .collection('stores').doc(store)
        .collection('invoices').get().then(snapshot => {
          const empty = new Array(snapshot.size)
          this.bills = empty
          const bills = []
          snapshot.forEach(doc => {
            const parsed = doc.data()
            parsed._id_ = doc.id
            bills.push(parsed)
          })
          // setTimeout(() => {
          //   this.bills = bills
          // }, 3000)
          this.bills = bills
        })
    }
  },
  mounted () {
    this.getBills()
  },
  watch: {
    store (newValue, oldValue) {
      this.getBills()
    }
  }
}
</script>

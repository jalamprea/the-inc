<template>
  <q-page padding>
    <!-- content -->
    <q-card>
      <q-card-section>
        <q-list>
          <q-item-label header>Facturas</q-item-label>
          <q-item
            class="q-py-md"
            :class="{
              'bg-red-1': bill.status === 'draft'
            }"
            v-for="(bill, index) in bills"
            :key="index"
            clickable
          >
            <!-- <q-item-section v-if="!bill">
              <q-skeleton type="rect" />
            </q-item-section> -->
            <q-item-section @click="openBill(bill)" side>
              <q-icon name="receipt"></q-icon>
            </q-item-section>
            <q-item-section @click="openBill(bill)">
              <q-item-label lines="1">{{ bill.id }}</q-item-label>
              <q-item-label caption>{{bill.created_at.toDate()}}</q-item-label>
            </q-item-section>
            <q-item-section side>
              {{ translateStatus(bill.status) }}
              <q-btn @click="deleteDraftBill(bill.id)" v-if="bill.status === 'draft'" icon="delete" dense flat></q-btn>
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
    openBill (bill) {
      switch (bill.status) {
        case 'processed':
          this.$router.push(`/factura/${bill.id}`)
          break
        case 'draft':
          this.$router.push(`/crear/${bill.id}`)
          break
        default:
          break
      }
    },
    translateStatus (status) {
      switch (status) {
        case 'processed':
          return 'Procesado'
        case 'draft':
          return 'Borrador'
        default:
          return '-'
      }
    },
    getBills () {
      const company = this.$store.getters['company/getActiveCompany']
      const store = this.store
      const dbRef = this.$firestore
        .collection('companies').doc(company)
        .collection('stores').doc(store)
        .collection('invoices').orderBy('created_at', 'desc')

      this.$bind('bills', dbRef).then(res => {
        console.log('bills :', res)
      })
    },
    deleteDraftBill (id) {
      const company = this.$store.getters['company/getActiveCompany']
      const store = this.store
      this.$firestore
        .collection('companies').doc(company)
        .collection('stores').doc(store)
        .collection('invoices').doc(id).delete()
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

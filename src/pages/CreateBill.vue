<template>
  <q-page padding class="flex flex-center">
    <!-- content -->
    <q-btn color="primary" @click="createBill">Crear Nueva Factura</q-btn>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  methods: {
    createBill () {
      this.company = this.$store.getters['company/getActiveCompany']
      this.store = this.$store.getters['company/getStore']
      this.$firestore
        .collection('companies').doc(this.company)
        .collection('stores').doc(this.store)
        .collection('invoices').add({
          created_at: this.$firebase.firestore.Timestamp.now(),
          status: 'draft',
          total: 0
        })
        .then(res => {
          console.log('res :', res)
          this.$router.push(`/crear/${res.id}`)
        })
    }
  }
}
</script>

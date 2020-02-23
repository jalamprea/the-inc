<template>
  <q-page padding class="flex flex-center">
    <!-- content -->
    <div class="row">
      <div class="col-12 row no-wrap justify-center items-center content-center">
        ID del Cliente: <q-input v-model="clientId" class="q-ml-md" dense outlined></q-input>
      </div>
      <div class="col-12 row justify-center q-mt-md">
        <q-btn class="row" color="primary" @click="createBill">Crear Nueva Factura</q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      clientId: ''
    }
  },
  methods: {
    createBill () {
      if (!this.clientId) {
        this.$q.notify('El id del cliente es obligatorio')
        return
      }
      this.company = this.$store.getters['company/getActiveCompany']
      this.store = this.$store.getters['company/getStore']
      this.$firestore
        .collection('companies').doc(this.company)
        .collection('stores').doc(this.store)
        .collection('invoices').add({
          created_at: this.$firebase.firestore.Timestamp.now(),
          status: 'draft',
          total: 0,
          company: this.company,
          clientId: this.clientId
        })
        .then(res => {
          console.log('res :', res)
          this.$router.push(`/crear/${res.id}`)
        })
    }
  }
}
</script>

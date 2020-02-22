<template>
  <q-page padding class="flex flex-center row dimmed-primary">
    <!-- content -->
    <q-card class="col-xs-12 col-sm-6 col-md-3">
      <q-card-section>
        <q-select
          outlined=""
          v-model="company"
          :options="companyOptions"
          label="Compañías"
          :error="errorFlag"
          :error-message="errorMsg"
          @input="errorFlag = false"
          map-options
          emit-value
        >
        </q-select>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn color="primary" @click="loginCompany">Enter</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      companyOptions: [],
      errorFlag: false,
      errorMsg: 'An option must be selected'
    }
  },
  methods: {
    loginCompany () {
      if (!this.company) {
        this.errorFlag = true
        return
      }
      this.$router.push({ name: 'dashboard' })
    }
  },
  computed: {
    company: {
      get () {
        return this.$store.getters['company/getActiveCompany']
      },
      set (val) {
        this.$store.commit('company/setActiveCompany', val)
      }
    }
  },
  created () {
    if (this.company) {
      this.$router.push({ name: 'dashboard' })
    }
    this.$firestore.collection('companies').get().then(snapshot => {
      snapshot.forEach(doc => {
        const company = {
          label: doc.id.toUpperCase(),
          value: doc.id
        }
        this.companyOptions.push(company)
      })
    })
  }
}
</script>
<style>
  .dimmed-primary {
    background-color: rgba(255, 97, 97, 0.521) !important;
  }
</style>

<template>
  <q-page padding class="flex flex-center row dimmed-primary">
    <!-- content -->
    <q-card class="col-xs-12 col-sm-6 col-md-3">
      <q-card-section>
        <q-select
          outlined=""
          v-model="provider"
          :options="providerOptions"
          label="Proveedores"
          :error="errorFlag"
          :error-message="errorMsg"
          @input="errorFlag = false"
          map-options
          emit-value
        >
        </q-select>
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn color="primary" @click="loginProvider">Enter</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data () {
    return {
      providerOptions: [],
      errorFlag: false,
      errorMsg: 'An option must be selected'
    }
  },
  methods: {
    loginProvider () {
      if (!this.provider) {
        this.errorFlag = true
        return
      }
      this.$router.push({ path: '/proveedor/' + this.provider })
    }
  },
  computed: {
    provider: {
      get () {
        return this.$store.getters['provider/getActiveProvider']
      },
      set (val) {
        this.$store.commit('provider/setActiveProvider', val)
      }
    }
  },
  created () {
    if (this.provider) {
      this.$router.push({ path: '/proveedor/' + this.provider })
    }
    this.$firestore.collection('providers').get().then(snapshot => {
      snapshot.forEach(doc => {
        const name = doc.data().name
        const provider = {
          label: name,
          value: doc.id
        }
        this.providerOptions.push(provider)
      })
    })
  }
}
</script>
<style>
  .dimmed-primary {
    background-color: rgba(97, 97, 255, 0.521) !important;
  }
</style>

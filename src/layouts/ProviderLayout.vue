<template>
  <q-layout view="hHh lpr fff">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar class="q-mr-sm">
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          {{activeProviderName.toUpperCase()}}
        </q-toolbar-title>

        <q-btn
          dense
          @click="logout"
          color="white"
          text-color="primary"
          icon="fas fa-sign-out-alt"
          title="Log Out"
        >
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'ProviderLayout',

  data () {
    return {
    }
  },
  methods: {
    logout () {
      this.$store.commit('provider/logout')
    }
  },
  computed: {
    activeProviderName () {
      let name = this.$store.getters['provider/getActiveProvider']
      name = name.slice(0, 1).toUpperCase() + name.slice(1)
      return name
    }
  },
  watch: {
    activeProviderName: {
      handler (val) {
        this.$router.push({ name: 'login-provider' })
      },
      immediate: true
    }
  }
}
</script>

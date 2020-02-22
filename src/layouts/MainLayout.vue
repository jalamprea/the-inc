<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Siigo App
        </q-toolbar-title>
        <span class="q-mr-sm">The Inc. v 0.1</span>
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

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <div class="text-h4 text-center text-weight-bold text-primary q-pt-lg">
        {{activeCompanyName}}
      </div>
      <q-list>
        <q-item-label header class="text-grey-8">Gestión de facturas</q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'

export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Crear',
          caption: 'Nueva Factura',
          icon: 'add_circle_outline',
          link: 'create'
        },
        {
          title: 'Revisar',
          caption: 'Ver Factura',
          icon: 'receipt',
          link: 'https://github.com/quasarframework'
        },
        {
          title: 'Inventario',
          caption: 'Listado Productos',
          icon: 'ballot',
          link: 'https://chat.quasar.dev'
        }
      ]
    }
  },
  methods: {
    logout () {
      this.$store.commit('company/logout')
      this.$router.push({ name: 'login' })
    }
  },
  computed: {
    activeCompanyName () {
      let name = this.$store.getters['company/getActiveCompany']
      name = name.slice(0, 1).toUpperCase() + name.slice(1)
      return name
    }
  }
}
</script>

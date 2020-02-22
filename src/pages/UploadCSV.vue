<template>
  <q-page padding>
    <q-card class="my-card">

      <q-card-section>
        <div class="text-h6">Actualizar productos</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="q-pb-sm">
          Sube aqui el listado actualizado de productos en formato CSV haciendo click en el ícono <q-icon name="add_box" class="text-primary" style="font-size: 2em" />
        </p>
        <p class="q-py-sm">
          <b>NOTA:</b> El formato de columnas <b>debe coincidir</b> con el siguiente listado de columnas:
          <pre><code>id, name, price, stock, tax</code></pre>
        </p>
        <q-uploader
          url="https://us-central1-the-inc-siigo2020.cloudfunctions.net/stock/update"
          style="max-width: 400px"
          :form-fields="[{name:'company', value: this.activeCompany}]"
        />
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
export default {
  computed: {
    activeCompany () {
      return this.$store.getters['company/getActiveCompany']
    }
  }
}
</script>

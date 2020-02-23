const mixin = {
  data () {
    return {
      data: [],
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
      this.$bind('data', dbRef).then(res => {
        console.log('res :', res)
      })
    }
  },
  mounted () {
    this.company = this.$store.getters['company/getActiveCompany']
    this.store = this.$store.getters['company/getStore']
    this.startVuefire()
  }
}
export default mixin

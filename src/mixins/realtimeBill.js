const mixin = {
  data () {
    return {
      data: [],
      billInfo: {},
      billRef: null,
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
      this.billRef = dbRef

      this.$bind('billInfo', dbRef).then(res => {
        console.log('billInfo :', res)
      })
      this.$bind('data', dbRef.collection('products')).then(res => {
        console.log('data :', res)
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

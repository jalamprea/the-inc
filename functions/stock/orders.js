
// Firestore connection
const admin = require('firebase-admin');
const db = admin.firestore();



// TODO: THis should be stored on a variable per each user
const STOCK_LIMIT = 10;

// Function executed onUpdate any document in the inventory of any company
const updateHandler = (change, context) => {


  const previousData = change.before.data();
  const newData = change.after.data();

  if (previousData.stock === newData.stock) {
    return null;
  }

  const company = context.params.company;
  const product = context.params.product;

  if (previousData.stock < newData.stock) {
    // validate pending invoices because I have more stock :)
    validatePendingInvoices(company).catch(err => {
      console.error('Update Invoice error:', err)
    })
  } else if (newData.stock === STOCK_LIMIT-1) {
    // send notification to providers about low stock...
    sendNotificationLowStock(company, product).catch(err => {
      console.error('Notification error:', err)
    })
  }
}

module.exports = {
  updateHandler
}


async function validatePendingInvoices(company) {
  console.log('Checking invoices on', company)

  const prods = await db.collection('companies').doc(company).collection('inventory').get()

  // Current stock for this company
  const stock = {}
  prods.docs.map(doc => {
    stock[doc.id] = doc.data()
    return stock[doc.id]
  })

  const invoices = await db.collectionGroup('invoices')
    .where('company', '==', company)
    .where('status', '==', 'pending')
    .get()

  for (let i = 0; i < invoices.docs.length; i++) {
    const invoice = invoices.docs[i]
    // on each invoice, find products...
    const products = await invoice.ref.collection('products').get()
    let invoiceReady = true

    // per each product, check if the requested stock is available
    products.forEach(productRef => {
      const product = productRef.data()
      // validate requested units among stock availability:
      if (product.units > stock[productRef.id].stock) {
        invoiceReady = false
        console.log('Product not available:', product)
      }
    })

    if (invoiceReady) {
      console.log('Processing invoice:', invoice.id)

      const batch = db.batch()
      for (let p = 0; p < products.docs.length; p++) {
        const product = products.docs[i]
        const stockProductRef = db.collection('companies').doc(company).collection('inventory').doc(product.id)
        const newStock = db.firestore.FieldValue.increment(product.data().units * -1)
        batch.update(stockProductRef, { stock: newStock })
      }

      batch.update(invoice.ref, { status: 'processed' })

      await batch.commit()
      console.log('Updated invoice', invoice.id)
    }
  }
}


async function sendNotificationLowStock(company, product) {
  console.log('Send notification because of low stock on', product, 'from company:', company);

  const companyRef = await db.collection('companies').doc(company).get()
  const providerID = companyRef.data().provider;

  const lowStockNotification = {
    company,
    product,
    amount: STOCK_LIMIT - 1,
    type: 'lowStock'
  }
  await db.collection('providers').doc(providerID).collection('notifications').set(lowStockNotification)

}

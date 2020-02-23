const functions = require('firebase-functions');
const stock = require('./stockHTTP.js')
const stockDB = require('./stock/orders.js')

// Firestore watcher
exports.stockChanges = functions.firestore
  .document('companies/{company}/inventory/{product}')
  .onUpdate(stockDB.updateHandler);


// HTTP upload handler for CSV
exports.stock = functions.https.onRequest(stock.app);

const express = require('express')
const multer = require('multer')

// Firestore connection
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// File limit: check if it is enough:
const SIZE_LIMIT = 2 * 1024 * 1024 // 2MB

const app = express()

const multipartFormDataParser = multer({
  storage: multer.memoryStorage(),
  // increase size limit if needed
  limits: {fieldSize: SIZE_LIMIT},

  // https://github.com/emadalam/multer
  startProcessing(req, busboy) {
    req.rawBody ? busboy.end(req.rawBody) : req.pipe(busboy)
  },
})

app.post('/update', multipartFormDataParser.any(), function (req, res, next) {
  const company = req.body.company || null;
  if (!company) {
    res.status(403)
    return res.send("403 Forbidden: Invalid company");
  }

  const out = {
    company
  };

  if (req.files && req.files.length>0) {
    const file = req.files[0];
    const csvRaw = file.buffer.toString();
    const products = processCSV(csvRaw);

    out.products = products.length;

    // updateStock(company, products);
  }


  res.json(out);
})

exports.app = app;


const updateStock = (company, products) => {
  let companyRef = db.collection('companies').doc(company);

  /* products.map(async product => {
    const prod = await companyRef.collection('inventory').doc(product.name).get();
    console.log(prod);
  }) */
}


const processCSV = raw => {
  const lines = raw.split(/\n/);
  const titles = {};
  const products = [];
  lines.map((line, index) => {
    const data = line.split(/[:,]/);

    if (index===0) {
      data.map((title, index) => { titles[title] = index; });
      return null
    }

    const product = {
      name: data[titles.product].trim(),
      price: data[titles.price].trim(),
      stock: data[titles.stock].trim(),
      tax: data[titles.tax].trim()
    }
    products.push(product)
    return product
  })

  return products
}

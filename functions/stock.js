const express = require('express')
const multer = require('multer')
const cors = require('cors')

// Firestore connection
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
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

app.use(cors())
app.post('/update', multipartFormDataParser.any(), async function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');

  const company = req.body.company || null;
  if (!company) {
    res.status(403)
    return res.send("403 Forbidden: Invalid company");
  }

  const out = { company };

  if (req.files && req.files.length>0) {
    const file = req.files[0];
    const csvRaw = file.buffer.toString();
    const products = processCSV(csvRaw);

    out.products = products.length;

    await updateStock(company, products);
  }

  res.json(out);
})

exports.app = app;


// Update the respective stock company
const updateStock = async (company, products) => {
  // console.log('COMPANY:', company);
  let companyStockRef = db.collection('companies').doc(company).collection('inventory');

  let product = null;
  for (var i = products.length - 1; i >= 0; i--) {
    try {
      product = products[i]
      // console.log('Processing:', product);
      await companyStockRef.doc(product.id).set({
        name: product.name,
        price: product.price,
        stock: product.stock,
        tax: product.tax
      });
    } catch(ex) {
      console.error('Firebase error:', ex)
    }
  }
}


const processCSV = raw => {
  const lines = raw.split(/\n/);
  const titles = {};
  const products = [];
  lines.map((line, index) => {
    if (!line || line.length<1) {
      return null;
    }

    const data = line.split(/[:,]/);

    if (index===0) {
      data.map((title, index) => { titles[title.trim()] = index; });
      return null
    }

    console.log('Reading:', data);
    try {
      const product = {
        id: data[titles.id].trim(),
        name: data[titles.name].trim(),
        price: parseFloat(data[titles.price].trim()),
        stock: parseFloat(data[titles.stock].trim()),
        tax: parseFloat(data[titles.tax].trim())
      }
      products.push(product)
      return product
    } catch(ex) {
      console.error(ex);
    }
  })

  return products
}

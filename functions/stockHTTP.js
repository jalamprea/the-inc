const functions = require('firebase-functions');
const express = require('express')
const cors = require('cors')

// Firestore connection
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Stock Imports
const csvHandler = require('./stock/csv-handler');

const app = express();

app.use(cors())

csvHandler.setDB(db);

app.post('/update', csvHandler.multipartFormDataParser.any(), csvHandler.handleRequest);


// HTTP Express app for Stock Requests
exports.app = app;

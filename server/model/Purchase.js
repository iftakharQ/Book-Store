const mongoose = require('mongoose')

const Purchase = new mongoose.Schema({}, { strict: false })

const PurchaseDB = mongoose.model('Purchase', Purchase)

module.exports = PurchaseDB
const mongoose = require('mongoose')

const category = new mongoose.Schema({}, { strict: false })
const categoryDB = mongoose.model('Categorie', category)

module.exports = categoryDB
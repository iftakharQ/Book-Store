const mongoose = require('mongoose')

const books = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    image: {
        type: String,
        required: true
    }
})

const BooksDB = mongoose.model('BooksDoc', books) // BooksDoc -> is the collection name in mongodb under a database.
module.exports = BooksDB
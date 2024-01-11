const mongoose = require('mongoose')

const users = new mongoose.Schema({}, { strict: false })

const admins = new mongoose.Schema({}, { strict: false })

const Userdb = mongoose.model('Userdb', users)
const Admindb = mongoose.model('Admindb', admins)

module.exports = {
    Userdb, Admindb
}
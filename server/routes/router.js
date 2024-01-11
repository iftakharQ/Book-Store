const express = require('express')
const router = express.Router()
const services = require('../services/render')
const controller = require('../controller/controller')

// page routes:
router.get('/', services.homeRoute)
router.get('/allBooks', services.allBooks)
router.post('/search', services.searchRoute)
router.get('/category', services.category)
router.get('/about', services.about)

router.get('/dash-home', loginRequired, services.dashHome)
router.get('/add-books', loginRequired, services.addBooks)
router.get('/update-book', loginRequired, services.updateBook)

router.get('/add-to-cart', services.addtoCart)
router.get('/myCart', services.myCart)
router.get('/cart-remove', services.removeCart)
router.get('/checkOut', services.checkOut)
router.post('/confirmCheckOut', services.confirmCheckout)

// Login:
router.get('/login', services.Login)
router.get('/registerUser', services.RegisterUser)
// Admin login:
router.get('/adminLogin', services.adminLogin)
router.get('/registerAdmin', services.RegisterAdmin)

// api routes:
router.get('/findBook', controller.find)
router.post('/api/add-book', controller.addBooks)
router.post('/api/update-book/:id', controller.updateBooks)
router.get('/api/delete-book/:id', controller.deleteBooks)
router.post('/api/search', controller.searchBooks)

router.post('/api/login', controller.LoginUser)
router.post('/api/registerUser', controller.registerUser)

router.post('/api/adminLogin', controller.LoginAdmin)
router.post('/api/registerAdmin', controller.registerAdmin)

// Logout:
router.get('/api/logout', controller.logout)


// Authorization middleware functions:
function loginRequired(req, res, next) {

    var user = req.session.user
    var userType = req.session.userType
    console.log(user)

    if(user === "" || user === undefined) {

        res.redirect('/adminLogin')
    }

    else {

        if(userType === "Admin") {

            next() // return next()
        }

        else {

            res.redirect('/adminLogin')
        }
    }
}


module.exports = router
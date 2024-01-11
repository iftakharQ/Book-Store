const axios = require('axios')
const BooksDB = require('../model/Books')
const PurchaseDB = require('../model/Purchase')
const CategoryDB = require('../model/Category')
const { Userdb, Admindb } = require('../model/Users')

// Cart variables:
var Cart = []
var total_Price = 0

exports.homeRoute = async (req, res) => {

    const count = await BooksDB.countDocuments()

    axios.get('http://localhost:3000/findBook', {params: {page: req.query.page}})
        .then(function(response) {

            res.render('homePage', { title: "Home Page", 
                                    Books: response.data.Book, 
                                    Page: response.data.Page, 
                                    Limit: response.data.Limit, 
                                    Skip: response.data.Skip, 
                                    PageCount: count,
                                    CartLen: Cart.length,
                                    User: req.session.user,
                                    UserType: req.session.userType })
        })
        .catch((err) => {

            res.send(err)
        })
}

exports.allBooks = async (req, res) => {

    const count = await BooksDB.countDocuments()

    axios.get('http://localhost:3000/findBook', {params: {page: req.query.page}})
        .then(function(response) {

            res.render('Books', { title: "All Books", 
                                    Books: response.data.Book, 
                                    Page: response.data.Page, 
                                    Limit: response.data.Limit, 
                                    Skip: response.data.Skip, 
                                    PageCount: count,
                                    CartLen: Cart.length,
                                    User: req.session.user,
                                    UserType: req.session.userType })
        })
        .catch((err) => {

            res.send(err)
        })
}

exports.searchRoute = async (req, res) => {

    axios.post(`http://localhost:3000/api/search?search=${req.body.search}`)
        .then(function(response) {

            res.render('searchBooks', { title: "Search Books", Books: response.data.Books, CartLen: Cart.length, User: req.session.user,
            UserType: req.session.userType })
        })
}

exports.category = async (req, res) => {

    var category = req.query.cat
    
    var books = await BooksDB.find(

        {
            $or: [

                { category: { $regex: ".*" + category + ".*", $options: 'i' } }
            ]
        }
    )

    res.render('CategorizedBooks', { title: "Categorized Books", Books: books, CartLen: Cart.length, User: req.session.user,
    UserType: req.session.userType })
}

exports.about = (req, res) => {

    res.render('About', { title: "About Us", CartLen: Cart.length, User: req.session.user, UserType: req.session.userType  })
}

exports.dashHome = async (req, res) => {

    const count = await BooksDB.countDocuments()

    axios.get('http://localhost:3000/findBook', {params: {page: req.query.page}})
        .then(function(response) {

            res.render("dashHome", { title: "Dash Board", 
                                    Books: response.data.Book, 
                                    Page: response.data.Page, 
                                    Limit: response.data.Limit, 
                                    Skip: response.data.Skip, 
                                    PageCount: count })
        })
        .catch((err) => {

            res.send(err)
        })
}

exports.addBooks = async (req, res) => {

    var List = await CategoryDB.find()
    res.render('addBooks', { title: "Add Books", Books: "", Category: List[0].Categories })
}

exports.updateBook = async (req, res) => {

    // another way: axios.get('http://localhost:3000/findBook', {params: {id: req.query.id}})

    var List = await CategoryDB.find()

    axios.get(`http://localhost:3000/findBook?id=${req.query.id}`)
        .then(function(response) {

            // console.log(response.data)
            res.render('updateBooks', { title: "Update Book", Books: response.data, Category: List[0].Categories })
        })
        .catch((err) => {

            res.send(err)
        })
}

// Add to Cart API & Render:
exports.addtoCart = async (req, res) => {

    var id = req.query.id
    var Book = await BooksDB.findById(id)
    Cart.push(Book)
    res.redirect('/allBooks')
}

exports.myCart = (req, res) => {

    // calculating total price in my cart:
    total_Price = 0
    for(var i = 0; i < Cart.length; i++) {

        total_Price += Cart[i].price
    }

    total_Price = total_Price.toFixed(2)

    res.render('Cart', { title: "My Cart", Cart: Cart, CartLen: Cart.length, Total_Price: total_Price, User: req.session.user,
    UserType: req.session.userType })
}

exports.removeCart = (req, res) => {

    var BooktoRemove = Cart.find(c => c.id === req.query.id)
    var index = Cart.indexOf(BooktoRemove)
    Cart.splice(index, 1)
    res.redirect('/myCart')
}

exports.checkOut = async (req, res) => {
    
    // console.log(cartObj)

    var UserInfo = await Userdb.findOne({ "Username": req.session.user })

    if(!UserInfo) {

        UserInfo = {}
        console.log('User Not Found!')
    }

    else {

        console.log(UserInfo)
    }

    res.render('PurchaseForm', { title: "Check Out", CartLen: Cart.length, User: req.session.user,
    UserType: req.session.userType, UserInfo: UserInfo })
}

exports.confirmCheckout = (req, res) => {

    var username = req.body.username
    var email = req.body.email
    var address = req.body.address
    var city = req.body.city
    var phone = req.body.phone
    var zipcode = req.body.zipcode

    var arr = []
    for(var i = 0; i < Cart.length; i++) {

        arr.push({ Book: Cart[i].name, Price: Cart[i].price })
    }

    // calculating total price in my cart:
    total_Price = 0
    for(var i = 0; i < Cart.length; i++) {

        total_Price += Cart[i].price
    }

    total_Price += 8.00
    total_Price = total_Price.toFixed(2)

    var sub_total = total_Price - 8.00
    sub_total = sub_total.toFixed(2)

    var cartObj = {}
    Object.assign(cartObj, {

        Username: username,
        Email: email,
        Address: address,
        City: city,
        Phone: phone,
        "Zip Code": zipcode,
        "Purchased Books": arr,
        "Total Price": total_Price
    })

    const purchase = new PurchaseDB(cartObj)
    purchase.save()
    Cart = []
    console.log("total price before = ", total_Price)
    total_Price = 0
    console.log('total price after = ', total_Price)
    res.render('Invoice', { title: "Invoice", info: cartObj, CartLen: Cart.length, Subtotal: sub_total, User: req.session.user,
    UserType: req.session.userType })
}

// Login or Register:
exports.Login = (req, res) => {

    var msg = req.query.msg || ""

    res.render('Login', { title: "Login", CartLen: Cart.length, User: req.session.user, message: msg,
    UserType: req.session.userType })
}

exports.RegisterUser = (req, res) => {

    var msg = req.query.msg || ""

    res.render('Register-User', { title: "Register User", CartLen: Cart.length, User: req.session.user, message: msg, UserType: req.session.userType })
}

// Admin Login or Register:
exports.adminLogin = (req, res) => {

    var msg = req.query.msg || ""

    res.render('AdminLogin', { message: msg })
}

exports.RegisterAdmin = (req, res) => {

    var msg = req.query.msg || ""

    res.render('Register-Admin', { message: msg })
}
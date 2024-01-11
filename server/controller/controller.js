const express = require('express')
const BooksDB = require('../model/Books')
const multer = require('multer')
const { Userdb, Admindb } = require('../model/Users')
const { default: axios } = require('axios')

// creating globally for addBook & updateBook; otherwise it will do the same thing twice which is unnecessary;
const Storage = multer.diskStorage({

    destination: 'uploads',

    filename: (req, file, cb) => { // cb is call back function;

        cb(null, file.originalname)
    }
})

// upload middleware to upload image into the 'uploads' folder:
const upload = multer({

    storage: Storage

}).single('image') // bookImage -> is the name of the input tag used for uploading image;

// Create & save new Book:
exports.addBooks = (req, res) => {

    upload(req, res, (err) => {

        if (err) {
            console.log(err)
        }

        else {

            const newBook = new BooksDB({

                name: req.body.name,
                author: req.body.author,
                category: req.body.category,
                price: req.body.price,
                image: req.file.filename
            })

            newBook.save()
                .then(() => { res.redirect('/add-books') })
                .catch((err) => { res.send(err) })
        }
    })
}

exports.find = async (req, res) => { // aysnc

    let page = Number(req.query.page) || 1
    let limit = Number(req.query.limit) || 10
    let skip = (page - 1) * limit

    if (req.query.id) {

        const id = req.query.id
        // console.log(id)

        BooksDB.findById(id)
            .then(data => {

                // console.log(data)
                res.send(data)
            })
            .catch((err) => {

                res.send(err)
            })
    }

    else {

        // console.log("No query")

        BooksDB.find().skip(skip).limit(limit)
            .then(data => {

                // console.log(data)
                // res.send(data)
                res.send({ Book: data, Page: page, Limit: limit, Skip: skip })
            })
            .catch((err) => {

                res.send(err)
            })
    }
}

exports.updateBooks = (req, res) => {

    upload(req, res, (err) => {

        // console.log(req.body.id)
        if (err) {

            res.send(err)
        }

        else {

            // A way to update:
            // BooksDB.findByIdAndUpdate(id, {

            //     name: req.body.name,
            //     author: req.body.author,
            //     category: req.body.category,
            //     price: req.body.price,
            //     image: req.file.filename
            // })

            var id = req.params.id
            console.log(id)

            var update_data;
            if (req.file) {

                update_data = {

                    name: req.body.name,
                    author: req.body.author,
                    category: req.body.category,
                    price: req.body.price,
                    image: req.file.filename
                }
            }

            else {

                update_data = {

                    name: req.body.name,
                    author: req.body.author,
                    category: req.body.category,
                    price: req.body.price
                }
            }

            BooksDB.findByIdAndUpdate(id, update_data).then(data => {

                if (data) {

                    // res.redirect('/update-book')
                    res.redirect(`/update-book?id=${id}`)
                }

                else {

                    res.send(`Cannot update user by id: ${id}. Maybe user not found.`)
                }
            })
                .catch((err) => {

                    res.send("Error updating user information!")
                })
        }
    })
}

exports.deleteBooks = (req, res) => {

    var id = req.params.id

    BooksDB.findByIdAndDelete(id)
        .then(data => {

            res.redirect('/dash-home')
        })
        .catch((err) => {

            res.send(err)
        })
}

exports.searchBooks = async (req, res) => {

    var query = req.query.search
    var searchedBooks = await BooksDB.find(

        {
            $or: [

                { name: { $regex: ".*" + query + ".*", $options: 'i' } },
                { author: { $regex: ".*" + query + ".*", $options: 'i' } }
            ]
        }
    )

    var count = searchedBooks.length
    res.send({ Books: searchedBooks })
}

// Login API:
exports.LoginUser = async (req, res) => {

    var username = req.body.username
    var email = req.body.email
    var password = req.body.password

    var Message = ""

    var User = await Userdb.find({ "Email": email, "Password": password })

    if(User.length === 0) {

        Message = "User Not Found!"
        res.redirect(`/login?msg=${Message}`)
    }

    else {

        req.session.user = username
        req.session.userType = "User"
        req.session.save()

        res.redirect('/')
    }
}

exports.registerUser = async (req, res) => {

    var Username = req.body.username
    var Email = req.body.email
    var Password = req.body.password
    var Address = req.body.address
    var City = req.body.city
    var Phone = req.body.phone
    var ZipCode = req.body.zipcode

    var Message = ""

    const obj = {

        "Username": Username,
        "Email": Email,
        "Password": Password,
        "Address": Address,
        "City": City,
        "Phone": Phone,
        "Zip code": ZipCode
    }

    const size = await Userdb.countDocuments()

    if (size === 0) {

        var newUser = new Userdb(obj)
        newUser.save()
    }

    else {

        var User = await Userdb.find({ "Username": Username, "Email": Email })

        if (User.length === 0) {

            console.log(User)
            var newUser = new Userdb(obj)
            newUser.save()
        }

        else {

            Message = "User Already Registered. Go to Login Page!"
        }
    }

    res.redirect(`/registerUser?msg=${Message}`)
}

exports.LoginAdmin = async (req, res) => {

    var username = req.body.username
    var email = req.body.email
    var password = req.body.password

    var Message = ""

    var Admin = await Admindb.find({ "Email": email, "Password": password })

    if(Admin.length === 0) {

        Message = "Admin Not Found!"
        res.redirect(`/adminLogin?msg=${Message}`)
    }

    else {

        req.session.user = username
        req.session.userType = "Admin"
        req.session.save()

        res.redirect('/dash-home')
    }
}

exports.registerAdmin = async (req, res) => {

    var Username = req.body.username
    var Email = req.body.email
    var Password = req.body.password
    var Phone = req.body.phone

    var Message = ""

    const obj = {

        "Username": Username,
        "Email": Email,
        "Password": Password,
        "Phone": Phone
    }

    var Admin = await Admindb.find({ "Username": Username, "Email": Email })

    if(Admin.length === 0) {

        var newAdmin = new Admindb(obj)
        newAdmin.save()

        Message = "Success"
    }

    else {

        Message = "Admin Already Registered. Go to Login Page!"
    }

    res.redirect(`/registerAdmin?msg=${Message}`)
}

exports.logout = (req, res) => {

    req.session.destroy()

    res.redirect('/')
}
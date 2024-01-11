const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const path = require('path')
const { execArgv } = require('process')
const morgan = require('morgan')
const session = require('express-session')
const cookieParser = require('cookie-parser')

const connectDB = require('./server/database/connection')

const app = express()

// use middleware:
app.use(express())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({

    resave: true,
    saveUninitialized: true,
    secret: "secret"
}))

// config dotenv:
dotenv.config( { path: 'config.env' } )
const PORT = process.env.PORT || 5000

// Morgan log request:
// app.use(morgan('tiny'))

// Database Connection:
connectDB()

// set view engine:
app.set("view engine", "ejs")

// load assets:
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')))
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')))
app.use('/images', express.static(path.resolve(__dirname, 'assets/images')))
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

// load routes:
app.use('/', require('./server/routes/router'))

app.listen(PORT, () => {

    console.log(`Server is running at http://localhost:${PORT}`)
})
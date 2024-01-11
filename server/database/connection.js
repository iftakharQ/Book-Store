const mongoose = require('mongoose')

const connectDB = async () => {

    try {

        // connection:
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${con.connection.host}`)
    }

    catch(err) {

        console.log(err)
    }
}

module.exports = connectDB
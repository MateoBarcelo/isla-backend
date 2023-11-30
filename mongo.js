const mongoose = require('mongoose')
const uri = process.env.DB_URI

mongoose.connect(uri).then(() => {
    console.log("Succesfully connected to DB")
}).catch((err) => {
    console.error(err)
})


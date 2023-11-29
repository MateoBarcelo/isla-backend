const mongoose = require('mongoose')
const uri = "mongodb+srv://mateobarcelo88:islatienda@islacluster.kzksce6.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri).then(() => {
    console.log("Succesfully connected to DB")
}).catch((err) => {
    console.error(err)
})


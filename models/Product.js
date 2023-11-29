const mongoose = require('mongoose')

const { Schema, model } = mongoose

const productSchema = new Schema({
    title: String,
    thumbnail: String,
    category: String,
    stock: String,
    measures: String,
    price: String
})

productSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Product = model('Product', productSchema)

module.exports = Product
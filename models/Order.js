const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
    products: Array,
    total: Number,
    dateCreated: String,
    cardHolderName: String,
    type: String,
    send: String,
    state: {
        type: String,
        enum: ['in_process', 'approved', 'rejected'],
        required: true
    },
    user: { // This is the user's ID, when is passed the id in the post, it'll be converted to a user object because it finds the id in the User schema
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    number: Number
})

orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Order = model('Order', orderSchema)

module.exports = Order
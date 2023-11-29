const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: String,
    passwordHash: String,
    email: String,
    name: String,
    surname: String,
    address: String,
    phone: String,
    role: String
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject.passwordHash
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const User = model('User', userSchema)

module.exports = User
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User.js')

const { SECRET } = process.env

loginRouter.post('/', async (req, res, next) => {
    const {body} = req
    const {email, password} = body

    const user = await User.findOne({email})

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if(!passwordCorrect) return res.json({error: 'invalid email or password'}).status(401)

    const userForToken = {
        id: user.id,
        role: user.role || 'user'
    }

    const authToken = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 * 24 * 7 })

    res.header("Access-Control-Allow-Origin", "*")
    res.json({
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        authToken
    }).status(200)
})

module.exports = loginRouter
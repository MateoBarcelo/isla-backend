const handleError = require('../middlewares/handleError.js')
const bcrypt = require('bcrypt')
const userValidation = require('../middlewares/userValidation.js')
const express = require('express')
const userRouter = express.Router()
const User = require('../models/User.js')

userRouter.get('/', userValidation, (req, res, next) => {
    User.find({}).then(users => {
        res.status(200).json(users)
    }).catch(err => next(err))
})

userRouter.get('/isAdmin', userValidation, (req, res) => {
    const { userRole } = req

    if(userRole !== 'admin') {
        return res.status(401).json({error: 'user is not admin'})
    } else {
        return res.status(200).end()
    }
})

userRouter.get('/:id', userValidation,(req, res, next) => {
    const {id} = req.params

    User.findById(id).then(user => {
        if(user) {
            res.json(user).status(200)
        } else {
            res.status(404).end()
        }
    }).catch(err => next(err))
})

userRouter.get('/email/:email', userValidation, (req, res, next) => {
    const { email } = req.params

    User.findOne({email}).then(user => {
        if(user) {
            res.json(user).status(200)
        } else {
            res.status(404).end()
        }
    }).catch(err => next(err))
})

userRouter.put('/:id', userValidation, async (req, res, next) => {

    const { id } = req.params
    const { body, userRole } = req
    const { name, surname, email, phone, address, role } = body

    if(userRole !== 'admin') {
        return res.status(401).json({error: 'user is not admin'})
    }
    try {
        User.findByIdAndUpdate(id, { name, surname, email, phone, address, role }, { new: true }).then(user => {
            res.json(user).status(200)
        }).catch(err => next(err))
    } catch(err) {
        next(err)
    }
})

userRouter.post('/register', async (req, res, next) => {
    const { body } = req;
    const { email, name, surname, password, phone } = body;

    const username = name + surname;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                error: 'An account with that email already exists',
            })
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            name,
            surname,
            passwordHash,
            phone,
        });

        const userSaved = await newUser.save();

        res.status(203).json(userSaved);
    } catch (error) {
        next(error); 
    }
});

userRouter.use(handleError)

module.exports = userRouter

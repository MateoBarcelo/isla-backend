require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
require('./mongo.js')

const productRouter = require('./controllers/products.js')
const userRouter = require('./controllers/user.js')
const cartRouter = require('./controllers/cart.js')
const loginRouter = require('./controllers/login.js')
const uploadRouter = require('./controllers/upload.js')
const checkoutRouter = require('./controllers/checkout.js')
const orderRouter = require('./controllers/order.js')

const cors = require('cors')
const handleError = require('./middlewares/handleError.js')

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.get("/", (req, res) => {
    res.send("<h1>Hi</h1>")
})
app.use(express.json())
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/order', orderRouter)
app.use('/api/login', loginRouter)
app.use('/api/uploads', uploadRouter)
app.use('/media', express.static('uploads'))

app.use(handleError)
const PORT = 3001
app.listen(PORT, (err) => {
    if(err) console.log(err)
    console.log("Server listening at port " + PORT)
})

module.exports = app
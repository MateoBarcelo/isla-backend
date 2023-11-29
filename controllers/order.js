const express = require('express')

const orderRouter = express.Router()

const Order = require('../models/Order.js')

const userValidation = require('../middlewares/userValidation.js')

const User = require('../models/User.js')

orderRouter.get('/maxorder', async (req, res, next) => {
    let orderNumber = 0
    Order.find({}).then(orders => {
      
        const orderNumbers = orders.map(order => Number(order.number))
        orderNumbers.length > 0 ? orderNumber = Math.max(...orderNumbers) : orderNumber = 0
        res.json(orderNumber)
    }).catch(err => next(err))
    
})


orderRouter.get('/', userValidation, async (req, res, next) => {

    Order.find({}).populate("user").then(orders => {
        const newOrders = orders.map(order => {
            
            return {
                id: order._id,
                products: order.products,
                total: order.total,
                dateCreated: order.dateCreated,
                cardHolderName: order.cardHolderName,
                number: order.number,
                state: order.state,
                send: order.send,
                user: order.user.username,
                type: order.type
            }
        })
        res.json(newOrders)
    }).catch(err => console.log(err))

})

orderRouter.put('/:id', userValidation, async (req, res, next) => {
    const { id } = req.params
    const { body } = req
    const { state } = body

    try {
        const newOrder = await Order.findByIdAndUpdate(id, { state }, { new: true })
        res.json(newOrder).status(200)
    } catch(err) {
        next(err)
    }
})

orderRouter.delete('/:id', userValidation, async (req, res, next) => {
    const { id } = req.params

    try {
        const deletedOrder = await Order.findByIdAndDelete(id)
        res.json(deletedOrder).status(200)
    } catch(err) {
        next(err)
    }
})


orderRouter.post('/', userValidation, async (req, res, next) => {
    const { body } = req
    const { products, total, type, number, send } = body
    const { userId } = req

    const newOrder = new Order({
        products,
        total,
        type,
        state:"in_process",
        user: userId,
        number,
        send
    });

    try {
        const orderSaved = await newOrder.save();
        res.json(orderSaved).status(200);
    } catch (err) {
        next(err);
    }
})

module.exports = orderRouter
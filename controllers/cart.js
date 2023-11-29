const Order = require('../models/Order');
const userValidation = require('../middlewares/userValidation.js');
const cartRouter = require('express').Router();

cartRouter.post('/', userValidation, async (req, res, next) => {
    const { body } = req;
    const { products, total, user } = body;
    const { id } = user

    //TO-DO: Handle state of the order and checkout

    const newOrder = new Order({
        products,
        total,
        //state,
        user: id
    });

    try {
        const orderSaved = await newOrder.save();
        res.json(orderSaved).status(200);
    } catch (err) {
        next(err);
    }
})

module.exports = cartRouter
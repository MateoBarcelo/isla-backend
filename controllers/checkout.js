const express = require('express')
const userValidation = require('../middlewares/userValidation')
const {MercadoPagoConfig, Payment} = require("mercadopago")
const User = require('../models/User')
const Order = require('../models/Order')

const checkoutRouter = express.Router()

checkoutRouter.post('/cardpayment', userValidation, async (req, res) => {

    const { body, userId } = req
    const { payer } = body

    const user = await User.findById(userId)

    if(!user) return res.status(404).json({error: "user not found"})
    else {

    const client = new MercadoPagoConfig({ accessToken: process.env.MPCLIENT_ACCESS_TOKEN, options: { timeout: 5000, idempotencyKey: 'abc' } });
    
    const payment = new Payment(client)

    const order = {
        body: { 
            transaction_amount: body.transaction_amount,
            token: body.token,
            description: body.description,
            installments: body.installments,
            payment_method_id: body.paymentMethodId,
            issuer_id: body.issuer,
            payer: {
                email: payer.email,
                identification: {
                    type: payer.identificationType,
                    number: payer.number
                }
            }
        }
    }
    try {
        const response = await payment.create(order)
        const newOrder = new Order({
            products: body.products,
            total: response.transaction_details.net_received_amount,
            dateCreated: response.card.date_created,
            cardHolderName: response.card.cardholder.name,
            state: response.status,
            type: "Tarjeta",
            send: body.send,
            user: user.id
        })

        const orderSaved = await newOrder.save()

        res.status(200).json(orderSaved)
    } catch (err) {
        console.log(err)
        res.status(400).json({error: err})
    }

    }
    
})

module.exports = checkoutRouter
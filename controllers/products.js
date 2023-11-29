const express = require('express')
const productRouter = express.Router()
const Product = require('../models/Product.js')
const handleError = require('../middlewares/handleError.js')
const userValidation = require('../middlewares/userValidation.js')

productRouter.get('/', (req, res) => {
    Product.find({}).then(products => {
        res.json(products)
    }).catch(err => console.log(err))
})

productRouter.get('/:id', (req, res, next) => {
    const {id} = req.params

    Product.findById(id).then(product => {
        if(product) {
            res.json(product).status(200)
        } else {
            res.status(404).end()
        }
    }).catch(err => next(err))
})

productRouter.post('/', userValidation, async (req, res, next) => {
    const {body} = req
    const { title, thumbnail, category, stock, measures, price } = body

    if(!body || !title) {
        return res.status(400).json({
            error: 'product body or title is missing'
        })
    }

    try {
        const existingProduct = await Product.findOne({ title });

        if (existingProduct) {
            return res.status(400).json({
                error: 'product with that title already exists'
            });
        }

        const newProduct = new Product({
            title,
            thumbnail,
            category,
            stock,
            measures,
            price
        });

        const productSaved = await newProduct.save();
        
        
        return res.status(200).json(productSaved);
    } catch (err) {
        
        return next(err);
    }
})

productRouter.put('/:id', userValidation, (req, res, next) => {
    const {id} = req.params
    const {title, thumbnail, category, stock, measures, price} = req.body

    const newProductInfo = {
        title,
        thumbnail,
        category,
        stock,
        measures,
        price
    }

    Product.findByIdAndUpdate(id, newProductInfo, {new: true}).then(product => {
       res.json(product).status(200).end()
    }).catch(err => next(err))
})

productRouter.delete('/:id', userValidation, (req, res, next) => {
    const {id} = req.params

    Product.findByIdAndDelete(id).then(() => {
        res.status(204).end()
    }).catch(err => next(err))
})

productRouter.use(handleError)

module.exports = productRouter
const express = require('express')
const uploadRouter = express.Router()
const multer = require('multer')

const {fileURLToPath} = require('url')

const path = require('path')

const userExtractor = require('../middlewares/userValidation.js')

const CURRENT_DIR = path.join(__dirname)
const MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg']

const multerUploader = multer({
    storage: multer.diskStorage({
        destination: path.join(CURRENT_DIR, '../uploads'),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase()
            const fileName = file.originalname.split(ext)[0] //splits to modify only before file extension
            
            cb(null, `${fileName}-${Date.now()}${ext}`)
        },
        fileFilter : (req, file, cb) => {
            const isValid = MIME_TYPES.includes(file.mimetype)
            if(!isValid) cb(new Error(`Only ${MIME_TYPES.join(', ')} files are allowed`))
            cb(null, isValid)
        }
    })
})

uploadRouter.post('/', userExtractor, multerUploader.single('file'), (req, res) => {

    req.file.fileUrl = req.protocol + "://" + req.headers.host + "/media/" + req.file.filename

    res.status(200).json(req.file)
})

module.exports = uploadRouter
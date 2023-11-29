const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authorization = req.get('authorization')

    let token = ''

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7)
    }

    let decodedToken = ''

    try {
        decodedToken = jwt.verify(token, process.env.SECRET)
    } catch(err) {
        next(err)
    }

    if(!token || !decodedToken) {
        return res.status(401).json({error: 'token missing or invalid'})
    } 

    req.userId = decodedToken.id
    req.userRole = decodedToken.role

    next()
}
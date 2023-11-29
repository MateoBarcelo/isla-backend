const ERROR_HANDLERS = {
    defaultError: res => res.status(500).send({ error: 'Server error' }),

    CastError: res => res.status(400).send({ error: "id used is malformed" }),

    JsonWebTokenError: res => res.status(401).json({ error: 'auth token missing or invalid' })
}

module.exports = (error, req, res, next) => {
    console.error(error)
    return ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError(res)
}
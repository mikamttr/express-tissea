const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const usersModel = require('../models/usersModel')

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await usersModel.findUserById(decoded.userId)

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized' })
            }

            next()
        } catch (error) {
            console.error(error)
            res.status(401).json({ message: 'Invalid token' })
        }
    } else {
        res.status(401).json({ message: 'No token, authorization denied' })
    }
})

module.exports = { protect }
const jwt = require('jsonwebtoken')

// Generate JWT token
const generateJWT = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = generateJWT
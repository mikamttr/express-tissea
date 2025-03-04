const asyncHandler = require('express-async-handler')
const generateJWT = require('../utils/generateJWT')
const bcrypt = require('bcryptjs')
const usersModel = require('../models/usersModel')

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.status(400)
        return res.status(400).json({ message: "All fields are required" })
    }

    const existingUser = await usersModel.findUserByEmail(email)
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await usersModel.createUser(email, hashedPassword)

    if (user) {
        res.status(201).json({
            id: user.id,
            email: user.email,
            token: generateJWT(user.id),
        })
    } else {
        res.status(400).json({ message: "Invalid user data" })
    }
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({
        message: "All fields are required"
    })

    const user = await usersModel.findUserByEmail(email)

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        res.json({
            id: user.id,
            email: user.email,
            token: generateJWT(user.id),
        })
    } else {
        res.status(401).json({ message: "Invalid email or password" })
    }
})

module.exports = { registerUser, loginUser }
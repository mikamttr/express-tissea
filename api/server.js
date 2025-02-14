const express = require('express')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const colors = require('colors')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// import des routes
app.use('/api', require('./routes'))

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
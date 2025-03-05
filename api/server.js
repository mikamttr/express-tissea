const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')

const port = process.env.PORT || 5000
const frontendUrl = process.env.FRONTEND_URL

const app = express()

app.use(cors({
    origin: frontendUrl,
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', require('./routes'))

app.listen(port, () => {
    console.log(`API running on port ${port}`)
    console.log(`CORS allowed for: ${frontendUrl}`)
})
const express = require('express')
const router = express.Router()
const { getDistanceBetweenStops, getTotalDistanceOfLine } = require('./controllers/statsController')
const { registerUser, loginUser } = require('./controllers/usersController')
const { getAllCategories, getCategoryLines, getLineDetails, addStopToLine, updateLineDetails } = require('./controllers/categoriesController')

// Categories routes
router.get('/categories', getAllCategories)
router.get('/categories/:id/lines', getCategoryLines)
router.get('/categories/:categoryId/lines/:lineId', getLineDetails)
router.post('/categories/:categoryId/lines/:lineId/stops', addStopToLine)
router.put('/categories/:id/lines/:id', updateLineDetails)

// Stats routes
router.get('/stats/distance/stops/:id1/:id2', getDistanceBetweenStops)
router.get('/stats/distance/lines/:id', getTotalDistanceOfLine)

// Users routes
router.post('/users/signup', registerUser)
router.post('/users/login', loginUser)

// 404 route
router.use((req, res, next) => { res.status(404).json({ message: 'Route not found' }) })

module.exports = router
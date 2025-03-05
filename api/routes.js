const express = require('express')
const router = express.Router()

const { registerUser, loginUser } = require('./controllers/usersController')
const { getAllCategories, getCategoryLines } = require('./controllers/categoriesController')
const { getLineDetails, getLineStopsDetails, updateLineDetails, addStopToLine, deleteStopFromLine } = require('./controllers/linesController')
const { getDistanceBetweenStops, getTotalDistanceOfLine } = require('./controllers/statsController')
const { protect } = require('./middlewares/authMiddleware')

// Categories routes
router.get('/categories', protect, getAllCategories)
router.get('/categories/:id/lines', protect, getCategoryLines)
router.get('/categories/:categoryId/lines/:lineId', protect, getLineDetails)
router.get('/categories/:categoryId/lines/:lineId/stops', protect, getLineStopsDetails)
router.put('/categories/:categoryId/lines/:lineId', protect, updateLineDetails)
router.post('/categories/:categoryId/lines/:lineId/stops', protect, addStopToLine)
router.delete('/categories/:categoryId/lines/:lineId/stops/:stopId', protect, deleteStopFromLine)

// Stats routes
router.get('/stats/distance/stops/:id1/:id2', protect, getDistanceBetweenStops)
router.get('/stats/distance/lines/:id', protect, getTotalDistanceOfLine)

// Users routes
router.post('/users/signup', registerUser)
router.post('/users/login', loginUser)

// Not found route
router.use((req, res) => { res.status(404).json({ message: 'Route not found' }) })

module.exports = router
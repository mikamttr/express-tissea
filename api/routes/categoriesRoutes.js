const express = require('express')
const router = express.Router()
const { getCategories, getCategoryLines, getLineDetails } = require('../controllers/categoriesController')

router.get('/categories', getCategories) // http://localhost:5000/api/categories
router.get('/categories/:id/lines', getCategoryLines) // http://localhost:5000/api/categories/2/lines
router.get('/categories/:categoryId/lines/:lineId', getLineDetails) // http://localhost:5000/api/categories/2/lines/1

module.exports = router

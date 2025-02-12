const express = require('express');
const router = express.Router();
const getAllCategories = require('../controllers/categoriesController');

router.get('/categories', getAllCategories);

module.exports = router;
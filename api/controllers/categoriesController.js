const asyncHandler = require('express-async-handler')
const categoriesModel = require('../models/categoriesModel')

// Retourne toutes les catégories
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await categoriesModel.getAllCategories()
        res.json(categories)
    } catch (error) {
        console.error("Error fetching categories:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

// Retourne la liste de toutes les lignes d'une catégorie
const getCategoryLines = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (isNaN(id)) return res.status(400).json({ error: "Specified id must be a number." })

    try {
        const lines = await categoriesModel.getCategoryLines(parseInt(id))
        if (lines.length === 0) {
            return res.status(404).json({
                message: `No lines found for category with id ${id}.`
            })
        }
        res.json(lines)
    } catch (error) {
        console.error("Error fetching lines for category:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = { getAllCategories, getCategoryLines }
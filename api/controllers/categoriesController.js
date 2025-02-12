const asyncHandler = require('express-async-handler')
const categoriesModel = require('../models/categoriesModel')

// Récupère toutes les catégories
const getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await categoriesModel.getCategories()
        res.json(categories)
    } catch (error) {
        console.error("Error fetching categories:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

// Récupère les lignes d'une catégorie à partir de son ID
const getCategoryLines = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const lines = await categoriesModel.getCategoryLines(parseInt(id))
        if (lines.length === 0) {
            return res.status(404).json({ message: `Aucune ligne trouvée pour la catégorie avec l'id ${id}.` })
        }
        res.json(lines)
    } catch (error) {
        console.error("Error fetching lines for category:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

// Récupère les détails d'une ligne spécifique dans une catégorie
const getLineDetails = asyncHandler(async (req, res) => {
    const { categoryId, lineId } = req.params

    try {
        const line = await categoriesModel.getLineDetails(parseInt(categoryId), parseInt(lineId))

        if (!line || line.categoryId !== parseInt(categoryId)) {
            return res.status(404).json({ message: "Ligne non trouvée." })
        }

        const stopNames = line.stops.map((lineStop) => lineStop.stop.name)

        res.json({
            createdAt: line.createdAt,
            startTime: line.startTime,
            endTime: line.endTime,
            stopNames,
        })
    } catch (error) {
        console.error("Error fetching line details:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = {
    getCategories,
    getCategoryLines,
    getLineDetails,
}

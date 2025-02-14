const asyncHandler = require('express-async-handler')
const categoriesModel = require('../models/categoriesModel')
const linesModel = require('../models/linesModel')

// Récupère toutes les catégories
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await categoriesModel.getAllCategories()
        res.json(categories)
    } catch (error) {
        console.error("Error fetching categories:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

// Récupère les lignes d'une catégorie
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

// Récupère les détails d'une ligne
const getLineDetails = asyncHandler(async (req, res) => {
    const { categoryId, lineId } = req.params

    if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Category id must be a number.' })
    }
    if (isNaN(lineId)) {
        return res.status(400).json({ error: 'Line id must be a number.' })
    }

    try {
        const line = await linesModel.getLineDetails(parseInt(categoryId), parseInt(lineId))

        if (!line) return res.status(404).json({ message: `Line with id ${lineId} not found in category ${categoryId}.` })

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

const addStopToLine = asyncHandler(async (req, res) => {
    const { categoryId, lineId } = req.params
    let { stopId, stopOrder } = req.body

    if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Category id must be a number.' })
    }
    if (isNaN(lineId)) {
        return res.status(400).json({ error: 'Line id must be a number.' })
    }
    if (isNaN(stopId) || isNaN(stopOrder)) {
        return res.status(400).json({ error: 'Invalid request body.' })
    }

    try {
        // Check if the line exists
        const line = await linesModel.getLineDetails(parseInt(categoryId), parseInt(lineId))
        if (!line) {
            return res.status(404).json({ error: `Line with ID ${lineId} not found in category ${categoryId}.` })
        }

        const existingStops = line.stops
        const lastOrder = existingStops.length > 0 ? existingStops[existingStops.length - 1].stopOrder : 0

        // If stopOrder is greater than lastOrder, set it to lastOrder + 1
        if (stopOrder > lastOrder + 1) {
            stopOrder = lastOrder + 1
        }

        // Shift stop orders if inserting in the middle
        if (stopOrder <= lastOrder) {
            await linesModel.shiftStopOrders(lineId, stopOrder)
        }

        const newStop = await linesModel.addStopToLine(parseInt(lineId), parseInt(stopId), parseInt(stopOrder))

        res.status(201).json(newStop)
    } catch (error) {
        console.error('Error adding stop to line:', error)
        res.status(500).json({ error: 'Internal server error.' })
    }
})

const updateLineDetails = asyncHandler(async (req, res) => {
    const { categoryId, lineId } = req.params
    const { name, startTime, endTime } = req.body

    // Check if at least one field is provided
    if (!name && !startTime && !endTime) {
        return res.status(400).json({ error: 'At least one field (name, startTime, or endTime) must be provided.' })
    }

    try {
        const existingLine = await linesModel.getLineDetails(parseInt(categoryId), parseInt(lineId))
        if (!existingLine) {
            return res.status(404).json({ error: `Line with id ${lineId} not found in category ${categoryId}.` })
        }

        const updateData = {}
        if (name) updateData.name = name
        if (startTime) updateData.startTime = startTime
        if (endTime) updateData.endTime = endTime

        const updatedLine = await linesModel.updateLineDetails(parseInt(lineId), updateData)
        res.json({ message: 'Line updated successfully', updatedLine })

    } catch (error) {
        console.error("Error updating line:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

/**
 * Error updating line: PrismaClientValidationError: 
Invalid `prisma.transportLine.findUnique()` invocation in
C:\Users\mika3\Desktop\tissea-api\api\models\linesModel.js:5:39

  2 
  3 // Récupère les détails d'une ligne
  4 const getLineDetails = async (categoryId, lineId) => {
→ 5     return await prisma.transportLine.findUnique({
          where: {
            categoryId: NaN,
        +   id: Int
          },
          include: {
            stops: {
              orderBy: {
                stopOrder: "asc"
              },
              include: {
                stop: true
              }
            }
          }
        })

Argument `id` is missing.
    at xn (C:\Users\mika3\Desktop\tissea-api\node_modules\@prisma\client\runtime\library.js:29:1363)
    at Bn.handleRequestError (C:\Users\mika3\Desktop\tissea-api\node_modules\@prisma\client\runtime\library.js:121:7005)
    at Bn.handleAndLogRequestError (C:\Users\mika3\Desktop\tissea-api\node_modules\@prisma\client\runtime\library.js:121:6686)
    at Bn.request (C:\Users\mika3\Desktop\tissea-api\node_modules\@prisma\client\runtime\library.js:121:6393)
    at async l (C:\Users\mika3\Desktop\tissea-api\node_modules\@prisma\client\runtime\library.js:130:9645)
    at async Object.getLineDetails (C:\Users\mika3\Desktop\tissea-api\api\models\linesModel.js:5:12)
    at async C:\Users\mika3\Desktop\tissea-api\api\controllers\categoriesController.js:118:30 {
  clientVersion: '6.3.1'
 */

module.exports = { getAllCategories, getCategoryLines, getLineDetails, addStopToLine, updateLineDetails }
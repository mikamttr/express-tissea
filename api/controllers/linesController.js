const asyncHandler = require('express-async-handler')
const linesModel = require('../models/linesModel')

// Retourne les détails d'une ligne
const getLineDetails = asyncHandler(async (req, res) => {
    const { categoryId, lineId } = req.params

    if (isNaN(categoryId) || isNaN(lineId)) {
        return res.status(400).json({ error: 'CategoryId and LineId must be numbers.' })
    }

    try {
        const line = await linesModel.getLineDetails(parseInt(categoryId), parseInt(lineId))

        if (!line) {
            return res.status(404).json({ message: `Line with ID ${lineId} not found in category ${categoryId}.` })
        }

        const stops = line.stops.map((lineStop) => ({
            order: lineStop.stopOrder,
            name: lineStop.stop.name
        }))

        res.json({
            "Date de creation": line.createdAt,
            "Début d'activité": line.startTime,
            "Fin d'activité": line.endTime,
            "liste des arrêts": stops,
        })
    } catch (error) {
        console.error('Error fetching line details: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Retourne la liste détaillée des arrêts d'une ligne
const getLineStopsDetails = asyncHandler(async (req, res) => {
    let { categoryId, lineId } = req.params

    if (isNaN(categoryId) || isNaN(lineId)) {
        return res.status(400).json({ error: 'CategoryId and LineId must be numbers.' })
    }

    try {
        const stops = await linesModel.getLineStopsDetails(parseInt(lineId))

        if (stops.length === 0) {
            return res.status(404).json({ message: `No stops found for line ${lineId} in category ${categoryId}.` })
        }

        res.json(
            stops.map((lineStop) => ({
                order: lineStop.stopOrder,
                name: lineStop.stop.name,
                latitude: lineStop.stop.latitude,
                longitude: lineStop.stop.longitude
            }))
        )

    } catch (error) {
        console.error('Error fetching stops: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Met à jour les détails d'une ligne
const updateLineDetails = asyncHandler(async (req, res) => {
    const { categoryId, lineId } = req.params
    const { name, startTime, endTime } = req.body

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
        console.error('Error updating line: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Ajoute un arrêt à une ligne et met à jour l'ordre des arrêts
const addStopToLine = asyncHandler(async (req, res) => {
    let { categoryId, lineId } = req.params
    let { stopId, stopOrder } = req.body

    if (isNaN(categoryId) || isNaN(lineId)) {
        return res.status(400).json({ error: 'CategoryId and LineId must be numbers.' })
    }

    if (!stopId || isNaN(stopId) || isNaN(stopOrder)) {
        return res.status(400).json({ error: 'Invalid request body.' })
    }

    categoryId = parseInt(categoryId)
    lineId = parseInt(lineId)
    stopId = parseInt(stopId)
    stopOrder = parseInt(stopOrder)

    try {
        const existingLine = await linesModel.getLineDetails(categoryId, lineId)
        if (!existingLine) {
            return res.status(404).json({ error: `Line with ID ${lineId} not found in category ${categoryId}.` })
        }

        let stopList = await linesModel.getLineStops(lineId)
        stopList = stopList.filter(s => s.stopId !== stopId) // Filtre l'arrêt s'il existe déjà sur la ligne
        stopList.splice(stopOrder - 1, 0, { stopId, lineId }) // Ajoute l'arrêt à la liste

        // Met à jour l'odre des arrêts de la ligne
        const newStopsOrder = await linesModel.updateStopsOrder(lineId, stopList)
        res.json({
            message: 'Stop added successfully.',
            stops: newStopsOrder,
        })
    } catch (error) {
        console.error('Error adding stop: ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

const deleteStopFromLine = asyncHandler(async (req, res) => {
    let { categoryId, lineId, stopId } = req.params

    if (isNaN(categoryId) || isNaN(lineId) || isNaN(stopId)) {
        return res.status(400).json({ error: 'Category, Line and Stop must be numbers.' })
    }

    categoryId = parseInt(categoryId)
    lineId = parseInt(lineId)
    stopId = parseInt(stopId)

    try {
        const existingLine = await linesModel.getLineDetails(categoryId, lineId)
        if (!existingLine) {
            return res.status(404).json({ error: `Line with ID ${lineId} not found in category ${categoryId}.` })
        }

        let stopList = await linesModel.getLineStops(lineId)

        // Vérifie si l'arrêt existe sur la ligne
        if (!stopList.some(s => s.stopId === stopId)) {
            return res.status(404).json({ error: `Stop ID ${stopId} not found in line ${lineId}.` })
        }

        stopList = stopList.filter(s => s.stopId !== stopId) // supprime l'arrêt de la liste

        // Met à jour l'ordre des arrêts restants
        const newStopsOrder = await linesModel.updateStopsOrder(lineId, stopList)

        res.json({
            message: `Stop ${stopId} removed successfully from line ${lineId}.`,
            stops: newStopsOrder,
        })
    } catch (error) {
        console.error('Error deleting stop:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = { getLineDetails, getLineStopsDetails, updateLineDetails, addStopToLine, deleteStopFromLine }
const asyncHandler = require('express-async-handler')
const stopsModel = require('../models/stopsModel')
const { calculateDistance } = require('../utils/calculateDistance')

// Retourne la distance entre deux arrêts   
const getDistanceBetweenStops = asyncHandler(async (req, res) => {
    const { id1, id2 } = req.params

    if (isNaN(id1) || isNaN(id2)) {
        return res.status(400).json({ error: 'Both IDs must be valid numbers.' })
    }
    if (id1 === id2) {
        return res.status(400).json({ error: 'The provided IDs must be different.' })
    }

    const stops = await stopsModel.getStopsByIds(id1, id2)

    if (stops.length < 2) {
        return res.status(404).json({ error: 'One of the specified stops was not found.' })
    }

    const [stop1, stop2] = stops
    const distance = calculateDistance(stop1.latitude, stop1.longitude, stop2.latitude, stop2.longitude)

    res.json({
        stop1: stop1.name,
        stop2: stop2.name,
        distance_km: distance.toFixed(3)
    })
})

// Retroune la distance totale d'une ligne
const getTotalDistanceOfLine = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (isNaN(id)) return res.status(400).json({
        error: "Specified id must be a number."
    })

    const stops = await stopsModel.getStopsByLineId(id)

    if (stops.length < 2) return res.status(404).json({
        error: 'Not enough stops to calculate a distance.'
    })

    let totalDistance = 0

    for (let i = 0; i < stops.length - 1; i++) {
        totalDistance += calculateDistance(
            stops[i].latitude, stops[i].longitude,
            stops[i + 1].latitude, stops[i + 1].longitude
        )
    }

    res.json({
        lineId: id,
        stops_count: stops.length,
        total_distance_km: totalDistance.toFixed(3)
    })
})

module.exports = { getDistanceBetweenStops, getTotalDistanceOfLine }
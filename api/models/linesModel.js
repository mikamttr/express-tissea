const prisma = require('../config/prismaClient')

// Récupère les détails d'une ligne
const getLineDetails = async (categoryId, lineId) => {
    return await prisma.transportLine.findUnique({
        where: {
            id: lineId,
            categoryId: categoryId,
        },
        include: {
            stops: {
                orderBy: {
                    stopOrder: 'asc',
                },
                include: {
                    stop: true,
                },
            },
        },
    })
}

// Met à jour les détails d'une ligne de transport
const updateLineDetails = async (lineId, data) => {
    return await prisma.transportLine.update({
        where: { id: lineId },
        data,
    })
}

// Récupère la liste des arrêts d'une ligne
const getLineStops = async (lineId) => {
    return await prisma.lineStop.findMany({
        where: { lineId },
        orderBy: { stopOrder: 'asc' }
    })
}

// Récupère la liste des arrêts d'une ligne avec la latitude et la longitude
const getLineStopsDetails = async (lineId) => {
    return await prisma.lineStop.findMany({
        where: { lineId },
        orderBy: { stopOrder: 'asc' },
        include: {
            stop: {
                select: {
                    name: true,
                    latitude: true,
                    longitude: true
                }
            }
        }
    })
}

// Met à jour et retourne l'ordre des arrêts d'une ligne
const updateStopsOrder = async (lineId, stops) => {
    // Supprime les associations pour éviter les conflits
    await prisma.lineStop.deleteMany({ where: { lineId } })
    // Recrée les associations avec les nouveaux ordres des arrêts
    await prisma.lineStop.createMany({
        data: stops.map((s, index) => ({
            lineId: s.lineId,
            stopId: s.stopId,
            stopOrder: index + 1
        }))
    })

    return await prisma.lineStop.findMany({
        where: { lineId },
        orderBy: { stopOrder: 'asc' }
    })
}

module.exports = { getLineDetails, getLineStopsDetails, updateLineDetails, getLineStops, updateStopsOrder }
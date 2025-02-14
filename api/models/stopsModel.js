const prisma = require('../config/prismaClient')

// Retourne les informations pour deux arrêts spécifié par leurs ID
const getStopsByIds = async (id1, id2) => {
    const stops = await prisma.stop.findMany({
        where: { id: { in: [parseInt(id1), parseInt(id2)] } },
        select: { id: true, name: true, latitude: true, longitude: true }
    })

    return stops
}

// Retourne tous les arrêts d'une ligne
const getStopsByLineId = async (lineId) => {
    const stops = await prisma.lineStop.findMany({
        where: { lineId: parseInt(lineId) },
        include: {
            stop: {
                select: { id: true, name: true, latitude: true, longitude: true }
            }
        },
        orderBy: { stopOrder: 'asc' }
    })

    return stops.map(ls => ls.stop)
}

module.exports = { getStopsByIds, getStopsByLineId }
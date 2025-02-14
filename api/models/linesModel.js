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

// Ajoute un arrêt à une ligne
const addStopToLine = async (lineId, stopId, stopOrder) => {
    return await prisma.lineStop.create({
        data: {
            lineId,
            stopId,
            stopOrder,
        },
    })
}

// Shift stop orders when inserting in the middle
const shiftStopOrders = async (lineId, stopOrder) => {
    const stopsToShift = await prisma.lineStop.findMany({
        where: {
            lineId: parseInt(lineId),
            stopOrder: { gte: parseInt(stopOrder) }
        },
        orderBy: { stopOrder: 'desc' }
    })

    const updateTransactions = stopsToShift.map(stop =>
        prisma.lineStop.update({
            where: { id: stop.id },
            data: { stopOrder: stop.stopOrder + 1 }
        })
    )

    await prisma.$transaction(updateTransactions)
}

// Update a line's details
const updateLineDetails = async (lineId, data) => {
    return await prisma.transportLine.update({
        where: { id: parseInt(lineId) },
        data,
    })
}

module.exports = { getLineDetails, addStopToLine, shiftStopOrders, updateLineDetails }
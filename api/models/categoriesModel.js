const prisma = require('../prismaClient')

// Récupère toutes les catégories
const getCategories = async () => {
    return await prisma.category.findMany()
}

// Récupère les lignes d'une catégorie à partir de son ID
const getCategoryLines = async (categoryId) => {
    return await prisma.transportLine.findMany({
        where: {
            categoryId: categoryId,
        },
    })
}

// Récupère les détails d'une ligne spécifique dans une catégorie
const getLineDetails = async (categoryId, lineId) => {
    return await prisma.transportLine.findUnique({
        where: {
            id: lineId,
        },
        include: {
            category: true,
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

module.exports = {
    getCategories,
    getCategoryLines,
    getLineDetails,
}

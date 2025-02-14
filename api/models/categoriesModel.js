const prisma = require('../config/prismaClient')

// Récupère toutes les catégories
const getAllCategories = async () => {
    return await prisma.category.findMany()
}

// Récupère les lignes d'une catégorie
const getCategoryLines = async (categoryId) => {
    return await prisma.transportLine.findMany({
        where: {
            categoryId: categoryId,
        }
    })
}

module.exports = { getAllCategories, getCategoryLines }
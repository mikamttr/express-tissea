const prisma = require('../prismaClient')
const asyncHandler = require('express-async-handler')

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = getAllCategories;
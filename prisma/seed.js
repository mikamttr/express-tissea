const prisma = require('@prisma/client').PrismaClient;
const prismaClient = new prisma();

// List of Categories
const categories = [
    { id: 1, name: "Bus" },
    { id: 2, name: "Metro" },
    { id: 3, name: "Tramway" },
];

async function main() {
    // 1. Seed Categories
    for (const category of categories) {
        await prismaClient.category.create({
            data: category,
        });
    }

    // 2. Seed Transport Lines
    const transportLines = [
        // Tram lines
        { name: "Ligne T1", categoryId: 3, startTime: "05:30", endTime: "00:30" },
        { name: "Ligne T2", categoryId: 3, startTime: "05:30", endTime: "00:30" },

        // Metro lines
        { name: "Ligne A", categoryId: 2, startTime: "05:30", endTime: "00:30" },
        { name: "Ligne B", categoryId: 2, startTime: "05:30", endTime: "00:30" },

        // Bus lines
        { name: "Ligne 14", categoryId: 1, startTime: "06:00", endTime: "23:30" },
        { name: "Ligne 45", categoryId: 1, startTime: "06:00", endTime: "23:30" },
    ];

    for (const line of transportLines) {
        await prismaClient.transportLine.create({
            data: line,
        });
    }

    // 3. Seed Stops
    const stops = [
        // Tram T1 stops
        { name: "Palais de Justice", latitude: 43.6022, longitude: 1.4369 },
        { name: "Île du Ramier", latitude: 43.6027, longitude: 1.4493 },
        { name: "Fer à Cheval", latitude: 43.6044, longitude: 1.4439 },
        { name: "Avenue de Muret - M. Cavaillé", latitude: 43.5881, longitude: 1.4464 },
        { name: "Zénith", latitude: 43.5919, longitude: 1.4482 },

        // Metro A stops
        { name: "Basso-Cambo", latitude: 43.5774, longitude: 1.4361 },
        { name: "Capitole", latitude: 43.6042, longitude: 1.4448 },
        { name: "Jean-Jaurès", latitude: 43.6048, longitude: 1.4415 },
        { name: "Esquirol", latitude: 43.6029, longitude: 1.4421 },
        { name: "Saint-Cyprien - République", latitude: 43.6063, longitude: 1.4490 },

        // Bus 14 stops
        { name: "Basso Cambo", latitude: 43.5760, longitude: 1.4385 },
        { name: "Bellefontaine", latitude: 43.5869, longitude: 1.4404 },
        { name: "Reynerie", latitude: 43.5882, longitude: 1.4557 },
        { name: "Mirail - Université", latitude: 43.5898, longitude: 1.4596 },
        { name: "Bagatelle", latitude: 43.5786, longitude: 1.4592 },

        // Bus 45 stops
        { name: "Arènes", latitude: 43.6035, longitude: 1.4418 },
        { name: "Patte d'Oie", latitude: 43.6003, longitude: 1.4453 },
        { name: "Saint-Cyprien - République", latitude: 43.6063, longitude: 1.4490 },
        { name: "Les Abattoirs", latitude: 43.5965, longitude: 1.4536 },
        { name: "Amidonniers", latitude: 43.5940, longitude: 1.4475 },
    ];

    for (const stop of stops) {
        await prismaClient.stop.create({
            data: stop,
        });
    }

    // 4. Seed LineStop Relationships
    const lineStops = [
        // Tram T1 stops
        { lineId: 1, stopId: 1, stopOrder: 1 },
        { lineId: 1, stopId: 2, stopOrder: 2 },
        { lineId: 1, stopId: 3, stopOrder: 3 },
        { lineId: 1, stopId: 4, stopOrder: 4 },
        { lineId: 1, stopId: 5, stopOrder: 5 },

        // Metro A stops
        { lineId: 3, stopId: 6, stopOrder: 1 },
        { lineId: 3, stopId: 7, stopOrder: 2 },
        { lineId: 3, stopId: 8, stopOrder: 3 },
        { lineId: 3, stopId: 9, stopOrder: 4 },
        { lineId: 3, stopId: 10, stopOrder: 5 },

        // Bus 14 stops
        { lineId: 4, stopId: 11, stopOrder: 1 },
        { lineId: 4, stopId: 12, stopOrder: 2 },
        { lineId: 4, stopId: 13, stopOrder: 3 },
        { lineId: 4, stopId: 14, stopOrder: 4 },
        { lineId: 4, stopId: 15, stopOrder: 5 },

        // Bus 45 stops
        { lineId: 5, stopId: 16, stopOrder: 1 },
        { lineId: 5, stopId: 17, stopOrder: 2 },
        { lineId: 5, stopId: 18, stopOrder: 3 },
        { lineId: 5, stopId: 19, stopOrder: 4 },
        { lineId: 5, stopId: 20, stopOrder: 5 },
    ];

    for (const lineStop of lineStops) {
        await prismaClient.lineStop.create({
            data: lineStop,
        });
    }

    console.log("Data has been seeded successfully.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });

const prisma = require('@prisma/client').PrismaClient;
const prismaClient = new prisma();

const categories = [
    { id: 1, name: "Bus" },
    { id: 2, name: "Metro" },
    { id: 3, name: "Tramway" },
];

async function main() {
    // Seed Categories
    for (const category of categories) {
        await prismaClient.category.create({
            data: category,
        });
    }

    // Seed Lignes de transport
    const transportLines = [
        { id: 1, name: "Ligne A", categoryId: 2, startTime: "05:30", endTime: "00:30" },
        { id: 2, name: "Ligne B", categoryId: 2, startTime: "05:30", endTime: "00:30" },
        { id: 3, name: "Ligne 3", categoryId: 1, startTime: "06:00", endTime: "23:30" },
        { id: 4, name: "Ligne 4", categoryId: 1, startTime: "06:00", endTime: "23:30" },
        { id: 5, name: "Ligne T1", categoryId: 3, startTime: "05:30", endTime: "00:30" },
    ];

    for (const line of transportLines) {
        await prismaClient.transportLine.create({
            data: line,
        });
    }

    // Seed arrêts
    const stops = [
        { name: "Basso-Cambo", latitude: 43.5774, longitude: 1.4361 },
        { name: "Mermoz", latitude: 43.5920, longitude: 1.4371 },
        { name: "Arènes", latitude: 43.6035, longitude: 1.4418 },
        { name: "Patte d'Oie", latitude: 43.6003, longitude: 1.4453 },
        { name: "Esquirol", latitude: 43.6029, longitude: 1.4421 },
        { name: "Capitole", latitude: 43.6042, longitude: 1.4448 },
        { name: "Jean-Jaurès", latitude: 43.6048, longitude: 1.4415 },
        { name: "Balma-Gramont", latitude: 43.6165, longitude: 1.4772 },
        { name: "Borderouge", latitude: 43.6043, longitude: 1.4684 },
        { name: "Barrière de Paris", latitude: 43.6010, longitude: 1.4706 },
        { name: "Canal du Midi", latitude: 43.6042, longitude: 1.4421 },
        { name: "Palais de Justice", latitude: 43.6022, longitude: 1.4369 },
        { name: "Rangueil", latitude: 43.5701, longitude: 1.4489 },
        { name: "Université Paul Sabatier", latitude: 43.5478, longitude: 1.4814 },
        { name: "Ramonville", latitude: 43.5669, longitude: 1.4557 },
        { name: "MEET", latitude: 43.5664, longitude: 1.4709 },
        { name: "Grand Noble", latitude: 43.5681, longitude: 1.4623 },
        { name: "Place du relais", latitude: 43.5853, longitude: 1.4682 },
        { name: "Ancely", latitude: 43.5894, longitude: 1.4413 },
        { name: "Cartoucherie", latitude: 43.5986, longitude: 1.4268 },
        { name: "Île du Ramier", latitude: 43.6027, longitude: 1.4493 },
        { name: "Lardenne", latitude: 43.5685, longitude: 1.4006 },
        { name: "Saint-Exupéry", latitude: 43.6156, longitude: 1.3978 },
        { name: "Bordeneuve", latitude: 43.5948, longitude: 1.3979 },
        { name: "Prat Dessus", latitude: 43.6118, longitude: 1.3866 },
        { name: "Plaisance Monestié", latitude: 43.5812, longitude: 1.3737 },
        { name: "Camus", latitude: 43.5968, longitude: 1.4741 },
        { name: "Rimont", latitude: 43.5931, longitude: 1.4876 },
        { name: "Barrière de Muret", latitude: 43.5694, longitude: 1.4336 },
        { name: "Stadium Est", latitude: 43.6105, longitude: 1.4479 },
        { name: "Empalot", latitude: 43.5987, longitude: 1.4524 },
    ];

    for (const stop of stops) {
        const existingStop = await prismaClient.stop.findFirst({
            where: {
                name: stop.name,
            },
        });

        if (!existingStop) {
            await prismaClient.stop.create({
                data: stop,
            });
        }
    }

    // Seed relation entre arrêts et lignes de transport
    const lineStops = [
        // Metro A
        { lineId: 1, stopId: 1, stopOrder: 1 }, // Basso-Cambo
        { lineId: 1, stopId: 2, stopOrder: 2 }, // Mermoz
        { lineId: 1, stopId: 3, stopOrder: 3 }, // Arènes
        { lineId: 1, stopId: 4, stopOrder: 4 }, // Patte d'Oie
        { lineId: 1, stopId: 5, stopOrder: 5 }, // Esquirol
        { lineId: 1, stopId: 6, stopOrder: 6 }, // Capitole
        { lineId: 1, stopId: 7, stopOrder: 7 }, // Jean-Jaurès
        { lineId: 1, stopId: 8, stopOrder: 8 }, // Balma-Gramont

        // Metro B
        { lineId: 2, stopId: 9, stopOrder: 1 }, // Borderouge
        { lineId: 2, stopId: 10, stopOrder: 2 }, // Barrière de Paris
        { lineId: 2, stopId: 11, stopOrder: 3 }, // Canal du Midi
        { lineId: 2, stopId: 7, stopOrder: 4 }, // Jean-Jaurès
        { lineId: 2, stopId: 12, stopOrder: 5 }, // Palais de Justice
        { lineId: 2, stopId: 13, stopOrder: 6 }, // Rangueil
        { lineId: 2, stopId: 14, stopOrder: 7 }, // Université Paul Sabatier
        { lineId: 2, stopId: 15, stopOrder: 8 }, // Ramonville

        // Bus 3
        { lineId: 3, stopId: 3, stopOrder: 1 }, // Arènes
        { lineId: 3, stopId: 22, stopOrder: 2 }, // Lardenne
        { lineId: 3, stopId: 23, stopOrder: 3 }, // Saint-Exupéry
        { lineId: 3, stopId: 24, stopOrder: 4 }, // Bordeneuve
        { lineId: 3, stopId: 25, stopOrder: 5 }, // Prat Dessus
        { lineId: 3, stopId: 26, stopOrder: 6 }, // Plaisance Monestié

        // Bus 4
        { lineId: 4, stopId: 1, stopOrder: 1 }, // Basso-Cambo
        { lineId: 4, stopId: 27, stopOrder: 2 }, // Camus
        { lineId: 4, stopId: 28, stopOrder: 3 }, // Rimont
        { lineId: 4, stopId: 29, stopOrder: 4 }, // Barrière de Muret
        { lineId: 4, stopId: 30, stopOrder: 5 }, // Stadium Est
        { lineId: 4, stopId: 31, stopOrder: 6 }, // Empalot

        // Tram T1
        { lineId: 5, stopId: 16, stopOrder: 1 }, // MEET
        { lineId: 5, stopId: 17, stopOrder: 2 }, // Grand Noble
        { lineId: 5, stopId: 18, stopOrder: 3 }, // Place du relais
        { lineId: 5, stopId: 19, stopOrder: 4 }, // Ancely
        { lineId: 5, stopId: 20, stopOrder: 5 }, // Cartoucherie
        { lineId: 5, stopId: 3, stopOrder: 6 }, // Arènes
        { lineId: 5, stopId: 21, stopOrder: 7 }, // Île du Ramier
        { lineId: 5, stopId: 12, stopOrder: 8 }, // Palais de Justice
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

const prisma = require('../api/config/prismaClient')

const categories = [
    { id: 1, name: "Bus" },
    { id: 2, name: "Metro" },
    { id: 3, name: "Tramway" },
]

const transportLines = [
    { id: 1, name: "Ligne A", categoryId: 2, startTime: "05:30", endTime: "00:30" },
    { id: 2, name: "Ligne B", categoryId: 2, startTime: "05:30", endTime: "00:30" },
    { id: 3, name: "Ligne 3", categoryId: 1, startTime: "06:00", endTime: "23:30" },
    { id: 4, name: "Ligne 4", categoryId: 1, startTime: "06:00", endTime: "23:30" },
    { id: 5, name: "Ligne T1", categoryId: 3, startTime: "05:30", endTime: "00:30" },
]

const stops = [
    { id: 1, name: "Basso-Cambo", latitude: 43.56995, longitude: 1.39185 },
    { id: 2, name: "Mermoz", latitude: 43.58347, longitude: 1.41443 },
    { id: 3, name: "Arènes", latitude: 43.59340, longitude: 1.41801 },
    { id: 4, name: "Patte d'Oie", latitude: 43.59636, longitude: 1.42289 },
    { id: 5, name: "Esquirol", latitude: 43.60030, longitude: 1.44390 },
    { id: 6, name: "Capitole", latitude: 43.60422, longitude: 1.44490 },
    { id: 7, name: "Jean-Jaurès", latitude: 43.60588, longitude: 1.44896 },
    { id: 8, name: "Balma-Gramont", latitude: 43.62975, longitude: 1.48237 },
    { id: 9, name: "Borderouge", latitude: 43.6043, longitude: 1.4684 },
    { id: 10, name: "Barrière de Paris", latitude: 43.62668, longitude: 1.43336 },
    { id: 11, name: "Canal du Midi", latitude: 43.61534, longitude: 1.43352 },
    { id: 12, name: "Palais de Justice", latitude: 43.59215, longitude: 1.44457 },
    { id: 13, name: "Rangueil", latitude: 43.57489, longitude: 1.46115 },
    { id: 14, name: "Université Paul Sabatier", latitude: 43.56078, longitude: 1.46600 },
    { id: 15, name: "Ramonville", latitude: 43.55573, longitude: 1.47558 },
    { id: 16, name: "MEETT", latitude: 43.66762, longitude: 1.35970 },
    { id: 17, name: "Grand Noble", latitude: 43.64479, longitude: 1.37697 },
    { id: 18, name: "Place du relais", latitude: 43.63668, longitude: 1.38958 },
    { id: 19, name: "Ancely", latitude: 43.61871, longitude: 1.39679 },
    { id: 20, name: "Cartoucherie", latitude: 43.60326, longitude: 1.40709 },
    { id: 21, name: "Île du Ramier", latitude: 43.59229, longitude: 1.43990 },
    { id: 22, name: "Lardenne", latitude: 43.59660, longitude: 1.38347 },
    { id: 23, name: "Briqueterie", latitude: 43.58980, longitude: 1.36576 },
    { id: 24, name: "Bordeneuve", latitude: 43.57805, longitude: 1.32192 },
    { id: 25, name: "Prat Dessus", latitude: 43.56830, longitude: 1.30369 },
    { id: 26, name: "Plaisance Monestié", latitude: 43.56318, longitude: 1.29089 },
    { id: 27, name: "Camus", latitude: 43.56134, longitude: 1.39481 },
    { id: 28, name: "Rimont", latitude: 43.56027, longitude: 1.40430 },
    { id: 29, name: "Barrière de Muret", latitude: 43.57893, longitude: 1.42321 },
    { id: 30, name: "Stadium Est", latitude: 43.58417, longitude: 1.43684 },
    { id: 31, name: "Empalot", latitude: 43.57994, longitude: 1.44205 },
]

// Relations entre arrêts et lignes de transport
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
    { lineId: 3, stopId: 23, stopOrder: 3 }, // Briqueterie
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
]

async function main() {
    console.log("Deleting existing data...")

    // Suppression des données
    await prisma.lineStop.deleteMany()
    await prisma.transportLine.deleteMany()
    await prisma.stop.deleteMany()
    await prisma.category.deleteMany()

    console.log("Seeding new data...")

    // Insertion des catégories
    await prisma.category.createMany({ data: categories })

    // Insertion des lignes de transport
    await prisma.transportLine.createMany({ data: transportLines })

    // Insertion des arrêts
    await prisma.stop.createMany({ data: stops })

    // Insertion des relations ligne-arrêt
    await prisma.lineStop.createMany({ data: lineStops })

    console.log("Data has been seeded successfully.")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

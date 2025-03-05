# Tissea API

Mika MANTTARI

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)

## Features
- **Transport Line Management**: Create and manage transport lines, categories and stops.
- **User Authentication**: Allows users to register and authenticate via JWT (JSON Web Tokens).
- **Prisma ORM**: Easily manage and interact with the MySQL database using Prisma.
- **Frontend**: Simple Vue.js frontend integrated with the API, featuring a map display powered by Leaflet and OpenStreetMap.
- **Environment Variables**: Managed with dotenv.

## Installation

### Backend (API)
1. Clone the repository:
   ```bash
   git clone https://github.com/mikamttr/express-tissea.git
   ```

2. Install dependencies:
   ```bash
   cd tissea-api
   npm install
   ```

3. Set up the environment variables in a `.env` file in the root of the `tissea-api` directory:
   ```bash
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="mysql://root:@localhost:3306/transport_api"
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_secret_key
   ```

4. Set up the database using Prisma:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the API server:
   ```bash
   npm run api
   ```

### Frontend
1. Go to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   cd ..
   npm run frontend
   ```

The frontend should now be accessible at [http://localhost:5173](http://localhost:5173).

## Usage
- **API**: The API is accessible at `http://localhost:5000`. You can use tools like Postman or CURL to interact with the API endpoints (see the [API Endpoints](#api-endpoints) section).
  
- **Frontend**: The Vue.js frontend allows users to interact with the transport data and provides an interface for user authentication.

Here's the updated version of the API Endpoints section based on the actual routes defined in your `routes.js`:

## API Endpoints

### Authentication
- **POST** `/api/users/signup` - Register a new user.
- **POST** `/api/users/login` - Login and get a JWT token.

### Transport Categories
- **GET** `/api/categories` - Get all transport categories.
- **GET** `/api/categories/:id/lines` - Get all lines for a specific category.
  
### Transport Lines
- **GET** `/api/categories/:categoryId/lines/:lineId` - Get details of a specific transport line.
- **GET** `/api/categories/:categoryId/lines/:lineId/stops` - Get details of all stops for a specific line.
- **PUT** `/api/categories/:categoryId/lines/:lineId` - Update an existing transport line.
- **POST** `/api/categories/:categoryId/lines/:lineId/stops` - Add a stop to a transport line.
- **DELETE** `/api/categories/:categoryId/lines/:lineId/stops/:stopId` - Delete specified stop from a transport line.

### Stats
- **GET** `/api/stats/distance/stops/:id1/:id2` - Get the distance between two stops.
- **GET** `/api/stats/distance/lines/:id` - Get the total distance of a transport line.

### Middleware
- **protect**: Used to protect routes that require authentication.

### Not Found Route
- **404** `/api/*` - Returns a 404 error for any undefined routes.


## Environment Variables
Make sure to define the following environment variables in a `.env` file in the root of the project:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="mysql://root:@localhost:3306/transport_api"
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key
```

## Database Schema

The project uses Prisma for ORM. The schema defines the following models:

- **Category**: Represents a transport category (e.g., bus, tram).
- **TransportLine**: Represents a specific transport line under a category.
- **Stop**: Represents a stop location.
- **LineStop**: Represents the relation between a line and a stop, including the order of stops on a line.
- **User**: Represents a user with authentication details.

Here's a view of `schema.prisma`:

```prisma
model Category {
  id        Int             @id @default(autoincrement())
  name      String          @unique
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  lines     TransportLine[]
}

model TransportLine {
  id         Int     @id @default(autoincrement())
  categoryId Int
  name       String
  startTime  String
  endTime    String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  stops      LineStop[]
}

model Stop {
  id         Int      @id @default(autoincrement())
  name       String
  latitude   Float
  longitude  Float
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  lines      LineStop[]
}

model LineStop {
  id         Int      @id @default(autoincrement())
  lineId     Int
  stopId     Int
  stopOrder  Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  line       TransportLine @relation(fields: [lineId], references: [id], onDelete: Cascade)
  stop       Stop @relation(fields: [stopId], references: [id], onDelete: Cascade)
  @@unique([lineId, stopOrder])
  @@unique([lineId, stopId])
}

model User {
  id           Int    @id @default(autoincrement())
  username     String   @unique
  email        String @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```
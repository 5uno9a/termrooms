import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { PrismaClient } from '@prisma/client'

const app = express()
const PORT = process.env.PORT || 3001
const prisma = new PrismaClient()

// Middleware
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}))
app.use(express.json())

// Routes
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/games', async (_req, res) => {
  try {
    const games = await prisma.game.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        name: true,
        description: true,
        authorId: true,
        createdAt: true,
        updatedAt: true
      }
    })
    res.json({ games })
  } catch (error) {
    console.error('Error fetching games:', error)
    res.status(500).json({ error: 'Failed to fetch games' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Database connected`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

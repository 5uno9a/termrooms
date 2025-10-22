import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})
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

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`)
  
  // Handle room joining
  socket.on('join-room', (roomId: string) => {
    socket.join(roomId)
    console.log(`👥 Client ${socket.id} joined room: ${roomId}`)
    socket.emit('room-joined', { roomId, success: true })
  })
  
  // Handle room leaving
  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId)
    console.log(`👋 Client ${socket.id} left room: ${roomId}`)
    socket.emit('room-left', { roomId, success: true })
  })
  
  // Handle game actions
  socket.on('game-action', (data: { roomId: string, action: any }) => {
    console.log(`🎮 Game action in room ${data.roomId}:`, data.action)
    // Broadcast to all clients in the room
    socket.to(data.roomId).emit('game-action', data.action)
  })
  
  // Handle game state updates
  socket.on('game-state-update', (data: { roomId: string, state: any }) => {
    console.log(`🔄 Game state update in room ${data.roomId}`)
    // Broadcast to all clients in the room
    io.to(data.roomId).emit('game-state-update', data.state)
  })
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`)
  })
})

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Database connected`)
  console.log(`🔌 WebSocket server ready`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

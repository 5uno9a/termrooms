import { io, Socket } from 'socket.io-client'

export interface GameAction {
  type: string
  payload: any
  timestamp: number
}

export interface GameState {
  vars: Record<string, any>
  entities: Record<string, any>
  events: any[]
  players: any[]
  scores: Record<string, number>
}

export interface WebSocketEvents {
  'room-joined': (data: { roomId: string; success: boolean }) => void
  'room-left': (data: { roomId: string; success: boolean }) => void
  'game-action': (action: GameAction) => void
  'game-state-update': (state: GameState) => void
  'error': (error: string) => void
}

export class GameWebSocket {
  private socket: Socket | null = null
  private serverUrl: string
  private currentRoomId: string | null = null
  private eventHandlers: Partial<WebSocketEvents> = {}

  constructor(serverUrl: string = 'http://localhost:3001') {
    this.serverUrl = serverUrl
  }

  /**
   * Connect to the WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.serverUrl, {
          transports: ['websocket', 'polling'],
          timeout: 10000,
        })

        this.socket.on('connect', () => {
          console.log('🔌 WebSocket connected:', this.socket?.id)
          resolve()
        })

        this.socket.on('connect_error', (error) => {
          console.error('❌ WebSocket connection error:', error)
          reject(error)
        })

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 WebSocket disconnected:', reason)
        })

        // Set up event handlers
        this.setupEventHandlers()

      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error)
        reject(error)
      }
    })
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.currentRoomId = null
      console.log('🔌 WebSocket disconnected')
    }
  }

  /**
   * Join a game room
   */
  joinRoom(roomId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('WebSocket not connected'))
        return
      }

      this.socket.emit('join-room', roomId)
      
      // Set up one-time listener for room-joined event
      const handleRoomJoined = (data: { roomId: string; success: boolean }) => {
        if (data.roomId === roomId) {
          this.currentRoomId = roomId
          this.socket?.off('room-joined', handleRoomJoined)
          resolve(data.success)
        }
      }

      this.socket.on('room-joined', handleRoomJoined)

      // Set up timeout
      setTimeout(() => {
        this.socket?.off('room-joined', handleRoomJoined)
        reject(new Error('Join room timeout'))
      }, 5000)
    })
  }

  /**
   * Leave the current game room
   */
  leaveRoom(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.currentRoomId) {
        reject(new Error('Not in a room'))
        return
      }

      const roomId = this.currentRoomId
      this.socket.emit('leave-room', roomId)
      
      // Set up one-time listener for room-left event
      const handleRoomLeft = (data: { roomId: string; success: boolean }) => {
        if (data.roomId === roomId) {
          this.currentRoomId = null
          this.socket?.off('room-left', handleRoomLeft)
          resolve(data.success)
        }
      }

      this.socket.on('room-left', handleRoomLeft)

      // Set up timeout
      setTimeout(() => {
        this.socket?.off('room-left', handleRoomLeft)
        reject(new Error('Leave room timeout'))
      }, 5000)
    })
  }

  /**
   * Send a game action to the current room
   */
  sendGameAction(action: GameAction): void {
    if (!this.socket || !this.currentRoomId) {
      console.error('❌ Cannot send action: not connected or not in a room')
      return
    }

    this.socket.emit('game-action', {
      roomId: this.currentRoomId,
      action: {
        ...action,
        timestamp: Date.now()
      }
    })
  }

  /**
   * Send a game state update to the current room
   */
  sendGameStateUpdate(state: GameState): void {
    if (!this.socket || !this.currentRoomId) {
      console.error('❌ Cannot send state update: not connected or not in a room')
      return
    }

    this.socket.emit('game-state-update', {
      roomId: this.currentRoomId,
      state
    })
  }

  /**
   * Register event handlers
   */
  on<K extends keyof WebSocketEvents>(event: K, handler: WebSocketEvents[K]): void {
    this.eventHandlers[event] = handler
  }

  /**
   * Remove event handler
   */
  off<K extends keyof WebSocketEvents>(event: K): void {
    delete this.eventHandlers[event]
  }

  /**
   * Get current connection status
   */
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  /**
   * Get current room ID
   */
  getCurrentRoomId(): string | null {
    return this.currentRoomId
  }

  /**
   * Set up internal event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return

    this.socket.on('room-joined', (data) => {
      const handler = this.eventHandlers['room-joined']
      if (handler) handler(data)
    })

    this.socket.on('room-left', (data) => {
      const handler = this.eventHandlers['room-left']
      if (handler) handler(data)
    })

    this.socket.on('game-action', (action) => {
      const handler = this.eventHandlers['game-action']
      if (handler) handler(action)
    })

    this.socket.on('game-state-update', (state) => {
      const handler = this.eventHandlers['game-state-update']
      if (handler) handler(state)
    })

    this.socket.on('error', (error) => {
      const handler = this.eventHandlers['error']
      if (handler) handler(error)
    })
  }
}

// Export a singleton instance
export const gameWebSocket = new GameWebSocket()

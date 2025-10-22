import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { gameWebSocket, GameAction, GameState, WebSocketEvents } from '../services/GameWebSocket'

interface GameContextType {
  // Connection state
  isConnected: boolean
  currentRoomId: string | null
  connectionError: string | null
  
  // Game state
  gameState: GameState | null
  isLoading: boolean
  
  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  joinRoom: (roomId: string) => Promise<boolean>
  leaveRoom: () => Promise<boolean>
  sendAction: (action: Omit<GameAction, 'timestamp'>) => void
  updateGameState: (state: GameState) => void
  
  // Event handlers
  onGameAction: (handler: (action: GameAction) => void) => void
  onGameStateUpdate: (handler: (state: GameState) => void) => void
  onRoomJoined: (handler: (data: { roomId: string; success: boolean }) => void) => void
  onRoomLeft: (handler: (data: { roomId: string; success: boolean }) => void) => void
}

type GameContextAction =
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ROOM_ID'; payload: string | null }
  | { type: 'SET_CONNECTION_ERROR'; payload: string | null }
  | { type: 'SET_GAME_STATE'; payload: GameState | null }
  | { type: 'SET_LOADING'; payload: boolean }

interface GameContextState {
  isConnected: boolean
  currentRoomId: string | null
  connectionError: string | null
  gameState: GameState | null
  isLoading: boolean
}

const initialState: GameContextState = {
  isConnected: false,
  currentRoomId: null,
  connectionError: null,
  gameState: null,
  isLoading: false
}

function gameReducer(state: GameContextState, action: GameContextAction): GameContextState {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload, connectionError: null }
    case 'SET_ROOM_ID':
      return { ...state, currentRoomId: action.payload }
    case 'SET_CONNECTION_ERROR':
      return { ...state, connectionError: action.payload, isConnected: false }
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined)

interface GameProviderProps {
  children: ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        await gameWebSocket.connect()
        dispatch({ type: 'SET_CONNECTED', payload: true })
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error)
        dispatch({ 
          type: 'SET_CONNECTION_ERROR', 
          payload: error instanceof Error ? error.message : 'Connection failed' 
        })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeConnection()

    // Cleanup on unmount
    return () => {
      gameWebSocket.disconnect()
    }
  }, [])

  // Set up WebSocket event handlers
  useEffect(() => {
    if (!gameWebSocket.isConnected()) return

    const handleRoomJoined = (data: { roomId: string; success: boolean }) => {
      if (data.success) {
        dispatch({ type: 'SET_ROOM_ID', payload: data.roomId })
      }
    }

    const handleRoomLeft = (data: { roomId: string; success: boolean }) => {
      if (data.success) {
        dispatch({ type: 'SET_ROOM_ID', payload: null })
      }
    }

    const handleGameStateUpdate = (newState: GameState) => {
      dispatch({ type: 'SET_GAME_STATE', payload: newState })
    }

    const handleError = (error: string) => {
      dispatch({ type: 'SET_CONNECTION_ERROR', payload: error })
    }

    // Register handlers
    gameWebSocket.on('room-joined', handleRoomJoined)
    gameWebSocket.on('room-left', handleRoomLeft)
    gameWebSocket.on('game-state-update', handleGameStateUpdate)
    gameWebSocket.on('error', handleError)

    // Cleanup handlers
    return () => {
      gameWebSocket.off('room-joined')
      gameWebSocket.off('room-left')
      gameWebSocket.off('game-state-update')
      gameWebSocket.off('error')
    }
  }, [state.isConnected])

  const connect = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await gameWebSocket.connect()
      dispatch({ type: 'SET_CONNECTED', payload: true })
    } catch (error) {
      console.error('Failed to connect:', error)
      dispatch({ 
        type: 'SET_CONNECTION_ERROR', 
        payload: error instanceof Error ? error.message : 'Connection failed' 
      })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const disconnect = (): void => {
    gameWebSocket.disconnect()
    dispatch({ type: 'SET_CONNECTED', payload: false })
    dispatch({ type: 'SET_ROOM_ID', payload: null })
  }

  const joinRoom = async (roomId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const success = await gameWebSocket.joinRoom(roomId)
      if (success) {
        dispatch({ type: 'SET_ROOM_ID', payload: roomId })
      }
      return success
    } catch (error) {
      console.error('Failed to join room:', error)
      dispatch({ 
        type: 'SET_CONNECTION_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to join room' 
      })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const leaveRoom = async (): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const success = await gameWebSocket.leaveRoom()
      if (success) {
        dispatch({ type: 'SET_ROOM_ID', payload: null })
      }
      return success
    } catch (error) {
      console.error('Failed to leave room:', error)
      dispatch({ 
        type: 'SET_CONNECTION_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to leave room' 
      })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const sendAction = (action: Omit<GameAction, 'timestamp'>): void => {
    gameWebSocket.sendGameAction({
      ...action,
      timestamp: Date.now()
    })
  }

  const updateGameState = (state: GameState): void => {
    gameWebSocket.sendGameStateUpdate(state)
    dispatch({ type: 'SET_GAME_STATE', payload: state })
  }

  const onGameAction = (handler: (action: GameAction) => void): void => {
    gameWebSocket.on('game-action', handler)
  }

  const onGameStateUpdate = (handler: (state: GameState) => void): void => {
    gameWebSocket.on('game-state-update', handler)
  }

  const onRoomJoined = (handler: (data: { roomId: string; success: boolean }) => void): void => {
    gameWebSocket.on('room-joined', handler)
  }

  const onRoomLeft = (handler: (data: { roomId: string; success: boolean }) => void): void => {
    gameWebSocket.on('room-left', handler)
  }

  const value: GameContextType = {
    isConnected: state.isConnected,
    currentRoomId: state.currentRoomId,
    connectionError: state.connectionError,
    gameState: state.gameState,
    isLoading: state.isLoading,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendAction,
    updateGameState,
    onGameAction,
    onGameStateUpdate,
    onRoomJoined,
    onRoomLeft
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame(): GameContextType {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

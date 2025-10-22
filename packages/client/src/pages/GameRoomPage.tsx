import React, { useState } from 'react';
import { Button, Card, LoadingSpinner } from '../components/ui';
import { useGame } from '../contexts/GameContext';

const GameRoomPage: React.FC = () => {
  const {
    isConnected,
    currentRoomId,
    connectionError,
    isLoading,
    joinRoom,
    leaveRoom,
    sendAction
  } = useGame();

  const [roomIdInput, setRoomIdInput] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [action, setAction] = useState('');

  // Handle room joining
  const handleJoinRoom = async () => {
    if (!roomIdInput.trim()) return;
    
    try {
      const success = await joinRoom(roomIdInput.trim());
      if (success) {
        setShowJoinModal(false);
        setRoomIdInput('');
      }
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  // Handle room leaving
  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  };

  // Handle creating a new room (generate random room ID)
  const handleCreateRoom = async () => {
    const newRoomId = `ROOM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    try {
      const success = await joinRoom(newRoomId);
      if (success) {
        setRoomIdInput('');
      }
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  // Handle sending game actions
  const handleSendAction = () => {
    if (!action.trim()) return;
    
    sendAction({
      type: 'command',
      payload: { command: action.trim() }
    });
    setAction('');
  };

  // Show connection status
  if (connectionError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card variant="elevated" padding="lg" className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-400">Connection Error</h2>
          <p className="text-white text-opacity-70 mb-6">{connectionError}</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 text-white">Game Room</h1>
          <p className="text-xl text-white text-opacity-80 max-w-3xl">
            Join or create a multiplayer game room.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Game Instance - Takes up 3 columns on large screens */}
          <div className="lg:col-span-3">
            <Card variant="elevated" padding="lg">
              <h3 className="text-2xl font-semibold mb-6 text-white">Nuclear Reactor Simulator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Core Status Panel */}
                <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
                  <h4 className="text-lg font-semibold text-white mb-3">⚛ CORE STATUS</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-70">Power:</span>
                      <span className="text-white">[████████░░] 80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-70">Temperature:</span>
                      <span className="text-white">[██████░░░░] 60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-70">Pressure:</span>
                      <span className="text-white">[██████████] 100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white text-opacity-70">Radiation:</span>
                      <span className="text-white">[██░░░░░░░░] 20%</span>
                    </div>
                  </div>
                </div>
                
                {/* Coolant Flow Panel */}
                <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
                  <h4 className="text-lg font-semibold text-white mb-3">🌊 COOLANT FLOW</h4>
                  <div className="text-xs font-mono text-white">
                    <div>┌─ Pump 1─┐</div>
                    <div>│    ●    │</div>
                    <div>└─┬─┬─┬─┬─┘</div>
                    <div>  │ │ │ │</div>
                    <div>  ▼ ▼ ▼ ▼</div>
                    <div>┌─┬─┬─┬─┬─┐</div>
                    <div>│●│●│●│●│●│ Core</div>
                    <div>└─┴─┴─┴─┴─┘</div>
                    <div>  ▲ ▲ ▲ ▲</div>
                    <div>  │ │ │ │</div>
                    <div>┌─┴─┴─┴─┴─┐</div>
                    <div>│    ●    │</div>
                    <div>└─ Pump 2─┘</div>
                  </div>
                </div>
              </div>
              
              {/* Events Log */}
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20 mb-4">
                <h4 className="text-lg font-semibold text-white mb-3">📋 EVENTS LOG</h4>
                <div className="space-y-1 text-sm font-mono text-white text-opacity-70 max-h-32 overflow-y-auto">
                  <div>[14:32:15] Power increased by 10%</div>
                  <div>[14:31:45] Coolant flow rate: 85%</div>
                  <div>[14:31:20] Temperature stable at 60%</div>
                  <div>[14:30:55] Engineer_01 joined the room</div>
                  <div>[14:30:30] Reactor startup sequence initiated</div>
                </div>
              </div>
              
              {/* Command Terminal */}
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-20">
                <h4 className="text-lg font-semibold text-white mb-3">💻 COMMAND TERMINAL</h4>
                <div className="text-sm font-mono text-white">
                  <div className="flex items-center mb-2">
                    <span className="text-green-400">user@reactor:~$</span>
                    <input
                      type="text"
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendAction()}
                      placeholder="Enter command..."
                      className="ml-2 bg-transparent border-none outline-none text-white flex-1"
                      disabled={!currentRoomId}
                    />
                    <span className="ml-2 text-white text-opacity-50 animate-pulse">|</span>
                  </div>
                  <div className="text-white text-opacity-50 text-xs">
                    Available commands: increase_power, decrease_power, adjust_coolant, status, help
                  </div>
                  {!currentRoomId && (
                    <div className="text-red-400 text-xs mt-2">
                      Join a room to send commands
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Sidebar - Takes up 1 column on large screens */}
          <div className="space-y-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Room Actions</h3>
              <div className="space-y-3">
                {!currentRoomId ? (
                  <>
                    <Button 
                      variant="secondary" 
                      size="md" 
                      className="w-full"
                      onClick={handleCreateRoom}
                      disabled={isLoading}
                    >
                      {isLoading ? <LoadingSpinner size="sm" /> : 'Create Room'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="md" 
                      className="w-full"
                      onClick={() => setShowJoinModal(true)}
                      disabled={isLoading}
                    >
                      Join Room
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="secondary" 
                    size="md" 
                    className="w-full"
                    onClick={handleLeaveRoom}
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Leave Room'}
                  </Button>
                )}
              </div>
              
              {/* Connection Status */}
              <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white text-opacity-70">Connection:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isConnected 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {currentRoomId && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-white text-opacity-70">Room:</span>
                    <span className="text-white font-mono text-xs">{currentRoomId}</span>
                  </div>
                )}
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Game Instance</h3>
              <div className="space-y-3">
                <div className="text-sm text-white text-opacity-70">
                  <p><strong>Game:</strong> Nuclear Reactor Simulator</p>
                  <p><strong>Instance ID:</strong> REACTOR-001</p>
                  <p><strong>Status:</strong> Waiting for players</p>
                </div>
                <Button variant="secondary" size="md" className="w-full">
                  Copy Room Link
                </Button>
                <Button variant="secondary" size="md" className="w-full">
                  Share Password
                </Button>
                <div className="text-xs text-white text-opacity-60">
                  Share this game instance with other players
                </div>
              </div>
            </Card>
            
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Players (4/8)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white">You (Chief)</span>
                  <span className="text-xs bg-white text-black px-2 py-1 rounded-full font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white text-opacity-70">Engineer_01</span>
                  <span className="text-xs bg-white text-black px-2 py-1 rounded-full font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white text-opacity-70">Tech_Alpha</span>
                  <span className="text-xs bg-white text-black px-2 py-1 rounded-full font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white text-opacity-70">Observer_1</span>
                  <span className="text-xs bg-white text-black px-2 py-1 rounded-full font-medium">Online</span>
                </div>
                <div className="text-xs text-white text-opacity-50 mt-2">
                  Waiting for 4 more players...
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card variant="elevated" padding="lg" className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-white">Join Room</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value)}
                  placeholder="Enter room ID..."
                  className="w-full px-3 py-2 bg-black bg-opacity-70 backdrop-blur-md border border-white border-opacity-20 text-white placeholder-white placeholder-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  onClick={handleJoinRoom}
                  disabled={!roomIdInput.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : 'Join Room'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowJoinModal(false);
                    setRoomIdInput('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GameRoomPage;

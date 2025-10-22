import React from 'react';
import { Button, Card } from '../components/ui';

const GameRoomPage: React.FC = () => {
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
                  <div className="flex items-center">
                    <span className="text-green-400">user@reactor:~$</span>
                    <span className="ml-2 text-white">increase_power 10</span>
                    <span className="ml-2 text-white text-opacity-50 animate-pulse">|</span>
                  </div>
                  <div className="text-white text-opacity-50 mt-2">
                    Available commands: increase_power, decrease_power, adjust_coolant, status, help
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Sidebar - Takes up 1 column on large screens */}
          <div className="space-y-6">
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Room Actions</h3>
              <div className="space-y-3">
                <Button variant="secondary" size="md" className="w-full">
                  Create Room
                </Button>
                <Button variant="secondary" size="md" className="w-full">
                  Join Room
                </Button>
                <Button variant="secondary" size="md" className="w-full">
                  Leave Room
                </Button>
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
    </div>
  );
};

export default GameRoomPage;

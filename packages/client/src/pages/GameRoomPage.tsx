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
              <h3 className="text-2xl font-semibold mb-6 text-white">Game Instance</h3>
              <div className="bg-black bg-opacity-50 backdrop-blur-sm p-6 rounded-lg border border-white border-opacity-20 min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-opacity-60 mb-4">Game visualization will appear here</p>
                  <div className="text-sm text-white text-opacity-50">
                    <p>Multi-panel UI with:</p>
                    <ul className="list-disc list-inside mt-2">
                      <li>Game status panel</li>
                      <li>Coolant flow visualization</li>
                      <li>Events log</li>
                      <li>Command terminal</li>
                    </ul>
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

import React from 'react';

const GameRoomPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Game Room</h1>
          <p className="text-gray-300">
            Join or create a multiplayer game room.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Game Instance</h3>
            <div className="bg-gray-900 p-4 rounded border h-96 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400 mb-4">Game visualization will appear here</p>
                <div className="text-sm text-gray-500">
                  <p>Multi-panel UI with:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Game status panel</li>
                    <li>Player list</li>
                    <li>Chat system</li>
                    <li>Command terminal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Room Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                  Create Room
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                  Join Room
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">
                  Leave Room
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Players</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">You</span>
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">Online</span>
                </div>
                <p className="text-sm text-gray-400">Waiting for other players...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoomPage;

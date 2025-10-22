import React from 'react';

const GameLibraryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Game Library</h1>
          <p className="text-gray-300">
            Discover and play games created by the community.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">ReactorSim</h3>
            <p className="text-gray-400 mb-4">
              Nuclear reactor simulation game. Manage power output, coolant systems, and prevent meltdowns.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">By: System</span>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Play
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-gray-400 mb-4">
              More games will be available as the platform grows.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">By: Community</span>
              <button className="bg-gray-600 px-4 py-2 rounded cursor-not-allowed" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLibraryPage;
